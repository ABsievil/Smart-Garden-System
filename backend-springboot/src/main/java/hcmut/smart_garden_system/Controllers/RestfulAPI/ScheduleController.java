package hcmut.smart_garden_system.Controllers.RestfulAPI;

import hcmut.smart_garden_system.DTOs.AddScheduleRequestDTO;
import hcmut.smart_garden_system.DTOs.ResponseObject;
import hcmut.smart_garden_system.DTOs.UpdateScheduleRequestDTO;
import hcmut.smart_garden_system.Services.RestfulAPI.ScheduleService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/schedule")
public class ScheduleController {

    @Autowired
    private ScheduleService scheduleService;

    // 1. Get calendar list by userId
    @GetMapping("/user/{userId}")
    public ResponseEntity<ResponseObject> getCalendarListByUserId(@PathVariable Integer userId) {
        return scheduleService.getCalendarListByUserId(userId);
    }

    // 2. Add Event (implicitly by userId provided in DTO)
    @PostMapping("/addEvent")
    public ResponseEntity<ResponseObject> addEvent(@RequestBody AddScheduleRequestDTO requestDTO) {
        return scheduleService.addEvent(requestDTO);
    }

    // 3. Update Event by eventId
    @PutMapping("/update/{eventId}")
    public ResponseEntity<ResponseObject> updateEvent(@PathVariable Integer eventId, @RequestBody UpdateScheduleRequestDTO requestDTO) {
        return scheduleService.updateEvent(eventId, requestDTO);
    }

    // 4. Delete Event by eventId
    @DeleteMapping("/delete/{eventId}")
    public ResponseEntity<ResponseObject> deleteEvent(@PathVariable Integer eventId) {
        return scheduleService.deleteEvent(eventId);
    }

    // 5. Get all calendar events for admin role
    @GetMapping("/allCalendar")
    public ResponseEntity<ResponseObject> getAllCalendar() {
        return scheduleService.getAllCalendar();
    }

}
