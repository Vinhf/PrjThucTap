package com.Server.category;

import java.util.List;

public interface CategoryService {
    public boolean addCategory(Category category);
    public Category getCategoryById(long id);
    public List<CategoryDTO> getAllCategories();
    public boolean updateCategory(Category category);
    public boolean deleteCategory(long id);

}
