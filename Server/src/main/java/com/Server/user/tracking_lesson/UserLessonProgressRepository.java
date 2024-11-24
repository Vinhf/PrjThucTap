package com.Server.user.tracking_lesson;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface UserLessonProgressRepository extends JpaRepository<UserLessonProgress, UserLessonProgressId> {
    Optional<UserLessonProgress> findById_UserIdAndId_LessonId(Long userId, Long lessonId);


}
