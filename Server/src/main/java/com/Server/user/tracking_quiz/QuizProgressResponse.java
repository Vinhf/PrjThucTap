package com.Server.user.tracking_quiz;

public class QuizProgressResponse {

    private boolean isCorrect;

    public QuizProgressResponse(boolean isCorrect) {
        this.isCorrect = isCorrect;
    }

    public boolean isCorrect() {
        return isCorrect;
    }

    public void setCorrect(boolean isCorrect) {
        this.isCorrect = isCorrect;
    }
}

