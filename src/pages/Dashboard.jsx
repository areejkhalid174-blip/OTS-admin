import React from 'react';
import { useAuth } from '../context/AuthContext';
import { useCategory } from '../context/CategoryContext';
import { useNavigate } from 'react-router-dom';

export default function Dashboard() {
  const { user, logout, users } = useAuth();
  const { categories } = useCategory();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div style={{ padding: '20px' }}>
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '30px',
        background: 'white',
        padding: '20px',
        borderRadius: '10px',
        boxShadow: '0 5px 15px rgba(0, 0, 0, 0.1)'
      }}>
        <div>
          <h1 style={{ margin: 0, color: '#333' }}>Welcome, {user?.name}!</h1>
          <p style={{ margin: '5px 0 0 0', color: '#666' }}>
            Role: <span style={{
              background: user?.role === 'admin' ? '#dc3545' : '#28a745',
              color: 'white',
              padding: '2px 8px',
              borderRadius: '12px',
              fontSize: '12px',
              fontWeight: '600'
            }}>{user?.role}</span>
          </p>
        </div>
        <button
          onClick={handleLogout}
          style={{
            background: '#dc3545',
            color: 'white',
            border: 'none',
            padding: '10px 20px',
            borderRadius: '5px',
            cursor: 'pointer',
            fontWeight: '600'
          }}
        >
          Logout
        </button>
      </div>

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
        gap: '20px',
        marginBottom: '30px'
      }}>
        <div style={{
          background: 'white',
          padding: '20px',
          borderRadius: '10px',
          boxShadow: '0 5px 15px rgba(0, 0, 0, 0.1)'
        }}>
          <h3 style={{ margin: '0 0 15px 0', color: '#333' }}>User Statistics</h3>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
            <span>Total Users:</span>
            <strong>{users.length}</strong>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
            <span>Admins:</span>
            <strong>{users.filter(u => u.role === 'admin').length}</strong>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <span>Regular Users:</span>
            <strong>{users.filter(u => u.role === 'user').length}</strong>
          </div>
        </div>

        <div style={{
          background: 'white',
          padding: '20px',
          borderRadius: '10px',
          boxShadow: '0 5px 15px rgba(0, 0, 0, 0.1)'
        }}>
          <h3 style={{ margin: '0 0 15px 0', color: '#333' }}>Category Statistics</h3>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
            <span>Total Categories:</span>
            <strong>{categories.length}</strong>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
            <span>Recently Added:</span>
            <strong>{categories.filter(c => new Date(c.createdAt) > new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)).length}</strong>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <span>This Week:</span>
            <strong>{categories.filter(c => new Date(c.createdAt) > new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)).length}</strong>
          </div>
        </div>

        <div style={{
          background: 'white',
          padding: '20px',
          borderRadius: '10px',
          boxShadow: '0 5px 15px rgba(0, 0, 0, 0.1)'
        }}>
          <h3 style={{ margin: '0 0 15px 0', color: '#333' }}>Quick Actions</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <button
              onClick={() => navigate('/user-management')}
              style={{
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                color: 'white',
                border: 'none',
                padding: '10px',
                borderRadius: '5px',
                cursor: 'pointer',
                fontWeight: '600'
              }}
            >
              Manage Users
            </button>
            <button
              onClick={() => navigate('/category-management')}
              style={{
                background: '#17a2b8',
                color: 'white',
                border: 'none',
                padding: '10px',
                borderRadius: '5px',
                cursor: 'pointer',
                fontWeight: '600'
              }}
            >
              Manage Categories
            </button>
            <button
              onClick={() => navigate('/OrderManagement')}
              style={{
                background: '#28a745',
                color: 'white',
                border: 'none',
                padding: '10px',
                borderRadius: '5px',
                cursor: 'pointer',
                fontWeight: '600'
              }}
            >
              Order Management
            </button>
          </div>
        </div>
      </div>

      <div style={{
        background: 'white',
        padding: '20px',
        borderRadius: '10px',
        boxShadow: '0 5px 15px rgba(0, 0, 0, 0.1)'
      }}>
        <h3 style={{ margin: '0 0 20px 0', color: '#333' }}>Recent Users</h3>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ background: '#f8f9fa' }}>
                <th style={{ padding: '10px', textAlign: 'left', borderBottom: '1px solid #dee2e6' }}>Name</th>
                <th style={{ padding: '10px', textAlign: 'left', borderBottom: '1px solid #dee2e6' }}>Email</th>
                <th style={{ padding: '10px', textAlign: 'left', borderBottom: '1px solid #dee2e6' }}>Role</th>
              </tr>
            </thead>
            <tbody>
              {users.slice(0, 5).map((user) => (
                <tr key={user.id} style={{ borderBottom: '1px solid #dee2e6' }}>
                  <td style={{ padding: '10px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <div style={{
                        width: '30px',
                        height: '30px',
                        borderRadius: '50%',
                        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: 'white',
                        fontWeight: 'bold',
                        fontSize: '14px'
                      }}>
                        {user.name.charAt(0).toUpperCase()}
                      </div>
                      {user.name}
                    </div>
                  </td>
                  <td style={{ padding: '10px' }}>{user.email}</td>
                  <td style={{ padding: '10px' }}>
                    <span style={{
                      background: user.role === 'admin' ? '#dc3545' : '#28a745',
                      color: 'white',
                      padding: '2px 8px',
                      borderRadius: '12px',
                      fontSize: '12px',
                      fontWeight: '600'
                    }}>
                      {user.role}
                    </span>
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
