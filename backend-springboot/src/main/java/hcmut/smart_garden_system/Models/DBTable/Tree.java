package hcmut.smart_garden_system.Models.DBTable;
import java.time.LocalDateTime;

import jakarta.persistence.*;
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
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "area")
    private Integer area;

    @Column(name = "name", nullable = false)
    private String name;

    @Column(name = "sold_moisture_recommend")
    private Double soldMoistureRecommend;

    @Column(name = "growth_time")
    private LocalDateTime growthTime;

    @Column(name = "season")
    private String season;

    @Column(name = "amount")
    private Integer amount;
}
