package com.Server.statistic;
public interface MonthlyOrderStats {
    int getMonth();
    double getTotalRevenue();
    long getTotalSales();
}