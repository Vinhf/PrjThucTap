package com.Server.user;


import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class UserCourseProgressDto {
    private int totalTitles;  // Tổng số tiêu đề trong khóa học
    private int completedTitles;  // Số tiêu đề đã hoàn thành bởi người dùng
}