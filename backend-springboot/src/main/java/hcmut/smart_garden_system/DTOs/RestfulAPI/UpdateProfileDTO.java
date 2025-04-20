package hcmut.smart_garden_system.DTOs.RestfulAPI;

import lombok.Data;
import java.sql.Date;

@Data
public class UpdateProfileDTO {
    private String username; // To identify the user
    private String email; // User field
    private String ssn; // PersonalInformation fields
    private String sex;
    private String fname;
    private String lname;
    private Date date;
    private Integer salary;
    private String phoneNumber;
    private String address;
    private String jobName;
    private Integer jobArea;
} 