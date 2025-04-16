package hcmut.smart_garden_system.Controllers.RestfulAPI;

import hcmut.smart_garden_system.DTOs.ResponseObject;
import hcmut.smart_garden_system.Services.RestfulAPI.DeviceManageService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/device-manage")
public class DeviceManageController {

    @Autowired
    private DeviceManageService deviceManageService;

    @GetMapping("/device-list")
    public ResponseEntity<ResponseObject> getDeviceList() {
        return deviceManageService.getDeviceList();
    }

}
