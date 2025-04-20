package hcmut.smart_garden_system.DTOs.RestfulAPI;

public class NotificationRequestDTO {
    private Integer senderUserId; // ID của người dùng gửi (dùng Integer vì user_id trong DB là INTEGER)
    private String content;    // Nội dung thông báo

    // Getters and Setters
    public Integer getSenderUserId() {
        return senderUserId;
    }

    public void setSenderUserId(Integer senderUserId) {
        this.senderUserId = senderUserId;
    }

    public String getContent() {
        return content;
    }

    public void setContent(String content) {
        this.content = content;
    }
}