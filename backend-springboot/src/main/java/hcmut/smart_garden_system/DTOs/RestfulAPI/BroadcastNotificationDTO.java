package hcmut.smart_garden_system.DTOs.RestfulAPI;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class BroadcastNotificationDTO {
    private String content; // Nội dung thông báo
    private Integer areaId; // Thêm trường này

    // Getters and Setters
    public String getContent() {
        return content;
    }

    public void setContent(String content) {
        this.content = content;
    }
}