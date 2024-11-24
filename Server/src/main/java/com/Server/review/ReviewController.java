package com.Server.review;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@CrossOrigin("*")
@RestController
@RequiredArgsConstructor
@RequestMapping("/api/v1/auth/review")
@SecurityRequirement(name = "bearerAuth")
@Tag(name = "Quiz", description = "Quiz management APIs")
public class ReviewController {

    private final ReviewService service;

    @PostMapping("/save")
    @Operation(summary = "Save a new review", description = "Saves a new review")
    @ApiResponse(responseCode = "201", description = "Review saved successfully")
    @ApiResponse(responseCode = "400", description = "Invalid input data")
    public ResponseEntity<Void> save(@RequestBody ReviewDTO reviewDTO) {
        try {
            Review review = ReviewMapper.mapToReview(reviewDTO);
            service.saveReview(review);
            return new ResponseEntity<>(HttpStatus.CREATED);
        } catch (Exception e) {
            return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
        }
    }

    @GetMapping("/findAll")
    @Operation(summary = "Get all reviews", description = "Retrieves all reviews")
    @ApiResponse(responseCode = "200", description = "Reviews retrieved successfully")
    public ResponseEntity<List<ReviewDTO>> findAll() {
        List<ReviewDTO> reviews = service.findAll();
        return ResponseEntity.ok(reviews);
    }

    @GetMapping("/findById")
    @Operation(summary = "Get a review by ID", description = "Retrieves a review by its ID")
    @ApiResponse(responseCode = "200", description = "Review retrieved successfully")
    @ApiResponse(responseCode = "404", description = "Review not found")
    public ResponseEntity<ReviewDTO> findById(@RequestParam Long review_id) {
        ReviewDTO reviewDTO = service.findById(review_id);
        return reviewDTO != null ? ResponseEntity.ok(reviewDTO) : ResponseEntity.status(HttpStatus.NOT_FOUND).build();
    }

    @PostMapping("/update")
    @Operation(summary = "Update a review", description = "Updates an existing review")
    @ApiResponse(responseCode = "200", description = "Review updated successfully")
    @ApiResponse(responseCode = "400", description = "Invalid input data")
    public ResponseEntity<ReviewDTO> update(@RequestBody ReviewDTO reviewDTO) {
        try {
            Review review = ReviewMapper.mapToReview(reviewDTO);
            Review updatedReview = service.updateReview(review);
            ReviewDTO updatedReviewDTO = ReviewMapper.mapToReviewDTO(updatedReview);
            return ResponseEntity.ok(updatedReviewDTO);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(null);
        }
    }

    @DeleteMapping("/deleteById")
    @Operation(summary = "Delete a review", description = "Deletes a review by its ID")
    @ApiResponse(responseCode = "200", description = "Review deleted successfully")
    @ApiResponse(responseCode = "404", description = "Review not found")
    public ResponseEntity<Void> delete(@RequestParam Long review_id) {
        try {
            service.deleteReview(review_id);
            return ResponseEntity.ok().build();
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        }
    }
}
