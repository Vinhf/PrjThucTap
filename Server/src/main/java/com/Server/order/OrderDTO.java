package com.Server.order;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class OrderDTO {
    private Long userId;
    private Long courseId;
    private String email;
}
