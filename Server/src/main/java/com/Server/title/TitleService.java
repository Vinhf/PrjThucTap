package com.Server.title;

import com.Server.feedback.ResourceNotFoundException;
import com.Server.quiz.Quiz;
import com.Server.quiz.QuizDTO;
import com.Server.quiz.QuizRepository;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class TitleService {

    @Autowired
    private TitleRepository titleRepository;
    @Autowired
    private QuizRepository
    quizRepository;

    public TitleDTO getTitleById(Long titleId) {
        Title title = titleRepository.findById(titleId)
                .orElseThrow(() -> new ResourceNotFoundException("Title not found"));
        return convertToDTO(title);
    }

    public List<TitleDTO> getTitleByCourseId(Long courseId) {
        List<Title> titles = titleRepository.getAllByCourse_CourseId(courseId);
        List<TitleDTO> getDTO = new ArrayList<>();

        return titles.stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }
    public Title createTitle(Title title) {
        return titleRepository.save(title);
    }

    private TitleDTO convertToDTO(Title title) {
        List<QuizDTO> quizDTOs = title.getQuiz().stream()
                .map(quiz -> QuizDTO.builder()
                        .id(quiz.getId())
                        .titleId(quiz.getTitle().getTitleId())
                        .isPassed(quiz.isPassed())
                        .build())
                .collect(Collectors.toList());

        return TitleDTO.builder()
                .titleId(title.getTitleId())
                .courseId(title.getCourse().getCourseId())
                .titleName(title.getTitleName())
                .isPassed(title.isPassed())
                .quizzes(quizDTOs)
                .build();
    }


//    @Autowired
//    UserTitleProgressRepository userTitleProgressRepository;
    @Transactional
    public void updateTitlePassedStatus(Long titleId) {
        List<Quiz> quizzes = quizRepository.findByTitle_TitleId(titleId);
        boolean allQuizzesPassed = quizzes.stream().allMatch(Quiz::isPassed);

        if (allQuizzesPassed) {

            Title title = titleRepository.findById(titleId).orElseThrow(() -> new IllegalArgumentException("Invalid title ID"));
            title.setPassed(true);
            titleRepository.save(title);
        }
    }


}

