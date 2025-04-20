package hcmut.smart_garden_system.DTOs;

import hcmut.smart_garden_system.Models.PersonalInformation;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class AddUserRequestDTO {
    private String username;
    private String password;
    private String email;
    private PersonalInformation information; // Có thể null hoặc chứa thông tin
} 