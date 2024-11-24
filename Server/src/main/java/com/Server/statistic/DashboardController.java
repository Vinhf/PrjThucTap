package com.Server.statistic;


import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import java.math.BigDecimal;
import java.util.HashMap;
import java.util.Map;

@RestController
public class DashboardController {

    @Autowired
    private DashboardService dashboardService;

    @GetMapping("/api/v1/auth/dashboard/stats")
    public Map<String, Object> getDashboardStats() {
        Map<String, Object> stats = new HashMap<>();
        stats.put("totalProfit", dashboardService.getTotalProfit());
        stats.put("totalUsers", dashboardService.getTotalUsers());
        stats.put("totalCourses", dashboardService.getTotalCourses());
        stats.put("totalCategoríes", dashboardService.getTotalCategories());
        System.out.println(stats.get("totalProfit"));
        System.out.println(stats.get("totalUsers"));
        System.out.println(stats.get("totalCourses"));
        System.out.println(stats.get("totalCategoríes"));
        return stats;
    }
}
