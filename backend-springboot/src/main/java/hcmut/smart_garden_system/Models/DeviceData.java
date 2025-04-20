package hcmut.smart_garden_system.Models;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

// Sử dụng Lombok để tự động tạo getters, setters, toString, etc.
@Data
@NoArgsConstructor
@AllArgsConstructor
public class DeviceData {
    private Integer area;
    private String mode;
    // Lombok sẽ tự động tạo các phương thức cần thiết
}