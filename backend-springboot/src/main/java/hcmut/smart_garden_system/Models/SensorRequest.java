package hcmut.smart_garden_system.Models;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class SensorRequest {
    private Integer area;
    private String deviceName;
    private Boolean active;
    private Boolean deviceMode;
    private Integer value; // optional, use for P of pump, temperature of Fan
}