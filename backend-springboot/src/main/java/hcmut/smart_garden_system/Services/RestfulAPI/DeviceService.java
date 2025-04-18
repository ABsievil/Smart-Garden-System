package hcmut.smart_garden_system.Services.RestfulAPI;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.List;

import org.springframework.dao.DataAccessException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.PreparedStatementCallback;
import org.springframework.stereotype.Service;
import org.springframework.beans.factory.annotation.Autowired;
import com.fasterxml.jackson.databind.ObjectMapper;

import hcmut.smart_garden_system.Controllers.SensorController;
import hcmut.smart_garden_system.DTOs.ResponseObject;
import hcmut.smart_garden_system.Models.SensorData;
import hcmut.smart_garden_system.Models.SensorRequest;
import hcmut.smart_garden_system.Models.DBTable.Device;
import hcmut.smart_garden_system.Repositories.DeviceRepository;

@Service
public class DeviceService {
    private final JdbcTemplate jdbcTemplate;
    private final ObjectMapper objectMapper;
    
    @Autowired
    private SensorController sensorController;

    @Autowired
    private DeviceRepository deviceRepository;

    public DeviceService(JdbcTemplate jdbcTemplate, ObjectMapper objectMapper) {
        this.jdbcTemplate = jdbcTemplate;
        this.objectMapper = objectMapper;
    }

    public ResponseEntity<ResponseObject> PROC_controlStatus(String deviceName, Boolean status, Integer area) {
        try {
            jdbcTemplate.execute(
            "CALL control_status(?, ?)",
            (PreparedStatementCallback<Void>) ps -> {
                ps.setString(1, deviceName);
                ps.setBoolean(2, status);
                ps.execute();
                return null;
            }
            );

            SensorRequest sensorRequest = new SensorRequest(area, deviceName, status, false, 0);
            sensorController.publishMessage(sensorRequest);
            System.out.println("send message to sensor successfully");

            return ResponseEntity.status(HttpStatus.OK)
                .body(new ResponseObject("OK", "Query to update PROC_controlStatus() successfully", null));
        } catch (DataAccessException e) {
            // Xử lý lỗi liên quan đến truy cập dữ liệu
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(new ResponseObject("ERROR", "Database error: " + e.getMessage(), null));
        } catch (Exception e) {
            // Xử lý các lỗi khác
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(new ResponseObject("ERROR", "Error updating PROC_controlStatus(): " + e.getMessage(), null));
        }
    }

    public ResponseEntity<ResponseObject> PROC_controlPumpSpeed(String deviceName, Integer value, Integer area) {
        try {
            jdbcTemplate.execute(
            "CALL control_pump_speed(?, ?)",
            (PreparedStatementCallback<Void>) ps -> {
                ps.setString(1, deviceName);
                ps.setInt(2, value);
                ps.execute();
                return null;
            }
            );

            SensorRequest sensorRequest = new SensorRequest(area, deviceName, false, false, value);
            sensorController.publishMessage(sensorRequest);
            System.out.println("send message pump speed to sensor successfully");

            return ResponseEntity.status(HttpStatus.OK)
                .body(new ResponseObject("OK", "Query to update PROC_controlPumpSpeed() successfully", null));
        } catch (DataAccessException e) {
            // Xử lý lỗi liên quan đến truy cập dữ liệu
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(new ResponseObject("ERROR", "Database error: " + e.getMessage(), null));
        } catch (Exception e) {
            // Xử lý các lỗi khác
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(new ResponseObject("ERROR", "Error updating PROC_controlPumpSpeed(): " + e.getMessage(), null));
        }
    }

    public ResponseEntity<ResponseObject> updateModeByArea(Integer area, String mode) {
        try {
            List<Device> devicesInArea = deviceRepository.findByArea(area);

            if (devicesInArea.isEmpty()) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(new ResponseObject("NOT_FOUND", "No devices found for area: " + area, null));
            }

            // Validate mode (optional, but good practice)
            if (!"AUTO".equalsIgnoreCase(mode) && !"MANUAL".equalsIgnoreCase(mode)) {
                 return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(new ResponseObject("BAD_REQUEST", "Invalid mode specified. Use 'AUTO' or 'MANUAL'.", null));
            }

            for (Device device : devicesInArea) {
                device.setMode(mode.toUpperCase()); // Ensure mode is stored consistently (e.g., uppercase)
            }

            deviceRepository.saveAll(devicesInArea); // Save all updated devices

            // Consider if an MQTT message needs to be sent for mode changes
            // If so, iterate through devicesInArea and call sensorController.publishMessage() appropriately.
            // For now, assuming no MQTT message is needed.

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

            // Return the mode of the first device found in the area
            // If modes can be mixed, the UI might need more complex handling
            String mode = devicesInArea.get(0).getMode(); 

            // Handle case where the first device might have a null mode (optional, depends on DB constraints)
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
}
