package com.beram.inventory.controller;

import com.beram.inventory.entity.Product;
import com.beram.inventory.service.ProductService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;
import jakarta.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.io.PrintWriter;

import java.util.List;

@RestController
@RequestMapping("/api/products")
@RequiredArgsConstructor

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

    @GetMapping("/export/csv")
    public void exportCSV(HttpServletResponse response) throws IOException {
        response.setContentType("text/csv");
        response.setHeader("Content-Disposition", "attachment; filename=products.csv");

        PrintWriter writer = response.getWriter();
        writer.println("ID,Name,SKU,Price,Quantity,Low Stock Threshold,Category,Status");

        List<Product> products = productService.getAllProducts();
        for (Product p : products) {
            String status = p.getQuantity() <= 0 ? "Out of Stock" :
                    p.getQuantity() <= p.getLowStockThreshold() ? "Low Stock" : "In Stock";
            String categoryName = p.getCategory() != null ? p.getCategory().getName() : "Uncategorized";

            writer.printf("%d,%s,%s,%.2f,%d,%d,%s,%s\n",
                    p.getId(),
                    escapeCsv(p.getName()),
                    escapeCsv(p.getSku()),
                    p.getPrice(),
                    p.getQuantity(),
                    p.getLowStockThreshold(),
                    escapeCsv(categoryName),
                    status
            );
        }
        writer.flush();
    }

    private String escapeCsv(String value) {
        if (value == null) return "";
        if (value.contains(",") || value.contains("\"") || value.contains("\n")) {
            return "\"" + value.replace("\"", "\"\"") + "\"";
        }
        return value;
    }

}