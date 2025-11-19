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
        borderRadius: '12px',
        boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
        border: '1px solid #E5E7EB'
      }}>
        <div>
          <h1 style={{ margin: 0, color: '#1F2937', fontSize: '28px', fontWeight: 'bold' }}>Welcome, {user?.name}!</h1>
          <p style={{ margin: '5px 0 0 0', color: '#6B7280', fontSize: '16px' }}>
            Role: <span style={{
              background: user?.role === 'admin' ? '#EF4444' : '#10B981',
              color: 'white',
              padding: '4px 12px',
              borderRadius: '6px',
              fontSize: '12px',
              fontWeight: '600'
            }}>{user?.role}</span>
          </p>
        </div>
        <button
          onClick={handleLogout}
          style={{
            background: '#EF4444',
            color: 'white',
            border: 'none',
            padding: '12px 24px',
            borderRadius: '8px',
            cursor: 'pointer',
            fontWeight: '600',
            transition: 'all 0.3s ease'
          }}
          onMouseOver={(e) => e.target.style.background = '#DC2626'}
          onMouseOut={(e) => e.target.style.background = '#EF4444'}
        >
          Logout
        </button>
      </div>

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
        gap: '20px',
        marginBottom: '30px'
      }}>
        <div style={{
          background: 'white',
          padding: '20px',
          borderRadius: '12px',
          boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
          border: '1px solid #E5E7EB'
        }}>
          <h3 style={{ margin: '0 0 15px 0', color: '#1F2937', fontWeight: '600' }}>User Statistics</h3>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
            <span style={{ color: '#6B7280' }}>Total Users:</span>
            <strong style={{ color: '#1F2937' }}>{users.length}</strong>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
            <span style={{ color: '#6B7280' }}>Admins:</span>
            <strong style={{ color: '#EF4444' }}>{users.filter(u => u.role === 'admin').length}</strong>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <span style={{ color: '#6B7280' }}>Regular Users:</span>
            <strong style={{ color: '#10B981' }}>{users.filter(u => u.role === 'user').length}</strong>
          </div>
        </div>

        <div style={{
          background: 'white',
          padding: '20px',
          borderRadius: '12px',
          boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
          border: '1px solid #E5E7EB'
        }}>
          <h3 style={{ margin: '0 0 15px 0', color: '#1F2937', fontWeight: '600' }}>Category Statistics</h3>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
            <span style={{ color: '#6B7280' }}>Total Categories:</span>
            <strong style={{ color: '#1F2937' }}>{categories.length}</strong>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
            <span style={{ color: '#6B7280' }}>Recently Added:</span>
            <strong style={{ color: '#F59E0B' }}>{categories.filter(c => new Date(c.createdAt) > new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)).length}</strong>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <span style={{ color: '#6B7280' }}>This Week:</span>
            <strong style={{ color: '#3B82F6' }}>{categories.filter(c => new Date(c.createdAt) > new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)).length}</strong>
          </div>
        </div>

        <div style={{
          background: 'white',
          padding: '20px',
          borderRadius: '12px',
          boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
          border: '1px solid #E5E7EB'
        }}>
          <h3 style={{ margin: '0 0 15px 0', color: '#1F2937', fontWeight: '600' }}>Quick Actions</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <button
              onClick={() => navigate('/user-management')}
              style={{
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                color: 'white',
                border: 'none',
                padding: '12px 16px',
                borderRadius: '8px',
                cursor: 'pointer',
                fontWeight: '600',
                transition: 'all 0.3s ease'
              }}
              onMouseOver={(e) => e.target.style.transform = 'translateY(-2px)'}
              onMouseOut={(e) => e.target.style.transform = 'translateY(0)'}
            >
              Manage Users
            </button>
            <button
              onClick={() => navigate('/category-management')}
              style={{
                background: '#3B82F6',
                color: 'white',
                border: 'none',
                padding: '12px 16px',
                borderRadius: '8px',
                cursor: 'pointer',
                fontWeight: '600',
                transition: 'all 0.3s ease'
              }}
              onMouseOver={(e) => e.target.style.background = '#2563EB'}
              onMouseOut={(e) => e.target.style.background = '#3B82F6'}
            >
              Manage Categories
            </button>
            <button
              onClick={() => navigate('/OrderManagement')}
              style={{
                background: '#10B981',
                color: 'white',
                border: 'none',
                padding: '12px 16px',
                borderRadius: '8px',
                cursor: 'pointer',
                fontWeight: '600',
                transition: 'all 0.3s ease'
              }}
              onMouseOver={(e) => e.target.style.background = '#059669'}
              onMouseOut={(e) => e.target.style.background = '#10B981'}
            >
              Order Management
            </button>
          </div>
        </div>
      </div>

      <div style={{
        background: 'white',
        padding: '20px',
        borderRadius: '12px',
        boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
        border: '1px solid #E5E7EB'
      }}>
        <h3 style={{ margin: '0 0 20px 0', color: '#1F2937', fontWeight: '600' }}>Recent Users</h3>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ background: '#F9FAFB', borderBottom: '1px solid #E5E7EB' }}>
                <th style={{ padding: '16px', textAlign: 'left', fontWeight: '600', color: '#374151' }}>Name</th>
                <th style={{ padding: '16px', textAlign: 'left', fontWeight: '600', color: '#374151' }}>Email</th>
                <th style={{ padding: '16px', textAlign: 'left', fontWeight: '600', color: '#374151' }}>Role</th>
              </tr>
            </thead>
            <tbody>
              {users.slice(0, 5).map((user) => (
                <tr key={user.id} style={{ borderBottom: '1px solid #F3F4F6' }}>
                  <td style={{ padding: '16px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
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
                      <span style={{ color: '#1F2937', fontWeight: '500' }}>{user.name}</span>
                    </div>
                  </td>
                  <td style={{ padding: '16px', color: '#6B7280', fontSize: '14px' }}>{user.email}</td>
                  <td style={{ padding: '16px' }}>
                    <span style={{
                      background: user.role === 'admin' ? '#FEE2E2' : '#DCFCE7',
                      color: user.role === 'admin' ? '#991B1B' : '#166534',
                      padding: '4px 12px',
                      borderRadius: '6px',
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
