package com.Server.order;

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

import com.Server.statistic.MonthlyOrderStats;
import com.Server.statistic.RevenueByCategoryDTO;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Map;

public interface OrderService {
    List<Order> getOrders();
    Order getOrder(long id);
    boolean addOrder(Order order);
    boolean updateOrder(Order order);
    boolean deleteOrder(long id);
    List<Object[]> getOrderStatistics();
    List<RevenueByCategoryDTO> getRevenueByCategory();
    List<MonthlyOrderStats> getMonthlyOrderStats();
    Map<String, Object> getOrderStatistics(int year);
    List<Course> findCoursesByUserId(Long userId);
    void addOrder(OrderDTO orderDTO) throws Exception;
    void deleteOrder(OrderDTO orderDTO) throws Exception;
    List<OrderCourseDTO> showAllOrder(String email) throws Exception;
}

