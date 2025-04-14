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
import jakarta.persistence.FetchType;
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

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "tree_area", referencedColumnName = "area", insertable = false, updatable = false)
    private Tree tree;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "record_id", insertable = false, updatable = false)
    private Record record;
}