package com.Server.feedback;

import java.sql.Timestamp;

import com.Server.course.Course;
import com.Server.user.User;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "Feedback")
public class Feedback {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long feedbackId;

    @ManyToOne
    @JoinColumn(name = "user_id")
    private User user;

    @ManyToOne
    @JoinColumn(name = "courseId")
    private Course course;

    private String message;
    private int ratting;


    private String email;
    @Builder.Default
    private Timestamp createDate = new Timestamp(System.currentTimeMillis());
}