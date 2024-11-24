package com.Server.statistic;

import com.Server.category.CategoryRepository;
import com.Server.order.OrderRepository;
import com.Server.user.UserRepository;
import com.Server.course.CourseRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;

@Service
public class DashboardService {

    @Autowired
    private OrderRepository orderRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private CourseRepository courseRepository;

    @Autowired
    private CategoryRepository categoryRepository;

    public double getTotalProfit() {
        return orderRepository.getTotalSuccessOrderPrice();
    }

    public long getTotalUsers() {
        System.out.println("Total users: " + userRepository.count());
        return userRepository.count();
    }

    public long getTotalCourses() {
        System.out.println("Total courses: " + courseRepository.count());
        return courseRepository.count();
    }

    public long getTotalCategories() {
        System.out.println("Total categories: " + categoryRepository.count());
        return categoryRepository.count();
    }
}
