package hcmut.smart_garden_system.Repositories;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import hcmut.smart_garden_system.Models.DBTable.Record;

public interface RecordRepository extends JpaRepository<Record, Integer> {
    @Query("SELECT COUNT(r) FROM Record r")
    Long countAllEvents();
}