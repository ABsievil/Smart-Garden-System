package hcmut.smart_garden_system.Services.RestfulAPI;

import hcmut.smart_garden_system.DTOs.AddScheduleRequestDTO;
import hcmut.smart_garden_system.DTOs.ResponseObject;
import hcmut.smart_garden_system.DTOs.UpdateScheduleRequestDTO;
import hcmut.smart_garden_system.Models.DBTable.Schedule;
import hcmut.smart_garden_system.Models.User;
import hcmut.smart_garden_system.Repositories.ScheduleRepository;
import hcmut.smart_garden_system.Repositories.UserRepository;
import hcmut.smart_garden_system.Repositories.UserScheduleRepository;
import hcmut.smart_garden_system.Repositories.StaffScheduleRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.DataAccessException;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@Service
public class ScheduleService {

    @Autowired
    private ScheduleRepository scheduleRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private UserScheduleRepository userScheduleRepository;

    @Autowired
    private StaffScheduleRepository staffScheduleRepository;

    // Định dạng ngày giờ chuẩn ISO
    private static final DateTimeFormatter ISO_FORMATTER = DateTimeFormatter.ISO_LOCAL_DATE_TIME;

    // Helper method to convert Schedule to Map
    private Map<String, Object> mapScheduleToMap(Schedule schedule) {
        Map<String, Object> scheduleData = new LinkedHashMap<>();
        scheduleData.put("id", schedule.getId());
        scheduleData.put("content", schedule.getContent());
        scheduleData.put("area", schedule.getArea());
        scheduleData.put("userId", schedule.getUserId());
        // Format LocalDateTime to ISO standard string for consistent JSON output
        scheduleData.put("dateTime", schedule.getDateTime() != null ? schedule.getDateTime().format(ISO_FORMATTER) : null);
        return scheduleData;
    }

    public ResponseEntity<ResponseObject> getCalendarListByUserId(Integer userId) {
        try {
            // Validate userId exists
            if (!userRepository.existsByUserId(userId)) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND)
                        .body(new ResponseObject("FAILED", "User with ID " + userId + " not found", null));
            }

            List<Schedule> schedules = scheduleRepository.findByUserId(userId);
            List<Map<String, Object>> resultList = new ArrayList<>();
            for (Schedule schedule : schedules) {
                resultList.add(mapScheduleToMap(schedule));
            }

            Map<String, Object> responseData = new LinkedHashMap<>();
            responseData.put("totalEvents", resultList.size());
            responseData.put("eventList", resultList);

            return ResponseEntity.status(HttpStatus.OK)
                    .body(new ResponseObject("OK", "Successfully retrieved schedule list for user " + userId, responseData));
        } catch (DataAccessException e) {
            System.err.println("Database error in getCalendarListByUserId(): " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(new ResponseObject("ERROR", "Database error: " + e.getMessage(), null));
        } catch (Exception e) {
            System.err.println("Unexpected error in getCalendarListByUserId(): " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(new ResponseObject("ERROR", "Unexpected error: " + e.getMessage(), null));
        }
    }

    @Transactional
    public ResponseEntity<ResponseObject> addEvent(AddScheduleRequestDTO requestDTO) {
        try {
            // Validate userId exists
            if (requestDTO.getUserId() == null || !userRepository.existsByUserId(requestDTO.getUserId())) {
                 return ResponseEntity.status(HttpStatus.BAD_REQUEST) // Or NOT_FOUND depending on desired semantics
                        .body(new ResponseObject("FAILED", "User with ID " + requestDTO.getUserId() + " does not exist or is invalid", null));
            }

            Schedule newSchedule = Schedule.builder()
                    .content(requestDTO.getContent())
                    .area(requestDTO.getArea())
                    .userId(requestDTO.getUserId())
                    .dateTime(requestDTO.getDateTime())
                    .build();

            Schedule savedSchedule = scheduleRepository.save(newSchedule);
            Map<String, Object> responseData = mapScheduleToMap(savedSchedule);

            return ResponseEntity.status(HttpStatus.CREATED)
                    .body(new ResponseObject("OK", "Event added successfully", responseData));

        } catch (DataAccessException e) {
            System.err.println("Database error in addEvent(): " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(new ResponseObject("ERROR", "Database error: " + e.getMessage(), null));
        } catch (Exception e) {
            System.err.println("Unexpected error in addEvent(): " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(new ResponseObject("ERROR", "Unexpected error: " + e.getMessage(), null));
        }
    }

    @Transactional
    public ResponseEntity<ResponseObject> updateEvent(Integer eventId, UpdateScheduleRequestDTO requestDTO) {
        try {
            Optional<Schedule> existingScheduleOpt = scheduleRepository.findById(eventId);
            if (existingScheduleOpt.isEmpty()) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND)
                        .body(new ResponseObject("FAILED", "Event with ID " + eventId + " not found", null));
            }

            Schedule existingSchedule = existingScheduleOpt.get();
            // TODO: Optional: Check if the user updating has permission (e.g., existingSchedule.getUserId() == currentUser.getId())

            // Update fields from DTO
            existingSchedule.setContent(requestDTO.getContent());
            existingSchedule.setArea(requestDTO.getArea());
            existingSchedule.setDateTime(requestDTO.getDateTime());

            Schedule updatedSchedule = scheduleRepository.save(existingSchedule);
            Map<String, Object> responseData = mapScheduleToMap(updatedSchedule);

            return ResponseEntity.status(HttpStatus.OK)
                    .body(new ResponseObject("OK", "Event updated successfully", responseData));

        } catch (DataAccessException e) {
            System.err.println("Database error in updateEvent(): " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(new ResponseObject("ERROR", "Database error: " + e.getMessage(), null));
        } catch (Exception e) {
            System.err.println("Unexpected error in updateEvent(): " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(new ResponseObject("ERROR", "Unexpected error: " + e.getMessage(), null));
        }
    }

    @Transactional
    public ResponseEntity<ResponseObject> deleteEvent(Integer eventId) {
        try {
           // Note: It's still good practice to check if the event exists before deleting associations.
           if (!scheduleRepository.existsById(eventId)) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND)
                       .body(new ResponseObject("FAILED", "Event with ID " + eventId + " not found to delete", null));
           }

            // --- Delete associations in JOIN tables FIRST ---
            userScheduleRepository.deleteByScheduleId(eventId); // Delete from user_schedule
            staffScheduleRepository.deleteByScheduleId(eventId); // Delete from staff_schedule
            // -----------------------------------------------

            // Proceed with deletion of the main schedule record
            scheduleRepository.deleteById(eventId);
            return ResponseEntity.status(HttpStatus.OK)
                    .body(new ResponseObject("OK", "Event deleted successfully", null));

        } catch (DataAccessException e) {
            System.err.println("Database error in deleteEvent(): " + e.getMessage());
             if (e instanceof DataIntegrityViolationException) {
                 System.err.println("Constraint Violation during deleteEvent: " + e.getMessage());
                  return ResponseEntity.status(HttpStatus.CONFLICT) 
                         .body(new ResponseObject("ERROR", "Could not delete event due to existing references.", null));
             }
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(new ResponseObject("ERROR", "Database error: " + e.getMessage(), null));
        } catch (Exception e) {
            System.err.println("Unexpected error in deleteEvent(): " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(new ResponseObject("ERROR", "Unexpected error: " + e.getMessage(), null));
        }
    }

    public ResponseEntity<ResponseObject> getAllCalendar() {
        try {
            List<Schedule> schedules = scheduleRepository.findAll();
            List<Map<String, Object>> resultList = new ArrayList<>();
            for (Schedule schedule : schedules) {
                resultList.add(mapScheduleToMap(schedule));
            }

            Map<String, Object> responseData = new LinkedHashMap<>();
            responseData.put("totalEvents", resultList.size());
            responseData.put("eventList", resultList);

            return ResponseEntity.status(HttpStatus.OK)
                    .body(new ResponseObject("OK", "Successfully retrieved all schedules", responseData));
        } catch (DataAccessException e) {
            System.err.println("Database error in getAllCalendar(): " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(new ResponseObject("ERROR", "Database error: " + e.getMessage(), null));
        } catch (Exception e) {
            System.err.println("Unexpected error in getAllCalendar(): " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(new ResponseObject("ERROR", "Unexpected error: " + e.getMessage(), null));
        }
    }
}
