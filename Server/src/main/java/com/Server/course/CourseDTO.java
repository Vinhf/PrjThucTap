package com.Server.course;

import com.Server.category.Category;
import com.Server.user.User;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.sql.Timestamp;


@Data
@NoArgsConstructor
@AllArgsConstructor
public class CourseDTO {

    private Long courseId;
    private Long userId;
    private Long categoryId;
    private String courseName;
    private String description;
    private String videoLink;
    private String imgLink;
    private Timestamp updateDate;
    private String status;
    private BigDecimal price;

}
