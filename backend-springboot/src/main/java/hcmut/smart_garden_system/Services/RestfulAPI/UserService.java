package hcmut.smart_garden_system.Services.RestfulAPI;
import hcmut.smart_garden_system.DTOs.ResponseObject;
import hcmut.smart_garden_system.DTOs.RestfulAPI.UpdateProfileDTO;
import hcmut.smart_garden_system.DTOs.RestfulAPI.UserProfileDTO;
import hcmut.smart_garden_system.Models.PersonalInformation;
import hcmut.smart_garden_system.Models.User;
import hcmut.smart_garden_system.Repositories.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class UserService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

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

    public ResponseEntity<ResponseObject> changePassword(String username, String oldPassword, String newPassword) {
        try {
            User user = userRepository.findByUsername(username);

            if (user == null) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND)
                        .body(new ResponseObject("NOT_FOUND", "User not found with username: " + username, null));
            }

            if (!passwordEncoder.matches(oldPassword, user.getPassword())) {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                        .body(new ResponseObject("FAILED", "Incorrect old password", null));
            }

            user.setPassword(passwordEncoder.encode(newPassword));
            userRepository.save(user);

            return ResponseEntity.status(HttpStatus.OK)
                    .body(new ResponseObject("OK", "Password changed successfully", null));

        } catch (Exception e) {
            System.err.println("Error changing password for username " + username + ": " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(new ResponseObject("ERROR", "Failed to change password: " + e.getMessage(), null));
        }
    }

    public ResponseEntity<ResponseObject> resetPassword(String email, String newPassword) {
        try {
            User user = userRepository.findByEmail(email);

            if (user == null) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND)
                        .body(new ResponseObject("NOT_FOUND", "User not found with email: " + email, null));
            }

            user.setPassword(passwordEncoder.encode(newPassword));
            userRepository.save(user);

            return ResponseEntity.status(HttpStatus.OK)
                    .body(new ResponseObject("OK", "Password reset successfully for user with email: " + email, null));

        } catch (Exception e) {
            System.err.println("Error resetting password for email " + email + ": " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(new ResponseObject("ERROR", "Failed to reset password: " + e.getMessage(), null));
        }
    }

    public ResponseEntity<ResponseObject> updateProfile(UpdateProfileDTO updateProfileDTO) {
        try {
            User user = userRepository.findByUsername(updateProfileDTO.getUsername());

            if (user == null) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND)
                        .body(new ResponseObject("NOT_FOUND", "User not found with username: " + updateProfileDTO.getUsername(), null));
            }

            // Update User fields if provided
            if (updateProfileDTO.getEmail() != null) {
                user.setEmail(updateProfileDTO.getEmail());
            }

            // Update PersonalInformation fields if provided
            PersonalInformation info = user.getInformation();
            if (info == null) { // Initialize if null
                info = new PersonalInformation();
                user.setInformation(info);
            }

            if (updateProfileDTO.getSsn() != null) {
                info.setSsn(updateProfileDTO.getSsn());
            }
            if (updateProfileDTO.getSex() != null) {
                info.setSex(updateProfileDTO.getSex());
            }
            if (updateProfileDTO.getFname() != null) {
                info.setFname(updateProfileDTO.getFname());
            }
            if (updateProfileDTO.getLname() != null) {
                info.setLname(updateProfileDTO.getLname());
            }
            if (updateProfileDTO.getDate() != null) {
                info.setDate(updateProfileDTO.getDate());
            }
            if (updateProfileDTO.getSalary() != null) {
                info.setSalary(updateProfileDTO.getSalary());
            }
            if (updateProfileDTO.getPhoneNumber() != null) {
                info.setPhoneNumber(updateProfileDTO.getPhoneNumber());
            }
            if (updateProfileDTO.getAddress() != null) {
                info.setAddress(updateProfileDTO.getAddress());
            }
            if (updateProfileDTO.getJobName() != null) {
                info.setJobName(updateProfileDTO.getJobName());
            }
            if (updateProfileDTO.getJobArea() != null) {
                info.setJobArea(updateProfileDTO.getJobArea());
            }

            userRepository.save(user);

            UserProfileDTO updatedUserProfile = UserProfileDTO.fromUser(user); // Return updated profile

            return ResponseEntity.status(HttpStatus.OK)
                    .body(new ResponseObject("OK", "Profile updated successfully", updatedUserProfile));

        } catch (Exception e) {
            System.err.println("Error updating profile for username " + updateProfileDTO.getUsername() + ": " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(new ResponseObject("ERROR", "Failed to update profile: " + e.getMessage(), null));
        }
    }
}