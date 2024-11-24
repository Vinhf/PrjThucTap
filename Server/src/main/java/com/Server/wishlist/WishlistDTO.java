package com.Server.wishlist;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class WishlistDTO {
    private Long userId;
    private Long courseId;
    private String email;
}
