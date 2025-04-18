package hcmut.smart_garden_system.Repositories;
import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import hcmut.smart_garden_system.Models.DBTable.Device;

public interface DeviceRepository extends JpaRepository<Device, Integer> {
    @Query("SELECT COUNT(d) FROM Device d")
    Long countAllDevices();

    Optional<Device> findTopByOrderByDeviceIdDesc();

    List<Device> findByArea(Integer area);

    // Optional: Add this if you want to check for existing device names
    // Optional<Device> findByName(String name);
}