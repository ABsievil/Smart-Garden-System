package hcmut.smart_garden_system.Models.DBCompositeTable;
import hcmut.smart_garden_system.Models.User;
import hcmut.smart_garden_system.Models.DBCompositeTable.MainKeys.UserScheduleId;
import hcmut.smart_garden_system.Models.DBTable.Schedule;
import jakarta.persistence.EmbeddedId;
import jakarta.persistence.Entity;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "user_schedule")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class UserSchedule {
    @EmbeddedId
    private UserScheduleId id;

    @ManyToOne
    @JoinColumn(name = "username", insertable = false, updatable = false)
    private User user;

    @ManyToOne
    @JoinColumn(name = "schedule_id", insertable = false, updatable = false)
    private Schedule schedule;
}