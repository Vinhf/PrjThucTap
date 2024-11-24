package com.Server.wishlist;

import com.Server.course.Course;
import com.Server.user.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface WishlistRepository extends JpaRepository<Wishlist, Long> {
    Optional<Wishlist> findByCourse(Course course);
    Optional<Wishlist> findByUserAndCourse(User user, Course course);
    List<Wishlist> findByUser(User user);

    void deleteByCourse_CourseId(Long courseId);
}