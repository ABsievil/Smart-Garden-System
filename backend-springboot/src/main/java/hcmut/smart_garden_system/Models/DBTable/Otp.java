package hcmut.smart_garden_system.Models.DBTable;

import hcmut.smart_garden_system.Models.DBTable.MainKeys.OtpId;
import jakarta.persistence.Column;
import jakarta.persistence.EmbeddedId;
import jakarta.persistence.Entity;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;


@Entity
@Table(name = "otp")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Otp {
    @EmbeddedId
    private OtpId id;

    @Column(name = "get_otp")
    private String getOtp;
}