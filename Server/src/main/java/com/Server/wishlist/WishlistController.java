package com.Server.wishlist;

import com.Server.course.Course;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.sql.SQLOutput;
import java.util.List;

@RestController
@RequestMapping("/api/v1/auth")
public class WishlistController {

    private static final Logger logger = LoggerFactory.getLogger(WishlistController.class);


    @Autowired
    private WishlistService wishlistService;


    @PostMapping("/wishlist/add")
    public ResponseEntity<String> addWishlist(@RequestBody WishlistDTO wishlistDTO) {
        try {
            wishlistService.addWishlist(wishlistDTO);
            return ResponseEntity.ok("Wishlist added");
        } catch (Exception e) {
            if (e.getMessage().equals("Course is already in the wishlist.")) {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Course has already been added to the Wishlist");
            }
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
        }
    }

    @PostMapping("/wishlist/remove")
    public ResponseEntity<String> deleteWishlist(@RequestBody WishlistDTO wishlistDTO) {
        try{
            wishlistService.deleteWishlist(wishlistDTO);
            return ResponseEntity.ok("Wishlist deleted");
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
        }
    }

    @GetMapping("/wishlist/show")
    public ResponseEntity<?> showAllWishlist(@RequestParam String email) {
        try {
            logger.info("Email for showing wishlist: {}", email);
            List<WishlistCourseDTO> wishlistCourses = wishlistService.showAllWishlist(email);
            return ResponseEntity.ok(wishlistCourses);
        } catch (Exception e) {
            logger.error("Error showing wishlist: {}", e.getMessage(), e);
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Error showing wishlist: " + e.getMessage());
        }
    }



}