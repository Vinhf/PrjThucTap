package com.Server.payment.paymentCourse;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class paymentCourseDTO {
    private String emailRequest;
    private String courseName;
    private String description;
    private String imgLink;
    private Long amount;
    private Long instructorID;
    private Long courseId;
}
