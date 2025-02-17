package hcmut.smart_garden_system.Config;
import org.eclipse.paho.client.mqttv3.MqttConnectOptions;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.integration.annotation.ServiceActivator;
import org.springframework.integration.channel.DirectChannel;
import org.springframework.integration.core.MessageProducer;
import org.springframework.integration.mqtt.core.DefaultMqttPahoClientFactory;
import org.springframework.integration.mqtt.core.MqttPahoClientFactory;
import org.springframework.integration.mqtt.inbound.MqttPahoMessageDrivenChannelAdapter;
import org.springframework.integration.mqtt.support.DefaultPahoMessageConverter;
import org.springframework.messaging.MessageChannel;
import org.springframework.messaging.MessageHandler;

import hcmut.smart_garden_system.Services.SensorDataService;

@Configuration
public class MqttConfig {
    
    @Value("${mqtt.broker.url}")
    private String brokerUrl;
    
    @Value("${mqtt.client.id}")
    private String clientId;
    
    @Value("${mqtt.topic}")
    private String topic;

    @Bean
    public MqttPahoClientFactory mqttClientFactory() {
        DefaultMqttPahoClientFactory factory = new DefaultMqttPahoClientFactory();
        MqttConnectOptions options = new MqttConnectOptions();
        
        options.setServerURIs(new String[] { brokerUrl }); // Địa chỉ MQTT broker
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
            // Lưu message vào service để render ra view
            SensorDataService.updateLatestData(payload);
        };
    }
}
