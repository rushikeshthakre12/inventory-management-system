package com.beram.inventory.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import lombok.*;

import java.math.BigDecimal;

@Entity
@Table(name = "products")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Product {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank
    private String name;

    @Column(unique = true)
    private String sku;

    private BigDecimal price;

    private Integer quantity;

    private Integer lowStockThreshold;

    @ManyToOne
    @JoinColumn(name = "category_id")
    private Category category;
}