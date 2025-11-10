import React, { createContext, useContext, useState, useEffect } from 'react';

const CategoryContext = createContext();

export const useCategory = () => {
  const context = useContext(CategoryContext);
  if (!context) {
    throw new Error('useCategory must be used within a CategoryProvider');
  }
  return context;
};

export const CategoryProvider = ({ children }) => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  // Load categories from localStorage
  useEffect(() => {
    const savedCategories = localStorage.getItem('categories');
    if (savedCategories) {
      setCategories(JSON.parse(savedCategories));
    } else {
      // Initialize with some sample categories
      const sampleCategories = [
        {
          id: "26kPr2ALh77tBZ8a1LvV",
          title: "Food",
          icon: "fast-food-outline",
          createdAt: new Date().toISOString()
        },
        {
          id: "cat_2",
          title: "Electronics",
          icon: "laptop-outline",
          createdAt: new Date().toISOString()
        },
        {
          id: "cat_3",
          title: "Clothing",
          icon: "shirt-outline",
          createdAt: new Date().toISOString()
        },
        {
          id: "cat_4",
          title: "Books",
          icon: "book-outline",
          createdAt: new Date().toISOString()
        }
      ];
      setCategories(sampleCategories);
      localStorage.setItem('categories', JSON.stringify(sampleCategories));
    }
    setLoading(false);
  }, []);

  const addCategory = (categoryData) => {
    const newCategory = {
      id: `cat_${Date.now()}`,
      ...categoryData,
      createdAt: new Date().toISOString()
    };
    const updatedCategories = [...categories, newCategory];
    setCategories(updatedCategories);
    localStorage.setItem('categories', JSON.stringify(updatedCategories));
    return { success: true, category: newCategory };
  };

  const updateCategory = (id, categoryData) => {
    const updatedCategories = categories.map(category => 
      category.id === id ? { ...category, ...categoryData, updatedAt: new Date().toISOString() } : category
    );
    setCategories(updatedCategories);
    localStorage.setItem('categories', JSON.stringify(updatedCategories));
    return { success: true };
  };

  const deleteCategory = (id) => {
    const updatedCategories = categories.filter(category => category.id !== id);
    setCategories(updatedCategories);
    localStorage.setItem('categories', JSON.stringify(updatedCategories));
    return { success: true };
  };

  const getCategoryById = (id) => {
    return categories.find(category => category.id === id);
  };

  const value = {
    categories,
    loading,
    addCategory,
    updateCategory,
    deleteCategory,
    getCategoryById
  };

  return (
    <CategoryContext.Provider value={value}>
      {children}
    </CategoryContext.Provider>
  );
};

