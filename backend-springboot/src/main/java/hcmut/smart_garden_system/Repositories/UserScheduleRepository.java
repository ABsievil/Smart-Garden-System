package hcmut.smart_garden_system.Repositories;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.transaction.annotation.Transactional;

import hcmut.smart_garden_system.Models.DBCompositeTable.UserSchedule;
import hcmut.smart_garden_system.Models.DBCompositeTable.MainKeys.UserScheduleId;

public interface UserScheduleRepository extends JpaRepository<UserSchedule, UserScheduleId> {

    /**
     * Deletes all UserSchedule entries associated with a given schedule ID.
     * IMPORTANT: This query assumes the UserSchedule entity has a field named 'schedule'
     * that maps to the Schedule entity, and Schedule has an 'id' field.
     * Please verify the entity structure of UserSchedule.java.
     *
     * @param scheduleId The ID of the schedule whose associations should be deleted.
     */
    @Transactional
    @Modifying
    // Verify the path "us.schedule.id" based on UserSchedule entity structure
    @Query("DELETE FROM UserSchedule us WHERE us.schedule.id = :scheduleId")
    void deleteByScheduleId(Integer scheduleId);

    // --- Alternative using Native Query (if UserSchedule entity doesn't exist or mapping is complex) ---
    /*
    @Transactional
    @Modifying
    // Replace 'user_schedule' and 'schedule_id' with your actual table and column names
    @Query(value = "DELETE FROM user_schedule WHERE schedule_id = :scheduleId", nativeQuery = true)
    void deleteByScheduleIdNative(Integer scheduleId);
    */

}