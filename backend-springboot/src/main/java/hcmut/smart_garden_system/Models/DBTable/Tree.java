package hcmut.smart_garden_system.Models.DBTable;
import java.time.LocalDateTime;

import hcmut.smart_garden_system.Models.DBTable.MainKeys.TreeId;
import jakarta.persistence.Column;
import jakarta.persistence.EmbeddedId;
import jakarta.persistence.Entity;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "tree")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Tree {
    @EmbeddedId
    private TreeId id;

    @Column(name = "season")
    private String season;

    @Column(name = "growth_time")
    private LocalDateTime growthTime;

    @Column(name = "amount")
    private Integer amount;
}
