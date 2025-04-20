package hcmut.smart_garden_system.Config;
import org.eclipse.paho.client.mqttv3.MqttConnectOptions;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.integration.annotation.ServiceActivator;
import org.springframework.integration.channel.DirectChannel;
import org.springframework.integration.core.MessageProducer;
import org.springframework.integration.mqtt.core.DefaultMqttPahoClientFactory;
import org.springframework.integration.mqtt.core.MqttPahoClientFactory;
import org.springframework.integration.mqtt.inbound.MqttPahoMessageDrivenChannelAdapter;
import org.springframework.integration.mqtt.outbound.MqttPahoMessageHandler;
import org.springframework.integration.mqtt.support.DefaultPahoMessageConverter;
import org.springframework.messaging.MessageChannel;
import org.springframework.messaging.MessageHandler;

import com.fasterxml.jackson.databind.ObjectMapper;

import hcmut.smart_garden_system.Models.DeviceData;
import hcmut.smart_garden_system.Models.SensorData;
import hcmut.smart_garden_system.Services.SensorDataService;
import hcmut.smart_garden_system.Services.RestfulAPI.DeviceService;
import hcmut.smart_garden_system.Services.RestfulAPI.RecordService;

@Configuration
public class MqttConfig {
    
    @Value("${mqtt.broker.url}")
    private String brokerUrl;
    
    @Value("${mqtt.client.id}")
    private String clientId;
    
    @Value("${mqtt.username}")
    private String username;

    @Value("${mqtt.password}")
    private String password;
    
    @Value("${mqtt.topic}")
    private String topic;

    @Value("${mqtt.topicfromserver}")
    private String topicFromServer;

    @Autowired
    private RecordService recordService;

    @Autowired
    private DeviceService deviceService;

    private final ObjectMapper mapper = new ObjectMapper();
    
    @Bean
    public MqttPahoClientFactory mqttClientFactory() {
        DefaultMqttPahoClientFactory factory = new DefaultMqttPahoClientFactory();
        MqttConnectOptions options = new MqttConnectOptions();
        
        options.setServerURIs(new String[] { brokerUrl }); // Địa chỉ MQTT broker
        options.setUserName(username); // Set username
        options.setPassword(password.toCharArray()); // Set password
        options.setCleanSession(true);
        
        factory.setConnectionOptions(options);
        return factory;
    }
    
    @Bean
    public MessageChannel mqttInputChannel() {
        return new DirectChannel();
    }
    
    @Bean
    public MessageProducer inbound() {
        MqttPahoMessageDrivenChannelAdapter 
            adapter = new MqttPahoMessageDrivenChannelAdapter(clientId, mqttClientFactory(), topic); // MQTT topic để subscribe
                
        adapter.setCompletionTimeout(5000);
        adapter.setConverter(new DefaultPahoMessageConverter());
        adapter.setQos(1);
        adapter.setOutputChannel(mqttInputChannel());
        return adapter;
    }
    
    @Bean
    @ServiceActivator(inputChannel = "mqttInputChannel")
    public MessageHandler handler() {
        return message -> {
            String payload = message.getPayload().toString();
            System.out.println("Received message: " + payload);

            try {
                // Thử parse thành SensorData trước
                SensorData sensorData = mapper.readValue(payload, SensorData.class);
                System.out.println("Parsed as SensorData: " + sensorData);
                // Lưu message vào service để render ra view
                SensorDataService.updateLatestData(payload); // Giả sử service này chỉ xử lý SensorData dạng String
                recordService.PROC_saveRecord(sensorData); // Lưu record SensorData

            } catch (com.fasterxml.jackson.core.JsonProcessingException eSensor) {
                // Nếu không phải SensorData, thử parse thành DeviceData
                try {
                    DeviceData deviceData = mapper.readValue(payload, DeviceData.class);
                    deviceService.updateModeByAreaFromData(deviceData);
                    System.out.println("Parsed as DeviceData: " + deviceData);
                    // Xử lý DeviceData ở đây (ví dụ: lưu vào DB khác, cập nhật trạng thái,...)
                    // deviceStatusService.updateDeviceStatus(deviceData);
                } catch (com.fasterxml.jackson.core.JsonProcessingException eDevice) {
                    // Nếu cũng không phải DeviceData, log lỗi
                    System.err.println("Error processing JSON: Unknown format. Payload: " + payload);
                    System.err.println("SensorData parse error: " + eSensor.getMessage());
                    System.err.println("DeviceData parse error: " + eDevice.getMessage());
                }
            } catch (Exception e) {
                // Các lỗi khác không liên quan đến JSON parsing
                System.err.println("An unexpected error occurred: " + e.getMessage());
            }
        };
    }

    // Publish message to MQTT broker
    @Bean
    public MessageChannel mqttOutboundChannel() {
        return new DirectChannel();
    }

    @Bean
    @ServiceActivator(inputChannel = "mqttOutboundChannel")
    public MessageHandler mqttOutbound() {
        MqttPahoMessageHandler messageHandler = new MqttPahoMessageHandler(clientId + "_pub", mqttClientFactory());
        messageHandler.setAsync(true);
        messageHandler.setDefaultTopic(topicFromServer);
        return messageHandler;
    }
}
