package com.beram.inventory.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

import java.math.BigDecimal;

@Data
@AllArgsConstructor
public class DashboardResponse {

    private long totalProducts;
    private long totalCategories;
    private long lowStockProducts;
    private BigDecimal totalStockValue;

}