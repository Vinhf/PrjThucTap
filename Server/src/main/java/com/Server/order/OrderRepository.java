package com.Server.order;

import com.Server.course.Course;
import com.Server.user.User;
import com.Server.statistic.MonthlyOrderStats;
import com.Server.statistic.RevenueByCategoryDTO;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface OrderRepository extends JpaRepository<Order, Long> {

    Optional<Order> findByUserAndCourse(User user, Course course);
    Optional<Order> findByCourse(Course course);
    List<Order> findByUser(User user);

    @Query(value = "SELECT * FROM course c WHERE c.course_id = :courseId", nativeQuery = true)
    Course findCourseById(@Param("courseId") long courseId);

    @Query(value = "SELECT o.status, COUNT(o) FROM _order o GROUP BY o.status", nativeQuery = true)
    List<Object[]> countOrdersByStatus();

    @Query(value = "SELECT ca.category_name AS categoryName, SUM(o.total_price) AS totalRevenue " +
            "FROM _order o " +
            "JOIN course c ON o.course_id = c.course_id " +
            "JOIN category ca ON c.category_id = ca.category_id " +
            "WHERE o.status = 'Success' " +
            "GROUP BY ca.category_name", nativeQuery = true)
    List<RevenueByCategoryDTO> findRevenueByCategory();

    @Query(value = "SELECT EXTRACT(MONTH FROM o.create_date) AS month, " +
            "SUM(o.total_price) AS totalRevenue, " +
            "COUNT(o.order_id) AS totalSales " +
            "FROM _order o " +
            "GROUP BY EXTRACT(MONTH FROM o.create_date) " +
            "ORDER BY EXTRACT(MONTH FROM o.create_date)", nativeQuery = true)
    List<MonthlyOrderStats> findMonthlyOrderStats();

    @Query(value = "SELECT EXTRACT(MONTH FROM o.create_date) AS month, COUNT(o) AS totalOrders, SUM(o.total_price) AS totalRevenue " +
            "FROM _order o " +
            "WHERE EXTRACT(YEAR FROM o.create_date) = :year AND LOWER(o.status) = 'success' " +
            "GROUP BY EXTRACT(MONTH FROM o.create_date)", nativeQuery = true)
    List<Object[]> findOrderStatisticsByYear(@Param("year") int year);

    @Query(value = "SELECT COALESCE(SUM(o.total_price), 1) FROM _order o WHERE LOWER(o.status) = 'success'", nativeQuery = true)
    Double getTotalSuccessOrderPrice();

    @Query(value = "SELECT c.* FROM course c " +
            "JOIN _order o ON c.course_id = o.course_id " +
            "WHERE o.user_id = :userId", nativeQuery = true)
    List<Course> findCoursesByUserId(@Param("userId") Long userId);
}
