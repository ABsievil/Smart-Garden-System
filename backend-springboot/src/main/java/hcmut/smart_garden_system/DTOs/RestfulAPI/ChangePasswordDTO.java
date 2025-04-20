package hcmut.smart_garden_system.DTOs.RestfulAPI;

import lombok.Data;

@Data
public class ChangePasswordDTO {
    private String username;
    private String oldPassword;
    private String newPassword;
} 