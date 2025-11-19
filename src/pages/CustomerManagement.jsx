import React, { useState, useEffect } from 'react';
import { useCustomer } from '../context/CustomerContext';
import { 
  FaPlus, 
  FaEdit, 
  FaTrash, 
  FaSearch, 
  FaUser,
  FaCheckCircle,
  FaTimesCircle,
  FaMapMarkerAlt,
  FaPhone,
  FaEnvelope,
  FaCalendarAlt,
  FaDollarSign,
  FaShoppingBag,
  FaStar,
  FaCity,
  FaGenderless
} from 'react-icons/fa';

const CustomerManagement = () => {
  const { customers, loading, error, addCustomer, updateCustomer, deleteCustomer, approveCustomer } = useCustomer();
  const [showModal, setShowModal] = useState(false);
  const [editingCustomer, setEditingCustomer] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('All');
  const [filterCity, setFilterCity] = useState('All');
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    postalCode: '',
    dateOfBirth: '',
    gender: 'Male',
    status: 'approved',
    emergencyContact: '',
    preferences: {
      deliveryTime: 'Evening',
      paymentMethod: 'Cash on Delivery',
      notifications: true
    }
  });

  const statusOptions = ['pending', 'approved', 'Active', 'Inactive'];
  const genderOptions = ['Male', 'Female', 'Other'];
  const cityOptions = ['Lahore', 'Karachi', 'Islamabad', 'Faisalabad', 'Rawalpindi'];
  const deliveryTimeOptions = ['Morning', 'Afternoon', 'Evening'];
  const paymentMethodOptions = ['Cash on Delivery', 'Online Payment', 'Card Payment'];

  const getStatusIcon = (status) => {
    switch (status) {
      case 'approved':
      case 'Active':
        return <FaCheckCircle style={{ color: '#10B981' }} />;
      case 'pending':
        return <FaTimesCircle style={{ color: '#F59E0B' }} />;
      case 'Inactive':
        return <FaTimesCircle style={{ color: '#EF4444' }} />;
      default:
        return <FaCheckCircle style={{ color: '#10B981' }} />;
    }
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    
    if (name.startsWith('preferences.')) {
      const prefKey = name.split('.')[1];
      setFormData(prev => ({
        ...prev,
        preferences: {
          ...prev.preferences,
          [prefKey]: type === 'checkbox' ? checked : value
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: type === 'checkbox' ? checked : value
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (editingCustomer) {
      await updateCustomer(editingCustomer.id || editingCustomer.uid, formData);
    } else {
      await addCustomer(formData);
    }
    
    setFormData({
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      address: '',
      city: '',
      postalCode: '',
      dateOfBirth: '',
      gender: 'Male',
      status: 'approved',
      emergencyContact: '',
      preferences: {
        deliveryTime: 'Evening',
        paymentMethod: 'Cash on Delivery',
        notifications: true
      }
    });
    setShowModal(false);
    setEditingCustomer(null);
  };

  const handleEdit = (customer) => {
    setEditingCustomer(customer);
    setFormData({
      firstName: customer.firstName || '',
      lastName: customer.lastName || '',
      email: customer.email || '',
      phone: customer.phone || '',
      address: customer.address || '',
      city: customer.city || '',
      postalCode: customer.postalCode || '',
      dateOfBirth: customer.dateOfBirth || '',
      gender: customer.gender || 'Male',
      status: customer.status || 'approved',
      emergencyContact: customer.emergencyContact || '',
      preferences: {
        deliveryTime: customer.preferences?.deliveryTime || 'Evening',
        paymentMethod: customer.preferences?.paymentMethod || 'Cash on Delivery',
        notifications: customer.preferences?.notifications !== undefined ? customer.preferences.notifications : true
      }
    });
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this customer?')) {
      await deleteCustomer(id);
    }
  };

  const handleApprove = async (id) => {
    if (window.confirm('Are you sure you want to approve this customer?')) {
      await approveCustomer(id);
    }
  };

  const filteredCustomers = customers.filter(customer => {
    const fullName = `${customer.firstName || ''} ${customer.lastName || ''}`.toLowerCase();
    const matchesSearch = fullName.includes(searchTerm.toLowerCase()) ||
                        (customer.email || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
                        (customer.phone || '').includes(searchTerm) ||
                        (customer.address || '').toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'All' || customer.status === filterStatus;
    const matchesCity = filterCity === 'All' || (customer.city || '') === filterCity;
    
    // Exclude pending customers from main table (they're shown separately)
    return matchesSearch && matchesStatus && matchesCity && customer.status !== 'pending';
  });

  const activeCustomers = customers.filter(c => c.status === 'approved' || c.status === 'Active');
  const totalRevenue = customers.reduce((sum, c) => sum + (c.totalSpent || 0), 0);
  const totalOrders = customers.reduce((sum, c) => sum + (c.totalOrders || 0), 0);
  const topCustomers = customers.sort((a, b) => (b.totalSpent || 0) - (a.totalSpent || 0)).slice(0, 5);
  const pendingCustomers = customers.filter(c => c.status === 'pending');

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '50vh' }}>
        <div>Loading customers...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ padding: '20px' }}>
        <div style={{ 
          background: '#FEE2E2', 
          border: '1px solid #FCA5A5', 
          borderRadius: '8px', 
          padding: '16px',
          color: '#991B1B'
        }}>
          Error: {error}
        </div>
      </div>
    );
  }

  return (
    <div style={{ padding: '20px' }}>
      <div style={{ marginBottom: '30px' }}>
        <h1 style={{ 
          fontSize: '28px', 
          fontWeight: 'bold', 
          color: '#1F2937', 
          marginBottom: '10px' 
        }}>
          Customer Management
        </h1>
        <p style={{ color: '#6B7280', fontSize: '16px' }}>
          Manage customer information, track orders, and analyze customer behavior.
        </p>
      </div>

      {/* Stats Cards */}
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
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div>
              <p style={{ color: '#6B7280', fontSize: '14px', margin: '0 0 5px 0' }}>Total Customers</p>
              <p style={{ fontSize: '24px', fontWeight: 'bold', color: '#1F2937', margin: 0 }}>
                {customers.length}
              </p>
              <p style={{ color: '#10B981', fontSize: '12px', margin: '5px 0 0 0' }}>
                +{Math.floor(customers.length * 0.1)} this month
              </p>
            </div>
            <FaUser style={{ fontSize: '24px', color: '#667eea' }} />
          </div>
        </div>

        <div style={{
          background: 'white',
          padding: '20px',
          borderRadius: '12px',
          boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
          border: '1px solid #E5E7EB'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div>
              <p style={{ color: '#6B7280', fontSize: '14px', margin: '0 0 5px 0' }}>Active Customers</p>
              <p style={{ fontSize: '24px', fontWeight: 'bold', color: '#10B981', margin: 0 }}>
                {activeCustomers.length}
              </p>
              <p style={{ color: '#10B981', fontSize: '12px', margin: '5px 0 0 0' }}>
                {((activeCustomers.length / customers.length) * 100).toFixed(1)}% of total
              </p>
            </div>
            <FaCheckCircle style={{ fontSize: '24px', color: '#10B981' }} />
          </div>
        </div>

        <div style={{
          background: 'white',
          padding: '20px',
          borderRadius: '12px',
          boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
          border: '1px solid #E5E7EB'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div>
              <p style={{ color: '#6B7280', fontSize: '14px', margin: '0 0 5px 0' }}>Total Revenue</p>
              <p style={{ fontSize: '24px', fontWeight: 'bold', color: '#F59E0B', margin: 0 }}>
                Rs. {totalRevenue.toLocaleString()}
              </p>
              <p style={{ color: '#F59E0B', fontSize: '12px', margin: '5px 0 0 0' }}>
                From all customers
              </p>
            </div>
            <FaDollarSign style={{ fontSize: '24px', color: '#F59E0B' }} />
          </div>
        </div>

        <div style={{
          background: 'white',
          padding: '20px',
          borderRadius: '12px',
          boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
          border: '1px solid #E5E7EB'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div>
              <p style={{ color: '#6B7280', fontSize: '14px', margin: '0 0 5px 0' }}>Total Orders</p>
              <p style={{ fontSize: '24px', fontWeight: 'bold', color: '#3B82F6', margin: 0 }}>
                {totalOrders}
              </p>
              <p style={{ color: '#3B82F6', fontSize: '12px', margin: '5px 0 0 0' }}>
                {customers.length > 0 ? (totalOrders / customers.length).toFixed(1) : 0} avg per customer
              </p>
            </div>
            <FaShoppingBag style={{ fontSize: '24px', color: '#3B82F6' }} />
          </div>
        </div>

        <div style={{
          background: 'white',
          padding: '20px',
          borderRadius: '12px',
          boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
          border: '1px solid #E5E7EB'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div>
              <p style={{ color: '#6B7280', fontSize: '14px', margin: '0 0 5px 0' }}>Pending Approval</p>
              <p style={{ fontSize: '24px', fontWeight: 'bold', color: '#F59E0B', margin: 0 }}>
                {pendingCustomers.length}
              </p>
              <p style={{ color: '#F59E0B', fontSize: '12px', margin: '5px 0 0 0' }}>
                Awaiting review
              </p>
            </div>
            <FaTimesCircle style={{ fontSize: '24px', color: '#F59E0B' }} />
          </div>
        </div>
      </div>

      {/* Top Customers */}
      <div style={{
        background: 'white',
        borderRadius: '12px',
        boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
        border: '1px solid #E5E7EB',
        padding: '20px',
        marginBottom: '30px'
      }}>
        <h3 style={{ margin: '0 0 20px 0', color: '#1F2937' }}>Top Customers by Spending</h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '15px' }}>
          {topCustomers.map((customer, index) => {
            const fullName = `${customer.firstName || ''} ${customer.lastName || ''}`.trim() || 'N/A';
            return (
              <div key={customer.id || customer.uid} style={{
              background: '#F9FAFB',
              padding: '15px',
              borderRadius: '8px',
              border: '1px solid #E5E7EB'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '10px' }}>
                <div style={{ 
                  background: '#667eea', 
                  color: 'white', 
                  width: '30px', 
                  height: '30px', 
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '14px',
                  fontWeight: 'bold'
                }}>
                  {index + 1}
                </div>
                <div>
                    <div style={{ fontWeight: '600', color: '#1F2937' }}>{fullName}</div>
                    <div style={{ fontSize: '12px', color: '#6B7280' }}>{customer.city || 'N/A'}</div>
                </div>
              </div>
              <div style={{ fontSize: '14px', color: '#059669', fontWeight: '500' }}>
                  Rs. {(customer.totalSpent || 0).toLocaleString()}
              </div>
              <div style={{ fontSize: '12px', color: '#6B7280' }}>
                  {customer.totalOrders || 0} orders
              </div>
            </div>
            );
          })}
        </div>
      </div>

      {/* Controls */}
      <div style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center', 
        marginBottom: '20px',
        flexWrap: 'wrap',
        gap: '15px'
      }}>
        <div style={{ display: 'flex', gap: '15px', flexWrap: 'wrap' }}>
          <div style={{ position: 'relative' }}>
            <FaSearch style={{ 
              position: 'absolute', 
              left: '12px', 
              top: '50%', 
              transform: 'translateY(-50%)', 
              color: '#9CA3AF' 
            }} />
            <input
              type="text"
              placeholder="Search customers..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{
                padding: '10px 15px 10px 40px',
                border: '1px solid #D1D5DB',
                borderRadius: '8px',
                fontSize: '14px',
                width: '250px'
              }}
            />
          </div>
          
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            style={{
              padding: '10px 15px',
              border: '1px solid #D1D5DB',
              borderRadius: '8px',
              fontSize: '14px',
              background: 'white'
            }}
          >
            <option value="All">All Status</option>
            {statusOptions.map(status => (
              <option key={status} value={status}>{status}</option>
            ))}
          </select>

          <select
            value={filterCity}
            onChange={(e) => setFilterCity(e.target.value)}
            style={{
              padding: '10px 15px',
              border: '1px solid #D1D5DB',
              borderRadius: '8px',
              fontSize: '14px',
              background: 'white'
            }}
          >
            <option value="All">All Cities</option>
            {cityOptions.map(city => (
              <option key={city} value={city}>{city}</option>
            ))}
          </select>
        </div>

        <button
          onClick={() => setShowModal(true)}
          style={{
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            color: 'white',
            border: 'none',
            padding: '12px 24px',
            borderRadius: '8px',
            fontSize: '14px',
            fontWeight: '600',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            transition: 'all 0.3s ease'
          }}
          onMouseOver={(e) => e.target.style.transform = 'translateY(-2px)'}
          onMouseOut={(e) => e.target.style.transform = 'translateY(0)'}
        >
          <FaPlus />
          Add Customer
        </button>
      </div>

      {/* Pending Customers Table */}
      <div style={{
        background: 'white',
        borderRadius: '12px',
        boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
        border: '1px solid #E5E7EB',
        overflow: 'hidden',
        marginBottom: '30px'
      }}>
        <div style={{ padding: '16px', background: '#F9FAFB', borderBottom: '1px solid #E5E7EB' }}>
          <strong style={{ fontSize: '18px', color: '#1F2937' }}>Pending Customer Approvals ({pendingCustomers.length})</strong>
        </div>
        {pendingCustomers.length > 0 ? (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ background: '#F9FAFB', borderBottom: '1px solid #E5E7EB' }}>
                  <th style={{ padding: '16px', textAlign: 'left', fontWeight: '600', color: '#374151' }}>Customer Information</th>
                  <th style={{ padding: '16px', textAlign: 'left', fontWeight: '600', color: '#374151' }}>Contact Details</th>
                  <th style={{ padding: '16px', textAlign: 'left', fontWeight: '600', color: '#374151' }}>Registration Date</th>
                  <th style={{ padding: '16px', textAlign: 'left', fontWeight: '600', color: '#374151' }}>Status</th>
                  <th style={{ padding: '16px', textAlign: 'center', fontWeight: '600', color: '#374151' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {pendingCustomers.map((customer) => (
                  <tr key={customer.id || customer.uid} style={{ borderBottom: '1px solid #F3F4F6' }}>
                    <td style={{ padding: '16px' }}>
                      <div>
                        <div style={{ fontWeight: '600', color: '#1F2937', fontSize: '14px', marginBottom: '4px' }}>
                          {customer.firstName} {customer.lastName}
                        </div>
                        <div style={{ color: '#6B7280', fontSize: '12px', marginBottom: '2px' }}>
                          Email: {customer.email || 'N/A'}
                        </div>
                        {customer.uid && (
                          <div style={{ color: '#9CA3AF', fontSize: '11px', marginTop: '4px' }}>
                            ID: {customer.uid.substring(0, 8)}...
                          </div>
                        )}
                      </div>
                    </td>
                    <td style={{ padding: '16px' }}>
                      <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '4px' }}>
                          <FaPhone style={{ fontSize: '12px', color: '#6B7280' }} />
                          <span style={{ fontSize: '14px', color: '#1F2937' }}>{customer.phone || 'N/A'}</span>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                          <FaEnvelope style={{ fontSize: '12px', color: '#6B7280' }} />
                          <span style={{ fontSize: '12px', color: '#6B7280' }}>{customer.email || 'N/A'}</span>
                        </div>
                      </div>
                    </td>
                    <td style={{ padding: '16px' }}>
                      {customer.createdAt && (
                        <div style={{ color: '#6B7280', fontSize: '14px' }}>
                          {new Date(customer.createdAt).toLocaleDateString()}
                        </div>
                      )}
                    </td>
                    <td style={{ padding: '16px' }}>
                      <span style={{ 
                        fontSize: '14px', 
                        color: '#F59E0B',
                        fontWeight: '500',
                        padding: '4px 8px',
                        background: '#FEF3C7',
                        borderRadius: '4px'
                      }}>
                        Pending
                      </span>
                    </td>
                    <td style={{ padding: '16px', textAlign: 'center' }}>
                      <div style={{ display: 'flex', gap: '8px', justifyContent: 'center', flexWrap: 'wrap' }}>
                        <button
                          onClick={() => handleApprove(customer.id || customer.uid)}
                          style={{ 
                            background: '#10B981', 
                            color: 'white', 
                            border: 'none', 
                            padding: '8px 16px', 
                            borderRadius: '6px', 
                            cursor: 'pointer', 
                            fontSize: '12px', 
                            fontWeight: 600,
                            display: 'flex',
                            alignItems: 'center',
                            gap: '4px',
                            transition: 'all 0.2s'
                          }}
                          onMouseOver={(e) => e.target.style.background = '#059669'}
                          onMouseOut={(e) => e.target.style.background = '#10B981'}
                        >
                          <FaCheckCircle />
                          Approve
                        </button>
                        <button
                          onClick={() => handleEdit(customer)}
                          style={{ 
                            background: '#3B82F6', 
                            color: 'white', 
                            border: 'none', 
                            padding: '8px 16px', 
                            borderRadius: '6px', 
                            cursor: 'pointer', 
                            fontSize: '12px', 
                            fontWeight: 600,
                            display: 'flex',
                            alignItems: 'center',
                            gap: '4px'
                          }}
                        >
                          <FaEdit />
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(customer.id || customer.uid)}
                          style={{ 
                            background: '#EF4444', 
                            color: 'white', 
                            border: 'none', 
                            padding: '8px 16px', 
                            borderRadius: '6px', 
                            cursor: 'pointer', 
                            fontSize: '12px', 
                            fontWeight: 600,
                            display: 'flex',
                            alignItems: 'center',
                            gap: '4px',
                            transition: 'all 0.2s'
                          }}
                          onMouseOver={(e) => e.target.style.background = '#DC2626'}
                          onMouseOut={(e) => e.target.style.background = '#EF4444'}
                        >
                          <FaTrash />
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div style={{ padding: '40px', textAlign: 'center', color: '#6B7280' }}>
            <FaCheckCircle style={{ fontSize: '48px', color: '#10B981', marginBottom: '16px' }} />
            <p style={{ fontSize: '16px', margin: 0 }}>No pending customer approvals</p>
            <p style={{ fontSize: '14px', margin: '8px 0 0 0', color: '#9CA3AF' }}>All customer registrations have been processed</p>
          </div>
        )}
      </div>

      {/* Approved Customers Table */}
      <div style={{
        background: 'white',
        borderRadius: '12px',
        boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
        border: '1px solid #E5E7EB',
        overflow: 'hidden'
      }}>
        <div style={{ padding: '16px', background: '#F9FAFB', borderBottom: '1px solid #E5E7EB' }}>
          <strong style={{ fontSize: '18px', color: '#1F2937' }}>All Customers</strong>
        </div>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ background: '#F9FAFB', borderBottom: '1px solid #E5E7EB' }}>
                <th style={{ padding: '16px', textAlign: 'left', fontWeight: '600', color: '#374151' }}>Customer</th>
                <th style={{ padding: '16px', textAlign: 'left', fontWeight: '600', color: '#374151' }}>Contact</th>
                <th style={{ padding: '16px', textAlign: 'left', fontWeight: '600', color: '#374151' }}>Location</th>
                <th style={{ padding: '16px', textAlign: 'left', fontWeight: '600', color: '#374151' }}>Status</th>
                <th style={{ padding: '16px', textAlign: 'left', fontWeight: '600', color: '#374151' }}>Orders</th>
                <th style={{ padding: '16px', textAlign: 'left', fontWeight: '600', color: '#374151' }}>Total Spent</th>
                <th style={{ padding: '16px', textAlign: 'left', fontWeight: '600', color: '#374151' }}>Last Order</th>
                <th style={{ padding: '16px', textAlign: 'center', fontWeight: '600', color: '#374151' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredCustomers.length > 0 ? (
                filteredCustomers.map((customer) => {
                  const fullName = `${customer.firstName || ''} ${customer.lastName || ''}`.trim() || 'N/A';
                  const initials = fullName !== 'N/A' ? fullName.split(' ').map(n => n[0]).join('').toUpperCase() : '?';
                  return (
                    <tr key={customer.id || customer.uid} style={{ borderBottom: '1px solid #F3F4F6' }}>
                  <td style={{ padding: '16px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <div style={{ 
                        width: '40px', 
                        height: '40px', 
                        background: '#F3F4F6', 
                        borderRadius: '50%',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: '#667eea',
                        fontWeight: 'bold'
                      }}>
                            {initials.substring(0, 2)}
                      </div>
                      <div>
                        <div style={{ fontWeight: '600', color: '#1F2937', fontSize: '14px' }}>
                              {fullName}
                        </div>
                        <div style={{ color: '#6B7280', fontSize: '12px' }}>
                              ID: {(customer.id || customer.uid || '').substring(0, 8)}...
                        </div>
                      </div>
                    </div>
                  </td>
                  <td style={{ padding: '16px' }}>
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '4px' }}>
                        <FaPhone style={{ fontSize: '12px', color: '#6B7280' }} />
                            <span style={{ fontSize: '14px', color: '#1F2937' }}>{customer.phone || 'N/A'}</span>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <FaEnvelope style={{ fontSize: '12px', color: '#6B7280' }} />
                            <span style={{ fontSize: '12px', color: '#6B7280' }}>{customer.email || 'N/A'}</span>
                      </div>
                    </div>
                  </td>
                  <td style={{ padding: '16px' }}>
                    <div>
                          {customer.city && (
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '4px' }}>
                        <FaMapMarkerAlt style={{ fontSize: '12px', color: '#6B7280' }} />
                        <span style={{ fontSize: '14px', color: '#1F2937' }}>{customer.city}</span>
                      </div>
                          )}
                          {customer.address && (
                      <div style={{ fontSize: '12px', color: '#6B7280' }}>
                              {customer.address.length > 30 ? customer.address.substring(0, 30) + '...' : customer.address}
                      </div>
                          )}
                    </div>
                  </td>
                  <td style={{ padding: '16px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      {getStatusIcon(customer.status)}
                          <span style={{ fontSize: '14px', color: '#374151' }}>{customer.status || 'N/A'}</span>
                    </div>
                  </td>
                  <td style={{ padding: '16px', color: '#6B7280', fontSize: '14px' }}>
                        {customer.totalOrders || 0}
                  </td>
                  <td style={{ padding: '16px', color: '#059669', fontSize: '14px', fontWeight: '500' }}>
                        Rs. {(customer.totalSpent || 0).toLocaleString()}
                  </td>
                  <td style={{ padding: '16px', color: '#6B7280', fontSize: '14px' }}>
                    {customer.lastOrderDate || 'N/A'}
                  </td>
                  <td style={{ padding: '16px', textAlign: 'center' }}>
                    <div style={{ display: 'flex', gap: '8px', justifyContent: 'center' }}>
                      <button
                        onClick={() => handleEdit(customer)}
                        style={{
                          background: '#3B82F6',
                          color: 'white',
                          border: 'none',
                          padding: '8px 12px',
                          borderRadius: '6px',
                          cursor: 'pointer',
                          fontSize: '12px',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '4px'
                        }}
                      >
                        <FaEdit />
                        Edit
                      </button>
                      <button
                            onClick={() => handleDelete(customer.id || customer.uid)}
                        style={{
                          background: '#EF4444',
                          color: 'white',
                          border: 'none',
                          padding: '8px 12px',
                          borderRadius: '6px',
                          cursor: 'pointer',
                          fontSize: '12px',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '4px'
                        }}
                      >
                        <FaTrash />
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan="8" style={{ padding: '40px', textAlign: 'center', color: '#6B7280' }}>
                    No customers found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal */}
      {showModal && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0,0,0,0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000
        }}>
          <div style={{
            background: 'white',
            borderRadius: '12px',
            padding: '30px',
            width: '90%',
            maxWidth: '600px',
            maxHeight: '90vh',
            overflowY: 'auto'
          }}>
            <h2 style={{ 
              fontSize: '20px', 
              fontWeight: 'bold', 
              marginBottom: '20px',
              color: '#1F2937'
            }}>
              {editingCustomer ? 'Edit Customer' : 'Add New Customer'}
            </h2>

            <form onSubmit={handleSubmit}>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '20px' }}>
                <div>
                  <label style={{ display: 'block', marginBottom: '5px', fontWeight: '500', color: '#374151' }}>
                    First Name *
                  </label>
                  <input
                    type="text"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleInputChange}
                    required
                    style={{
                      width: '100%',
                      padding: '10px',
                      border: '1px solid #D1D5DB',
                      borderRadius: '6px',
                      fontSize: '14px'
                    }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', marginBottom: '5px', fontWeight: '500', color: '#374151' }}>
                    Last Name *
                  </label>
                  <input
                    type="text"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleInputChange}
                    required
                    style={{
                      width: '100%',
                      padding: '10px',
                      border: '1px solid #D1D5DB',
                      borderRadius: '6px',
                      fontSize: '14px'
                    }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', marginBottom: '5px', fontWeight: '500', color: '#374151' }}>
                    Email *
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                    style={{
                      width: '100%',
                      padding: '10px',
                      border: '1px solid #D1D5DB',
                      borderRadius: '6px',
                      fontSize: '14px'
                    }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', marginBottom: '5px', fontWeight: '500', color: '#374151' }}>
                    Phone Number *
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    required
                    style={{
                      width: '100%',
                      padding: '10px',
                      border: '1px solid #D1D5DB',
                      borderRadius: '6px',
                      fontSize: '14px'
                    }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', marginBottom: '5px', fontWeight: '500', color: '#374151' }}>
                    Gender *
                  </label>
                  <select
                    name="gender"
                    value={formData.gender}
                    onChange={handleInputChange}
                    required
                    style={{
                      width: '100%',
                      padding: '10px',
                      border: '1px solid #D1D5DB',
                      borderRadius: '6px',
                      fontSize: '14px'
                    }}
                  >
                    {genderOptions.map(gender => (
                      <option key={gender} value={gender}>{gender}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label style={{ display: 'block', marginBottom: '5px', fontWeight: '500', color: '#374151' }}>
                    Date of Birth
                  </label>
                  <input
                    type="date"
                    name="dateOfBirth"
                    value={formData.dateOfBirth}
                    onChange={handleInputChange}
                    style={{
                      width: '100%',
                      padding: '10px',
                      border: '1px solid #D1D5DB',
                      borderRadius: '6px',
                      fontSize: '14px'
                    }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', marginBottom: '5px', fontWeight: '500', color: '#374151' }}>
                    City *
                  </label>
                  <select
                    name="city"
                    value={formData.city}
                    onChange={handleInputChange}
                    required
                    style={{
                      width: '100%',
                      padding: '10px',
                      border: '1px solid #D1D5DB',
                      borderRadius: '6px',
                      fontSize: '14px'
                    }}
                  >
                    <option value="">Select City</option>
                    {cityOptions.map(city => (
                      <option key={city} value={city}>{city}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label style={{ display: 'block', marginBottom: '5px', fontWeight: '500', color: '#374151' }}>
                    Postal Code
                  </label>
                  <input
                    type="text"
                    name="postalCode"
                    value={formData.postalCode}
                    onChange={handleInputChange}
                    style={{
                      width: '100%',
                      padding: '10px',
                      border: '1px solid #D1D5DB',
                      borderRadius: '6px',
                      fontSize: '14px'
                    }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', marginBottom: '5px', fontWeight: '500', color: '#374151' }}>
                    Status *
                  </label>
                  <select
                    name="status"
                    value={formData.status}
                    onChange={handleInputChange}
                    required
                    style={{
                      width: '100%',
                      padding: '10px',
                      border: '1px solid #D1D5DB',
                      borderRadius: '6px',
                      fontSize: '14px'
                    }}
                  >
                    {statusOptions.map(status => (
                      <option key={status} value={status}>{status}</option>
                    ))}
                  </select>
                </div>

                <div style={{ gridColumn: '1 / -1' }}>
                  <label style={{ display: 'block', marginBottom: '5px', fontWeight: '500', color: '#374151' }}>
                    Address *
                  </label>
                  <textarea
                    name="address"
                    value={formData.address}
                    onChange={handleInputChange}
                    required
                    rows="3"
                    style={{
                      width: '100%',
                      padding: '10px',
                      border: '1px solid #D1D5DB',
                      borderRadius: '6px',
                      fontSize: '14px',
                      resize: 'vertical'
                    }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', marginBottom: '5px', fontWeight: '500', color: '#374151' }}>
                    Emergency Contact
                  </label>
                  <input
                    type="tel"
                    name="emergencyContact"
                    value={formData.emergencyContact}
                    onChange={handleInputChange}
                    style={{
                      width: '100%',
                      padding: '10px',
                      border: '1px solid #D1D5DB',
                      borderRadius: '6px',
                      fontSize: '14px'
                    }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', marginBottom: '5px', fontWeight: '500', color: '#374151' }}>
                    Preferred Delivery Time
                  </label>
                  <select
                    name="preferences.deliveryTime"
                    value={formData.preferences.deliveryTime}
                    onChange={handleInputChange}
                    style={{
                      width: '100%',
                      padding: '10px',
                      border: '1px solid #D1D5DB',
                      borderRadius: '6px',
                      fontSize: '14px'
                    }}
                  >
                    {deliveryTimeOptions.map(time => (
                      <option key={time} value={time}>{time}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label style={{ display: 'block', marginBottom: '5px', fontWeight: '500', color: '#374151' }}>
                    Preferred Payment Method
                  </label>
                  <select
                    name="preferences.paymentMethod"
                    value={formData.preferences.paymentMethod}
                    onChange={handleInputChange}
                    style={{
                      width: '100%',
                      padding: '10px',
                      border: '1px solid #D1D5DB',
                      borderRadius: '6px',
                      fontSize: '14px'
                    }}
                  >
                    {paymentMethodOptions.map(method => (
                      <option key={method} value={method}>{method}</option>
                    ))}
                  </select>
                </div>

                <div style={{ gridColumn: '1 / -1' }}>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontWeight: '500', color: '#374151' }}>
                    <input
                      type="checkbox"
                      name="preferences.notifications"
                      checked={formData.preferences.notifications}
                      onChange={handleInputChange}
                      style={{ margin: 0 }}
                    />
                    Enable Notifications
                  </label>
                </div>
              </div>

              <div style={{ 
                display: 'flex', 
                gap: '15px', 
                justifyContent: 'flex-end', 
                marginTop: '30px' 
              }}>
                <button
                  type="button"
                  onClick={() => {
                    setShowModal(false);
                    setEditingCustomer(null);
                    setFormData({
                      firstName: '',
                      lastName: '',
                      email: '',
                      phone: '',
                      address: '',
                      city: '',
                      postalCode: '',
                      dateOfBirth: '',
                      gender: 'Male',
                      status: 'approved',
                      emergencyContact: '',
                      preferences: {
                        deliveryTime: 'Evening',
                        paymentMethod: 'Cash on Delivery',
                        notifications: true
                      }
                    });
                  }}
                  style={{
                    padding: '12px 24px',
                    border: '1px solid #D1D5DB',
                    background: 'white',
                    color: '#374151',
                    borderRadius: '6px',
                    cursor: 'pointer',
                    fontSize: '14px',
                    fontWeight: '500'
                  }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  style={{
                    padding: '12px 24px',
                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                    color: 'white',
                    border: 'none',
                    borderRadius: '6px',
                    cursor: 'pointer',
                    fontSize: '14px',
                    fontWeight: '500'
                  }}
                >
                  {editingCustomer ? 'Update Customer' : 'Add Customer'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default CustomerManagement;

