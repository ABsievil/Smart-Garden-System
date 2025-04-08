package hcmut.smart_garden_system.Repositories;
import org.springframework.data.jpa.repository.JpaRepository;

import hcmut.smart_garden_system.Models.DBTable.Schedule;

public interface ScheduleRepository extends JpaRepository<Schedule, Integer> {
}