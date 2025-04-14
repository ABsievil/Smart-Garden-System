package hcmut.smart_garden_system.Services.RestfulAPI;
import hcmut.smart_garden_system.DTOs.ResponseObject;
import hcmut.smart_garden_system.DTOs.RestfulAPI.UserProfileDTO;
import hcmut.smart_garden_system.Models.User;
import hcmut.smart_garden_system.Repositories.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class UserService {

    @Autowired
    private UserRepository userRepository;

    public ResponseEntity<ResponseObject> getUserProfile(String username) {
        try {
            User user = userRepository.findByUsername(username);

            if (user == null) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND)
                        .body(new ResponseObject("NOT_FOUND", "User not found with username: " + username, null));
            }

            UserProfileDTO userProfile = UserProfileDTO.fromUser(user); // Chuyển đổi sang DTO

            return ResponseEntity.status(HttpStatus.OK)
                    .body(new ResponseObject("OK", "Get user profile successfully", userProfile));

        } catch (Exception e) {
            // Ghi log lỗi chi tiết hơn nếu cần
            System.err.println("Error getting user profile for username " + username + ": " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(new ResponseObject("ERROR", "Failed to get user profile: " + e.getMessage(), null));
        }
    }
}