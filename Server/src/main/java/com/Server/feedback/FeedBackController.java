package com.Server.feedback;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/feedbacks")
@SecurityRequirement(name = "bearerAuth")
@Tag(name = "Feedbacks", description = "Feedbacks management APIs")
public class FeedBackController {

    private final FeedBackService service;

    @Autowired
    public FeedBackController(FeedBackService service) {
        this.service = service;
    }

    @PostMapping("/feedbacks/create")
    @Operation(summary = "Create feedback", description = "Creates a new feedback entry")
    @ApiResponse(responseCode = "200", description = "Feedback created successfully",
            content = @Content(schema = @Schema(implementation = FeedBackDto.class)))
    public ResponseEntity<FeedBackDto> createFeedback(@RequestBody FeedBackDto feedBackDto) {
        FeedBackDto savedFeedbackDto = service.createFeedback(feedBackDto);
        return ResponseEntity.ok(savedFeedbackDto);
    }

    @GetMapping("/by-course/{courseId}")
    @Operation(summary = "Get feedback by course ID", description = "Retrieves feedback for a specific course ID")
    @ApiResponse(responseCode = "200", description = "Successful retrieval of feedback",
            content = @Content(schema = @Schema(implementation = FeedBackDto.class)))
    @ApiResponse(responseCode = "404", description = "Feedback not found for the given course ID")
    public ResponseEntity<List<FeedBackDto>> getFeedbacksByCourseId(@PathVariable Long courseId) {
        List<FeedBackDto> feedBackDtos = service.getFeedbacksByCourseId(courseId);
        return feedBackDtos != null && !feedBackDtos.isEmpty()
                ? ResponseEntity.ok(feedBackDtos)
                : ResponseEntity.notFound().build();
    }
}
