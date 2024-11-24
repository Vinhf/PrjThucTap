package com.Server.user.tracking_lesson;

import com.Server.lesson.Lesson;
import com.Server.user.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;
@Repository
public interface UserLessonRepository extends JpaRepository<UserLesson, Long> {
    // Custom query method to find a UserLesson by User and Lesson
    Optional<UserLesson> findByUserAndLesson(User user, Lesson lesson);
}
