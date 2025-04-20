package hcmut.smart_garden_system.Repositories;

import org.springframework.data.jpa.repository.JpaRepository;

import hcmut.smart_garden_system.Models.DBTable.Otp;
import hcmut.smart_garden_system.Models.DBTable.MainKeys.OtpId;

public interface OtpRepository extends JpaRepository<Otp, OtpId> {
}