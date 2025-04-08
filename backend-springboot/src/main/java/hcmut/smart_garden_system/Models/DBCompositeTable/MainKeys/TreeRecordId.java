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
public class TreeRecordId implements Serializable {
    @Column(name = "tree_name")
    private String treeName;

    @Column(name = "tree_area")
    private Integer treeArea;

    @Column(name = "record_id")
    private Integer recordId;
}