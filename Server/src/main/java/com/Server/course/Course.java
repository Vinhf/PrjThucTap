package com.Server.course;

import com.Server.category.Category;
import com.Server.title.Title;
import com.Server.user.User;
import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;
import java.sql.Timestamp;
import java.util.List;

@Entity
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Course {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long courseId;

    @ManyToOne
    @JoinColumn(name = "user_id")
    private User user;

    @ManyToOne
    @JoinColumn(name = "category_id")
    private Category category;

    private String courseName;
    private String description;
    private String videoLink;
    private String videoId;
    private String imgLink;
    private String imgId;
    
    @Builder.Default
    private Timestamp updateDate = new Timestamp(System.currentTimeMillis());

    @Builder.Default
    private String status = "active";

    private BigDecimal price;

    @OneToMany(mappedBy = "course", cascade = CascadeType.ALL)
    private List<Title> titles;
}
