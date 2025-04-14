package hcmut.smart_garden_system.Repositories;
import java.time.LocalDateTime;
import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import hcmut.smart_garden_system.Models.DBTable.Record;

public interface RecordRepository extends JpaRepository<Record, Long> {
    // Câu lệnh native query để lấy nhiệt độ trung bình theo ngày và theo khu vực
    // Sử dụng CAST(datetime AS DATE) cho PostgreSQL
    @Query(value = "SELECT CAST(datetime AS DATE) as record_date, AVG(temperature) as avg_temp " +
                   "FROM record " +
                   "WHERE datetime >= :startDate AND datetime < :endDate AND area = :areaId " +
                   "GROUP BY CAST(datetime AS DATE) " +
                   "ORDER BY record_date", nativeQuery = true)
    List<Object[]> findDailyAverageTemperatureByArea(@Param("startDate") LocalDateTime startDate, @Param("endDate") LocalDateTime endDate, @Param("areaId") Long areaId);

    // Phương thức mới để lấy độ ẩm không khí và độ ẩm đất trung bình hàng ngày cho 7 ngày qua theo khu vực
    @Query(value = "SELECT CAST(datetime AS DATE) as record_date, " +
                   "       AVG(humidity) as avg_humidity, " +
                   "       AVG(soil_moisture) as avg_soil_moisture " +
                   "FROM record " +
                   "WHERE area = :areaId AND datetime >= :startDate AND datetime < :endDate " +
                   "GROUP BY CAST(datetime AS DATE) " +
                   "ORDER BY record_date", nativeQuery = true)
    List<Object[]> findDailyAverageHumidityAndSoilMoistureByAreaForLastNDays(
        @Param("areaId") Long areaId,
        @Param("startDate") LocalDateTime startDate,
        @Param("endDate") LocalDateTime endDate
    );

    @Query("SELECT COUNT(r) FROM Record r")
    Long countAllEvents();
}