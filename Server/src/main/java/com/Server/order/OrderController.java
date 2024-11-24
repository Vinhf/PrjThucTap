package com.Server.order;

import com.Server.payment.paymentCourse.paymentCourseDTO;
import com.Server.payment.paymentCourse.paymentCourseService;
import com.Server.statistic.MonthlyOrderStats;
import com.Server.statistic.RevenueByCategoryDTO;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/auth/orders")
@SecurityRequirement(name = "bearerAuth")
@Tag(name = "Orders", description = "Orders management APIs")
public class OrderController {

    private static final Logger logger = LoggerFactory.getLogger(OrderController.class);

    private final paymentCourseService courseService;
    private final OrderService orderService;

    @Autowired
    public OrderController(paymentCourseService courseService, OrderService orderService) {
        this.courseService = courseService;
        this.orderService = orderService;
    }

    @PostMapping("/add")
    @Operation(summary = "Add an order", description = "Adds a new order if the course is not already purchased")
    @ApiResponse(responseCode = "200", description = "Order added successfully")
    @ApiResponse(responseCode = "400", description = "Bad request")
    @ApiResponse(responseCode = "500", description = "Internal server error")
    public ResponseEntity<String> addOrder(@RequestBody OrderDTO orderDTO) {
        try {
            paymentCourseDTO courseDTO = new paymentCourseDTO();
            courseDTO.setEmailRequest(orderDTO.getEmail());
            courseDTO.setCourseId(orderDTO.getCourseId());

            if (orderDTO.getEmail() == null) {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("You are not logged in");
            }

            boolean check = courseService.getCheckCourse(courseDTO);
            if (!check) {
                orderService.addOrder(orderDTO);
                return ResponseEntity.ok("Order placed successfully");
            } else {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("This course has already been purchased");
            }
        } catch (Exception e) {
            logger.error("Error adding order: {}", e.getMessage(), e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("An error occurred while processing your order");
        }
    }

    @PostMapping("/remove")
    @Operation(summary = "Remove orders", description = "Removes the specified orders")
    @ApiResponse(responseCode = "200", description = "Orders removed successfully")
    @ApiResponse(responseCode = "400", description = "Bad request")
    public ResponseEntity<String> deleteOrder(@RequestBody List<OrderDTO> orderDTOs) {
        try {
            if (orderDTOs == null || orderDTOs.isEmpty()) {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("No orders provided.");
            }
            for (OrderDTO orderDTO : orderDTOs) {
                orderService.deleteOrder(orderDTO);
            }
            return ResponseEntity.ok("Orders deleted successfully");
        } catch (Exception e) {
            logger.error("Error deleting orders: {}", e.getMessage(), e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("An error occurred while deleting the orders");
        }
    }

    @GetMapping("/show")
    @Operation(summary = "Show all orders", description = "Retrieves all orders for a given email")
    @ApiResponse(responseCode = "200", description = "Orders retrieved successfully")
    @ApiResponse(responseCode = "400", description = "Bad request")
    public ResponseEntity<?> showAllOrders(@RequestParam String email) {
        try {
            logger.info("Email for retrieving orders: {}", email);
            List<OrderCourseDTO> orderCourses = orderService.showAllOrder(email);
            return ResponseEntity.ok(orderCourses);
        } catch (Exception e) {
            logger.error("Error retrieving orders: {}", e.getMessage(), e);
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Error retrieving orders: " + e.getMessage());
        }
    }

    @GetMapping("/monthly-stats")
    public ResponseEntity<List<MonthlyOrderStats>> getMonthlyOrderStats() {
        List<MonthlyOrderStats> monthlyStats = orderService.getMonthlyOrderStats();
        return ResponseEntity.ok(monthlyStats);
    }

    @GetMapping("/revenue-by-category")
    public ResponseEntity<List<RevenueByCategoryDTO>> getRevenueByCategory() {
        List<RevenueByCategoryDTO> revenueStats = orderService.getRevenueByCategory();
        return ResponseEntity.ok(revenueStats);
    }

}
