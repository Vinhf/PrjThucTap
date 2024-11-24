package com.Server.quiz;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface QuizRepository extends JpaRepository<Quiz, Long> {
    List<Quiz> findByTitle_TitleId(Long titleId);

    @Query("SELECT qp.isCorrect FROM UserQuizProgress qp WHERE qp.id.userId = :userId AND qp.id.quizId = :quizId")
    Boolean isQuizAnsweredCorrectly(@Param("userId") Long userId, @Param("quizId") Long quizId);
}

