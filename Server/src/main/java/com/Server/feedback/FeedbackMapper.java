package com.Server.feedback;

import com.Server.course.Course;
import com.Server.user.User;

public class FeedbackMapper {

    public static FeedBackDto toDTO(Feedback feedback) {
        return FeedBackDto.builder()
                .feedbackId(feedback.getFeedbackId())
                .user_id(feedback.getUser().getUser_id()) // giả sử User có phương thức getId()
                .courseId(feedback.getCourse().getCourseId()) // giả sử Course có phương thức getCourseId()
                .message(feedback.getMessage())
                .rating(feedback.getRatting())
                .createDate(feedback.getCreateDate())
                .full_name(feedback.getUser().getFull_name())

                .role(feedback.getUser().getRole())
                .email(feedback.getUser().getEmail())
                .build();
    }

    public static Feedback toEntity(FeedBackDto feedbackDTO, User user, Course course) {
        return Feedback.builder()
                .feedbackId(feedbackDTO.getFeedbackId())
                .user(user)
                .course(course)
                .message(feedbackDTO.getMessage())
                .ratting(feedbackDTO.getRating())
                .createDate(feedbackDTO.getCreateDate())

                .email(feedbackDTO.getEmail())
                .build();
    }
}
