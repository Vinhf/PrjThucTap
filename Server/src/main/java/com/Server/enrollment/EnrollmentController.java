package com.Server.enrollment;

import com.Server.course.Course;
import com.Server.course.CourseRepository;
import com.Server.quiz.QuizService;
import com.Server.title.TitleRepository;
import com.Server.user.*;
import com.Server.user.tracking_lesson.LessonProgressResponse;
import com.Server.user.tracking_lesson.UserLessonProgressService;
import com.Server.user.tracking_quiz.QuizProgressResponse;
import com.Server.user.tracking_quiz.UserQuizProgressService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/auth/enrollment")
public class EnrollmentController {

    @Autowired
    private EnrollmentService enrollmentService;

    @GetMapping
    public List<EnrollmentDto> getAllEnrollments() {
        return enrollmentService.getAllEnrollments();
    }

    @GetMapping("/{id}")
    public EnrollmentDto getEnrollmentById(@PathVariable Long id) {
        return enrollmentService.getEnrollmentById(id);
    }

    @PostMapping
    public EnrollmentDto createEnrollment(@RequestBody EnrollmentDto enrollmentDto) {
        return enrollmentService.createEnrollment(enrollmentDto);
    }

    @PutMapping("/{id}")
    public EnrollmentDto updateEnrollment(@PathVariable Long id, @RequestBody EnrollmentDto enrollmentDto) {
        return enrollmentService.updateEnrollment(id, enrollmentDto);
    }

    @PutMapping("/status/{id}")
    public EnrollmentDto updateEnrollmentStatus(@PathVariable Long id, @RequestParam String status) {
        return enrollmentService.updateEnrollmentStatus(id, status);
    }

    @DeleteMapping("/{id}")
    public void deleteEnrollment(@PathVariable Long id) {
        enrollmentService.deleteEnrollment(id);
    }


    @Autowired
    private UserRepository userRepository;

    @Autowired
    private CourseRepository courseRepository;

    @Autowired
    private TitleRepository titleRepository;

    @GetMapping("/courses/{courseId}/progress")
    public ResponseEntity<UserCourseProgressDto> getCourseProgress(@PathVariable Long courseId, @RequestParam Long userId) {
        User user = userRepository.findById(userId).orElseThrow(() -> new RuntimeException("User not found"));
        Course course = courseRepository.findById(courseId).orElseThrow(() -> new RuntimeException("Course not found"));

        // Fetch progress details, e.g., number of completed lessons, quizzes, etc.
        int totalTitles = course.getTitles().size();
        int completedTitles = titleRepository.countCompletedTitlesByUserAndCourse(userId, courseId);

        UserCourseProgressDto progressDto = new UserCourseProgressDto(totalTitles, completedTitles);
        return ResponseEntity.ok(progressDto);
    }
@Autowired
UserLessonProgressService userLessonProgressService;
    @PutMapping("/markLessonAsPassed")
    public ResponseEntity<?> markLessonAsPassed(@RequestParam Long userId, @RequestParam Long lessonId) {
        userLessonProgressService.markLessonAsPassed(userId, lessonId);
        return ResponseEntity.ok().build();
    }

    @Autowired
    UserQuizProgressService userQuizProgressService;
    @Autowired
    QuizService quizService;
    @PostMapping("/submitQuizAnswer")
    public ResponseEntity<?> submitQuizAnswer(@RequestParam Long userId, @RequestParam Long quizId, @RequestParam String answer) {
        boolean isCorrect = quizService.checkAnswer(quizId, answer);
        userQuizProgressService.submitAnswer(userId, quizId, answer, isCorrect);
        return ResponseEntity.ok().build();
    }

    @GetMapping("/quizProgress")
    public ResponseEntity<QuizProgressResponse> getQuizProgress(
            @RequestParam Long userId,
            @RequestParam Long quizId) {
        boolean isCorrect = quizService.checkUserQuizProgress(userId, quizId);
        return ResponseEntity.ok(new QuizProgressResponse(isCorrect));
    }


    @GetMapping("/lessonProgress")
    public ResponseEntity<LessonProgressResponse> getLessonProgress(
            @RequestParam Long userId,
            @RequestParam Long lessonId) {
        boolean passed = userLessonProgressService.getLessonProgress(userId, lessonId);
        System.out.println("passed: " + passed);
        return ResponseEntity.ok(new LessonProgressResponse(passed));
    }





//    @GetMapping("/course-progress")
//    public double getCourseProgressNew(@RequestParam Long userId, @RequestParam Long courseId) {
//        return userProgressService.calculateCourseProgress(userId, courseId);
//    }


}