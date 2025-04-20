package hcmut.smart_garden_system.Repositories;

import org.springframework.data.jpa.repository.JpaRepository;

import hcmut.smart_garden_system.Models.DBCompositeTable.TreeRecord;
import hcmut.smart_garden_system.Models.DBCompositeTable.MainKeys.TreeRecordId;

public interface TreeRecordRepository extends JpaRepository<TreeRecord, TreeRecordId> {
}