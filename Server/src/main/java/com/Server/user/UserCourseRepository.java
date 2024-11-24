package com.Server.user;

import com.Server.course.Course;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface UserCourseRepository extends JpaRepository<UserCourse, Long> {
    Optional<UserCourse> findByUserAndCourse(User user, Course course);
}
