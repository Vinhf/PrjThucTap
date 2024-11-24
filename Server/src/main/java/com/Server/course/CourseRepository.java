package com.Server.course;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface CourseRepository extends JpaRepository<Course, Long> {
    Course getCourseByCourseId(Long id);
    Optional<Course> findByCourseId(Long id);
    Optional<Course> findByCourseName(String courseName);
    @Query(value = "SELECT * FROM public.course WHERE user_id = :userId", nativeQuery = true)
    List<Course> findCoursesByUserId(@Param("userId") Long userId);
    
    @Query("SELECT c FROM Course c WHERE c.courseName LIKE %?1%")
    Page<Course> searchCourseByName(String courseName, Pageable pageable);
}
