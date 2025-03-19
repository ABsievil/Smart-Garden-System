package hcmut.smart_garden_system.Services.RestfulAPI;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;

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

@Service
public class DeviceService {
    private final JdbcTemplate jdbcTemplate;
    private final ObjectMapper objectMapper;
    
    @Autowired
    private SensorController sensorController;

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
}
