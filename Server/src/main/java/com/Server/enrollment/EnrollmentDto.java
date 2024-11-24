package com.Server.enrollment;

import com.Server.course.Course;
import com.Server.user.User;
import lombok.*;

import java.sql.Timestamp;
@Data
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class EnrollmentDto {
    private Long enrollmentId;
    private Long user_id;
    private Long course;
    private Timestamp enrollDate;
    private String status;
}
