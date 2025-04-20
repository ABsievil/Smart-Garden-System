package hcmut.smart_garden_system.Controllers;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.RestController;

import hcmut.smart_garden_system.DTOs.ResponseObject;
import hcmut.smart_garden_system.Services.EmailSenderService;
import jakarta.mail.MessagingException;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;


@RestController
@RequestMapping("/api/v1/Email")
public class EmailController {
    @Autowired
    private EmailSenderService emailSenderService;

    @GetMapping("/sendEmail")
    public ResponseEntity<ResponseObject> sendEmailRequest(@RequestParam("toGmail") String gmail) {
        return emailSenderService.sendOTPEmail(gmail, "Authentication Code for System");
    }

    @PutMapping("/deleteOTPByEmail/{email}")
    public ResponseEntity<ResponseObject> deleteOTPByEmail(@PathVariable String email){
        return emailSenderService.PROC_deleteOTPByEmail(email);
    }

    @GetMapping("/getOTPByEmail/{email}")
    public ResponseEntity<ResponseObject> getOTPByEmail(@PathVariable String email) {
        return emailSenderService.FNC_getOTPByEmail(email);
    }
}
