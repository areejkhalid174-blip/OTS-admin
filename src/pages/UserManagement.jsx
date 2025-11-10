import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';

export default function UserManagement() {
  const { users, addUser, updateUser, deleteUser, user: currentUser } = useAuth();
  const [showForm, setShowForm] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'user'
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

    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }

    if (!editingUser && !formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password && formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
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
      const userData = { ...formData };
      if (editingUser) {
        if (!userData.password) {
          delete userData.password;
        }
        await updateUser(editingUser.id, userData);
      } else {
        await addUser(userData);
      }

      setShowForm(false);
      setEditingUser(null);
      setFormData({ name: '', email: '', password: '', role: 'user' });
      setErrors({});
    } catch (error) {
      setErrors({ general: 'Operation failed. Please try again.' });
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (user) => {
    setEditingUser(user);
    setFormData({
      name: user.name,
      email: user.email,
      password: '',
      role: user.role
    });
    setShowForm(true);
  };

  const handleDelete = async (userId) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      try {
        await deleteUser(userId);
      } catch (error) {
        alert('Failed to delete user');
      }
    }
  };

  const resetForm = () => {
    setShowForm(false);
    setEditingUser(null);
    setFormData({ name: '', email: '', password: '', role: 'user' });
    setErrors({});
  };

  return (
    <div style={{ padding: '20px' }}>
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '30px'
      }}>
        <h1 style={{ color: '#333', margin: 0 }}>User Management</h1>
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
          Add New User
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
            {editingUser ? 'Edit User' : 'Add New User'}
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
                  Name
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  style={{
                    width: '100%',
                    padding: '10px',
                    border: `2px solid ${errors.name ? '#e74c3c' : '#ddd'}`,
                    borderRadius: '5px',
                    fontSize: '14px',
                    boxSizing: 'border-box'
                  }}
                />
                {errors.name && (
                  <span style={{ color: '#e74c3c', fontSize: '12px' }}>{errors.name}</span>
                )}
              </div>

              <div>
                <label style={{ display: 'block', marginBottom: '5px', color: '#555', fontWeight: '500' }}>
                  Email
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  style={{
                    width: '100%',
                    padding: '10px',
                    border: `2px solid ${errors.email ? '#e74c3c' : '#ddd'}`,
                    borderRadius: '5px',
                    fontSize: '14px',
                    boxSizing: 'border-box'
                  }}
                />
                {errors.email && (
                  <span style={{ color: '#e74c3c', fontSize: '12px' }}>{errors.email}</span>
                )}
              </div>

              <div>
                <label style={{ display: 'block', marginBottom: '5px', color: '#555', fontWeight: '500' }}>
                  Password {editingUser && '(leave empty to keep current)'}
                </label>
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  style={{
                    width: '100%',
                    padding: '10px',
                    border: `2px solid ${errors.password ? '#e74c3c' : '#ddd'}`,
                    borderRadius: '5px',
                    fontSize: '14px',
                    boxSizing: 'border-box'
                  }}
                />
                {errors.password && (
                  <span style={{ color: '#e74c3c', fontSize: '12px' }}>{errors.password}</span>
                )}
              </div>

              <div>
                <label style={{ display: 'block', marginBottom: '5px', color: '#555', fontWeight: '500' }}>
                  Role
                </label>
                <select
                  name="role"
                  value={formData.role}
                  onChange={handleChange}
                  style={{
                    width: '100%',
                    padding: '10px',
                    border: '2px solid #ddd',
                    borderRadius: '5px',
                    fontSize: '14px',
                    boxSizing: 'border-box'
                  }}
                >
                  <option value="user">User</option>
                  <option value="admin">Admin</option>
                </select>
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
                {loading ? 'Saving...' : (editingUser ? 'Update User' : 'Add User')}
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
          <h3 style={{ margin: 0, color: '#333' }}>All Users ({users.length})</h3>
        </div>

        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ background: '#f8f9fa' }}>
                <th style={{ padding: '15px', textAlign: 'left', borderBottom: '1px solid #dee2e6' }}>ID</th>
                <th style={{ padding: '15px', textAlign: 'left', borderBottom: '1px solid #dee2e6' }}>Name</th>
                <th style={{ padding: '15px', textAlign: 'left', borderBottom: '1px solid #dee2e6' }}>Email</th>
                <th style={{ padding: '15px', textAlign: 'left', borderBottom: '1px solid #dee2e6' }}>Role</th>
                <th style={{ padding: '15px', textAlign: 'left', borderBottom: '1px solid #dee2e6' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user.id} style={{ borderBottom: '1px solid #dee2e6' }}>
                  <td style={{ padding: '15px' }}>{user.id}</td>
                  <td style={{ padding: '15px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <div style={{
                        width: '40px',
                        height: '40px',
                        borderRadius: '50%',
                        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: 'white',
                        fontWeight: 'bold',
                        fontSize: '16px'
                      }}>
                        {user.name.charAt(0).toUpperCase()}
                      </div>
                      {user.name}
                    </div>
                  </td>
                  <td style={{ padding: '15px' }}>{user.email}</td>
                  <td style={{ padding: '15px' }}>
                    <span style={{
                      background: user.role === 'admin' ? '#dc3545' : '#28a745',
                      color: 'white',
                      padding: '4px 8px',
                      borderRadius: '12px',
                      fontSize: '12px',
                      fontWeight: '600'
                    }}>
                      {user.role}
                    </span>
                  </td>
                  <td style={{ padding: '15px' }}>
                    <div style={{ display: 'flex', gap: '5px' }}>
                      <button
                        onClick={() => handleEdit(user)}
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
                      {user.id !== currentUser?.id && (
                        <button
                          onClick={() => handleDelete(user.id)}
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
                      )}
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

