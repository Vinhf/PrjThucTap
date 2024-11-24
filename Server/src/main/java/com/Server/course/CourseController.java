package com.Server.course;

import com.Server.category.CategoryService;
import com.Server.order.OrderServiceImpl;
import com.Server.statistic.MonthlyOrderStats;
import com.Server.statistic.RevenueByCategoryDTO;
import com.Server.user.User;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@SecurityRequirement(name = "bearerAuth")
@Tag(name = "course", description = "course management APIs")
@RequestMapping("/api/v1/")
public class CourseController {

    private final CourseService courseService;
    private final OrderServiceImpl orderServiceImpl;

    @Autowired
    public CourseController(CourseService courseService, OrderServiceImpl orderServiceImpl) {
        this.courseService = courseService;
        this.orderServiceImpl = orderServiceImpl;
    }

    @GetMapping("auth/courses/all")
    @Operation(summary = "Get all courses", description = "Retrieves a list of all courses")
    @ApiResponse(responseCode = "200", description = "Successful retrieval of courses",
            content = @Content(schema = @Schema(implementation = CourseDTO.class)))
    public ResponseEntity<List<CourseDTO>> getAllCourses() {
        List<CourseDTO> courses = courseService.getAllCourses();
        return ResponseEntity.ok(courses);
    }

    @GetMapping("courses/session/{id}")
    @Operation(summary = "Get session data by ID", description = "Retrieves session data for a specific course ID")
    @ApiResponse(responseCode = "200", description = "Successful retrieval of session data",
            content = @Content(schema = @Schema(implementation = SessionData.class)))
    @ApiResponse(responseCode = "404", description = "Session data not found")
    public ResponseEntity<SessionData> getSessionDataById(@PathVariable long id) {
        SessionData sessionData = courseService.getSessionDataById(id);
        return sessionData != null ? ResponseEntity.ok(sessionData) : ResponseEntity.notFound().build();
    }

    @GetMapping("auth/courses/{id}")
    @Operation(summary = "Get course by ID", description = "Retrieves a course by its ID")
    @ApiResponse(responseCode = "200", description = "Successful retrieval of course",
            content = @Content(schema = @Schema(implementation = CourseDTO.class)))
    @ApiResponse(responseCode = "404", description = "Course not found")
    public ResponseEntity<CourseDTO> getCourseById(@PathVariable long id) {
        CourseDTO course = courseService.getCourse(id);
        return course != null ? ResponseEntity.ok(course) : ResponseEntity.notFound().build();
    }

    @GetMapping("courses/by-email/{email}")
    @Operation(summary = "Get courses by email", description = "Retrieves courses associated with a specific email")
    @ApiResponse(responseCode = "200", description = "Successful retrieval of courses",
            content = @Content(schema = @Schema(implementation = CourseDTO.class)))
    @ApiResponse(responseCode = "404", description = "Courses not found for the given email")
    public ResponseEntity<List<CourseDTO>> getCourseByEmail(@PathVariable String email) {
        List<CourseDTO> courses = courseService.getAllCourseBYEmail(email);
        return courses != null && !courses.isEmpty() ? ResponseEntity.ok(courses) : ResponseEntity.notFound().build();
    }

    @DeleteMapping("courses/{courseId}")
    @Operation(summary = "Delete a course", description = "Deletes a course by its ID")
    @ApiResponse(responseCode = "200", description = "Course deleted successfully")
    @ApiResponse(responseCode = "500", description = "Internal server error")
    public ResponseEntity<String> deleteCourse(@PathVariable Long courseId) {
        try {
            courseService.deleteCourse(courseId);
            return ResponseEntity.ok("Course deleted successfully");
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(e.getMessage());
        }
    }

    @PostMapping("courses/add")
    @Operation(summary = "Add a new course", description = "Adds a new course to the system")
    @ApiResponse(responseCode = "200", description = "Course added successfully",
            content = @Content(schema = @Schema(implementation = SessionData.class)))
    @ApiResponse(responseCode = "400", description = "Invalid input data")
    public ResponseEntity<String> createCourse(@RequestBody SessionData sessionData) {
        try {
            courseService.saveCourse(sessionData);
            return ResponseEntity.ok("Course saved successfully");
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
        }
    }

    @PutMapping("courses/{courseId}")
    @Operation(summary = "Update a course", description = "Updates an existing course")
    @ApiResponse(responseCode = "200", description = "Course updated successfully",
            content = @Content(schema = @Schema(implementation = SessionData.class)))
    @ApiResponse(responseCode = "500", description = "Internal server error")
    public ResponseEntity<String> updateCourse(@PathVariable Long courseId, @RequestBody SessionData sessionData) {
        try {
            courseService.updateCourse(courseId, sessionData);
            return ResponseEntity.ok("Course updated successfully");
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(e.getMessage());
        }
    }

    @PutMapping("courses/{courseId}/status")
    @Operation(summary = "Update course status", description = "Updates the status of a course")
    @ApiResponse(responseCode = "200", description = "Course status updated successfully")
    @ApiResponse(responseCode = "500", description = "Internal server error")
    public ResponseEntity<String> updateCourseStatus(@PathVariable Long courseId, @RequestParam String status) {
        try {
            courseService.updateCourseStatus(courseId, status);
            return ResponseEntity.ok("Course status updated successfully");
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(e.getMessage());
        }
    }

    @GetMapping("courses/search")
    @Operation(summary = "Search courses", description = "Searches for courses by keyword")
    @ApiResponse(responseCode = "200", description = "Successful retrieval of courses",
            content = @Content(schema = @Schema(implementation = CourseDTO.class)))
    public ResponseEntity<Page<CourseDTO>> searchCourses(@RequestParam String keyword,
                                                         @RequestParam(defaultValue = "1") int page,
                                                         @RequestParam(defaultValue = "10") int size) {
        Pageable pageable = PageRequest.of(page - 1, size);  // PageRequest pages are zero-indexed
        Page<CourseDTO> result = courseService.searchCourseByName(keyword, pageable);
        return ResponseEntity.ok(result);
    }

    @GetMapping("courses/statistics")
    public ResponseEntity<List<Object[]>> getOrderStatistics() {
        List<Object[]> stats = orderServiceImpl.getOrderStatistics();
        return ResponseEntity.ok(stats);
    }




    @GetMapping("courses/statistics/{year}")
    public ResponseEntity<Map<String, Object>> getOrderStatisticsByYear(@PathVariable int year) {
        Map<String, Object> stats = orderServiceImpl.getOrderStatistics(year);
        return ResponseEntity.ok(stats);
    }

    @GetMapping("courses/user/{userId}/courses")
    public ResponseEntity<List<Course>> getCoursesByUserId(@PathVariable Long userId) {
        List<Course> courses = orderServiceImpl.findCoursesByUserId(userId);
        return ResponseEntity.ok(courses);
    }




}
