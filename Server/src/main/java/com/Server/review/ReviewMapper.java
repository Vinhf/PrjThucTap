package com.Server.review;

public class ReviewMapper {
    public static ReviewDTO mapToReviewDTO(Review review) {
        return new ReviewDTO(
                review.getReview_id(),
                review.getCourse_id(),
                review.getUser_id(),
                review.getRating(),
                review.getComment(),
                review.getCreate_date()
        );
    }

    public static Review mapToReview(ReviewDTO reviewDTO) {
        return new Review(
                reviewDTO.getReview_id(),
                reviewDTO.getCourse_id(),
                reviewDTO.getUser_id(),
                reviewDTO.getRating(),
                reviewDTO.getComment(),
                reviewDTO.getCreate_date()
        );
    }
}
