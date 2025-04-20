package hcmut.smart_garden_system.Controllers.RestfulAPI;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import hcmut.smart_garden_system.DTOs.ResponseObject;
import hcmut.smart_garden_system.Services.RestfulAPI.DeviceService;

@RestController
@RequestMapping("/api/v1/device")
public class DeviceController {
    @Autowired
    private DeviceService deviceService;

    @GetMapping("/controlStatus")
    public ResponseEntity<ResponseObject> controlStatus(
        @RequestParam(value = "deviceName") String deviceName,
        @RequestParam(value = "status") Boolean status, 
        @RequestParam(value = "area") Integer area) {
        return deviceService.PROC_controlStatus(deviceName, status, area);
    }
    
    @GetMapping("/controlPumpSpeed")
    public ResponseEntity<ResponseObject> controlPumpSpeed(
        @RequestParam(value = "deviceName") String deviceName,
        @RequestParam(value = "value") Integer value, 
        @RequestParam(value = "area") Integer area) {
        return deviceService.PROC_controlPumpSpeed(deviceName, value, area);
    }

    @PutMapping("/updateModeByArea")
    public ResponseEntity<ResponseObject> updateModeByArea(
        @RequestParam(value = "area") Integer area,
        @RequestParam(value = "mode") String mode) {
        return deviceService.updateModeByArea(area, mode);
    }

    @GetMapping("/getModeByArea")
    public ResponseEntity<ResponseObject> getModeByArea(
        @RequestParam(value = "area") Integer area) {
        return deviceService.getModeByArea(area);
    }

    @GetMapping("/getDevicesByArea")
    public ResponseEntity<ResponseObject> getDevicesByArea(
        @RequestParam(value = "area") Integer area) {
        return deviceService.getDevicesByArea(area);
    }

    // @GetMapping("/controlState")
    // public ResponseEntity<ResponseObject> controlState(@PathVariable Boolean state) {
    //     return deviceService.PROC_controlState(state);
    // }
}
