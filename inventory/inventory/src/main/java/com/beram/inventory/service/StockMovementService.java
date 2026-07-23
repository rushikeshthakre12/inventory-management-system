package com.beram.inventory.service;

import com.beram.inventory.entity.Product;
import com.beram.inventory.entity.StockMovement;
import com.beram.inventory.repository.ProductRepository;
import com.beram.inventory.repository.StockMovementRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class StockMovementService {

    private final StockMovementRepository stockMovementRepository;
    private final ProductRepository productRepository;

    @Transactional
    public StockMovement addStock(Long productId, Integer quantity, String reason) {
        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new RuntimeException("Product not found"));

        product.setQuantity(product.getQuantity() + quantity);
        productRepository.save(product);

        StockMovement movement = StockMovement.builder()
                .product(product)
                .type("IN")
                .quantity(quantity)
                .reason(reason)
                .build();

        return stockMovementRepository.save(movement);
    }

    @Transactional
    public StockMovement removeStock(Long productId, Integer quantity, String reason) {
        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new RuntimeException("Product not found"));

        if (product.getQuantity() < quantity) {
            throw new RuntimeException("Insufficient stock! Available: " + product.getQuantity());
        }

        product.setQuantity(product.getQuantity() - quantity);
        productRepository.save(product);

        StockMovement movement = StockMovement.builder()
                .product(product)
                .type("OUT")
                .quantity(quantity)
                .reason(reason)
                .build();

        return stockMovementRepository.save(movement);
    }

    public List<StockMovement> getProductHistory(Long productId) {
        return stockMovementRepository.findByProductIdOrderByCreatedAtDesc(productId);
    }

    public List<StockMovement> getAllMovements() {
        return stockMovementRepository.findAllByOrderByCreatedAtDesc();
    }
}