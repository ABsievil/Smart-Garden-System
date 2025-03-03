package hcmut.smart_garden_system.Models;
import lombok.Data;

@Data
public class SensorRequest {
    private String deviceName;
    private Boolean active;
    private Boolean deviceMode;
    private String value; // optional, use for P of pump, temperature of Fan
}
