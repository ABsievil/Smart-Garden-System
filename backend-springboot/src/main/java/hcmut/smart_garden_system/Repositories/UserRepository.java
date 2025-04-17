package hcmut.smart_garden_system.Repositories;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import hcmut.smart_garden_system.Models.User;
import java.util.List;
import java.util.Optional;

public interface UserRepository extends JpaRepository<User, String> {
    User findByUsername(String username);
    
    User findByEmail(String email);

    // Tìm tất cả user có role 'USER'
    @Query("SELECT u FROM User u WHERE u.role = 'USER'")
    List<User> findAllUsersByRoleUser();

    // Tìm admin (giả sử chỉ có một admin hoặc lấy admin đầu tiên)
    @Query("SELECT u FROM User u WHERE u.role = 'ADMIN'")
    Optional<User> findAdmin(); // Hoặc List<User> nếu có thể có nhiều admin

    // Kiểm tra user tồn tại bằng userId (INTEGER)
    @Query("SELECT CASE WHEN COUNT(u) > 0 THEN true ELSE false END FROM User u WHERE u.userId = :userId")
    boolean existsByUserId(@Param("userId") Integer userId);

    // Tìm user có userId lớn nhất
    Optional<User> findTopByOrderByUserIdDesc();

    // Tìm danh sách userId theo jobArea trong PersonalInformation
    @Query("SELECT u.userId FROM User u WHERE u.information.jobArea = :jobArea")
    List<Integer> findUserIdsByJobArea(@Param("jobArea") Integer jobArea);

    @Query(value = "SELECT nextval('users_id_seq')", nativeQuery = true)
    Integer getNextUserId();
} 