package com.Server.category;

import com.Server.course.Course;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Repository
@Transactional
public class CategoryDaoImpl implements CategoryService{
    private CategoryRepository repo;

    @Autowired
    public CategoryDaoImpl(CategoryRepository repo) {
        this.repo = repo;
    }

    @Override

    public boolean addCategory(Category category) {
        if ((category.getCategoryName()) != null) {
            repo.save(category);
            return true;
        }
        return false;
    }

    @Override
    public Category getCategoryById(long id) {
        List<Category> categories = repo.findAll();
        for (Category category : categories) {
            if (category.getCategoryId() == id) {
                return category;
            }
        }
        return null;
    }

    @Override
    public List<CategoryDTO> getAllCategories() {
        List<Category> categories = repo.findAll();
        List<CategoryDTO> categoriesDTO = new ArrayList<>();

        for (Category category : categories) {
            CategoryDTO categoryDTO = new CategoryDTO();
            categoryDTO.setCategoryId(category.getCategoryId());
            categoryDTO.setCategoryName(category.getCategoryName());

            // Collect course IDs into a list
            List<Long> courseIds = new ArrayList<>();
            for (Course course : category.getCourses()) {
                courseIds.add(course.getCourseId());
            }
            categoryDTO.setCourses(courseIds);

            categoriesDTO.add(categoryDTO);
        }
        return categoriesDTO;
    }

    @Override
    public boolean updateCategory(Category category) {
        if (getCategoryById(category.getCategoryId()) != null) {
            repo.saveAndFlush(category);
            return true;
        }
        return false;
    }

    @Override
    public boolean deleteCategory(long id) {
        Category category = repo.findById(id).get();
if (category != null) {
    repo.delete(category);
    return true;
}
        return false;
    }
}
