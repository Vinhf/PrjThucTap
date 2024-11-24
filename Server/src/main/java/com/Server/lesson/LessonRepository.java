package com.Server.lesson;

import jakarta.transaction.Transactional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface LessonRepository extends JpaRepository<Lesson, Long> {
    List<Lesson> getLessonsByTitleTitleId(Long id);


    @Modifying
    @Transactional
    @Query("UPDATE Lesson l SET l.passed = true WHERE l.lessonId = :lessonId")
    int markAsPassed(Long lessonId);


    @Query("SELECT l FROM Lesson l WHERE l.title.titleId = :titleId")
    List<Lesson> findByTitleId(@Param("titleId") Long titleId);
}