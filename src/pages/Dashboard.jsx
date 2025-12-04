import React from 'react';
import { useAuth } from '../context/AuthContext';
import { useCategory } from '../context/CategoryContext';
import { useNavigate } from 'react-router-dom';

export default function Dashboard() {
  const { user, logout } = useAuth();
  const { categories } = useCategory();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  // Static statistics
  const staticStats = {
    totalUsers: 1250,
    totalRiders: 320,
    totalCustomers: 850,
    totalAdmins: 15,
    totalCategories: categories.length || 12,
    activeOrders: 45,
    pendingOrders: 12
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
          <h1 style={{ margin: 0, color: '#1F2937', fontSize: '28px', fontWeight: 'bold' }}>Welcome, {user?.name || 'Admin'}!</h1>
          <p style={{ margin: '5px 0 0 0', color: '#6B7280', fontSize: '16px' }}>
            Role: <span style={{
              background: user?.role === 'admin' ? '#EF4444' : '#10B981',
              color: 'white',
              padding: '4px 12px',
              borderRadius: '6px',
              fontSize: '12px',
              fontWeight: '600'
            }}>{user?.role || 'Admin'}</span>
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
            <strong style={{ color: '#1F2937' }}>{staticStats.totalUsers}</strong>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
            <span style={{ color: '#6B7280' }}>Riders:</span>
            <strong style={{ color: '#3B82F6' }}>{staticStats.totalRiders}</strong>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
            <span style={{ color: '#6B7280' }}>Customers:</span>
            <strong style={{ color: '#10B981' }}>{staticStats.totalCustomers}</strong>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <span style={{ color: '#6B7280' }}>Admins:</span>
            <strong style={{ color: '#EF4444' }}>{staticStats.totalAdmins}</strong>
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
            <strong style={{ color: '#1F2937' }}>{staticStats.totalCategories}</strong>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
            <span style={{ color: '#6B7280' }}>Active Orders:</span>
            <strong style={{ color: '#F59E0B' }}>{staticStats.activeOrders}</strong>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <span style={{ color: '#6B7280' }}>Pending Orders:</span>
            <strong style={{ color: '#EF4444' }}>{staticStats.pendingOrders}</strong>
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
          </div>
        </div>
      </div>
    </div>
  );
}
