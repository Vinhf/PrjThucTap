package com.Server.user.tracking_lesson;

public class LessonProgressResponse {

    private boolean passed;

    public LessonProgressResponse(boolean passed) {
        this.passed = passed;
    }

    public boolean isPassed() {
        return passed;
    }

    public void setPassed(boolean passed) {
        this.passed = passed;
    }
}

