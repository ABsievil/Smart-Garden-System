package hcmut.smart_garden_system.DTOs.RestfulAPI;

import java.time.LocalDateTime;

// Giả sử bạn đang dùng Lombok, nếu không thì cần thêm getters/setters và constructors thủ công
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class TreeDTO {
    private String name;
    private Double soldMoistureRecommend;
    private LocalDateTime growthTime;
    private String season;
    private Integer amount;
} 