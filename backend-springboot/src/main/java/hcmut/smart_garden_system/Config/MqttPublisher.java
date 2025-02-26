package hcmut.smart_garden_system.Config;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;

import hcmut.smart_garden_system.Models.SensorRequest;

@Service
public class MqttPublisher {
    
    @Autowired
    private MqttGateway mqttGateway;
    
    @Value("${mqtt.topicfromserver}")
    private String topicFromServer;
    
    public void publishSensorData(SensorRequest sensorRequest) {
        try {
            // Chuyển đổi object thành JSON string
            ObjectMapper mapper = new ObjectMapper();
            String jsonPayload = mapper.writeValueAsString(sensorRequest);
            
            // Gửi message tới MQTT broker
            mqttGateway.sendToMqtt(jsonPayload);
            System.out.println("Sensor Message published: "+ jsonPayload);
        } catch (JsonProcessingException e) {
            System.err.println("Error parsing json: " + e.getMessage());
        }
    }

}
