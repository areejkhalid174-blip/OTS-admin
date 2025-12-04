import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { getAllData, updateData, deleteData } from '../Helper/firebaseHelper';

export default function UserManagement() {
  const { user: currentUser } = useAuth();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'Customer'
  });
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterRole, setFilterRole] = useState('All');

  // Fetch all users from Firebase
  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const allUsers = await getAllData('users');
      setUsers(allUsers || []);
    } catch (error) {
      console.error('Error fetching users:', error);
      setErrors({ general: 'Failed to fetch users' });
    } finally {
      setLoading(false);
    }
  };

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

    setSubmitting(true);
    try {
      const userData = { ...formData };
      if (editingUser) {
        delete userData.password; // Don't update password through this form
        // Handle name field - if it contains space, split into firstName and lastName
        if (userData.name && userData.name.includes(' ')) {
          const nameParts = userData.name.trim().split(' ');
          userData.firstName = nameParts[0];
          userData.lastName = nameParts.slice(1).join(' ');
          delete userData.name;
        } else if (userData.name) {
          userData.firstName = userData.name;
          delete userData.name;
        }
        await updateData('users', editingUser.id || editingUser.uid, userData);
        await fetchUsers(); // Refresh the list
      } else {
        setErrors({ general: 'Please use signup page to add new users' });
        return;
      }

      setShowForm(false);
      setEditingUser(null);
      setFormData({ name: '', email: '', password: '', role: 'Customer' });
      setErrors({});
    } catch (error) {
      setErrors({ general: 'Operation failed. Please try again.' });
    } finally {
      setSubmitting(false);
    }
  };

  const handleEdit = (user) => {
    setEditingUser(user);
    setFormData({
      name: user.name || `${user.firstName || ''} ${user.lastName || ''}`.trim() || '',
      email: user.email || '',
      password: '',
      role: user.role || 'Customer'
    });
    setShowForm(true);
  };

  const handleDelete = async (userId) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      try {
        await deleteData('users', userId);
        await fetchUsers(); // Refresh the list
      } catch (error) {
        alert('Failed to delete user');
      }
    }
  };

  // Filter users based on search and role
  const filteredUsers = users.filter(user => {
    const matchesSearch = 
      (user.name || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (user.email || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (user.firstName || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (user.lastName || '').toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesRole = filterRole === 'All' || 
      (user.role || '').toLowerCase() === filterRole.toLowerCase();
    
    return matchesSearch && matchesRole;
  });

  // Get role display name
  const getRoleDisplay = (role) => {
    if (!role) return 'Unknown';
    const roleLower = role.toLowerCase();
    if (roleLower === 'rider') return 'Rider';
    if (roleLower === 'customer') return 'Customer';
    if (roleLower === 'admin') return 'Admin';
    return role;
  };

  // Get role badge color
  const getRoleBadgeColor = (role) => {
    if (!role) return { bg: '#6c757d', color: 'white' };
    const roleLower = role.toLowerCase();
    if (roleLower === 'rider') return { bg: '#3B82F6', color: 'white' };
    if (roleLower === 'customer') return { bg: '#10B981', color: 'white' };
    if (roleLower === 'admin') return { bg: '#EF4444', color: 'white' };
    return { bg: '#6c757d', color: 'white' };
  };

  // Get user display name
  const getUserDisplayName = (user) => {
    if (user.name) return user.name;
    if (user.firstName && user.lastName) return `${user.firstName} ${user.lastName}`;
    if (user.firstName) return user.firstName;
    return user.email || 'Unknown User';
  };

  const resetForm = () => {
    setShowForm(false);
    setEditingUser(null);
    setFormData({ name: '', email: '', password: '', role: 'Customer' });
    setErrors({});
  };

  if (loading) {
    return (
      <div style={{ padding: '20px', textAlign: 'center' }}>
        <p>Loading users...</p>
      </div>
    );
  }

  return (
    <div style={{ padding: '20px' }}>
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '30px'
      }}>
        <h1 style={{ color: '#333', margin: 0 }}>User Management</h1>
      </div>

      {/* Search and Filter */}
      <div style={{
        background: 'white',
        padding: '20px',
        borderRadius: '10px',
        boxShadow: '0 5px 15px rgba(0, 0, 0, 0.1)',
        marginBottom: '30px',
        display: 'flex',
        gap: '15px',
        flexWrap: 'wrap'
      }}>
        <div style={{ flex: '1', minWidth: '200px' }}>
          <input
            type="text"
            placeholder="Search by name or email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{
              width: '100%',
              padding: '10px',
              border: '2px solid #ddd',
              borderRadius: '5px',
              fontSize: '14px',
              boxSizing: 'border-box'
            }}
          />
        </div>
        <div style={{ minWidth: '150px' }}>
          <select
            value={filterRole}
            onChange={(e) => setFilterRole(e.target.value)}
            style={{
              width: '100%',
              padding: '10px',
              border: '2px solid #ddd',
              borderRadius: '5px',
              fontSize: '14px',
              boxSizing: 'border-box'
            }}
          >
            <option value="All">All Roles</option>
            <option value="Rider">Riders</option>
            <option value="Customer">Customers</option>
            <option value="admin">Admins</option>
          </select>
        </div>
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
                  <option value="Customer">Customer</option>
                  <option value="Rider">Rider</option>
                  <option value="admin">Admin</option>
                </select>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '10px' }}>
              <button
                type="submit"
                disabled={submitting}
                style={{
                  background: submitting ? '#ccc' : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                  color: 'white',
                  border: 'none',
                  padding: '10px 20px',
                  borderRadius: '5px',
                  cursor: submitting ? 'not-allowed' : 'pointer',
                  fontWeight: '600'
                }}
              >
                {submitting ? 'Saving...' : 'Update User'}
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
          borderBottom: '1px solid #dee2e6',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <h3 style={{ margin: 0, color: '#333' }}>All Users ({filteredUsers.length} of {users.length})</h3>
          <div style={{ display: 'flex', gap: '15px', fontSize: '14px', color: '#666' }}>
            <span>Riders: <strong>{users.filter(u => (u.role || '').toLowerCase() === 'rider').length}</strong></span>
            <span>Customers: <strong>{users.filter(u => (u.role || '').toLowerCase() === 'customer').length}</strong></span>
            <span>Admins: <strong>{users.filter(u => (u.role || '').toLowerCase() === 'admin').length}</strong></span>
          </div>
        </div>

        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ background: '#f8f9fa' }}>
                <th style={{ padding: '15px', textAlign: 'left', borderBottom: '1px solid #dee2e6' }}>Name</th>
                <th style={{ padding: '15px', textAlign: 'left', borderBottom: '1px solid #dee2e6' }}>Email</th>
                <th style={{ padding: '15px', textAlign: 'left', borderBottom: '1px solid #dee2e6' }}>Phone</th>
                <th style={{ padding: '15px', textAlign: 'left', borderBottom: '1px solid #dee2e6' }}>Role</th>
                <th style={{ padding: '15px', textAlign: 'left', borderBottom: '1px solid #dee2e6' }}>Status</th>
                <th style={{ padding: '15px', textAlign: 'left', borderBottom: '1px solid #dee2e6' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.length === 0 ? (
                <tr>
                  <td colSpan="6" style={{ padding: '30px', textAlign: 'center', color: '#666' }}>
                    No users found
                  </td>
                </tr>
              ) : (
                filteredUsers.map((user) => {
                  const displayName = getUserDisplayName(user);
                  const roleBadge = getRoleBadgeColor(user.role);
                  return (
                    <tr key={user.id || user.uid} style={{ borderBottom: '1px solid #dee2e6' }}>
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
                            {displayName.charAt(0).toUpperCase()}
                          </div>
                          <span style={{ fontWeight: '500' }}>{displayName}</span>
                        </div>
                      </td>
                      <td style={{ padding: '15px', color: '#666' }}>{user.email || 'N/A'}</td>
                      <td style={{ padding: '15px', color: '#666' }}>{user.phone || user.phoneNumber || 'N/A'}</td>
                      <td style={{ padding: '15px' }}>
                        <span style={{
                          background: roleBadge.bg,
                          color: roleBadge.color,
                          padding: '4px 12px',
                          borderRadius: '12px',
                          fontSize: '12px',
                          fontWeight: '600'
                        }}>
                          {getRoleDisplay(user.role)}
                        </span>
                      </td>
                      <td style={{ padding: '15px' }}>
                        <span style={{
                          background: user.status === 'approved' || user.status === 'Approved' ? '#DCFCE7' : 
                                     user.status === 'pending' || user.status === 'Pending' ? '#FEF3C7' : 
                                     user.status === 'rejected' || user.status === 'Rejected' ? '#FEE2E2' : '#E5E7EB',
                          color: user.status === 'approved' || user.status === 'Approved' ? '#166534' : 
                                 user.status === 'pending' || user.status === 'Pending' ? '#92400E' : 
                                 user.status === 'rejected' || user.status === 'Rejected' ? '#991B1B' : '#374151',
                          padding: '4px 12px',
                          borderRadius: '12px',
                          fontSize: '12px',
                          fontWeight: '600',
                          textTransform: 'capitalize'
                        }}>
                          {user.status || 'N/A'}
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
                          {(user.id !== currentUser?.id && user.uid !== currentUser?.uid) && (
                            <button
                              onClick={() => handleDelete(user.id || user.uid)}
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
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

