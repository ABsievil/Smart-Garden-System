package hcmut.smart_garden_system.Services.RestfulAPI;

// Bỏ import DeviceDTO và DeviceListResponseDTO nếu không dùng nữa
// import hcmut.smart_garden_system.DTOs.DeviceDTO;
// import hcmut.smart_garden_system.DTOs.DeviceListResponseDTO;
import hcmut.smart_garden_system.DTOs.ResponseObject;
import hcmut.smart_garden_system.Models.DBTable.Device;
import hcmut.smart_garden_system.Repositories.DeviceRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.DataAccessException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.LinkedHashMap; // Sử dụng LinkedHashMap để giữ thứ tự chèn
import java.util.List;
import java.util.Map;
// Bỏ import Collectors nếu không dùng stream nữa
// import java.util.stream.Collectors;

@Service
public class DeviceManageService {

    @Autowired
    private DeviceRepository deviceRepository;

    public ResponseEntity<ResponseObject> getDeviceList() {
        try {
            List<Device> devices = deviceRepository.findAll();
            List<Map<String, Object>> resultList = new ArrayList<>();

            for (Device device : devices) {
                Map<String, Object> deviceData = new LinkedHashMap<>();
                deviceData.put("name", device.getName());
                deviceData.put("area", String.valueOf(device.getArea())); // Chuyển Integer sang String nếu cần
                deviceData.put("state", device.getState() ? "ACTIVE" : "BROKEN"); // Chuyển Boolean sang String
                deviceData.put("status", device.getStatus() ? "ON" : "OFF"); // Chuyển Boolean sang String
                resultList.add(deviceData);
            }

            // Tạo Map kết quả cuối cùng
            Map<String, Object> responseData = new LinkedHashMap<>();
            responseData.put("totalDevice", resultList.size());
            responseData.put("deviceList", resultList);

            return ResponseEntity.status(HttpStatus.OK).body(
                    new ResponseObject("success", "Successfully retrieved device list", responseData)
            );
        } catch (DataAccessException e) {
            // Log the exception e.g., using a logger
            System.err.println("Database error in getDeviceList(): " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(
                    new ResponseObject("error", "Database error: " + e.getMessage(), null)
            );
        } catch (Exception e) {
            // Log the exception
             System.err.println("Unexpected error in getDeviceList(): " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(
                    new ResponseObject("error", "Error retrieving device list: " + e.getMessage(), null)
            );
        }
    }

    // Bỏ phương thức mapDeviceToDTO nếu không dùng nữa
    /*
    private DeviceDTO mapDeviceToDTO(Device device) {
        DeviceDTO dto = new DeviceDTO();
        dto.setName(device.getNameOfDevices()); // Sử dụng nameOfDevices theo model
        dto.setArea(String.valueOf(device.getArea())); // Chuyển Integer sang String
        dto.setState(device.getState() ? "ON" : "OFF"); // Chuyển Boolean sang String
        dto.setStatus(device.getStatus() ? "OK" : "ERROR"); // Chuyển Boolean sang String
        return dto;
    }
    */
}
