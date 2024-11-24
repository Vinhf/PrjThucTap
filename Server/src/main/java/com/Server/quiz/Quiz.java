package com.Server.quiz;

import com.Server.title.Title;
import jakarta.persistence.*;
import lombok.*;

import java.util.List;

@Entity 
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Quiz {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "title_id")
    private Title title;

    private String question;

    @ElementCollection
    private List<String> options;

    private String correctAnswer;

    @Builder.Default
    private boolean isPassed = false;
}

