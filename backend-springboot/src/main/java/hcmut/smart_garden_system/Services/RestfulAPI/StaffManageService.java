package hcmut.smart_garden_system.Services.RestfulAPI;

import hcmut.smart_garden_system.Models.PersonalInformation;
import hcmut.smart_garden_system.DTOs.AddUserRequestDTO;
import hcmut.smart_garden_system.DTOs.ResponseObject;
import hcmut.smart_garden_system.Models.Role;
import hcmut.smart_garden_system.Models.User;
import hcmut.smart_garden_system.Repositories.UserRepository;
import hcmut.smart_garden_system.Repositories.TreeRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.DataAccessException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@Service
public class StaffManageService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private TreeRepository treeRepository;

    public ResponseEntity<ResponseObject> getUserList() {
        try {
            List<User> userList = userRepository.findAllUsersByRoleUser();
            List<Map<String, Object>> resultList = new ArrayList<>();

            for (User user : userList) {
                Map<String, Object> userData = new LinkedHashMap<>();
                PersonalInformation info = user.getInformation();

                if (info != null) {
                    String name = (info.getLname() != null ? info.getLname() : "") +
                                  (info.getFname() != null ? " " + info.getFname() : "");
                    userData.put("name", name.trim().isEmpty() ? null : name.trim());
                    userData.put("jobName", info.getJobName());
                    userData.put("ssn", info.getSsn());
                } else {
                    userData.put("name", null);
                    userData.put("jobName", null);
                    userData.put("ssn", null);
                }
                // Có thể thêm các trường khác nếu cần, ví dụ:
                // userData.put("username", user.getUsername());
                // userData.put("email", user.getEmail());

                resultList.add(userData);
            }

            // Tạo Map kết quả cuối cùng
            Map<String, Object> responseData = new LinkedHashMap<>();
            responseData.put("totalUser", resultList.size());
            responseData.put("userList", resultList);

            return ResponseEntity.status(HttpStatus.OK)
                    .body(new ResponseObject("OK", "Query getUserList() successfully", responseData));

        } catch (DataAccessException e) {
            System.err.println("Database error in getUserList(): " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(new ResponseObject("ERROR", "Database error: " + e.getMessage(), null));
        } catch (Exception e) {
            System.err.println("Unexpected error in getUserList(): " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(new ResponseObject("ERROR", "Unexpected error: " + e.getMessage(), null));
        }
    }

    @Transactional
    public ResponseEntity<ResponseObject> addUser(AddUserRequestDTO requestDTO) {
        try {
            if (userRepository.findByUsername(requestDTO.getUsername()) != null) {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                        .body(new ResponseObject("FAILED", "Username already exists", null));
            }

            PersonalInformation info = requestDTO.getInformation();
            if (info != null && info.getJobArea() != null) {
                if (!treeRepository.existsById(info.getJobArea())) {
                    return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                            .body(new ResponseObject("FAILED", "Tree Area with ID " + info.getJobArea() + " does not exist", null));
                }
            }

            Optional<User> lastUserOpt = userRepository.findTopByOrderByUserIdDesc();
            int nextUserId = lastUserOpt.map(user -> user.getUserId() + 1).orElse(1);

            User newUser = User.builder()
                    .username(requestDTO.getUsername())
                    .password(passwordEncoder.encode(requestDTO.getPassword()))
                    .email(requestDTO.getEmail())
                    .role(Role.USER)
                    .userId(nextUserId)
                    .information(info)
                    .build();

            User savedUser = userRepository.save(newUser);

            return ResponseEntity.status(HttpStatus.CREATED)
                    .body(new ResponseObject("OK", "User added successfully", savedUser));

        } catch (DataAccessException e) {
            System.err.println("Database error in addUser(): " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(new ResponseObject("ERROR", "Database error: " + e.getMessage(), null));
        } catch (Exception e) {
            System.err.println("Unexpected error in addUser(): " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(new ResponseObject("ERROR", "Unexpected error: " + e.getMessage(), null));
        }
    }
}
