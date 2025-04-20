package hcmut.smart_garden_system.Services;

import java.text.MessageFormat;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.dao.DataAccessException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.PreparedStatementCallback;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;

import hcmut.smart_garden_system.DTOs.ResponseObject;
import hcmut.smart_garden_system.Services.Utils.OTPGenerator;
import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

@Service
public class EmailSenderService {
    @Autowired
    private JavaMailSender mailSender;

    private final JdbcTemplate jdbcTemplate;
    private final ObjectMapper objectMapper;

    private static final Logger logger = LoggerFactory.getLogger(EmailSenderService.class);
    
    public EmailSenderService(JdbcTemplate jdbcTemplate, ObjectMapper objectMapper) {
        this.jdbcTemplate = jdbcTemplate;
        this.objectMapper = objectMapper;
    }

    @Value("${spring.mail.username}")
    private String fromEmailId;

    // Định nghĩa Pattern một lần để tái sử dụng
    private static final Pattern PSQL_ERROR_PATTERN = Pattern.compile("ERROR:\\s*(.*?)\\n", Pattern.DOTALL);

    public ResponseEntity<ResponseObject> sendOTPEmail(String toEmail, String subject) {
        try {
            String otp = OTPGenerator.generateOTP();
            // Gọi saveOTPToDatabase và kiểm tra kết quả
            ResponseEntity<ResponseObject> otpSaveResponse = saveOTPToDatabase(toEmail, otp);
            if (!otpSaveResponse.getStatusCode().is2xxSuccessful()) {
                return otpSaveResponse; // Trả về lỗi nếu lưu OTP thất bại
            }

            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");
            
            helper.setFrom(fromEmailId);
            helper.setTo(toEmail);
            helper.setSubject(subject);
            
            // Create HTML content
            String htmlBody = """
                <!DOCTYPE html>
                <html>
                <head>
                    <style>
                        .otp-container {
                            font-family: Arial, sans-serif;
                            max-width: 600px;
                            margin: 0 auto;
                            padding: 20px;
                        }
                        .otp-code {
                            font-size: 24px;
                            font-weight: bold;
                            color: #1a73e8;
                            padding: 10px;
                            margin: 10px 0;
                            background-color: #f5f5f5;
                            border-radius: 4px;
                            display: inline-block;
                        }
                        .note {
                            color: #666;
                            font-size: 14px;
                            margin-top: 20px;
                        }
                    </style>
                </head>
                <body>
                    <div class="otp-container">
                        <h2>Verification Code</h2>
                        <p>Hello,</p>
                        <p>Your verification code is:</p>
                        <div class="otp-code">%s</div>
                        <p>This code will expire in 5 minutes.</p>
                        <p class="note">If you didn't request this code, please ignore this email.</p>
                    </div>
                </body>
                </html>
            """.formatted(otp);
            
            helper.setText(htmlBody, true); // true indicates html
            
            mailSender.send(message);
        
            return ResponseEntity.status(HttpStatus.OK)
                .body(new ResponseObject("OK",  "Sent email Successfully", null));
        } catch (DataAccessException e) { // Khối catch này bây giờ sẽ không bắt lỗi từ saveOTPToDatabase nữa
            // Xử lý lỗi liên quan đến truy cập dữ liệu (nếu có ở những chỗ khác trong try block)
            logger.error("Database access error during OTP email process for email: {}", toEmail, e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(new ResponseObject("ERROR", "Database error during OTP process: " + e.getMessage(), null));
        } catch (MessagingException e) {
            // Handle the exception here, e.g., log the error or return an error message
            logger.error("Messaging error when sending email to: {}", toEmail, e);
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                .body(new ResponseObject("Failed", "Error sending email: " + e.getMessage(), null));
        } catch (Exception e) {
            // Xử lý các lỗi khác
            logger.error("Unexpected error when sending email to: {}", toEmail, e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(new ResponseObject("ERROR", "Unknown error while sending email: " + e.getMessage(), null));
        }
    }
    
    private ResponseEntity<ResponseObject> saveOTPToDatabase(String toEmail, String otp) {
        try {
            jdbcTemplate.execute(
            "CALL add_otp_by_email(?, ?)",
                (PreparedStatementCallback<Void>) ps -> {
                    ps.setString(1, toEmail);
                    ps.setString(2, otp);

                    ps.execute();
                    return null;
                }
            );
            return ResponseEntity.status(HttpStatus.OK)
                .body(new ResponseObject("OK", "OTP saved successfully", null));
        } catch (DataAccessException e) {
            logger.error("Database access error when saving OTP for email: {}", toEmail, e);

            String errorMessage = "Database error saving OTP."; // Mặc định
            String nestedMessage = e.getMostSpecificCause().getMessage();

            if (nestedMessage != null) {
                 // Chỉ xử lý đặc biệt nếu là lỗi P0001
                 if (nestedMessage.contains("SQL state [P0001]")) {
                    Matcher matcher = PSQL_ERROR_PATTERN.matcher(nestedMessage);
                    if (matcher.find()) {
                        // Lấy group 1 chứa thông điệp lỗi thực sự
                        errorMessage = matcher.group(1).trim();
                    } else {
                         // Nếu regex không khớp, thử lấy dòng đầu tiên làm fallback
                         errorMessage = nestedMessage.split("\n")[0].trim();
                    }
                } else {
                     // Dùng thông báo lỗi gốc nếu không phải P0001
                     errorMessage = nestedMessage;
                }
            } else {
                errorMessage = e.getMessage(); // Fallback nếu không có nested message
            }

             return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(new ResponseObject("ERROR", errorMessage, null));
        } catch (Exception e) {
            logger.error("Unexpected error when saving OTP for email: {}", toEmail, e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(new ResponseObject("ERROR", "Unknown error while saving OTP: " + e.getMessage(), null));
        }
    }

    public ResponseEntity<ResponseObject> PROC_deleteOTPByEmail(String email){
        try {
            jdbcTemplate.execute(
            "CALL delete_otp_by_email(?)",
            (PreparedStatementCallback<Void>) ps -> {
                ps.setString(1, email);
                ps.execute();
                return null;
            }
        );
            return ResponseEntity.status(HttpStatus.OK)
                .body(new ResponseObject("OK", "Query to update PROC_deleteOTPByEmail() successfully", null));
        } catch (DataAccessException e) {
            // Xử lý lỗi liên quan đến truy cập dữ liệu
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(new ResponseObject("ERROR", "Database error: " + e.getMessage(), null));
        } catch (Exception e) {
            // Xử lý các lỗi khác
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(new ResponseObject("ERROR", "Error updating PROC_deleteOTPByEmail(): " + e.getMessage(), null));
        }
    }

    public ResponseEntity<ResponseObject> FNC_getOTPByEmail(String email){
        try {
            String otp = jdbcTemplate.queryForObject(
                "SELECT get_otp_by_email(?)",
                String.class, 
                email
            );

            JsonNode jsonNode = objectMapper.readTree(otp);

            return ResponseEntity.status(HttpStatus.OK)
                .body(new ResponseObject("OK", "Query to get FNC_getOTPByEmail() successfully", jsonNode));
        } catch (DataAccessException e) {
            // Xử lý lỗi liên quan đến truy cập dữ liệu
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(new ResponseObject("ERROR", "Database error: " + e.getMessage(), null));
        } catch (JsonProcessingException e) {
            // Xử lý lỗi khi parse JSON
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(new ResponseObject("ERROR", "JSON processing error: " + e.getMessage(), null));
        } catch (Exception e) {
            // Xử lý các lỗi khác
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(new ResponseObject("ERROR", "Error getting FNC_getOTPByEmail(): " + e.getMessage(), null));
        }
    }
}
