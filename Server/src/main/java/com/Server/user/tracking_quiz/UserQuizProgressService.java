package com.Server.user.tracking_quiz;


import com.Server.quiz.QuizService;
import org.springframework.stereotype.Service;

@Service
public class UserQuizProgressService {

    private final UserQuizProgressRepository userQuizProgressRepository;
    private final QuizService quizService;

    public UserQuizProgressService(UserQuizProgressRepository userQuizProgressRepository, QuizService quizService) {
        this.userQuizProgressRepository = userQuizProgressRepository;
        this.quizService = quizService;
    }

    public void submitAnswer(Long userId, Long quizId, String answer, boolean isCorrect) {
        UserQuizProgressId id = new UserQuizProgressId(userId, quizId);
        UserQuizProgress progress = userQuizProgressRepository.findById(id)
                .orElse(new UserQuizProgress());

        progress.setUserId(userId);
        progress.setQuizId(quizId);
        progress.setAnswer(answer);
        progress.setCorrect(isCorrect);
        progress.setCompleted(true); // Mark as completed after submission

        userQuizProgressRepository.save(progress);
    }
}