package hcmut.smart_garden_system.DTOs;

import com.fasterxml.jackson.annotation.JsonFormat;
import lombok.Data;
import java.time.LocalDateTime;

@Data
public class AddScheduleRequestDTO {
    private String content;
    private Integer area;
    private Integer userId;

    // Specify the expected date-time format
    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd'T'HH:mm:ss")
    private LocalDateTime dateTime;
} 