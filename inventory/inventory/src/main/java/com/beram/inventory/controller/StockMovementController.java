package com.beram.inventory.controller;

import com.beram.inventory.dto.StockMovementRequest;
import com.beram.inventory.entity.StockMovement;
import com.beram.inventory.service.StockMovementService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/stock")
@RequiredArgsConstructor
@CrossOrigin("*")
public class StockMovementController {

    private final StockMovementService stockMovementService;

    @PostMapping("/in")
    public StockMovement stockIn(@RequestBody StockMovementRequest request) {
        return stockMovementService.addStock(
                request.getProductId(),
                request.getQuantity(),
                request.getReason()
        );
    }

    @PostMapping("/out")
    public StockMovement stockOut(@RequestBody StockMovementRequest request) {
        return stockMovementService.removeStock(
                request.getProductId(),
                request.getQuantity(),
                request.getReason()
        );
    }

    @GetMapping("/history/{productId}")
    public List<StockMovement> productHistory(@PathVariable Long productId) {
        return stockMovementService.getProductHistory(productId);
    }

    @GetMapping("/history")
    public List<StockMovement> allMovements() {
        return stockMovementService.getAllMovements();
    }
}