package hcmut.smart_garden_system.Repositories;

import hcmut.smart_garden_system.Models.DBCompositeTable.DeviceArea;
import hcmut.smart_garden_system.Models.DBCompositeTable.DeviceAreaId;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.transaction.annotation.Transactional;

public interface DeviceAreaRepository extends JpaRepository<DeviceArea, DeviceAreaId> {

    // Phương thức xóa tất cả các bản ghi trong device_area theo deviceId
    // Sử dụng @Query để định nghĩa truy vấn tường minh
    @Modifying
    @Transactional
    @Query("DELETE FROM DeviceArea da WHERE da.id.deviceId = :deviceId")
    void deleteByDeviceId(Integer deviceId);
}