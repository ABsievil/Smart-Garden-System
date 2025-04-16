package hcmut.smart_garden_system.Controllers.RestfulAPI;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import hcmut.smart_garden_system.DTOs.ResponseObject;
import hcmut.smart_garden_system.Services.RestfulAPI.DashboardService;
import hcmut.smart_garden_system.Services.RestfulAPI.DeviceService;
import hcmut.smart_garden_system.DTOs.RestfulAPI.NotificationRequestDTO;
import hcmut.smart_garden_system.DTOs.RestfulAPI.BroadcastNotificationDTO;
import hcmut.smart_garden_system.DTOs.RestfulAPI.SendNotificationToUserDTO;

@RestController
@RequestMapping("/api/v1/dashboard")
public class DashboardController {
    @Autowired
    private DashboardService dashboardService;

    @GetMapping("/summary")
    public ResponseEntity<ResponseObject> getSummaryData() {
        return dashboardService.getSummaryData();
    }

    @GetMapping("/temperature/{areaId}")
    public ResponseEntity<ResponseObject> getTemperatureData(@PathVariable Long areaId) {
        return dashboardService.getTemperatureData(areaId);
    }

    @GetMapping("/humidity/{areaId}")
    public ResponseEntity<ResponseObject> getHumidityData(@PathVariable Long areaId) {
        return dashboardService.getHumidityData(areaId);
    }

    @GetMapping("/notifications/user/{userId}")
    public ResponseEntity<ResponseObject> getNotificationsByUserId(@PathVariable Integer userId) {
        return dashboardService.getNotificationsByUserId(userId);
    }

    @PostMapping("/notifications/to-admin")
    public ResponseEntity<ResponseObject> sendNotificationToAdmin(@RequestBody NotificationRequestDTO request) {
        return dashboardService.sendNotificationToAdmin(request);
    }

    @PostMapping("/notifications/broadcast")
    public ResponseEntity<ResponseObject> sendNotificationToAllUsers(@RequestBody BroadcastNotificationDTO request) {
        return dashboardService.sendNotificationToAllUsers(request);
    }

    @PostMapping("/notifications/to-user")
    public ResponseEntity<ResponseObject> sendNotificationToUser(@RequestBody SendNotificationToUserDTO request) {
        return dashboardService.sendNotificationToUser(request);
    }

    // @GetMapping("/reports")
    // public ResponseEntity<ResponseObject> getReports() {
    //     return dashboardService.getReports();
    // }

    @GetMapping("/areas")
    public ResponseEntity<ResponseObject> getAllAreas() {
        return dashboardService.getAllAreas();
    }

}
