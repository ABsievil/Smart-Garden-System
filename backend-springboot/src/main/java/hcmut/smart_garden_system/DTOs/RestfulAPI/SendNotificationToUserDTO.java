package hcmut.smart_garden_system.DTOs.RestfulAPI;

public class SendNotificationToUserDTO {
    private Integer targetUserId; // ID của người dùng nhận
    private String content;     // Nội dung thông báo

    // Getters and Setters
    public Integer getTargetUserId() {
        return targetUserId;
    }

    public void setTargetUserId(Integer targetUserId) {
        this.targetUserId = targetUserId;
    }

    public String getContent() {
        return content;
    }

    public void setContent(String content) {
        this.content = content;
    }
}