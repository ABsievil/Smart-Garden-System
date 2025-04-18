package hcmut.smart_garden_system.Services.RestfulAPI;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.Map;
import java.util.HashMap;
import java.util.LinkedList;
import java.util.Optional;

import org.springframework.dao.DataAccessException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.beans.factory.annotation.Autowired;
import com.fasterxml.jackson.databind.ObjectMapper;

import hcmut.smart_garden_system.Controllers.SensorController;
import hcmut.smart_garden_system.DTOs.ResponseObject;
import hcmut.smart_garden_system.Models.SensorData;
import hcmut.smart_garden_system.Models.SensorRequest;
import hcmut.smart_garden_system.Models.DBTable.Device;
import hcmut.smart_garden_system.Repositories.DeviceRepository;
import hcmut.smart_garden_system.Models.DeviceData;

@Service
public class DeviceService {
    private final ObjectMapper objectMapper;
    
    @Autowired
    private SensorController sensorController;

    @Autowired
    private DeviceRepository deviceRepository;

    public DeviceService(ObjectMapper objectMapper) {
        this.objectMapper = objectMapper;
    }

    public ResponseEntity<ResponseObject> PROC_controlStatus(String deviceName, Boolean status, Integer area) {
        try {
            Optional<Device> deviceOptional = deviceRepository.findByNameAndArea(deviceName, area);

            if (!deviceOptional.isPresent()) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(new ResponseObject("NOT_FOUND", "Device '" + deviceName + "' not found in area " + area, null));
            }

            Device device = deviceOptional.get();
            device.setStatus(status);
            deviceRepository.save(device);

            SensorRequest sensorRequest = new SensorRequest(area, deviceName, status, false, 0);
            sensorController.publishMessage(sensorRequest);
            System.out.println("send message to sensor successfully");

            return ResponseEntity.status(HttpStatus.OK)
                .body(new ResponseObject("OK", "Updated status for device '" + deviceName + "' in area " + area, null));
        } catch (DataAccessException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(new ResponseObject("ERROR", "Database error updating status: " + e.getMessage(), null));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(new ResponseObject("ERROR", "Error processing status update: " + e.getMessage(), null));
        }
    }

    public ResponseEntity<ResponseObject> PROC_controlPumpSpeed(String deviceName, Integer value, Integer area) {
        try {
            Optional<Device> deviceOptional = deviceRepository.findByNameAndArea(deviceName, area);

            if (!deviceOptional.isPresent()) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(new ResponseObject("NOT_FOUND", "Device '" + deviceName + "' not found in area " + area, null));
            }

            Device device = deviceOptional.get();
            device.setSpeed(value);
            deviceRepository.save(device);
            
            SensorRequest sensorRequest = new SensorRequest(area, deviceName, false, false, value);
            sensorController.publishMessage(sensorRequest);
            System.out.println("send message pump speed to sensor successfully");

            return ResponseEntity.status(HttpStatus.OK)
                .body(new ResponseObject("OK", "Updated speed for device '" + deviceName + "' in area " + area, null));
        } catch (DataAccessException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(new ResponseObject("ERROR", "Database error updating pump speed: " + e.getMessage(), null));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(new ResponseObject("ERROR", "Error processing pump speed update: " + e.getMessage(), null));
        }
    }

    public ResponseEntity<ResponseObject> updateModeByArea(Integer area, String mode) {
        try {
            List<Device> devicesInArea = deviceRepository.findByArea(area);

            if (devicesInArea.isEmpty()) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(new ResponseObject("NOT_FOUND", "No devices found for area: " + area, null));
            }

            if (!"AUTO".equalsIgnoreCase(mode) && !"MANUAL".equalsIgnoreCase(mode)) {
                 return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(new ResponseObject("BAD_REQUEST", "Invalid mode specified. Use 'AUTO' or 'MANUAL'.", null));
            }

            for (Device device : devicesInArea) {
                device.setMode(mode.toUpperCase());
            }

            deviceRepository.saveAll(devicesInArea);
            // Xác định giá trị deviceMode bằng toán tử ba ngôi, sửa lỗi so sánh chuỗi
            boolean deviceModeAuto = mode.equalsIgnoreCase("AUTO");
            SensorRequest sensorRequest = new SensorRequest(area, "Fan1", false, deviceModeAuto, 0);
            sensorController.publishMessage(sensorRequest);
            System.out.println("Sent message to change Device Mode to " + mode + " for Fan1 in area " + area);

            return ResponseEntity.status(HttpStatus.OK)
                .body(new ResponseObject("OK", "Successfully updated mode for all devices in area " + area + " to " + mode.toUpperCase(), null));

        } catch (DataAccessException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(new ResponseObject("ERROR", "Database error while updating modes: " + e.getMessage(), null));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(new ResponseObject("ERROR", "Error updating modes for area " + area + ": " + e.getMessage(), null));
        }
    }

    public ResponseEntity<ResponseObject> getModeByArea(Integer area) {
        try {
            List<Device> devicesInArea = deviceRepository.findByArea(area);

            if (devicesInArea.isEmpty()) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(new ResponseObject("NOT_FOUND", "No devices found for area: " + area, null));
            }

            String mode = devicesInArea.get(0).getMode(); 

            if (mode == null) {
                 return ResponseEntity.status(HttpStatus.OK)
                    .body(new ResponseObject("OK", "First device found in area " + area + " has no mode set.", null));
            }

            return ResponseEntity.status(HttpStatus.OK)
                .body(new ResponseObject("OK", "Successfully retrieved mode for area " + area, mode));

        } catch (DataAccessException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(new ResponseObject("ERROR", "Database error while retrieving mode: " + e.getMessage(), null));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(new ResponseObject("ERROR", "Error retrieving mode for area " + area + ": " + e.getMessage(), null));
        }
    }

    public ResponseEntity<ResponseObject> getDevicesByArea(Integer area) {
        try {
            List<Device> devicesInArea = deviceRepository.findByArea(area);

            if (devicesInArea.isEmpty()) {
                return ResponseEntity.status(HttpStatus.OK)
                    .body(new ResponseObject("OK", "No devices found for area: " + area, new LinkedList<>())); 
            }

            LinkedList<Map<String, Object>> deviceList = new LinkedList<>();
            for (Device device : devicesInArea) {
                Map<String, Object> deviceInfo = new HashMap<>();
                deviceInfo.put("name", device.getName());
                deviceInfo.put("status", device.getStatus());
                deviceInfo.put("speed", device.getSpeed());
                deviceList.add(deviceInfo);
            }

            return ResponseEntity.status(HttpStatus.OK)
                .body(new ResponseObject("OK", "Successfully retrieved devices for area " + area, deviceList));

        } catch (DataAccessException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(new ResponseObject("ERROR", "Database error while retrieving devices: " + e.getMessage(), null));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(new ResponseObject("ERROR", "Error retrieving devices for area " + area + ": " + e.getMessage(), null));
        }
    }

    /**
     * Updates the mode for all devices within a specific area based on DeviceData.
     * @param deviceData DTO containing areaId and the new mode.
     * @return ResponseEntity with the operation status.
     */
    public ResponseEntity<ResponseObject> updateModeByAreaFromData(DeviceData deviceData) {
        Integer areaId = deviceData.getArea();
        String mode = deviceData.getMode();

        if (areaId == null || mode == null) {
             return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                .body(new ResponseObject("BAD_REQUEST", "Missing areaId or mode in the request body.", null));
        }

        try {
            List<Device> devicesInArea = deviceRepository.findByArea(areaId);

            if (devicesInArea.isEmpty()) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(new ResponseObject("NOT_FOUND", "No devices found for area: " + areaId, null));
            }

            if (!"AUTO".equalsIgnoreCase(mode) && !"MANUAL".equalsIgnoreCase(mode)) {
                 return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(new ResponseObject("BAD_REQUEST", "Invalid mode specified. Use 'AUTO' or 'MANUAL'.", null));
            }

            String upperCaseMode = mode.toUpperCase();
            for (Device device : devicesInArea) {
                device.setMode(upperCaseMode);
            }

            deviceRepository.saveAll(devicesInArea);

            return ResponseEntity.status(HttpStatus.OK)
                .body(new ResponseObject("OK", "Successfully updated mode for all devices in area " + areaId + " to " + upperCaseMode, null));

        } catch (DataAccessException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(new ResponseObject("ERROR", "Database error while updating modes: " + e.getMessage(), null));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(new ResponseObject("ERROR", "Error updating modes for area " + areaId + ": " + e.getMessage(), null));
        }
    }
}
