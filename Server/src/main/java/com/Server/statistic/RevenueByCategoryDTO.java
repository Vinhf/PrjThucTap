package com.Server.statistic;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import lombok.*;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Data
@Builder
@NoArgsConstructor
@JsonIgnoreProperties(ignoreUnknown = true)
public class RevenueByCategoryDTO {
    private String categoryName;
    private Double totalRevenue;

    // Constructor needed for JPQL query
    public RevenueByCategoryDTO(String categoryName, Double totalRevenue) {
        this.categoryName = categoryName;
        this.totalRevenue = totalRevenue;
    }

    // Getters and setters (optional with @Data annotation from Lombok)
    public String getCategoryName() {
        return categoryName;
    }

    public void setCategoryName(String categoryName) {
        this.categoryName = categoryName;
    }

    public Double getTotalRevenue() {
        return totalRevenue;
    }

    public void setTotalRevenue(Double totalRevenue) {
        this.totalRevenue = totalRevenue;
    }
}
