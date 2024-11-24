package com.Server.quiz;

import com.Server.user.User;
import com.Server.user.tracking_quiz.UserQuiz;
import com.Server.user.tracking_quiz.UserQuizRepository;
import com.Server.user.UserRepository;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/auth/quiz")
public class QuizController {

    private final QuizService quizService;

    @Autowired
    public QuizController(QuizService quizService) {
        this.quizService = quizService;
    }

    @GetMapping("/all")
    @Operation(summary = "Get all quizzes", description = "Retrieves all quizzes")
    @ApiResponse(responseCode = "200", description = "Quizzes retrieved successfully")
    public ResponseEntity<List<QuizDTO>> getAllQuizzes() {
        List<QuizDTO> quizDTOS = quizService.getALl();
        return ResponseEntity.ok(quizDTOS);
    }

    @GetMapping("/{id}")
    @Operation(summary = "Get quiz by ID", description = "Retrieves a quiz by its ID")
    @ApiResponse(responseCode = "200", description = "Quiz retrieved successfully")
    @ApiResponse(responseCode = "404", description = "Quiz not found")
    public ResponseEntity<QuizDTO> getQuizById(@PathVariable long id) {
        QuizDTO quiz = quizService.getQuizById(id);
        return quiz != null ? ResponseEntity.ok(quiz) : ResponseEntity.status(HttpStatus.NOT_FOUND).build();
    }

    @GetMapping("/by-title/{titleId}")
    @Operation(summary = "Get quizzes by title ID", description = "Retrieves all quizzes by the title ID")
    @ApiResponse(responseCode = "200", description = "Quizzes retrieved successfully")
    public ResponseEntity<List<QuizDTO>> getQuizzesByTitleId(@PathVariable Long titleId) {
        List<QuizDTO> quizzes = quizService.getAllQuizByTitleId(titleId);
        return ResponseEntity.ok(quizzes);
    }

    @PostMapping
    @Operation(summary = "Create a new quiz", description = "Creates a new quiz")
    @ApiResponse(responseCode = "201", description = "Quiz created successfully")
    public ResponseEntity<Quiz> createQuiz(@RequestBody Quiz quiz) {
        Quiz createdQuiz = quizService.createQuiz(quiz);
        return ResponseEntity.status(HttpStatus.CREATED).body(createdQuiz);
    }
    
    @PostMapping("/check")
    public ResponseEntity<Boolean> checkQuizAnswer(@RequestParam Long id, @RequestParam String answer) {
        boolean isCorrect = quizService.checkQuizAnswer(id, answer);
        return ResponseEntity.ok(isCorrect);
    }

    @Autowired
    UserRepository userRepository;
    @Autowired
    QuizRepository quizRepository;
    @Autowired
    UserQuizRepository userQuizRepository;
    @PostMapping("/quizzes/{quizId}/complete")
    public ResponseEntity<String> completeQuiz(@PathVariable Long quizId, @RequestParam Long userId) {
        User user = userRepository.findById(userId).orElseThrow(() -> new RuntimeException("User not found"));
        Quiz quiz = quizRepository.findById(quizId).orElseThrow(() -> new RuntimeException("Quiz not found"));

        // Check if the user has already passed the quiz
        UserQuiz userQuiz = userQuizRepository.findByUserAndQuiz(user, quiz)
                .orElse(UserQuiz.builder().user(user).quiz(quiz).passed(false).build());

        userQuiz.setPassed(true);
        userQuizRepository.save(userQuiz);

        return ResponseEntity.ok("Quiz completed");
    }


}
