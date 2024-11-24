package com.Server.title;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface TitleRepository extends JpaRepository<Title, Long> {
    @Query("SELECT t FROM Title t LEFT JOIN FETCH t.quiz WHERE t.course.courseId = :courseId ORDER BY t.titleId ASC")
    List<Title> getAllByCourse_CourseId(@Param("courseId") Long courseId);

    void deleteAllByCourse_CourseId(Long id);
    @Query("SELECT COUNT(t) FROM Title t JOIN t.lessons l JOIN UserLesson ul ON l.lessonId = ul.lesson.lessonId " +
            "WHERE t.course.courseId = :courseId AND ul.user.user_id = :userId AND ul.passed = true")
    int countCompletedTitlesByUserAndCourse(@Param("userId") Long userId, @Param("courseId") Long courseId);
}
