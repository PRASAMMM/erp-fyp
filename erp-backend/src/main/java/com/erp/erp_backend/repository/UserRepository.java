package com.erp.erp_backend.repository;

import com.erp.erp_backend.model.User;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;
import java.util.List;
import java.util.Optional;

public interface UserRepository extends MongoRepository<User, String> {
    Optional<User> findByUsername(String username);

    // Case-insensitive username search — catches students created with wrong case
    @Query("{ 'username': { $regex: ?0, $options: 'i' } }")
    Optional<User> findByUsernameCaseInsensitive(String username);

    List<User> findByRole(String role);

    // Case-insensitive role search — catches STUDENT vs student mismatches
    @Query("{ 'role': { $regex: ?0, $options: 'i' } }")
    List<User> findByRoleCaseInsensitive(String role);

    Optional<User> findByRegistrationNumber(String registrationNumber);
    boolean existsByUsername(String username);
    boolean existsByRegistrationNumber(String registrationNumber);
}
