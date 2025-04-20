package hcmut.smart_garden_system.Models.DBCompositeTable;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import jakarta.persistence.Column;
import jakarta.persistence.Embeddable;
import java.io.Serializable;

@Embeddable
@Data
@NoArgsConstructor
@AllArgsConstructor
public class DeviceAreaId implements Serializable {
    @Column(name = "device_id")
    private Integer deviceId;

    @Column(name = "area")
    private Integer area;
}