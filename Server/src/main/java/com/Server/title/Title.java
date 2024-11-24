package com.Server.title;

import com.Server.course.Course;
import com.Server.lesson.Lesson;
import com.Server.quiz.Quiz;
import jakarta.persistence.*;
import lombok.*;

import java.util.List;

@Entity
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Title {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long titleId;

    @ManyToOne
    @JoinColumn(name = "course_id")
    private Course course;

    private String titleName;

    @OneToMany(mappedBy = "title", cascade = CascadeType.ALL, fetch = FetchType.EAGER)
    private List<Lesson> lessons;

    @OneToMany(mappedBy = "title", cascade = CascadeType.ALL, fetch = FetchType.EAGER)
    private List<Quiz> quiz;

    @Builder.Default
    private boolean isPassed = false;
}

