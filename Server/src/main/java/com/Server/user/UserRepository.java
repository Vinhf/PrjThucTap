package com.Server.user;

import com.Server.course.Course;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.rest.core.annotation.RepositoryRestResource;

import java.util.List;
import java.util.Optional;

@RepositoryRestResource
public interface UserRepository extends JpaRepository<User, Long>{

    Optional<User> findById(Long id);
    Optional<User> findByEmail(String email);

    @Query(value = "SELECT * FROM _user u WHERE u.\"role\" != 'ADMIN' and u.status = true", nativeQuery = true)
    List<User> findUsersWithoutAdminRole();


}
