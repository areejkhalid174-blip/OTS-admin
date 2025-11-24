import React, { useState, useEffect } from 'react';
import { getAllData, updateData } from '../Helper/firebaseHelper';
import { 
  FaPlus, 
  FaEdit, 
  FaTrash, 
  FaSearch, 
  FaShoppingCart,
  FaCheckCircle,
  FaExclamationTriangle,
  FaTimesCircle,
  FaClock,
  FaMapMarkerAlt,
  FaUser,
  FaPhone,
  FaDollarSign,
  FaMotorcycle,
  FaCar,
  FaTruck,
  FaBicycle,
  FaStar,
  FaCalendarAlt,
  FaCreditCard,
  FaBox,
  FaWeight,
  FaImage,
  FaShippingFast
} from 'react-icons/fa';

const OrderPlacement = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [riders, setRiders] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editingOrder, setEditingOrder] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('All');
  const [assignModalOrder, setAssignModalOrder] = useState(null);
  const [selectedRiderId, setSelectedRiderId] = useState(null);
  const [assignLoading, setAssignLoading] = useState(false);
  const [viewDetails, setViewDetails] = useState(null);

  // Fetch orders from Firebase
  const fetchOrders = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getAllData("orders");
      setOrders(data || []);
    } catch (err) {
      console.error("Error fetching orders:", err);
      setError("Failed to fetch orders");
      setOrders([]);
    } finally {
      setLoading(false);
    }
  };

  // Fetch riders from users collection
  const fetchRiders = async () => {
    try {
      const users = await getAllData('users');
      if (Array.isArray(users)) {
        const onlyRiders = users.filter(u => 
          (u.role || '').toLowerCase() === 'rider'
        );
        setRiders(onlyRiders);
      } else {
        setRiders([]);
      }
    } catch (err) {
      console.error('Error fetching riders:', err);
      setRiders([]);
    }
  };

  useEffect(() => {
    fetchOrders();
    fetchRiders();
  }, []);

  const getStatusIcon = (status) => {
    const statusLower = (status || '').toLowerCase();
    switch (statusLower) {
      case 'pending':
        return <FaClock style={{ color: '#F59E0B' }} />;
      case 'assigned':
        return <FaUser style={{ color: '#3B82F6' }} />;
      case 'in-progress':
      case 'in progress':
        return <FaExclamationTriangle style={{ color: '#8B5CF6' }} />;
      case 'delivered':
        return <FaCheckCircle style={{ color: '#10B981' }} />;
      case 'cancelled':
        return <FaTimesCircle style={{ color: '#EF4444' }} />;
      default:
        return <FaClock style={{ color: '#F59E0B' }} />;
    }
  };

  const getStatusColor = (status) => {
    const statusLower = (status || '').toLowerCase();
    switch (statusLower) {
      case 'pending':
        return '#F59E0B';
      case 'assigned':
        return '#3B82F6';
      case 'in-progress':
      case 'in progress':
        return '#8B5CF6';
      case 'delivered':
        return '#10B981';
      case 'cancelled':
        return '#EF4444';
      default:
        return '#6B7280';
    }
  };

  // Assign rider handlers
  const openAssignModal = (order) => {
    setAssignModalOrder(order);
    setSelectedRiderId(order?.riderId || order?.riderUid || null);
  };

  const closeAssignModal = () => {
    setAssignModalOrder(null);
    setSelectedRiderId(null);
  };

  const saveAssignModal = async () => {
    if (!assignModalOrder) return;
    if (!selectedRiderId) {
      alert('Please select a rider');
      return;
    }
    setAssignLoading(true);
    try {
      const rider = riders.find(r => r.id === selectedRiderId || r.uid === selectedRiderId) || null;
      const riderName = rider?.firstName ? `${rider.firstName} ${rider.lastName || ''}`.trim() : (rider?.name || '');
      const riderPhone = rider?.phone || '';
      const riderEmail = rider?.email || '';

      await updateData('orders', assignModalOrder.id, {
        riderId: selectedRiderId,
        riderUid: selectedRiderId,
        riderName: riderName || null,
        riderPhone: riderPhone || null,
        riderEmail: riderEmail || null,
        status: assignModalOrder.status === 'pending' ? 'assigned' : assignModalOrder.status,
        updatedAt: new Date().toISOString()
      });

      await fetchOrders();
      closeAssignModal();
      alert("Rider assigned successfully!");
    } catch (err) {
      console.error('Error assigning rider:', err);
      alert('Failed to assign rider');
    } finally {
      setAssignLoading(false);
    }
  };

  const handleStatusUpdate = async (orderId, newStatus) => {
    try {
      await updateData('orders', orderId, { 
        status: newStatus, 
        updatedAt: new Date().toISOString() 
      });
      await fetchOrders();
      alert("Order status updated successfully!");
    } catch (err) {
      console.error('Error updating status:', err);
      alert('Failed to update status');
    }
  };

  const filteredOrders = orders.filter(order => {
    const matchesSearch = 
      (order.customerName || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (order.customerEmail || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (order.pickupLocation || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (order.dropLocation || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (order.id || '').toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'All' || (order.status || '').toLowerCase() === filterStatus.toLowerCase();
    
    return matchesSearch && matchesStatus;
  });

  const stats = {
    totalOrders: orders.length,
    pendingOrders: orders.filter(o => (o.status || '').toLowerCase() === 'pending').length,
    assignedOrders: orders.filter(o => (o.status || '').toLowerCase() === 'assigned').length,
    deliveredOrders: orders.filter(o => (o.status || '').toLowerCase() === 'delivered').length,
    inProgressOrders: orders.filter(o => (o.status || '').toLowerCase() === 'in-progress' || (o.status || '').toLowerCase() === 'in progress').length
  };

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '50vh' }}>
        <div>Loading orders...</div>
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
          Order Management
        </h1>
        <p style={{ color: '#6B7280', fontSize: '16px' }}>
          View all orders, assign riders, and manage the complete order lifecycle.
        </p>
      </div>

      {/* Stats Cards */}
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', 
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
              <p style={{ color: '#6B7280', fontSize: '14px', margin: '0 0 5px 0' }}>Total Orders</p>
              <p style={{ fontSize: '24px', fontWeight: 'bold', color: '#1F2937', margin: 0 }}>
                {stats.totalOrders}
              </p>
            </div>
            <FaShoppingCart style={{ fontSize: '24px', color: '#667eea' }} />
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
              <p style={{ color: '#6B7280', fontSize: '14px', margin: '0 0 5px 0' }}>Pending Orders</p>
              <p style={{ fontSize: '24px', fontWeight: 'bold', color: '#F59E0B', margin: 0 }}>
                {stats.pendingOrders}
              </p>
              <p style={{ color: '#F59E0B', fontSize: '12px', margin: '5px 0 0 0' }}>
                Need assignment
              </p>
            </div>
            <FaClock style={{ fontSize: '24px', color: '#F59E0B' }} />
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
              <p style={{ color: '#6B7280', fontSize: '14px', margin: '0 0 5px 0' }}>Assigned</p>
              <p style={{ fontSize: '24px', fontWeight: 'bold', color: '#3B82F6', margin: 0 }}>
                {stats.assignedOrders}
              </p>
            </div>
            <FaUser style={{ fontSize: '24px', color: '#3B82F6' }} />
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
              <p style={{ color: '#6B7280', fontSize: '14px', margin: '0 0 5px 0' }}>Delivered</p>
              <p style={{ fontSize: '24px', fontWeight: 'bold', color: '#10B981', margin: 0 }}>
                {stats.deliveredOrders}
              </p>
            </div>
            <FaCheckCircle style={{ fontSize: '24px', color: '#10B981' }} />
          </div>
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
              placeholder="Search orders..."
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
            <option value="pending">Pending</option>
            <option value="assigned">Assigned</option>
            <option value="in-progress">In Progress</option>
            <option value="delivered">Delivered</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </div>
      </div>

      {/* Orders Table */}
      <div style={{
        background: 'white',
        borderRadius: '12px',
        boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
        border: '1px solid #E5E7EB',
        overflow: 'hidden'
      }}>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ background: '#F9FAFB', borderBottom: '1px solid #E5E7EB' }}>
                <th style={{ padding: '16px', textAlign: 'left', fontWeight: '600', color: '#374151' }}>Order ID</th>
                <th style={{ padding: '16px', textAlign: 'left', fontWeight: '600', color: '#374151' }}>Customer</th>
                <th style={{ padding: '16px', textAlign: 'left', fontWeight: '600', color: '#374151' }}>Route</th>
                <th style={{ padding: '16px', textAlign: 'left', fontWeight: '600', color: '#374151' }}>Package Details</th>
                <th style={{ padding: '16px', textAlign: 'left', fontWeight: '600', color: '#374151' }}>Status</th>
                <th style={{ padding: '16px', textAlign: 'left', fontWeight: '600', color: '#374151' }}>Rider</th>
                <th style={{ padding: '16px', textAlign: 'left', fontWeight: '600', color: '#374151' }}>Date</th>
                <th style={{ padding: '16px', textAlign: 'center', fontWeight: '600', color: '#374151' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredOrders.length > 0 ? (
                filteredOrders.map((order) => (
                  <tr key={order.id} style={{ borderBottom: '1px solid #F3F4F6' }}>
                    <td style={{ padding: '16px' }}>
                      <div style={{ fontWeight: '600', color: '#1F2937', fontSize: '14px' }}>
                        {order.id?.substring(0, 12)}...
                      </div>
                      {order.createdAt && (
                        <div style={{ color: '#9CA3AF', fontSize: '11px', marginTop: '4px' }}>
                          {new Date(order.createdAt).toLocaleDateString()}
                        </div>
                      )}
                    </td>
                    <td style={{ padding: '16px' }}>
                      <div>
                        <div style={{ fontWeight: '500', color: '#1F2937', fontSize: '14px', marginBottom: '4px' }}>
                          {order.customerName || 'N/A'}
                        </div>
                        <div style={{ color: '#6B7280', fontSize: '12px' }}>
                          {order.customerEmail || 'N/A'}
                        </div>
                        {order.userId && (
                          <div style={{ color: '#9CA3AF', fontSize: '11px', marginTop: '2px' }}>
                            ID: {order.userId.substring(0, 8)}...
                          </div>
                        )}
                      </div>
                    </td>
                    <td style={{ padding: '16px' }}>
                      <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '4px' }}>
                          <FaMapMarkerAlt style={{ fontSize: '12px', color: '#10B981' }} />
                          <span style={{ fontSize: '12px', color: '#6B7280' }}>Pickup: {order.pickupLocation || 'N/A'}</span>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                          <FaMapMarkerAlt style={{ fontSize: '12px', color: '#EF4444' }} />
                          <span style={{ fontSize: '12px', color: '#6B7280' }}>Drop: {order.dropLocation || 'N/A'}</span>
                        </div>
                      </div>
                    </td>
                    <td style={{ padding: '16px' }}>
                      <div>
                        <div style={{ fontSize: '12px', color: '#6B7280', marginBottom: '2px' }}>
                          <FaBox style={{ display: 'inline', marginRight: '4px' }} />
                          Type: {order.packageType || 'N/A'}
                        </div>
                        <div style={{ fontSize: '12px', color: '#6B7280', marginBottom: '2px' }}>
                          <FaWeight style={{ display: 'inline', marginRight: '4px' }} />
                          Weight: {order.weight || 'N/A'} kg
                        </div>
                        <div style={{ fontSize: '12px', color: '#6B7280' }}>
                          Category: {order.categoryName || 'N/A'}
                        </div>
                        {order.packagePhoto && (
                          <div style={{ marginTop: '4px' }}>
                            <FaImage style={{ fontSize: '12px', color: '#3B82F6' }} />
                            <span style={{ fontSize: '11px', color: '#3B82F6', marginLeft: '4px' }}>Photo</span>
                          </div>
                        )}
                      </div>
                    </td>
                    <td style={{ padding: '16px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        {getStatusIcon(order.status)}
                        <span style={{ 
                          fontSize: '14px', 
                          color: getStatusColor(order.status),
                          fontWeight: '500',
                          textTransform: 'capitalize'
                        }}>
                          {order.status || 'pending'}
                        </span>
                      </div>
                    </td>
                    <td style={{ padding: '16px' }}>
                      {order.riderName ? (
                        <div>
                          <div style={{ fontWeight: '500', color: '#1F2937', fontSize: '14px' }}>
                            {order.riderName}
                          </div>
                          {order.riderPhone && (
                            <div style={{ color: '#6B7280', fontSize: '12px' }}>
                              {order.riderPhone}
                            </div>
                          )}
                        </div>
                      ) : (
                        <div style={{ color: '#9CA3AF', fontSize: '12px', fontStyle: 'italic' }}>
                          Not assigned
                        </div>
                      )}
                    </td>
                    <td style={{ padding: '16px', color: '#6B7280', fontSize: '14px' }}>
                      {order.createdAt ? new Date(order.createdAt).toLocaleDateString() : 'N/A'}
                    </td>
                    <td style={{ padding: '16px', textAlign: 'center' }}>
                      <div style={{ display: 'flex', gap: '6px', justifyContent: 'center', flexWrap: 'wrap' }}>
                        <button
                          onClick={() => setViewDetails(order)}
                          style={{ 
                            background: '#3B82F6', 
                            color: 'white', 
                            border: 'none', 
                            padding: '6px 10px', 
                            borderRadius: '6px', 
                            cursor: 'pointer', 
                            fontSize: '11px', 
                            fontWeight: 600
                          }}
                        >
                          View
                        </button>
                        {(order.status === 'pending' || order.status === 'assigned') && (
                          <button
                            onClick={() => openAssignModal(order)}
                            style={{ 
                              background: '#8B5CF6', 
                              color: 'white', 
                              border: 'none', 
                              padding: '6px 10px', 
                              borderRadius: '6px', 
                              cursor: 'pointer', 
                              fontSize: '11px', 
                              fontWeight: 600
                            }}
                          >
                            {order.riderName ? 'Reassign' : 'Assign'}
                          </button>
                        )}
                        {order.status !== 'delivered' && order.status !== 'cancelled' && (
                          <button
                            onClick={() => handleStatusUpdate(order.id, 'delivered')}
                            style={{ 
                              background: '#10B981', 
                              color: 'white', 
                              border: 'none', 
                              padding: '6px 10px', 
                              borderRadius: '6px', 
                              cursor: 'pointer', 
                              fontSize: '11px', 
                              fontWeight: 600
                            }}
                          >
                            Complete
                          </button>
                        )}
                        {order.status !== 'delivered' && order.status !== 'cancelled' && (
                          <button
                            onClick={() => handleStatusUpdate(order.id, 'cancelled')}
                            style={{ 
                              background: '#EF4444', 
                              color: 'white', 
                              border: 'none', 
                              padding: '6px 10px', 
                              borderRadius: '6px', 
                              cursor: 'pointer', 
                              fontSize: '11px', 
                              fontWeight: 600
                            }}
                          >
                            Cancel
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="8" style={{ padding: '40px', textAlign: 'center', color: '#6B7280' }}>
                    No orders found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* View Details Modal */}
      {viewDetails && (
        <div style={{ 
          position: 'fixed', 
          inset: 0, 
          background: 'rgba(0,0,0,0.5)', 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center',
          zIndex: 1000,
          padding: '20px'
        }}
        onClick={() => setViewDetails(null)}
        >
          <div 
            style={{ 
              background: 'white', 
              padding: '30px', 
              borderRadius: '12px', 
              width: '100%', 
              maxWidth: '900px',
              maxHeight: '90vh',
              overflowY: 'auto',
              boxShadow: '0 10px 25px rgba(0,0,0,0.2)'
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <h2 style={{ fontSize: '24px', fontWeight: 'bold', color: '#1F2937', margin: 0 }}>Order Details</h2>
              <button 
                onClick={() => setViewDetails(null)}
                style={{ 
                  background: 'transparent', 
                  border: 'none', 
                  fontSize: '24px', 
                  cursor: 'pointer',
                  color: '#6B7280'
                }}
              >
                ×
              </button>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '20px' }}>
              {/* Order Info */}
              <div style={{ background: '#F9FAFB', padding: '16px', borderRadius: '8px' }}>
                <h3 style={{ fontSize: '16px', fontWeight: '600', color: '#1F2937', marginBottom: '12px' }}>Order Information</h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  <div>
                    <span style={{ color: '#6B7280', fontSize: '14px' }}>Order ID: </span>
                    <span style={{ color: '#1F2937', fontSize: '14px', fontWeight: '500' }}>{viewDetails.id}</span>
                  </div>
                  <div>
                    <span style={{ color: '#6B7280', fontSize: '14px' }}>Status: </span>
                    <span style={{ 
                      color: getStatusColor(viewDetails.status),
                      fontSize: '14px',
                      fontWeight: '500',
                      textTransform: 'capitalize'
                    }}>
                      {viewDetails.status || 'pending'}
                    </span>
                  </div>
                  {viewDetails.createdAt && (
                    <div>
                      <span style={{ color: '#6B7280', fontSize: '14px' }}>Created: </span>
                      <span style={{ color: '#1F2937', fontSize: '14px' }}>{new Date(viewDetails.createdAt).toLocaleString()}</span>
                    </div>
                  )}
                  {viewDetails.updatedAt && (
                    <div>
                      <span style={{ color: '#6B7280', fontSize: '14px' }}>Updated: </span>
                      <span style={{ color: '#1F2937', fontSize: '14px' }}>{new Date(viewDetails.updatedAt).toLocaleString()}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Package Info */}
              <div style={{ background: '#F9FAFB', padding: '16px', borderRadius: '8px' }}>
                <h3 style={{ fontSize: '16px', fontWeight: '600', color: '#1F2937', marginBottom: '12px' }}>Package Details</h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  <div>
                    <span style={{ color: '#6B7280', fontSize: '14px' }}>Category: </span>
                    <span style={{ color: '#1F2937', fontSize: '14px', fontWeight: '500' }}>{viewDetails.categoryName || 'N/A'}</span>
                  </div>
                  <div>
                    <span style={{ color: '#6B7280', fontSize: '14px' }}>Type: </span>
                    <span style={{ color: '#1F2937', fontSize: '14px', fontWeight: '500' }}>{viewDetails.packageType || 'N/A'}</span>
                  </div>
                  <div>
                    <span style={{ color: '#6B7280', fontSize: '14px' }}>Weight: </span>
                    <span style={{ color: '#1F2937', fontSize: '14px' }}>{viewDetails.weight || 'N/A'} kg</span>
                  </div>
                  {viewDetails.packagePhoto && (
                    <div style={{ marginTop: '8px' }}>
                      <div style={{ fontSize: '12px', color: '#6B7280', marginBottom: '4px' }}>Package Photo:</div>
                      <img 
                        src={viewDetails.packagePhoto} 
                        alt="Package" 
                        style={{ 
                          width: '100%', 
                          maxHeight: '150px', 
                          objectFit: 'cover', 
                          borderRadius: '8px',
                          border: '1px solid #E5E7EB'
                        }} 
                      />
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '20px' }}>
              {/* Customer Info */}
              <div style={{ background: '#F9FAFB', padding: '16px', borderRadius: '8px' }}>
                <h3 style={{ fontSize: '16px', fontWeight: '600', color: '#1F2937', marginBottom: '12px' }}>Customer Information</h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  <div>
                    <span style={{ color: '#6B7280', fontSize: '14px' }}>Name: </span>
                    <span style={{ color: '#1F2937', fontSize: '14px', fontWeight: '500' }}>{viewDetails.customerName || 'N/A'}</span>
                  </div>
                  <div>
                    <span style={{ color: '#6B7280', fontSize: '14px' }}>Email: </span>
                    <span style={{ color: '#1F2937', fontSize: '14px' }}>{viewDetails.customerEmail || 'N/A'}</span>
                  </div>
                  {viewDetails.userId && (
                    <div>
                      <span style={{ color: '#6B7280', fontSize: '14px' }}>User ID: </span>
                      <span style={{ color: '#1F2937', fontSize: '14px' }}>{viewDetails.userId}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Rider Info */}
              <div style={{ background: '#F9FAFB', padding: '16px', borderRadius: '8px' }}>
                <h3 style={{ fontSize: '16px', fontWeight: '600', color: '#1F2937', marginBottom: '12px' }}>Rider Information</h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  {viewDetails.riderName ? (
                    <>
                      <div>
                        <span style={{ color: '#6B7280', fontSize: '14px' }}>Name: </span>
                        <span style={{ color: '#1F2937', fontSize: '14px', fontWeight: '500' }}>{viewDetails.riderName}</span>
                      </div>
                      {viewDetails.riderPhone && (
                        <div>
                          <span style={{ color: '#6B7280', fontSize: '14px' }}>Phone: </span>
                          <span style={{ color: '#1F2937', fontSize: '14px' }}>{viewDetails.riderPhone}</span>
                        </div>
                      )}
                      {viewDetails.riderEmail && (
                        <div>
                          <span style={{ color: '#6B7280', fontSize: '14px' }}>Email: </span>
                          <span style={{ color: '#1F2937', fontSize: '14px' }}>{viewDetails.riderEmail}</span>
                        </div>
                      )}
                    </>
                  ) : (
                    <div style={{ color: '#9CA3AF', fontSize: '14px', fontStyle: 'italic' }}>
                      No rider assigned
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Location Info */}
            <div style={{ background: '#F9FAFB', padding: '16px', borderRadius: '8px', marginBottom: '20px' }}>
              <h3 style={{ fontSize: '16px', fontWeight: '600', color: '#1F2937', marginBottom: '12px' }}>Location Information</h3>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '4px' }}>
                    <FaMapMarkerAlt style={{ fontSize: '14px', color: '#10B981' }} />
                    <span style={{ color: '#6B7280', fontSize: '14px', fontWeight: '500' }}>Pickup Location:</span>
                  </div>
                  <div style={{ color: '#1F2937', fontSize: '14px', marginLeft: '20px' }}>
                    {viewDetails.pickupLocation || 'N/A'}
                  </div>
                </div>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '4px' }}>
                    <FaMapMarkerAlt style={{ fontSize: '14px', color: '#EF4444' }} />
                    <span style={{ color: '#6B7280', fontSize: '14px', fontWeight: '500' }}>Drop Location:</span>
                  </div>
                  <div style={{ color: '#1F2937', fontSize: '14px', marginLeft: '20px' }}>
                    {viewDetails.dropLocation || 'N/A'}
                  </div>
                </div>
              </div>
            </div>

            {/* Additional Notes */}
            {viewDetails.additionalNotes && (
              <div style={{ background: '#F9FAFB', padding: '16px', borderRadius: '8px', marginBottom: '20px' }}>
                <h3 style={{ fontSize: '16px', fontWeight: '600', color: '#1F2937', marginBottom: '12px' }}>Additional Notes</h3>
                <p style={{ color: '#1F2937', fontSize: '14px', margin: 0 }}>{viewDetails.additionalNotes}</p>
              </div>
            )}

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '20px' }}>
              <button 
                onClick={() => setViewDetails(null)}
                style={{ 
                  padding: '10px 20px', 
                  background: '#6B7280', 
                  color: 'white', 
                  border: 'none', 
                  borderRadius: '8px',
                  cursor: 'pointer',
                  fontWeight: '600'
                }}
              >
                Close
              </button>
              {(viewDetails.status === 'pending' || viewDetails.status === 'assigned') && (
                <button 
                  onClick={() => {
                    setViewDetails(null);
                    openAssignModal(viewDetails);
                  }}
                  style={{ 
                    padding: '10px 20px', 
                    background: '#8B5CF6', 
                    color: 'white', 
                    border: 'none', 
                    borderRadius: '8px',
                    cursor: 'pointer',
                    fontWeight: '600'
                  }}
                >
                  {viewDetails.riderName ? 'Reassign Rider' : 'Assign Rider'}
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Assign Rider Modal */}
      {assignModalOrder && (
        <div style={{ 
          position: 'fixed', 
          inset: 0, 
          background: 'rgba(0,0,0,0.5)', 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center',
          zIndex: 1000,
          padding: '20px'
        }}
        onClick={closeAssignModal}
        >
          <div 
            style={{ 
              background: 'white', 
              padding: '30px', 
              borderRadius: '12px', 
              width: '100%', 
              maxWidth: '600px',
              maxHeight: '90vh',
              overflowY: 'auto',
              boxShadow: '0 10px 25px rgba(0,0,0,0.2)'
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <h2 style={{ fontSize: '20px', fontWeight: 'bold', color: '#1F2937', margin: 0 }}>Assign Rider</h2>
              <button 
                onClick={closeAssignModal}
                style={{ 
                  background: 'transparent', 
                  border: 'none', 
                  fontSize: '24px', 
                  cursor: 'pointer',
                  color: '#6B7280'
                }}
              >
                ×
              </button>
            </div>
            <div style={{ marginBottom: '20px' }}>
              <p style={{ color: '#6B7280', fontSize: '14px', marginBottom: '15px' }}>Order ID: {assignModalOrder.id}</p>
              {riders.length === 0 ? (
                <div style={{ 
                  padding: '20px', 
                  textAlign: 'center', 
                  background: '#F9FAFB', 
                  borderRadius: '8px',
                  color: '#6B7280'
                }}>
                  No riders available
                </div>
              ) : (
                <div style={{ 
                  maxHeight: '400px', 
                  overflowY: 'auto', 
                  border: '1px solid #E5E7EB', 
                  borderRadius: '8px',
                  padding: '8px'
                }}>
                  {riders.map(r => (
                    <label 
                      key={r.id || r.uid} 
                      style={{ 
                        display: 'flex', 
                        alignItems: 'center', 
                        gap: '12px', 
                        padding: '12px', 
                        borderBottom: '1px solid #F3F4F6',
                        cursor: 'pointer',
                        borderRadius: '8px',
                        transition: 'background 0.2s'
                      }}
                      onMouseEnter={(e) => e.currentTarget.style.background = '#F9FAFB'}
                      onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                    >
                      <input 
                        type="radio" 
                        name="selectedRider" 
                        value={r.id || r.uid} 
                        checked={(selectedRiderId === (r.id || r.uid))} 
                        onChange={() => setSelectedRiderId(r.id || r.uid)} 
                        style={{ cursor: 'pointer' }}
                      />
                      <div style={{ flex: 1 }}>
                        <div style={{ fontWeight: 600, color: '#1F2937', fontSize: '14px' }}>
                          {r.firstName ? `${r.firstName} ${r.lastName || ''}`.trim() : r.name || 'Unknown Rider'}
                        </div>
                        <div style={{ fontSize: 13, color: '#6B7280', marginTop: '4px' }}>
                          {r.email || r.phone || 'No contact info'}
                        </div>
                        {r.status && (
                          <div style={{ fontSize: 12, color: r.status === 'approved' || r.status === 'Active' ? '#10B981' : '#F59E0B', marginTop: '4px' }}>
                            Status: {r.status}
                          </div>
                        )}
                      </div>
                    </label>
                  ))}
                </div>
              )}
            </div>
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
              <button 
                onClick={closeAssignModal} 
                style={{ 
                  padding: '10px 20px', 
                  background: '#6B7280', 
                  color: 'white', 
                  border: 'none', 
                  borderRadius: '8px',
                  cursor: 'pointer',
                  fontWeight: '600'
                }}
              >
                Cancel
              </button>
              <button 
                onClick={saveAssignModal} 
                disabled={assignLoading || !selectedRiderId} 
                style={{ 
                  padding: '10px 20px', 
                  background: assignLoading || !selectedRiderId ? '#9CA3AF' : '#10B981', 
                  color: 'white', 
                  border: 'none', 
                  borderRadius: '8px',
                  cursor: assignLoading || !selectedRiderId ? 'not-allowed' : 'pointer',
                  fontWeight: '600'
                }}
              >
                {assignLoading ? 'Assigning...' : 'Assign Rider'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default OrderPlacement;
