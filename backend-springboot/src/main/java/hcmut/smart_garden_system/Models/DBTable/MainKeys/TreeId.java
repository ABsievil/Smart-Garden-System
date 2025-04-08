package hcmut.smart_garden_system.Models.DBTable.MainKeys;
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
public class TreeId implements Serializable {
    @Column(name = "name")
    private String name;

    @Column(name = "area")
    private Integer area;
}
