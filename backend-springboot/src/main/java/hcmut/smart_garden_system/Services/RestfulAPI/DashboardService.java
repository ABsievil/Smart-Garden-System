package hcmut.smart_garden_system.Services.RestfulAPI;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.HashMap;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.DataAccessException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.PreparedStatementCallback;
import org.springframework.stereotype.Service;

import com.fasterxml.jackson.databind.ObjectMapper;

import hcmut.smart_garden_system.Controllers.SensorController;
import hcmut.smart_garden_system.DTOs.ResponseObject;
import hcmut.smart_garden_system.Models.SensorData;
import hcmut.smart_garden_system.Repositories.DeviceRepository;
import hcmut.smart_garden_system.Repositories.RecordRepository;
import hcmut.smart_garden_system.Repositories.ScheduleRepository;
import hcmut.smart_garden_system.Repositories.StaffScheduleRepository;
import hcmut.smart_garden_system.Repositories.TreeRepository;

@Service
public class DashboardService {
    @Autowired
    private TreeRepository treeRepository;

    @Autowired
    private StaffScheduleRepository staffScheduleRepository;

    @Autowired
    private RecordRepository recordRepository;

    @Autowired
    private DeviceRepository deviceRepository;

    public ResponseEntity<ResponseObject> getSummaryData() {
        try {
            // Lấy dữ liệu từ các repository
            Long plants = treeRepository.countAllPlants();
            Long staff = staffScheduleRepository.countDistinctStaff();
            Long events = recordRepository.countAllEvents();
            Long devices = deviceRepository.countAllDevices();

            // Gói 4 biến thành một Map để trả về dưới dạng JSON
            Map<String, Object> summaryData = new HashMap<>();
            summaryData.put("plants", plants);
            summaryData.put("staff", staff);
            summaryData.put("events", events);
            summaryData.put("devices", devices);

            // Trả về response thành công với dữ liệu JSON
            return ResponseEntity.status(HttpStatus.OK)
                    .body(new ResponseObject("OK", "Query to get summary data successfully", summaryData));
        } catch (DataAccessException e) {
            // Xử lý lỗi liên quan đến truy cập cơ sở dữ liệu
            System.err.println("Database error: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(new ResponseObject("ERROR", "Database error: " + e.getMessage(), null));
        } catch (IllegalArgumentException e) {
            // Xử lý lỗi do tham số không hợp lệ
            System.err.println("Invalid argument error: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(new ResponseObject("ERROR", "Invalid argument: " + e.getMessage(), null));
        } catch (Exception e) {
            // Xử lý các lỗi chung khác
            System.err.println("Unexpected error in getSummaryData(): " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(new ResponseObject("ERROR", "Unexpected error: " + e.getMessage(), null));
        }
    }
}
