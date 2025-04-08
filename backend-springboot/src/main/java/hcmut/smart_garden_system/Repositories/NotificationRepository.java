package hcmut.smart_garden_system.Repositories;

import org.springframework.data.jpa.repository.JpaRepository;

import hcmut.smart_garden_system.Models.DBTable.Notification;
import hcmut.smart_garden_system.Models.DBTable.MainKeys.NotificationId;

public interface NotificationRepository extends JpaRepository<Notification, NotificationId> {
}
    