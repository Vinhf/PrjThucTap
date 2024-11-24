package com.Server.title;

import com.Server.quiz.Quiz;
import com.Server.quiz.QuizDTO;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class TitleDTO {
    private Long titleId;
    private Long courseId;
    private String titleName;
    private boolean isPassed;
    private List<QuizDTO> quizzes;
}

