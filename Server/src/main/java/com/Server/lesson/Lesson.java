package com.Server.lesson;

import com.Server.title.Title;
import jakarta.persistence.*;
import lombok.*;

@Entity
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Lesson {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long lessonId;

    @ManyToOne
    @JoinColumn(name = "title_id")
    private Title title;
    @Builder.Default
    private boolean passed = false;
    private String lessonName;
    private String videoLink;
    private String videoId;
}

