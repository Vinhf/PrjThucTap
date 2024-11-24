package com.Server.feedback;

import java.sql.Timestamp;

import com.Server.role.Role;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class FeedBackDto {
    private Long feedbackId;
    private Long user_id;
    private Long courseId;
    private String message;
    private int rating;
    private String full_name;


    private String email;

    @Enumerated(EnumType.STRING)
    private Role role;

    @Builder.Default
    private Timestamp createDate = new Timestamp(System.currentTimeMillis());
}
