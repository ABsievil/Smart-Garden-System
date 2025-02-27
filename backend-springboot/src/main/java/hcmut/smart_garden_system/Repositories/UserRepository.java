package hcmut.smart_garden_system.Repositories;
import org.springframework.data.jpa.repository.JpaRepository;

import hcmut.smart_garden_system.Models.User;

public interface UserRepository extends JpaRepository<User, String> {
    User findByUsername(String username);
    
    User findByEmail(String email);

} 