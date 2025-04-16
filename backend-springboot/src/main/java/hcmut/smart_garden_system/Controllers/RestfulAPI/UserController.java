package hcmut.smart_garden_system.Controllers.RestfulAPI;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import hcmut.smart_garden_system.DTOs.RestfulAPI.UserInforDTO;
import hcmut.smart_garden_system.Services.RestfulAPI.UserService;
import hcmut.smart_garden_system.DTOs.ResponseObject;
import hcmut.smart_garden_system.DTOs.RestfulAPI.ChangePasswordDTO;
import hcmut.smart_garden_system.DTOs.RestfulAPI.ResetPasswordDTO;
import org.springframework.http.ResponseEntity;

@RestController
@RequestMapping("/api/v1/users")
public class UserController {
    @Autowired
    private UserService userService;

    @PostMapping("/profile")
    public ResponseEntity<ResponseObject> getUserProfile(@RequestBody UserInforDTO userInforDTO) {
        return userService.getUserProfile(userInforDTO.getUsername());
    }

    @PostMapping("/change-password")
    public ResponseEntity<ResponseObject> changePassword(@RequestBody ChangePasswordDTO changePasswordDTO) {
        return userService.changePassword(
                changePasswordDTO.getUsername(),
                changePasswordDTO.getOldPassword(),
                changePasswordDTO.getNewPassword()
        );
    }

    @PostMapping("/reset-password")
    public ResponseEntity<ResponseObject> resetPassword(@RequestBody ResetPasswordDTO resetPasswordDTO) {
        return userService.resetPassword(
                resetPasswordDTO.getEmail(),
                resetPasswordDTO.getNewPassword()
        );
    }
}
