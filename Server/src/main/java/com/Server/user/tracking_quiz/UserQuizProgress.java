package com.Server.user.tracking_quiz;


import jakarta.persistence.*;
import lombok.Data;

@Data
@Entity
@Table(name = "user_quiz_progress")
public class UserQuizProgress {

    @EmbeddedId
    private UserQuizProgressId id;

    @Column
    private String answer;

    @Column
    private boolean isCorrect;

    @Column
    private boolean isCompleted;

    // Getters and setters

    public Long getUserId() {
        return id.getUserId();
    }

    public void setUserId(Long userId) {
        if (id == null) {
            id = new UserQuizProgressId();
        }
        id.setUserId(userId);
    }

    public Long getQuizId() {
        return id.getQuizId();
    }

    public void setQuizId(Long quizId) {
        if (id == null) {
            id = new UserQuizProgressId();
        }
        id.setQuizId(quizId);
    }
}
