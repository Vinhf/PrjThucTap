package com.Server.feedback;

import com.Server.course.Course;
import com.Server.course.CourseRepository;
import com.Server.user.User;
import com.Server.user.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class FeedBackService {

    @Autowired
    private FeedbackRepository feedbackRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private CourseRepository courseRepository;

    public FeedBackDto createFeedback(FeedBackDto feedBackDto) {
        User user = userRepository.findByEmail(feedBackDto.getEmail())
                .orElseThrow(() -> new RuntimeException("User not found"));
        Course course = courseRepository.findById(feedBackDto.getCourseId())
                .orElseThrow(() -> new RuntimeException("Course not found"));

        Feedback feedback = FeedbackMapper.toEntity(feedBackDto, user, course);
        Feedback savedFeedback = feedbackRepository.save(feedback);
        return FeedbackMapper.toDTO(savedFeedback);
    }

    public List<FeedBackDto> getAllFeedbacks() {
        List<Feedback> feedbacks = feedbackRepository.findAll();
        return feedbacks.stream()
                .map(FeedbackMapper::toDTO)
                .collect(Collectors.toList());
    }

    public List<FeedBackDto> getFeedbacksByCourseId(Long courseId) {
        List<Feedback> feedbacks = feedbackRepository.findByCourseId(courseId);
        return feedbacks.stream()
                .map(FeedbackMapper::toDTO)
                .collect(Collectors.toList());
    }
}
