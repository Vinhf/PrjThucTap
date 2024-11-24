package com.Server.wishlist;
import com.Server.course.Course;
import com.Server.course.CourseRepository;
import com.Server.user.User;
import com.Server.user.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.sql.Timestamp;
import java.time.Instant;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class WishlistService {
    @Autowired
    private WishlistRepository wishlistRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private CourseRepository courseRepository;

    public void addWishlist(WishlistDTO wishlistDTO) throws Exception {
        String email = wishlistDTO.getEmail();
        Long courseId = wishlistDTO.getCourseId();
        if (email == null || email.trim().isEmpty()) {
            throw new Exception("Email null or empty");
        }
        System.out.println("Email: " + email);
        System.out.println("CourseID: " + courseId);
        User user = userRepository.findByEmail(email).orElse(null);
        Course course = courseRepository.findById(courseId).orElse(null);
        Wishlist wl = wishlistRepository.findByUserAndCourse(user, course).orElse(null);
        if (wl != null) {
            System.out.println("Course is already in the wishlist.");
            throw new Exception("Course is already in the wishlist.");
        } else {
            Wishlist wishlist = new Wishlist().builder()
                    .user(user)
                    .course(course)
                    .createDate(Timestamp.from(Instant.now()))
                    .build();
            wishlistRepository.save(wishlist);
        }
    }
        public void deleteWishlist(WishlistDTO wishlistDTO) throws Exception {
        String email = wishlistDTO.getEmail();
        Long courseId = wishlistDTO.getCourseId();
            User user = userRepository.findByEmail(email).orElse(null);
            Course course = courseRepository.findById(courseId).orElse(null);
            Wishlist wl = wishlistRepository.findByUserAndCourse(user, course).orElse(null);
            if (wl == null) {
                throw new Exception("Course and user is not in the wishlist.");
            } else {
                wishlistRepository.delete(wl);
            }
            }

    public List<WishlistCourseDTO> showAllWishlist(String email) throws Exception {
        User user = userRepository.findByEmail(email).orElse(null);
        if (user == null) {
            throw new Exception("User not found.");
        }
        List<Wishlist> wishlistEntries = wishlistRepository.findByUser(user);
        if (wishlistEntries.isEmpty()) {
            System.out.println("No courses found in wishlist.");
        }
        return wishlistEntries.stream()
                .map(wishlist -> convertCourseDTO(wishlist.getCourse()))
                .collect(Collectors.toList());
    }

    private WishlistCourseDTO convertCourseDTO(Course course) {
        return new WishlistCourseDTO(
                course.getCourseId(),
                course.getUser().getUser_id(),
                course.getCategory().getCategoryId(),
                course.getCourseName(),
                course.getDescription(),
                course.getVideoLink(),
                course.getImgLink(),
                course.getUpdateDate(),
                course.getStatus(),
                course.getPrice()
        );
    }




}