package com.Server.enrollment;

import com.Server.course.Course;
import com.Server.course.CourseRepository;
import com.Server.user.User;
import com.Server.user.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.rest.webmvc.ResourceNotFoundException;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class EnrollmentService {

    @Autowired
    private EnrollmentRepository enrollmentRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private CourseRepository courseRepository;

    public List<EnrollmentDto> getAllEnrollments() {
        return enrollmentRepository.findAll().stream()
                .map(EnrollmentMapper::toDto)
                .collect(Collectors.toList());
    }

    public EnrollmentDto getEnrollmentById(Long id) {
        Enrollment enrollment = enrollmentRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundExcept("Enrollment not found with id: " + id));
        return EnrollmentMapper.toDto(enrollment);
    }

    public EnrollmentDto createEnrollment(EnrollmentDto enrollmentDto) {
        User user = userRepository.findById(enrollmentDto.getUser_id())
                .orElseThrow(() -> new ResourceNotFoundExcept("User not found with id: " + enrollmentDto.getUser_id()));
        Course course = courseRepository.findById(enrollmentDto.getCourse())
                .orElseThrow(() -> new ResourceNotFoundExcept("Course not found with id: " + enrollmentDto.getCourse()));

        Enrollment enrollment = EnrollmentMapper.toEntity(enrollmentDto, user, course);
        enrollment.setStatus(enrollmentDto.getStatus());
        return EnrollmentMapper.toDto(enrollmentRepository.save(enrollment));
    }

    public EnrollmentDto updateEnrollment(Long id, EnrollmentDto enrollmentDto) {
        Enrollment existingEnrollment = enrollmentRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundExcept("Enrollment not found with id: " + id));

        User user = userRepository.findById(enrollmentDto.getUser_id())
                .orElseThrow(() -> new ResourceNotFoundExcept("User not found with id: " + enrollmentDto.getUser_id()));
        Course course = courseRepository.findById(enrollmentDto.getCourse())
                .orElseThrow(() -> new ResourceNotFoundExcept("Course not found with id: " + enrollmentDto.getCourse()));

        existingEnrollment.setUser(user);
        existingEnrollment.setCourse(course);
        existingEnrollment.setEnrollDate(enrollmentDto.getEnrollDate());
        existingEnrollment.setStatus(enrollmentDto.getStatus());
        return EnrollmentMapper.toDto(enrollmentRepository.save(existingEnrollment));
    }
    public EnrollmentDto updateEnrollmentStatus(Long id, String status) {
        Enrollment existingEnrollment = enrollmentRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Enrollment not found with id: " + id));

        existingEnrollment.setStatus(status);

        Enrollment savedEnrollment = enrollmentRepository.save(existingEnrollment);
        return EnrollmentMapper.toDto(savedEnrollment);
    }



    public void deleteEnrollment(Long id) {
        Enrollment enrollment = enrollmentRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundExcept("Enrollment not found with id: " + id));
        enrollmentRepository.delete(enrollment);
    }
}