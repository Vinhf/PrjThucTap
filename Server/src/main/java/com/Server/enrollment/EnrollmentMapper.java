package com.Server.enrollment;

import com.Server.course.Course;
import com.Server.user.User;

public class EnrollmentMapper {

    public static EnrollmentDto toDto(Enrollment enrollment) {
        EnrollmentDto dto = new EnrollmentDto();
        dto.setEnrollmentId(enrollment.getEnrollmentId());
        dto.setUser_id(enrollment.getUser().getUser_id());
        dto.setCourse((enrollment.getCourse().getCourseId()));
        dto.setEnrollDate(enrollment.getEnrollDate());
        dto.setStatus(enrollment.getStatus());
        return dto;
    }

    public static Enrollment toEntity(EnrollmentDto dto, User user, Course course) {
        return Enrollment.builder()
                .enrollmentId(dto.getEnrollmentId())
                .user(user)
                .course(course)
                .enrollDate(dto.getEnrollDate())
                .build();
    }
}
