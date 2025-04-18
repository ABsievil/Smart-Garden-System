package hcmut.smart_garden_system.Models.DBTable;
import java.time.LocalDateTime;

import jakarta.persistence.Column;
import jakarta.persistence.EmbeddedId;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "device")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Device {
    @Id
    @Column(name = "device_id")
    private Integer deviceId;

    @Column(name = "name", nullable = false)
    private String name;

    @Column(name = "area")
    private Integer area;

    @Column(name = "warranty")
    private String warranty;

    @Column(name = "drive")
    private String drive;

    @Column(name = "input_voltage")
    private String inputVoltage;

    @Column(name = "output_voltage")
    private String outputVoltage;

    @Column(name = "state")
    private Boolean state;

    @Column(name = "status")
    private Boolean status;

    @Column(name = "speed")
    private Integer speed;

    @Column(name = "mode")
    private String mode;
}