package hcmut.smart_garden_system.Models;
import lombok.Data;

@Data
public class SensorRequest {
    private String deviceName;
    private Boolean active;
    private String value;
}
