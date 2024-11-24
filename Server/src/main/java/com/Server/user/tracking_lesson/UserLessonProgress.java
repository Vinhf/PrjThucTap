package com.Server.user.tracking_lesson;


import jakarta.persistence.*;
import lombok.AllArgsConstructor;


@AllArgsConstructor

@Entity
@Table(name = "user_lesson_progress")
public class UserLessonProgress {

    @EmbeddedId
    private UserLessonProgressId id;

    private boolean passed;

    public UserLessonProgress() {
        this.id = new UserLessonProgressId();
    }

    public UserLessonProgress(UserLessonProgressId id) {
        this.id = id;
    }

    // Getters and setters

    public UserLessonProgressId getId() {
        return id;
    }

    public void setId(UserLessonProgressId id) {
        this.id = id;
    }

    public Long getUserId() {
        return id.getUserId();
    }

    public void setUserId(Long userId) {
        if (id == null) {
            id = new UserLessonProgressId();
        }
        id.setUserId(userId);
    }

    public Long getLessonId() {
        return id.getLessonId();
    }

    public void setLessonId(Long lessonId) {
        if (id == null) {
            id = new UserLessonProgressId();
        }
        id.setLessonId(lessonId);
    }

    public boolean isPassed() {
        return passed;
    }

    public void setPassed(boolean passed) {
        this.passed = passed;
    }
}