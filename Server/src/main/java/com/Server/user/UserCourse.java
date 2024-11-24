package com.Server.user;

import com.Server.course.Course;
import com.Server.user.User;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.sql.Timestamp;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "user_course")
public class UserCourse {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @ManyToOne
    @JoinColumn(name = "course_id", nullable = false)
    private Course course;


    @JoinColumn(name="Status", nullable = false)
    private String status;

    private Timestamp enrolledDate;

    @PrePersist
    protected void onCreate() {
        enrolledDate = new Timestamp(System.currentTimeMillis());
    }
}


