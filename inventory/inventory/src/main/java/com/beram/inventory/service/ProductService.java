package com.beram.inventory.service;

import com.beram.inventory.entity.Category;
import com.beram.inventory.entity.Product;
import com.beram.inventory.repository.CategoryRepository;
import com.beram.inventory.repository.ProductRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class ProductService {

    private final ProductRepository productRepository;
    private final CategoryRepository categoryRepository;

    public Product addProduct(Product product) {

        Category category = categoryRepository.findById(
                        product.getCategory().getId())
                .orElseThrow(() ->
                        new RuntimeException("Category not found"));

        product.setCategory(category);

        return productRepository.save(product);
    }

    public List<Product> getAllProducts() {
        return productRepository.findAll();
    }

    public Product updateProduct(Long id, Product product) {

        Product existing = productRepository.findById(id)
                .orElseThrow(() ->
                        new RuntimeException("Product not found"));

        existing.setName(product.getName());
        existing.setSku(product.getSku());
        existing.setPrice(product.getPrice());
        existing.setQuantity(product.getQuantity());
        existing.setLowStockThreshold(product.getLowStockThreshold());

        Category category = categoryRepository.findById(
                        product.getCategory().getId())
                .orElseThrow(() ->
                        new RuntimeException("Category not found"));

        existing.setCategory(category);

        return productRepository.save(existing);
    }

    public void deleteProduct(Long id) {
        productRepository.deleteById(id);
    }

    public List<Product> search(String keyword) {
        return productRepository.findByNameContainingIgnoreCase(keyword);
    }
}