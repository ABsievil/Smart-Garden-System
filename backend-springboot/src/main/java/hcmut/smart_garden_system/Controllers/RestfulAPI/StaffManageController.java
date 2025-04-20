package hcmut.smart_garden_system.Controllers.RestfulAPI;

import hcmut.smart_garden_system.DTOs.AddUserRequestDTO;
import hcmut.smart_garden_system.DTOs.ResponseObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import hcmut.smart_garden_system.Services.RestfulAPI.StaffManageService;

@RestController
@RequestMapping("/api/v1/staff-manage")
public class StaffManageController {
    @Autowired
    private StaffManageService staffManageService;

    @GetMapping("/user-list")
    public ResponseEntity<ResponseObject> getUserList() {
        return staffManageService.getUserList();
    }

    @PostMapping("/add-user")
    public ResponseEntity<ResponseObject> addUser(@RequestBody AddUserRequestDTO requestDTO) {
        return staffManageService.addUser(requestDTO);
    }
}
