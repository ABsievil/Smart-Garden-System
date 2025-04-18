package hcmut.smart_garden_system.Services.RestfulAPI;

// Bỏ import DeviceDTO và DeviceListResponseDTO nếu không dùng nữa
// import hcmut.smart_garden_system.DTOs.DeviceDTO;
// import hcmut.smart_garden_system.DTOs.DeviceListResponseDTO;
import hcmut.smart_garden_system.DTOs.ResponseObject;
import hcmut.smart_garden_system.DTOs.AddDeviceRequestDTO;
import hcmut.smart_garden_system.Models.DBTable.Device;
import hcmut.smart_garden_system.Repositories.DeviceRepository;
import hcmut.smart_garden_system.Repositories.DeviceAreaRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.DataAccessException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.LinkedHashMap; // Sử dụng LinkedHashMap để giữ thứ tự chèn
import java.util.List;
import java.util.Map;
import java.util.Optional;
// Bỏ import Collectors nếu không dùng stream nữa
// import java.util.stream.Collectors;

@Service
public class DeviceManageService {

    @Autowired
    private DeviceRepository deviceRepository;

    @Autowired
    private DeviceAreaRepository deviceAreaRepository;

    public ResponseEntity<ResponseObject> getDeviceList() {
        try {
            List<Device> devices = deviceRepository.findAll();
            List<Map<String, Object>> resultList = new ArrayList<>();

            for (Device device : devices) {
                Map<String, Object> deviceData = new LinkedHashMap<>();
                deviceData.put("deviceId", device.getDeviceId());
                deviceData.put("name", device.getName());
                deviceData.put("area", String.valueOf(device.getArea())); // Chuyển Integer sang String nếu cần
                deviceData.put("state", device.getState() ? "ACTIVE" : "BROKEN"); // Chuyển Boolean sang String
                deviceData.put("status", device.getStatus() ? "ON" : "OFF"); // Chuyển Boolean sang String
                deviceData.put("mode", device.getMode());
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

    @Transactional
    public ResponseEntity<ResponseObject> addDevice(AddDeviceRequestDTO requestDTO) {
        try {
            // Optional: Check if device with the same name already exists
            // if (deviceRepository.findByName(requestDTO.getName()).isPresent()) {
            //     return ResponseEntity.status(HttpStatus.BAD_REQUEST)
            //             .body(new ResponseObject("FAILED", "Device name already exists", null));
            // }

            // Find the last device ID and increment
            Optional<Device> lastDeviceOpt = deviceRepository.findTopByOrderByDeviceIdDesc();
            int nextDeviceId = lastDeviceOpt.map(device -> device.getDeviceId() + 1).orElse(1);

            // Convert String state and status to Boolean
            Boolean stateValue;
            if ("ACTIVE".equalsIgnoreCase(requestDTO.getState())) {
                stateValue = true;
            } else if ("BROKEN".equalsIgnoreCase(requestDTO.getState())) {
                stateValue = false;
            } else {
                // Handle invalid or null state - defaulting to BROKEN (false)
                stateValue = false;
            }

            Boolean statusValue;
            if ("ON".equalsIgnoreCase(requestDTO.getStatus())) {
                statusValue = true;
            } else if ("OFF".equalsIgnoreCase(requestDTO.getStatus())) {
                statusValue = false;
            } else {
                // Handle invalid or null status - defaulting to OFF (false)
                statusValue = false;
            }

            Device newDevice = Device.builder()
                    .deviceId(nextDeviceId)
                    .name(requestDTO.getName())
                    .area(requestDTO.getArea())
                    .warranty(requestDTO.getWarranty())
                    .drive(requestDTO.getDrive())
                    .inputVoltage(requestDTO.getInputVoltage())
                    .outputVoltage(requestDTO.getOutputVoltage())
                    .state(stateValue) // Use converted boolean value
                    .status(statusValue) // Use converted boolean value
                    .speed(requestDTO.getSpeed())
                    .mode(requestDTO.getMode())
                    .build();

            Device savedDevice = deviceRepository.save(newDevice);

            return ResponseEntity.status(HttpStatus.CREATED)
                    .body(new ResponseObject("OK", "Device added successfully", savedDevice));

        } catch (DataAccessException e) {
            System.err.println("Database error in addDevice(): " + e.getMessage());
            e.printStackTrace(); // It's good practice to log the stack trace
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(new ResponseObject("ERROR", "Database error: " + e.getMessage(), null));
        } catch (Exception e) {
            System.err.println("Unexpected error in addDevice(): " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(new ResponseObject("ERROR", "Unexpected error: " + e.getMessage(), null));
        }
    }

    @Transactional
    public ResponseEntity<ResponseObject> updateDevice(Integer deviceId, AddDeviceRequestDTO requestDTO) {
        try {
            Optional<Device> deviceOpt = deviceRepository.findById(deviceId);
            if (!deviceOpt.isPresent()) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND)
                        .body(new ResponseObject("ERROR", "Device not found with id: " + deviceId, null));
            }

            Device existingDevice = deviceOpt.get();

            // Convert String state and status to Boolean
            Boolean stateValue;
            if ("ACTIVE".equalsIgnoreCase(requestDTO.getState())) {
                stateValue = true;
            } else if ("BROKEN".equalsIgnoreCase(requestDTO.getState())) {
                stateValue = false;
            } else {
                // Handle invalid or null state - defaulting to BROKEN (false)
                stateValue = false;
            }

            Boolean statusValue;
            if ("ON".equalsIgnoreCase(requestDTO.getStatus())) {
                statusValue = true;
            } else if ("OFF".equalsIgnoreCase(requestDTO.getStatus())) {
                statusValue = false;
            } else {
                // Handle invalid or null status - defaulting to OFF (false)
                statusValue = false;
            }

            // Update fields
            existingDevice.setName(requestDTO.getName());
            existingDevice.setArea(requestDTO.getArea());
            existingDevice.setWarranty(requestDTO.getWarranty());
            existingDevice.setDrive(requestDTO.getDrive());
            existingDevice.setInputVoltage(requestDTO.getInputVoltage());
            existingDevice.setOutputVoltage(requestDTO.getOutputVoltage());
            existingDevice.setState(stateValue);
            existingDevice.setStatus(statusValue);
            existingDevice.setSpeed(requestDTO.getSpeed());
            existingDevice.setMode(requestDTO.getMode());

            Device updatedDevice = deviceRepository.save(existingDevice);

            return ResponseEntity.status(HttpStatus.OK)
                    .body(new ResponseObject("OK", "Device updated successfully", updatedDevice));

        } catch (DataAccessException e) {
            System.err.println("Database error in updateDevice(): " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(new ResponseObject("ERROR", "Database error: " + e.getMessage(), null));
        } catch (Exception e) {
            System.err.println("Unexpected error in updateDevice(): " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(new ResponseObject("ERROR", "Unexpected error: " + e.getMessage(), null));
        }
    }

    @Transactional
    public ResponseEntity<ResponseObject> deleteDevice(Integer deviceId) {
        try {
            if (!deviceRepository.existsById(deviceId)) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND)
                        .body(new ResponseObject("ERROR", "Device not found with id: " + deviceId, null));
            }

            deviceAreaRepository.deleteByDeviceId(deviceId);

            deviceRepository.deleteById(deviceId);

            return ResponseEntity.status(HttpStatus.OK)
                    .body(new ResponseObject("OK", "Device deleted successfully with id: " + deviceId, null));

        } catch (DataAccessException e) {
            System.err.println("Database error in deleteDevice(): " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(new ResponseObject("ERROR", "Database error: " + e.getMessage(), null));
        } catch (Exception e) {
            System.err.println("Unexpected error in deleteDevice(): " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(new ResponseObject("ERROR", "Unexpected error: " + e.getMessage(), null));
        }
    }
}
