package hcmut.smart_garden_system.Repositories;
import org.springframework.data.jpa.repository.JpaRepository;

import hcmut.smart_garden_system.Models.DBCompositeTable.StaffSchedule;
import hcmut.smart_garden_system.Models.DBCompositeTable.MainKeys.StaffScheduleId;

public interface StaffScheduleRepository extends JpaRepository<StaffSchedule, StaffScheduleId> {
}