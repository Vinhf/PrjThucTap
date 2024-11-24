package com.Server.user.tracking_lesson;

import jakarta.persistence.Embeddable;
import lombok.Builder;
import lombok.Data;

import java.io.Serializable;
import java.util.Objects;

@Data
@Builder
@Embeddable
public class UserLessonProgressId implements Serializable {

    private Long userId;
    private Long lessonId;

    public UserLessonProgressId() {}

    public UserLessonProgressId(Long userId, Long lessonId) {
        this.userId = userId;
        this.lessonId = lessonId;
    }

    // Getters and setters

    public Long getUserId() {
        return userId;
    }

    public void setUserId(Long userId) {
        this.userId = userId;
    }

    public Long getLessonId() {
        return lessonId;
    }

    public void setLessonId(Long lessonId) {
        this.lessonId = lessonId;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        UserLessonProgressId that = (UserLessonProgressId) o;
        return Objects.equals(userId, that.userId) &&
                Objects.equals(lessonId, that.lessonId);
    }

    @Override
    public int hashCode() {
        return Objects.hash(userId, lessonId);
    }
}