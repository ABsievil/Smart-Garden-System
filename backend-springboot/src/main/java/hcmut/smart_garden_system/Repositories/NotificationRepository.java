package hcmut.smart_garden_system.Repositories;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import hcmut.smart_garden_system.Models.DBTable.Notification;
import hcmut.smart_garden_system.Models.DBTable.MainKeys.NotificationId;

public interface NotificationRepository extends JpaRepository<Notification, NotificationId> {
    @Query("SELECT n FROM Notification n ORDER BY n.id.userId DESC")
    List<Notification> findAllNotifications();

    @Query("SELECT n FROM Notification n WHERE n.id.userId = :userId ORDER BY n.datetime DESC")
    List<Notification> findNotificationsByUserId(@Param("userId") Integer userId);
}
    