package hcmut.smart_garden_system.DTOs.RestfulAPI;

import lombok.Data;

@Data
public class ResetPasswordDTO {
    private String username;
    private String newPassword;
} 