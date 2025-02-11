package hcmut.smart_garden_system.Services;

import org.springframework.stereotype.Service;

import com.fasterxml.jackson.databind.ObjectMapper;

import hcmut.smart_garden_system.Models.SensorData;

@Service
public class SensorDataService {
    private static SensorData latestData;
    private static final ObjectMapper mapper = new ObjectMapper();
    
    public static void updateLatestData(String jsonData) {
        try {
            latestData = mapper.readValue(jsonData, SensorData.class);
        } catch (Exception e) {
            e.printStackTrace();
        }
    }
    
    public SensorData getLatestData() {
        return latestData;
    }
}
