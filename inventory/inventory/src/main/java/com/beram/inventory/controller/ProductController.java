package com.beram.inventory.controller;

import com.beram.inventory.entity.Product;
import com.beram.inventory.service.ProductService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/products")
@RequiredArgsConstructor
@CrossOrigin("*")
public class ProductController {

    private final ProductService productService;

    @PostMapping
    public Product add(@RequestBody Product product){
        return productService.addProduct(product);
    }

    @GetMapping
    public List<Product> all(){
        return productService.getAllProducts();
    }

    @PutMapping("/{id}")
    public Product update(@PathVariable Long id,
                          @RequestBody Product product){
        return productService.updateProduct(id,product);
    }

    @DeleteMapping("/{id}")
    public String delete(@PathVariable Long id){

        productService.deleteProduct(id);

        return "Deleted Successfully";
    }

    @GetMapping("/search")
    public List<Product> search(
            @RequestParam String keyword){

        return productService.search(keyword);
    }

}