package hcmut.smart_garden_system.Repositories;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import hcmut.smart_garden_system.Models.DBTable.Tree;
import hcmut.smart_garden_system.Models.DBTable.MainKeys.TreeId;

public interface TreeRepository extends JpaRepository<Tree, TreeId> {
    @Query("SELECT COUNT(t) FROM Tree t")
    Long countAllPlants();
}