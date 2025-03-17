package hcmut.smart_garden_system.Models;
import lombok.Data;

@Data
public class SensorData {
    private Integer area;
    private Double temperature;
    private Double humidity;
    private Double light;
    private Double soilMoisture;
}
