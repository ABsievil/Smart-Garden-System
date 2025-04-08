package hcmut.smart_garden_system.Repositories;
import org.springframework.data.jpa.repository.JpaRepository;

import hcmut.smart_garden_system.Models.DBTable.Tree;
import hcmut.smart_garden_system.Models.DBTable.MainKeys.TreeId;

public interface TreeRepository extends JpaRepository<Tree, TreeId> {
}