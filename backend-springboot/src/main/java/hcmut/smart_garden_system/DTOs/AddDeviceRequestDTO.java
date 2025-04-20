package hcmut.smart_garden_system.DTOs;

import lombok.Data;

@Data
public class AddDeviceRequestDTO {
    private String name;
    private Integer area;
    private String warranty;
    private String drive;
    private String inputVoltage;
    private String outputVoltage;
    private String state; // "ACTIVE" or "BROKEN"
    private String status; // "ON" or "OFF"
    private Integer speed;
    private String mode; // "AUTO" or "MANUAL"
} 