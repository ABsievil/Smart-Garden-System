package hcmut.smart_garden_system.Models.DBCompositeTable;
import hcmut.smart_garden_system.Models.DBCompositeTable.MainKeys.TreeRecordId;
import hcmut.smart_garden_system.Models.DBTable.Tree;
import hcmut.smart_garden_system.Models.DBTable.Record;
import jakarta.persistence.EmbeddedId;
import jakarta.persistence.Entity;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.JoinColumns;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "tree_record")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class TreeRecord {
    @EmbeddedId
    private TreeRecordId id;

    @ManyToOne
    @JoinColumns({
        @JoinColumn(name = "tree_name", referencedColumnName = "name", insertable = false, updatable = false),
        @JoinColumn(name = "tree_area", referencedColumnName = "area", insertable = false, updatable = false)
    })
    private Tree tree;

    @ManyToOne
    @JoinColumn(name = "record_id", insertable = false, updatable = false)
    private Record record;
}