package com.beram.inventory.service;

import com.beram.inventory.dto.DashboardResponse;
import com.beram.inventory.entity.Product;
import com.beram.inventory.repository.CategoryRepository;
import com.beram.inventory.repository.ProductRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.List;

@Service
@RequiredArgsConstructor
public class DashboardService {

    private final ProductRepository productRepository;
    private final CategoryRepository categoryRepository;

    public DashboardResponse getDashboard() {

        long totalProducts = productRepository.count();

        long totalCategories = categoryRepository.count();

        List<Product> products = productRepository.findAll();

        long lowStock = products.stream()
                .filter(p -> p.getQuantity() <= p.getLowStockThreshold())
                .count();

        BigDecimal stockValue = BigDecimal.ZERO;

        for (Product p : products) {

            stockValue = stockValue.add(
                    p.getPrice().multiply(
                            BigDecimal.valueOf(p.getQuantity())
                    )
            );

        }

        return new DashboardResponse(
                totalProducts,
                totalCategories,
                lowStock,
                stockValue
        );

    }

}