package com.Server.order;

import com.Server.course.Course;
import com.Server.course.CourseRepository;
import com.Server.statistic.MonthlyOrderStats;
import com.Server.statistic.RevenueByCategoryDTO;
import com.Server.user.User;
import com.Server.user.UserRepository;
import jakarta.servlet.http.HttpSession;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.web.context.request.RequestContextHolder;
import org.springframework.web.context.request.ServletRequestAttributes;

import java.sql.Timestamp;
import java.time.Instant;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
@Transactional
public class OrderServiceImpl implements OrderService{

    private final OrderRepository repo;
    private final OrderRepository orderRepository;
    private final UserRepository userRepository;
    private final CourseRepository courseRepository;

    @Autowired
    public OrderServiceImpl(OrderRepository repo, OrderRepository orderRepository, UserRepository userRepository, CourseRepository courseRepository) {
        this.repo = repo;
        this.orderRepository = orderRepository;
        this.userRepository = userRepository;
        this.courseRepository = courseRepository;
    }

    @Override
    public List<Order> getOrders() {
        return repo.findAll();
    }

    @Override
    public Order getOrder(long id) {
        return repo.findById(id).orElse(null);
    }

    @Override
    public boolean addOrder(Order order) {
        if (repo.existsById(order.getOrderId())) {
            return false;
        }
        repo.save(order);
        return true;
    }

    @Override
    public boolean updateOrder(Order order) {
        if (!repo.existsById(order.getOrderId())) {
            return false;
        }
        repo.saveAndFlush(order);
        return true;
    }

    @Override
    public boolean deleteOrder(long id) {
        if (!repo.existsById(id)) {
            return false;
        }
        repo.deleteById(id);
        return true;
    }

    @Override
    public List<Object[]> getOrderStatistics() {
        return repo.countOrdersByStatus();
    }

    @Override
    public List<RevenueByCategoryDTO> getRevenueByCategory() {
        return repo.findRevenueByCategory();
    }

    @Override
    public List<MonthlyOrderStats> getMonthlyOrderStats() {
        return repo.findMonthlyOrderStats();
    }

    @Override
    public Map<String, Object> getOrderStatistics(int year) {
        List<Object[]> results = orderRepository.findOrderStatisticsByYear(year);

        int[] totalOrders = new int[12];
        double[] totalRevenue = new double[12];
        String[] categories = new String[]{"Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"};

        for (Object[] result : results) {
            int month = (int) result[0] - 1; // Month is 1-based in SQL, converting to 0-based
            totalOrders[month] = ((Number) result[1]).intValue();
            totalRevenue[month] = ((Number) result[2]).doubleValue();
        }

        Map<String, Object> data = new HashMap<>();
        data.put("totalOrders", totalOrders);
        data.put("totalRevenue", totalRevenue);
        data.put("categories", categories);

        return data;
    }

    @Override
    public List<Course> findCoursesByUserId(Long userId) {
        return repo.findCoursesByUserId(userId);
    }

    @Override
    public void addOrder(OrderDTO orderDTO) throws Exception {
        String email = orderDTO.getEmail();
        Long courseId = orderDTO.getCourseId();
        if (email == null || email.trim().isEmpty()) {
            throw new Exception("Email null or empty");
        }
        User user = userRepository.findByEmail(email).orElse(null);
        Course course = courseRepository.findById(courseId).orElse(null);
        Order odr = orderRepository.findByUserAndCourse(user, course).orElse(null);
        if (odr != null) {
            throw new Exception("Order already exists");
        } else {
            Order newOrder = Order.builder()
                    .user(user)
                    .course(course)
                    .createDate(Timestamp.from(Instant.now()))
                    .build();
            orderRepository.save(newOrder);
        }
    }

    @Override
    public void deleteOrder(OrderDTO orderDTO) throws Exception {
        String email = orderDTO.getEmail();
        Long courseId = orderDTO.getCourseId();
        User user = userRepository.findByEmail(email).orElse(null);
        Course course = courseRepository.findById(courseId).orElse(null);
        Order odr = orderRepository.findByUserAndCourse(user, course).orElse(null);
        if (odr == null) {
            throw new Exception("Course and user is not in the Order.");
        } else {
            orderRepository.delete(odr);
        }
    }

    @Override
    public List<OrderCourseDTO> showAllOrder(String email) throws Exception {
        User user = userRepository.findByEmail(email).orElse(null);
        if (user == null) {
            throw new Exception("User not found.");
        }
        List<Order> orderEntries = orderRepository.findByUser(user);
        if (orderEntries.isEmpty()) {
            System.out.println("No courses found in order.");
        }
        return orderEntries.stream()
                .map(newOrder -> convertCourseDTO(newOrder.getCourse()))
                .collect(Collectors.toList());
    }

    private OrderCourseDTO convertCourseDTO(Course course) {
        return new OrderCourseDTO(
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
