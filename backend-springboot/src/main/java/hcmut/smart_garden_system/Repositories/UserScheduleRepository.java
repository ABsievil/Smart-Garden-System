package hcmut.smart_garden_system.Repositories;
import org.springframework.data.jpa.repository.JpaRepository;

import hcmut.smart_garden_system.Models.DBCompositeTable.UserSchedule;
import hcmut.smart_garden_system.Models.DBCompositeTable.MainKeys.UserScheduleId;

public interface UserScheduleRepository extends JpaRepository<UserSchedule, UserScheduleId> {
}