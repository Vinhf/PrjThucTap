package com.Server.payment;

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
@Table(name = "Payment")
public class Payment {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long paymentId;

    @ManyToOne
    @JoinColumn(name = "user_id")
    private User user;

    private Timestamp create_Date;

    @ManyToOne
    @JoinColumn(name = "course_id")
    private Course course;
    private  String type_of_payment;

    private String status;
}