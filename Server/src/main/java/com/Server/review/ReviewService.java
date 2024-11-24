package com.Server.review;

import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class ReviewService {
    @Autowired
    private ReviewRepository reviewRepo;

    public Review saveReview(Review review) {
        return reviewRepo.save(review);
    }

    public ReviewDTO findById(Long review_id) {
        Optional<Review> review = reviewRepo.findById(review_id);
        if (review.isEmpty()) {
            throw new RuntimeException("Review not found");
        }
        Review reviewData = review.get();
        return ReviewMapper.mapToReviewDTO(reviewData);
    }

    @Transactional
    public List<ReviewDTO> findAll() {
        List<Review> review = reviewRepo.findAll();
        return review.stream().map(ReviewMapper::mapToReviewDTO).toList();
    }

    public Review updateReview(Review review) {
        Optional<Review> dbreview = reviewRepo.findById(review.getReview_id());
        if (dbreview.isEmpty()) {
            throw new RuntimeException("Review not found");
        }
        Review existingReview = dbreview.get();
        existingReview.setCourse_id(review.getCourse_id());
        existingReview.setUser_id(review.getUser_id());
        existingReview.setRating(review.getRating());
        existingReview.setComment(review.getComment());
        existingReview.setCreate_date(review.getCreate_date());
        return reviewRepo.save(existingReview);
    }

    public void deleteReview(Long reviewId) {
        Optional<Review> dbreview = reviewRepo.findById(reviewId);
        if (dbreview.isEmpty()) {
            throw new RuntimeException("Review not found");
        }
        reviewRepo.delete(dbreview.get());
    }
}