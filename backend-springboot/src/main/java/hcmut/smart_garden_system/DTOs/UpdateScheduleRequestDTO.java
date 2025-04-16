package hcmut.smart_garden_system.DTOs;

import com.fasterxml.jackson.annotation.JsonFormat;
import lombok.Data;
import java.time.LocalDateTime;

@Data
public class UpdateScheduleRequestDTO {
    private String content;
    private Integer area;

    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd'T'HH:mm:ss")
    private LocalDateTime dateTime;
    
    // userId không cần ở đây vì thường không cho phép thay đổi người tạo sự kiện
    // Nếu cần, có thể thêm vào.
} 