package com.Server.course;

import lombok.Data;
import lombok.Data;
import java.math.BigDecimal;
import java.util.List;

@Data
public class SessionData {
    private String course_id;
    private String email; // Thêm trường email
    private Long categoryId;
    private String courseTitle;
    private String shortDescription;
    private String poster;
    private String posterId;
    private BigDecimal price;
    private List<Section> sections;
    private String video;
    private String videoId;

    @Data
    public static class Section {
        private String title;
        private List<Content> contents;
        private List<Quiz> quizzes;

        @Data
        public static class Content {
            private String text;
            private String file;
            private String id;
        }

        @Data
        public static class Quiz {
            private String title;
            private List<String> answers;
            private String correctAnswer;
        }
    }
}


