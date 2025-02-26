package hcmut.smart_garden_system.Controllers;

import org.eclipse.paho.client.mqttv3.MqttException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.messaging.MessagingException;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import hcmut.smart_garden_system.Config.MqttPublisher;
import hcmut.smart_garden_system.DTOs.ResponseObject;
import hcmut.smart_garden_system.Models.SensorData;
import hcmut.smart_garden_system.Models.SensorRequest;

@RestController
@RequestMapping("/api/v1/sensor")
public class SensorController {
    @Autowired
    private MqttPublisher mqttPublisher;
    
    @PostMapping("/publish")
    public ResponseEntity<ResponseObject> publishMessage(@RequestBody SensorRequest sensorRequest) {
        try {
            mqttPublisher.publishSensorData(sensorRequest);
            return ResponseEntity.status(HttpStatus.OK)
                    .body(new ResponseObject("OK", "Sensor Message published successfully", null));

        } catch (IllegalArgumentException e) {
            // Handle invalid input data
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(new ResponseObject("ERROR", "Invalid sensor data: " + e.getMessage(), null));
        } catch (Exception e) {
            // Handle any MQTT or other runtime errors
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(new ResponseObject("ERROR", "Failed to publish message: " + e.getMessage(), null));
        }
    }
}
