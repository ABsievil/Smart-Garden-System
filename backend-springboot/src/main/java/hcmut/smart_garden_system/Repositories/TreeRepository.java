package hcmut.smart_garden_system.Repositories;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import hcmut.smart_garden_system.Models.DBTable.Tree;
import java.util.List;

public interface TreeRepository extends JpaRepository<Tree, Integer> {
    @Query("SELECT COUNT(t) FROM Tree t")
    Long countAllPlants();

    List<Tree> findAllByOrderByAreaAsc();
}