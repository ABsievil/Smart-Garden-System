package hcmut.smart_garden_system.DTOs.RestfulAPI;
import hcmut.smart_garden_system.Models.PersonalInformation;
import hcmut.smart_garden_system.Models.Role;
import hcmut.smart_garden_system.Models.User;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UserProfileDTO {
    private Integer userId;
    private String username;
    private String email;
    private Role role;
    private PersonalInformation information; // Giữ nguyên cấu trúc PersonalInformation

    // Factory method để tạo DTO từ User entity
    public static UserProfileDTO fromUser(User user) {
        if (user == null) {
            return null;
        }
        return UserProfileDTO.builder()
                .userId(user.getUserId())
                .email(user.getEmail())
                .information(user.getInformation()) // Lấy toàn bộ thông tin cá nhân
                .build();
    }
}