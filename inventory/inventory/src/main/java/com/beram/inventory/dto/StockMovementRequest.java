package com.beram.inventory.dto;

import lombok.Data;

@Data
public class StockMovementRequest {
    private Long productId;
    private String type; // "IN" or "OUT"
    private Integer quantity;
    private String reason;
}