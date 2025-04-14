package hcmut.smart_garden_system.Controllers.RestfulAPI;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import hcmut.smart_garden_system.DTOs.ResponseObject;
import hcmut.smart_garden_system.Services.RestfulAPI.DashboardService;
import hcmut.smart_garden_system.Services.RestfulAPI.DeviceService;

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

    @GetMapping("/notifications")
    public ResponseEntity<ResponseObject> getNotifications() {
        return dashboardService.getNotifications();
    }
}
