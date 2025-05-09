// package hcmut.smart_garden_system.Databases;

// import org.springframework.beans.factory.annotation.Autowired;
// import org.springframework.boot.CommandLineRunner;
// import org.springframework.context.annotation.Bean;
// import org.springframework.context.annotation.Configuration;
// import org.springframework.security.crypto.password.PasswordEncoder;

// import org.slf4j.Logger;
// import org.slf4j.LoggerFactory;

// import hcmut.smart_garden_system.Models.Role;
// import hcmut.smart_garden_system.Models.User;
// import hcmut.smart_garden_system.Repositories.UserRepository;

// @Configuration
// public class Database {
//     // Logger is used to print information to terminal
//     private static final Logger logger = LoggerFactory.getLogger(Database.class);

//     @Autowired
//     PasswordEncoder passwordEncoder;

//     @Autowired
//     UserRepository userRepository;

//     // CommandLineRunner is used to initialize data for Database (For testing)
//     @Bean
//     CommandLineRunner initDatabase(UserRepository userRepository) {
//         return new CommandLineRunner() {
//             @Override
//             public void run(String... args) throws Exception {
//                 User user1 = new User("user3", passwordEncoder.encode("1245"), "nccuong123@gmail.com", Role.USER, userRepository.getNextUserId(), null);
//                 logger.info("insert user account: " + userRepository.save(user1));
//                 // User admin = new User("admin", passwordEncoder.encode("1245"), "nccuong317qb@gmail.com", Role.ADMIN, null);
//                 // logger.info("insert admin account: " + userRepository.save(admin));
//             }
//         };
//     }
// }

