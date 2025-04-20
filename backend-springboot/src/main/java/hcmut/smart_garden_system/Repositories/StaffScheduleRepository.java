package hcmut.smart_garden_system.Repositories;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.transaction.annotation.Transactional;

import hcmut.smart_garden_system.Models.DBCompositeTable.StaffSchedule;
import hcmut.smart_garden_system.Models.DBCompositeTable.MainKeys.StaffScheduleId;

public interface StaffScheduleRepository extends JpaRepository<StaffSchedule, StaffScheduleId> {
    @Query("SELECT COUNT(DISTINCT ss.user.username) FROM StaffSchedule ss")
    Long countDistinctStaff();

    /**
     * Deletes all StaffSchedule entries associated with a given schedule ID.
     * Uses the 'schedule' field mapping within the StaffSchedule entity.
     *
     * @param scheduleId The ID of the schedule whose associations should be deleted.
     */
    @Transactional
    @Modifying
    @Query("DELETE FROM StaffSchedule ss WHERE ss.schedule.id = :scheduleId")
    void deleteByScheduleId(Integer scheduleId);
}