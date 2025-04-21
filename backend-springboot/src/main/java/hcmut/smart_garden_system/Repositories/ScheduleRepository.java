package hcmut.smart_garden_system.Repositories;
import org.springframework.data.jpa.repository.JpaRepository;
import hcmut.smart_garden_system.Models.DBTable.Schedule;
import java.util.List;
import java.util.Optional;

public interface ScheduleRepository extends JpaRepository<Schedule, Integer> {
    List<Schedule> findByUserIdOrderByDateTimeAsc(Integer userId);
}