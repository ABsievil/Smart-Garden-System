package hcmut.smart_garden_system.Models.DBCompositeTable.MainKeys;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import jakarta.persistence.Column;
import jakarta.persistence.Embeddable;
import java.io.Serializable;


@Embeddable
@Data
@NoArgsConstructor
@AllArgsConstructor
public class UserScheduleId implements Serializable {
    @Column(name = "username")
    private String username;

    @Column(name = "schedule_id")
    private Integer scheduleId;
}