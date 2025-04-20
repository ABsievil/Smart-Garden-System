package hcmut.smart_garden_system.Controllers.RestfulAPI;

import hcmut.smart_garden_system.DTOs.AddDeviceRequestDTO;
import hcmut.smart_garden_system.DTOs.ResponseObject;
import hcmut.smart_garden_system.Services.RestfulAPI.DeviceManageService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.PathVariable;

@RestController
@RequestMapping("/api/v1/device-manage")
public class DeviceManageController {

    @Autowired
    private DeviceManageService deviceManageService;

    @GetMapping("/device-list")
    public ResponseEntity<ResponseObject> getDeviceList() {
        return deviceManageService.getDeviceList();
    }

    @PostMapping("/add-device")
    public ResponseEntity<ResponseObject> addDevice(@RequestBody AddDeviceRequestDTO requestDTO) {
        return deviceManageService.addDevice(requestDTO);
    }

    @PutMapping("/update-device/{deviceId}")
    public ResponseEntity<ResponseObject> updateDevice(@PathVariable Integer deviceId, @RequestBody AddDeviceRequestDTO requestDTO) {
        return deviceManageService.updateDevice(deviceId, requestDTO);
    }

    @DeleteMapping("/delete-device/{deviceId}")
    public ResponseEntity<ResponseObject> deleteDevice(@PathVariable Integer deviceId) {
        return deviceManageService.deleteDevice(deviceId);
    }

}
