package hcmut.smart_garden_system.Models.DBCompositeTable;
import hcmut.smart_garden_system.Models.User;
import hcmut.smart_garden_system.Models.DBCompositeTable.MainKeys.StaffScheduleId;
import hcmut.smart_garden_system.Models.DBCompositeTable.MainKeys.UserScheduleId;
import hcmut.smart_garden_system.Models.DBTable.Device;
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
@Table(name = "device_area")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class DeviceArea {
    @EmbeddedId
    private DeviceAreaId id;

    @ManyToOne
    @JoinColumn(name = "device_id", insertable = false, updatable = false)
    private Device device;
}