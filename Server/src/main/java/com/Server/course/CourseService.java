package com.Server.course;

import com.Server.category.Category;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import java.util.List;
import java.io.IOException;
import java.util.*;

public interface CourseService {
    public boolean addCourse(Course course);
    public List<CourseDTO> getAllCourses();
    public boolean updateCourse(Long courseId, SessionData sessionData);
    public CourseDTO getCourse(Long id);
    public void saveCourse(SessionData sessionData);
    public List<CourseDTO> getAllCourseBYEmail(String Email);
    public void deleteCourse(Long courseId) throws IOException;
    public void updateCourseStatus(Long courseId, String status);
    public SessionData getSessionDataById(Long id);
    Page<CourseDTO> searchCourseByName(String keyword, Pageable pageable);
}
