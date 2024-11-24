package com.Server.category;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/auth/categories")
@Tag(name = "Category", description = "Category management APIs")
public class CategoryController {

    private CategoryService categoryService;

    @Autowired
    public CategoryController(CategoryService categoryService) {
        this.categoryService = categoryService;
    }

    @GetMapping("/all")
    @Operation(summary = "Get all categories", description = "Retrieves a list of all categories")
    @ApiResponse(responseCode = "200", description = "Successful retrieval of categories",
            content = @Content(schema = @Schema(implementation = CategoryDTO.class)))
    public List<CategoryDTO> getAllCategories() {
        return categoryService.getAllCategories();
    }

    @GetMapping("/{id}")
    @Operation(summary = "Get a category by ID", description = "Retrieves a category by its ID")
    @ApiResponse(responseCode = "200", description = "Successful retrieval of category",
            content = @Content(schema = @Schema(implementation = Category.class)))
    @ApiResponse(responseCode = "404", description = "Category not found")
    public Category getCategory(@PathVariable long id) {
        return categoryService.getCategoryById(id);
    }

    @PostMapping("")
    @Operation(summary = "Add a new category", description = "Adds a new category to the system")
    @ApiResponse(responseCode = "200", description = "Category added successfully",
            content = @Content(schema = @Schema(implementation = Category.class)))
    @ApiResponse(responseCode = "400", description = "Invalid input")
    public ResponseEntity<Category> addCategory(@RequestBody Category category) {
        if (category.getCategoryName() == null || category.getCategoryName().isEmpty()) {
            return ResponseEntity.badRequest().body(null);
        }
        categoryService.addCategory(category);
        return ResponseEntity.ok(category);
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "Delete a category", description = "Deletes a category by its ID")
    @ApiResponse(responseCode = "200", description = "Category deleted successfully")
    @ApiResponse(responseCode = "404", description = "Category not found")
    public void deleteCategory(@PathVariable int id) {
        categoryService.deleteCategory(id);
    }

    @PutMapping("/{id}")
    @Operation(summary = "Update a category", description = "Updates an existing category")
    @ApiResponse(responseCode = "200", description = "Category updated successfully",
            content = @Content(schema = @Schema(implementation = Category.class)))
    @ApiResponse(responseCode = "400", description = "Invalid input")
    @ApiResponse(responseCode = "404", description = "Category not found")
    public ResponseEntity<Category> updateCategory(@PathVariable int id, @RequestBody Category category) {
        if (category.getCategoryName() == null || category.getCategoryName().isEmpty()) {
            return ResponseEntity.badRequest().body(null);
        }
        Category oldCategory = categoryService.getCategoryById(id);
        if (oldCategory == null) {
            return ResponseEntity.notFound().build();
        } else {
            oldCategory.setCategoryName(category.getCategoryName());
            categoryService.updateCategory(oldCategory);
        }
        return ResponseEntity.ok(category);
    }
}