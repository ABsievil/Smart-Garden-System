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

    public void sendOTPEmail(String toEmail, String subject) throws MessagingException {
        String otp = OTPGenerator.generateOTP();
        saveOTPToDatabase(toEmail, otp);

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
    }
    
    private void saveOTPToDatabase(String toEmail, String otp) {
        // Lưu OTP với thời gian hết hạn (ví dụ: 5 phút)
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
        } catch (DataAccessException e) {
            // Xử lý lỗi liên quan đến truy cập dữ liệu
            logger.error("Database access error when saving OTP for email: {}", toEmail, e);
            // throw new DatabaseException("Cannot save OTP", e);
        } catch (Exception e) {
            // Xử lý các lỗi khác
            logger.error("Unexpected error when saving OTP for email: {}", toEmail, e);
            throw new RuntimeException("Unknown error while saving OTP", e);
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
