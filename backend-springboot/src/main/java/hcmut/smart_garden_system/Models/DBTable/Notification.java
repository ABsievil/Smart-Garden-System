package hcmut.smart_garden_system.Models.DBTable;

import java.time.LocalDateTime;

import hcmut.smart_garden_system.Models.DBTable.MainKeys.NotificationId;
import jakarta.persistence.Column;
import jakarta.persistence.EmbeddedId;
import jakarta.persistence.Entity;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;


@Entity
@Table(name = "notification")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Notification {
    @EmbeddedId
    private NotificationId id;

    @Column(name = "datetime")
    private LocalDateTime datetime;
}
