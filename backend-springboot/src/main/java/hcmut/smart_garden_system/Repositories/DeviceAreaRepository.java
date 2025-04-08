package hcmut.smart_garden_system.Repositories;
import org.springframework.data.jpa.repository.JpaRepository;

import hcmut.smart_garden_system.Models.DBCompositeTable.DeviceArea;
import hcmut.smart_garden_system.Models.DBCompositeTable.DeviceAreaId;

public interface DeviceAreaRepository extends JpaRepository<DeviceArea, DeviceAreaId> {
}