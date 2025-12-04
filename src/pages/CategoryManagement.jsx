import React, { useState } from 'react';
import { useCategory } from '../context/CategoryContext';
import { 
  IoFastFoodOutline, 
  IoLaptopOutline, 
  IoShirtOutline, 
  IoBookOutline, 
  IoCarOutline, 
  IoHomeOutline, 
  IoPhonePortraitOutline,
  IoGameControllerOutline,
  IoMusicalNotesOutline,
  IoFitnessOutline,
  IoMedicalOutline,
  IoSchoolOutline,
  IoBusinessOutline,
  IoRestaurantOutline,
  IoCafeOutline
} from 'react-icons/io5';

export default function CategoryManagement() {
  const { categories, addCategory, updateCategory, deleteCategory } = useCategory();
  const [showForm, setShowForm] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    icon: ''
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.title.trim()) {
      newErrors.title = 'Category title is required';
    }

    if (!formData.icon.trim()) {
      newErrors.icon = 'Icon name is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setLoading(true);
    try {
      if (editingCategory) {
        await updateCategory(editingCategory.id, formData);
      } else {
        await addCategory(formData);
      }

      setShowForm(false);
      setEditingCategory(null);
      setFormData({ title: '', icon: '' });
      setErrors({});
    } catch (error) {
      setErrors({ general: 'Operation failed. Please try again.' });
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (category) => {
    setEditingCategory(category);
    setFormData({
      title: category.title,
      icon: category.icon
    });
    setShowForm(true);
  };

  const handleDelete = async (categoryId) => {
    if (window.confirm('Are you sure you want to delete this category?')) {
      try {
        await deleteCategory(categoryId);
      } catch (error) {
        alert('Failed to delete category');
      }
    }
  };

  const resetForm = () => {
    setShowForm(false);
    setEditingCategory(null);
    setFormData({ title: '', icon: '' });
    setErrors({});
  };

  const iconOptions = [
    'fast-food-outline',
    'laptop-outline',
    'shirt-outline',
    'book-outline',
    'car-outline',
    'home-outline',
    'phone-outline',
    'game-controller-outline',
    'musical-notes-outline',
    'fitness-outline',
    'medical-outline',
    'school-outline',
    'business-outline',
    'restaurant-outline',
    'cafe-outline'
  ];

  // Map icon names to actual icon components
  const getIconComponent = (iconName) => {
    const iconMap = {
      'fast-food-outline': IoFastFoodOutline,
      'laptop-outline': IoLaptopOutline,
      'shirt-outline': IoShirtOutline,
      'book-outline': IoBookOutline,
      'car-outline': IoCarOutline,
      'home-outline': IoHomeOutline,
      'phone-outline': IoPhonePortraitOutline,
      'game-controller-outline': IoGameControllerOutline,
      'musical-notes-outline': IoMusicalNotesOutline,
      'fitness-outline': IoFitnessOutline,
      'medical-outline': IoMedicalOutline,
      'school-outline': IoSchoolOutline,
      'business-outline': IoBusinessOutline,
      'restaurant-outline': IoRestaurantOutline,
      'cafe-outline': IoCafeOutline
    };

    const IconComponent = iconMap[iconName];
    return IconComponent || null;
  };

  return (
    <div style={{ padding: '20px' }}>
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '30px'
      }}>
        <h1 style={{ color: '#333', margin: 0 }}>Category Management</h1>
        <button
          onClick={() => setShowForm(true)}
          style={{
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            color: 'white',
            border: 'none',
            padding: '10px 20px',
            borderRadius: '5px',
            cursor: 'pointer',
            fontWeight: '600'
          }}
        >
          Add New Category
        </button>
      </div>

      {showForm && (
        <div style={{
          background: 'white',
          padding: '30px',
          borderRadius: '10px',
          boxShadow: '0 5px 15px rgba(0, 0, 0, 0.1)',
          marginBottom: '30px'
        }}>
          <h2 style={{ marginTop: 0, color: '#333' }}>
            {editingCategory ? 'Edit Category' : 'Add New Category'}
          </h2>

          {errors.general && (
            <div style={{
              background: '#fee',
              color: '#c33',
              padding: '10px',
              borderRadius: '5px',
              marginBottom: '20px'
            }}>
              {errors.general}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '20px' }}>
              <div>
                <label style={{ display: 'block', marginBottom: '5px', color: '#555', fontWeight: '500' }}>
                  Category Title
                </label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  style={{
                    width: '100%',
                    padding: '10px',
                    border: `2px solid ${errors.title ? '#e74c3c' : '#ddd'}`,
                    borderRadius: '5px',
                    fontSize: '14px',
                    boxSizing: 'border-box'
                  }}
                  placeholder="Enter category title"
                />
                {errors.title && (
                  <span style={{ color: '#e74c3c', fontSize: '12px' }}>{errors.title}</span>
                )}
              </div>

              <div>
                <label style={{ display: 'block', marginBottom: '5px', color: '#555', fontWeight: '500' }}>
                  Icon Name
                </label>
                <div style={{ position: 'relative' }}>
                  <select
                    name="icon"
                    value={formData.icon}
                    onChange={handleChange}
                    style={{
                      width: '100%',
                      padding: '10px',
                      paddingLeft: formData.icon ? '40px' : '10px',
                      border: `2px solid ${errors.icon ? '#e74c3c' : '#ddd'}`,
                      borderRadius: '5px',
                      fontSize: '14px',
                      boxSizing: 'border-box',
                      appearance: 'none',
                      backgroundImage: 'url("data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' width=\'12\' height=\'12\' viewBox=\'0 0 12 12\'%3E%3Cpath fill=\'%23333\' d=\'M6 9L1 4h10z\'/%3E%3C/svg%3E")',
                      backgroundRepeat: 'no-repeat',
                      backgroundPosition: 'right 10px center',
                      paddingRight: '30px'
                    }}
                  >
                    <option value="">Select an icon</option>
                    {iconOptions.map(icon => (
                      <option key={icon} value={icon}>{icon}</option>
                    ))}
                  </select>
                  {formData.icon && (
                    <div style={{
                      position: 'absolute',
                      left: '12px',
                      top: '50%',
                      transform: 'translateY(-50%)',
                      pointerEvents: 'none',
                      color: '#667eea'
                    }}>
                      {(() => {
                        const IconComponent = getIconComponent(formData.icon);
                        return IconComponent ? <IconComponent size={18} /> : null;
                      })()}
                    </div>
                  )}
                </div>
                {errors.icon && (
                  <span style={{ color: '#e74c3c', fontSize: '12px' }}>{errors.icon}</span>
                )}
              </div>
            </div>

            <div style={{ display: 'flex', gap: '10px' }}>
              <button
                type="submit"
                disabled={loading}
                style={{
                  background: loading ? '#ccc' : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                  color: 'white',
                  border: 'none',
                  padding: '10px 20px',
                  borderRadius: '5px',
                  cursor: loading ? 'not-allowed' : 'pointer',
                  fontWeight: '600'
                }}
              >
                {loading ? 'Saving...' : (editingCategory ? 'Update Category' : 'Add Category')}
              </button>
              <button
                type="button"
                onClick={resetForm}
                style={{
                  background: '#6c757d',
                  color: 'white',
                  border: 'none',
                  padding: '10px 20px',
                  borderRadius: '5px',
                  cursor: 'pointer',
                  fontWeight: '600'
                }}
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      <div style={{
        background: 'white',
        borderRadius: '10px',
        boxShadow: '0 5px 15px rgba(0, 0, 0, 0.1)',
        overflow: 'hidden'
      }}>
        <div style={{
          background: '#f8f9fa',
          padding: '20px',
          borderBottom: '1px solid #dee2e6'
        }}>
          <h3 style={{ margin: 0, color: '#333' }}>All Categories ({categories.length})</h3>
        </div>

        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ background: '#f8f9fa' }}>
                <th style={{ padding: '15px', textAlign: 'left', borderBottom: '1px solid #dee2e6' }}>ID</th>
                <th style={{ padding: '15px', textAlign: 'left', borderBottom: '1px solid #dee2e6' }}>Icon</th>
                <th style={{ padding: '15px', textAlign: 'left', borderBottom: '1px solid #dee2e6' }}>Title</th>
                <th style={{ padding: '15px', textAlign: 'left', borderBottom: '1px solid #dee2e6' }}>Created</th>
                <th style={{ padding: '15px', textAlign: 'left', borderBottom: '1px solid #dee2e6' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {categories.map((category) => (
                <tr key={category.id} style={{ borderBottom: '1px solid #dee2e6' }}>
                  <td style={{ padding: '15px', fontFamily: 'monospace', fontSize: '12px' }}>
                    {category.id}
                  </td>
                  <td style={{ padding: '15px' }}>
                    <div style={{
                      width: '40px',
                      height: '40px',
                      borderRadius: '8px',
                      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: 'white',
                      fontSize: '18px'
                    }}>
                      {(() => {
                        const IconComponent = getIconComponent(category.icon);
                        return IconComponent ? <IconComponent size={20} /> : '📦';
                      })()}
                    </div>
                  </td>
                  <td style={{ padding: '15px' }}>
                    <div style={{ fontWeight: '600', fontSize: '16px' }}>{category.title}</div>
                    <div style={{ fontSize: '12px', color: '#666', fontFamily: 'monospace' }}>
                      {category.icon}
                    </div>
                  </td>
                  <td style={{ padding: '15px', fontSize: '12px', color: '#666' }}>
                    {new Date(category.createdAt).toLocaleDateString()}
                  </td>
                  <td style={{ padding: '15px' }}>
                    <div style={{ display: 'flex', gap: '5px' }}>
                      <button
                        onClick={() => handleEdit(category)}
                        style={{
                          background: '#17a2b8',
                          color: 'white',
                          border: 'none',
                          padding: '5px 10px',
                          borderRadius: '3px',
                          cursor: 'pointer',
                          fontSize: '12px'
                        }}
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(category.id)}
                        style={{
                          background: '#dc3545',
                          color: 'white',
                          border: 'none',
                          padding: '5px 10px',
                          borderRadius: '3px',
                          cursor: 'pointer',
                          fontSize: '12px'
                        }}
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

