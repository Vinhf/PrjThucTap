package com.Server.quiz;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class QuizDTO {
    private Long id;
    private Long titleId;
    private String question;
    private List<String> options;
    private String correctAnswer;
    private boolean isPassed;
}

