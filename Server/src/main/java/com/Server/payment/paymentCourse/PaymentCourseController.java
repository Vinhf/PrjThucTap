package com.Server.payment.paymentCourse;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/auth/payment-courses")
@SecurityRequirement(name = "bearerAuth")
@Tag(name = "Payment", description = "Payment management APIs")
public class PaymentCourseController {

    private final paymentCourseService courseService;

    public PaymentCourseController(paymentCourseService courseService) {
        this.courseService = courseService;
    }

    @PostMapping("/pay")
    @Operation(summary = "Make a payment for a course", description = "Processes payment for a single course")
    @ApiResponse(responseCode = "200", description = "Payment successful")
    @ApiResponse(responseCode = "400", description = "Bad request")
    @ApiResponse(responseCode = "500", description = "Internal server error")
    public ResponseEntity<String> payForCourse(@RequestBody paymentCourseDTO courseDTO) {
        try {
            courseService.getBuyCourse(courseDTO);
            return ResponseEntity.ok("Transfer successful");
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
        }
    }

    @PostMapping("/pay/multiple")
    @Operation(summary = "Make payments for multiple courses", description = "Processes payment for multiple courses")
    @ApiResponse(responseCode = "200", description = "Payments successful")
    @ApiResponse(responseCode = "400", description = "Bad request")
    @ApiResponse(responseCode = "500", description = "Internal server error")
    public ResponseEntity<String> payForMultipleCourses(@RequestBody List<paymentCourseDTO> courseDTOs) {
        try {
            if (courseDTOs == null || courseDTOs.isEmpty()) {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("No orders provided.");
            }
            for (paymentCourseDTO courseDTO : courseDTOs) {
                courseService.getBuyCourse(courseDTO);
            }
            return ResponseEntity.ok("Transfers successful");
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
        }
    }

    @GetMapping("/user-fullname")
    @Operation(summary = "Get user full name", description = "Retrieves the full name of a user by user ID")
    @ApiResponse(responseCode = "200", description = "Full name retrieved successfully")
    @ApiResponse(responseCode = "404", description = "User not found")
    @ApiResponse(responseCode = "500", description = "Internal server error")
    public ResponseEntity<String> getUserFullName(@RequestParam String userId) {
        try {
            Long id = Long.parseLong(userId);
            String fullName = courseService.getFullName(id);
            return fullName != null ? ResponseEntity.ok(fullName) : ResponseEntity.status(HttpStatus.NOT_FOUND).body("User not found");
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error fetching user full name");
        }
    }

    @GetMapping("/user-fullname-student")
    @Operation(summary = "Get user full name by email", description = "Retrieves the full name of a user by email")
    @ApiResponse(responseCode = "200", description = "Full name retrieved successfully")
    @ApiResponse(responseCode = "404", description = "User not found")
    @ApiResponse(responseCode = "500", description = "Internal server error")
    public ResponseEntity<String> getUserFullNameByEmail(@RequestParam String email) {
        try {
            String fullName = courseService.getFullNameStudent(email);
            return fullName != null ? ResponseEntity.ok(fullName) : ResponseEntity.status(HttpStatus.NOT_FOUND).body("User not found");
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error fetching user full name");
        }
    }

    @GetMapping("/category-fullname")
    @Operation(summary = "Get category full name", description = "Retrieves the full name of a category by category ID")
    @ApiResponse(responseCode = "200", description = "Full name retrieved successfully")
    @ApiResponse(responseCode = "404", description = "Category not found")
    @ApiResponse(responseCode = "500", description = "Internal server error")
    public ResponseEntity<String> getCategoryFullName(@RequestParam String categoryId) {
        try {
            Long id = Long.parseLong(categoryId);
            String fullName = courseService.getFullNameCategory(id);
            return fullName != null ? ResponseEntity.ok(fullName) : ResponseEntity.status(HttpStatus.NOT_FOUND).body("Category not found");
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error fetching category full name");
        }
    }

    @PostMapping("/check-course")
    @Operation(summary = "Check course availability", description = "Checks if a course is available for a user")
    @ApiResponse(responseCode = "200", description = "Course check successful")
    @ApiResponse(responseCode = "400", description = "Bad request")
    @ApiResponse(responseCode = "500", description = "Internal server error")
    public ResponseEntity<String> checkCourse(@RequestBody paymentCourseDTO courseDTO) {
        try {
            boolean isAvailable = courseService.getCheckCourse(courseDTO);
            return isAvailable ? ResponseEntity.ok("Course check successful") : ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Course check failed");
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error checking course availability");
        }
    }

    @PostMapping("/check-course-status")
    @Operation(summary = "Check detailed course status", description = "Checks detailed status of a course for a user")
    @ApiResponse(responseCode = "200", description = "Course status check successful")
    @ApiResponse(responseCode = "400", description = "Bad request")
    @ApiResponse(responseCode = "500", description = "Internal server error")
    public ResponseEntity<String> checkCourseStatus(@RequestBody paymentCourseDTO courseDTO) {
        try {
            boolean status = courseService.getCheckCoursee(courseDTO);
            return status ? ResponseEntity.ok("Course status check successful") : ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Course status check failed");
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error checking course status");
        }
    }
}
