package com.Server.user.tracking_quiz;

import jakarta.persistence.Embeddable;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.io.Serializable;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Embeddable
public class UserQuizProgressId implements Serializable {

    private Long userId;
    private Long quizId;
    // Constructors, getters, setters, hashCode, and equals
}
