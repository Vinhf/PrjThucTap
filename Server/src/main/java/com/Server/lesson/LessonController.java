package com.Server.lesson;

import com.Server.user.*;
import com.Server.user.UserRepository;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;

import java.util.List;

@RestController
@RequestMapping("/api/v1/lessons")
@SecurityRequirement(name = "bearerAuth")
@Tag(name = "Lessons", description = "lessons management APIs")
public class LessonController {

    @Autowired
    private LessonService lessonService;

    @PutMapping("/auth/markAsPassed/{lessonId}")
    public ResponseEntity<String> markAsPassed(@PathVariable Long lessonId) {
        lessonService.markLessonAsPassed(lessonId);
        return ResponseEntity.ok("Lesson marked as passed");
    }
    @Autowired
    public LessonController(LessonService lessonService) {
        this.lessonService = lessonService;
    }

    @GetMapping("/{id}")
    @Operation(summary = "Get lesson by ID", description = "Retrieves a lesson by its ID")
    @ApiResponse(responseCode = "200", description = "Successful retrieval of lesson",
            content = @Content(schema = @Schema(implementation = LessonDTO.class)))
    @ApiResponse(responseCode = "404", description = "Lesson not found")
    public ResponseEntity<LessonDTO> getLessonById(@PathVariable Long id) {
        LessonDTO lesson = lessonService.getLessonById(id);
        return lesson != null ? ResponseEntity.ok(lesson) : ResponseEntity.notFound().build();
    }

    @GetMapping("/by-title/{titleId}")
    @Operation(summary = "Get lessons by title ID", description = "Retrieves a list of lessons by the title ID")
    @ApiResponse(responseCode = "200", description = "Successful retrieval of lessons",
            content = @Content(schema = @Schema(implementation = LessonDTO.class)))
    @ApiResponse(responseCode = "404", description = "Lessons not found")
    public ResponseEntity<List<LessonDTO>> getLessonsByTitleId(@PathVariable Long titleId) {
        List<LessonDTO> lessons = lessonService.getLessonByTitleId(titleId);
        return lessons != null && !lessons.isEmpty() ? ResponseEntity.ok(lessons) : ResponseEntity.notFound().build();
    }

    @PostMapping
    @Operation(summary = "Create a lesson", description = "Creates a new lesson")
    @ApiResponse(responseCode = "201", description = "Lesson created successfully",
            content = @Content(schema = @Schema(implementation = Lesson.class)))
    @ApiResponse(responseCode = "400", description = "Invalid input")
    public ResponseEntity<Lesson> createLesson(@RequestBody Lesson lesson) {
        Lesson createdLesson = lessonService.createLesson(lesson);
        return ResponseEntity.status(HttpStatus.CREATED).body(createdLesson);
    }
    @Autowired
    UserRepository userRepository;

    @Autowired
    LessonRepository lessonRepository;






}

