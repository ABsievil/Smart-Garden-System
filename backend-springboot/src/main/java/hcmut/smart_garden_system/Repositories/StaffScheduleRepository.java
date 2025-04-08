package hcmut.smart_garden_system.Repositories;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import hcmut.smart_garden_system.Models.DBCompositeTable.StaffSchedule;
import hcmut.smart_garden_system.Models.DBCompositeTable.MainKeys.StaffScheduleId;

public interface StaffScheduleRepository extends JpaRepository<StaffSchedule, StaffScheduleId> {
    @Query("SELECT COUNT(DISTINCT ss.user.username) FROM StaffSchedule ss")
    Long countDistinctStaff();
}