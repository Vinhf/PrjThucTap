package com.Server.quiz;

import com.Server.feedback.ResourceNotFoundException;
import com.Server.title.TitleService;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
public class QuizService {

    @Autowired
    private QuizRepository quizRepository;

    @Autowired
    private TitleService titleService;

    public QuizDTO getQuizById(long id) {
        Quiz quiz = quizRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Quiz not found"));
        return convertToDTO(quiz);
    }

    public List<QuizDTO> getALl() {
        List<Quiz> quiz = quizRepository.findAll();
        List<QuizDTO> quizDTOS = new ArrayList<>();
        for (Quiz quiz1: quiz) {
            QuizDTO quizDTO = convertToDTO(quiz1);
            quizDTOS.add(quizDTO);
        }
        return quizDTOS;
    }

    public List<QuizDTO> getAllQuizByTitleId(Long titleId) {
        List<Quiz> quizzes = quizRepository.findByTitle_TitleId(titleId);
        List<QuizDTO> quizDTOS = new ArrayList<>();
        for (Quiz quiz : quizzes) {
            QuizDTO quizDTO = convertToDTO(quiz);
            quizDTOS.add(quizDTO);
        }
        return quizDTOS;
    }

    public Quiz createQuiz(Quiz quiz) {
        return quizRepository.save(quiz);
    }

    public boolean checkQuizAnswer(Long id, String answer) {
        Quiz quiz = quizRepository.findById(id).orElseThrow(() -> new RuntimeException("Quiz not found"));
        boolean isCorrect = answer.equals(quiz.getCorrectAnswer());

        if (isCorrect) {
            quiz.setPassed(true); // Set the quiz as passed
            quizRepository.save(quiz); // Save the updated quiz
            titleService.updateTitlePassedStatus(quiz.getTitle().getTitleId());

        }

        return isCorrect;
    }

    private QuizDTO convertToDTO(Quiz quiz) {
        return QuizDTO.builder()
                .id(quiz.getId())
                .titleId(quiz.getTitle().getTitleId())
                .question(quiz.getQuestion())
                .options(quiz.getOptions())
                .correctAnswer(quiz.getCorrectAnswer())
                .isPassed(quiz.isPassed())
                .build();
    }
    @Transactional
    public void markQuizAsPassed(Long quizId) {
        Quiz quiz = quizRepository.findById(quizId).orElseThrow(() -> new IllegalArgumentException("Invalid quiz ID"));
        quiz.setPassed(true);
        quizRepository.save(quiz);

        // Update the title's isPassed status if necessary
        titleService.updateTitlePassedStatus(quiz.getTitle().getTitleId());
    }

    public boolean checkAnswer(Long quizId, String answer) {
        // Retrieve the quiz from the repository
        Quiz quiz = quizRepository.findById(quizId)
                .orElseThrow(() -> new IllegalArgumentException("Quiz not found"));

        boolean isCorrect = answer.equals(quiz.getCorrectAnswer());

        if (isCorrect) {
            // Set the quiz as passed
           // Save the updated quiz
            titleService.updateTitlePassedStatus(quiz.getTitle().getTitleId());

        }
        // Compare the provided answer with the correct answer stored in the quiz
        return quiz.getCorrectAnswer().equalsIgnoreCase(answer.trim());
    }
    public boolean checkQuizAnswer1(Long id, String answer) {
        Quiz quiz = quizRepository.findById(id).orElseThrow(() -> new RuntimeException("Quiz not found"));
        boolean isCorrect = answer.equals(quiz.getCorrectAnswer());

        if (isCorrect) {
            quiz.setPassed(true); // Set the quiz as passed
            quizRepository.save(quiz); // Save the updated quiz
            titleService.updateTitlePassedStatus(quiz.getTitle().getTitleId());

        }

        return isCorrect;
    }


    public boolean checkUserQuizProgress(Long userId, Long quizId) {
        Boolean isCorrect = quizRepository.isQuizAnsweredCorrectly(userId, quizId);
        return isCorrect != null && isCorrect;
    }
}

