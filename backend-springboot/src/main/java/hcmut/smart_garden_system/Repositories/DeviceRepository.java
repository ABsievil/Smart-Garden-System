package hcmut.smart_garden_system.Repositories;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import hcmut.smart_garden_system.Models.DBTable.Device;

public interface DeviceRepository extends JpaRepository<Device, Integer> {
    @Query("SELECT COUNT(d) FROM Device d")
    Long countAllDevices();
}