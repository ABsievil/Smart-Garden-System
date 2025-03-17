package hcmut.smart_garden_system.Services.RestfulAPI;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;

import org.springframework.dao.DataAccessException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.PreparedStatementCallback;
import org.springframework.stereotype.Service;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;

import hcmut.smart_garden_system.DTOs.ResponseObject;
import hcmut.smart_garden_system.Models.SensorData;

@Service
public class RecordService {
    private final JdbcTemplate jdbcTemplate;
    private final ObjectMapper objectMapper;

    public RecordService(JdbcTemplate jdbcTemplate, ObjectMapper objectMapper) {
        this.jdbcTemplate = jdbcTemplate;
        this.objectMapper = objectMapper;
    }

    public ResponseEntity<ResponseObject> FNC_getCurrentRecord(Integer area){
        try {
            String currentRecord = jdbcTemplate.queryForObject(
                "select get_current_record(?)",
                String.class, area
            );
            // if (currentRecord == null) {
            //     return ResponseEntity.status(HttpStatus.OK)
            //         .body(new ResponseObject("OK", "Query to get FNC_getCurrentRecord() successfully with data = null", currentRecord));
            // }

            JsonNode jsonNode = objectMapper.readTree(currentRecord);

            return ResponseEntity.status(HttpStatus.OK)
                .body(new ResponseObject("OK", "Query to get FNC_getCurrentRecord() successfully", jsonNode));
        } catch (DataAccessException e) {
            // Xử lý lỗi liên quan đến truy cập dữ liệu
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(new ResponseObject("ERROR", "Database error: " + e.getMessage(), null));
        } catch (JsonProcessingException e) {
            // Xử lý lỗi khi parse JSON
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(new ResponseObject("ERROR", "JSON processing error: " + e.getMessage(), null));
        } catch (Exception e) {
            // Xử lý các lỗi khác
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(new ResponseObject("ERROR", "Error getting FNC_getCurrentRecord(): " + e.getMessage(), null));
        }
    }

    public ResponseEntity<ResponseObject> FNC_getAllRecord(){
        try {
            String allRecords = jdbcTemplate.queryForObject(
                "select get_all_record()",
                String.class
            );
            if (allRecords == null) {
                return ResponseEntity.status(HttpStatus.OK)
                    .body(new ResponseObject("OK", "Query to get FNC_getAllRecord() successfully with data = null", allRecords));
            }

            JsonNode jsonNode = objectMapper.readTree(allRecords);

            return ResponseEntity.status(HttpStatus.OK)
                .body(new ResponseObject("OK", "Query to get FNC_getAllRecord() successfully", jsonNode));
        } catch (DataAccessException e) {
            // Xử lý lỗi liên quan đến truy cập dữ liệu
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(new ResponseObject("ERROR", "Database error: " + e.getMessage(), null));
        } catch (JsonProcessingException e) {
            // Xử lý lỗi khi parse JSON
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(new ResponseObject("ERROR", "JSON processing error: " + e.getMessage(), null));
        } catch (Exception e) {
            // Xử lý các lỗi khác
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(new ResponseObject("ERROR", "Error getting FNC_getAllRecord(): " + e.getMessage(), null));
        }
    }

    public ResponseEntity<ResponseObject> PROC_saveRecord(SensorData sensorData){
        try {
            LocalDateTime now = LocalDateTime.now();
            DateTimeFormatter formatter = DateTimeFormatter.ofPattern("dd-MM-yyyy HH:mm:ss");
            
            jdbcTemplate.execute(
            "CALL save_record(?, ?, ?, ?, ?, ?)",
            (PreparedStatementCallback<Void>) ps -> {
                ps.setInt(1, sensorData.getArea());
                ps.setDouble(2, sensorData.getTemperature());
                ps.setDouble(3, sensorData.getHumidity());
                ps.setDouble(4, sensorData.getLight());
                ps.setDouble(5, sensorData.getSoilMoisture());
                ps.setString(6, now.format(formatter).toString());
                ps.execute();
                return null;
            }
        );
            return ResponseEntity.status(HttpStatus.OK)
                .body(new ResponseObject("OK", "Query to update PROC_saveRecord() successfully", null));
        } catch (DataAccessException e) {
            // Xử lý lỗi liên quan đến truy cập dữ liệu
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(new ResponseObject("ERROR", "Database error: " + e.getMessage(), null));
        } catch (Exception e) {
            // Xử lý các lỗi khác
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(new ResponseObject("ERROR", "Error updating PROC_saveRecord(): " + e.getMessage(), null));
        }
    }
}
