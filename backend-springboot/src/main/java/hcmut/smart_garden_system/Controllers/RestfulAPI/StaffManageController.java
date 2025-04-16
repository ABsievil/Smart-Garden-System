package hcmut.smart_garden_system.Controllers.RestfulAPI;

import hcmut.smart_garden_system.DTOs.ResponseObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import hcmut.smart_garden_system.Services.RestfulAPI.StaffManageService;

@RestController
@RequestMapping("/api/v1/staff-manage")
public class StaffManageController {
    @Autowired
    private StaffManageService staffManageService;

    @GetMapping("/profile")
    public ResponseEntity<ResponseObject> getUserList() {
        return staffManageService.getUserList();
    }
}
