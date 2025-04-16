package hcmut.smart_garden_system.Models;

import java.sql.Date;
import jakarta.persistence.Column;
import jakarta.persistence.Embeddable;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;


@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Embeddable
public class PersonalInformation {
    private String ssn;

    private String sex;
    
    @Column(name= "fname")
    private String fname;

    @Column(name= "lname")
    private String lname;

    @Column(name= "date_of_birth")
    private Date date;

    private Integer salary;

    private Integer numsofdevice;

    private Integer numofschedules;

    @Column(name= "phone_number")
    private String phoneNumber;

    private String address;

    @Column(name= "job_name")
    private String jobName;

    @Column(name= "job_area")
    private Integer jobArea;
}