package hcmut.smart_garden_system.Models;
import lombok.Data;

@Data
public class SensorData {
    private Integer temperature;
    private Integer pressure;
    private Integer humidity;
    private Integer gas;
}
