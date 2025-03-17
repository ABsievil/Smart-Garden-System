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

    private String id;

    @Column(name= "fname")
    private String fname;

    @Column(name= "lname")
    private String lname;

    @Column(name= "dob")
    private Date date;

    private Integer salary;

    private Integer numsofdevice;

    private Integer numofschedules;

    @Column(name= "phonenumber")
    private String phoneNumber;
}