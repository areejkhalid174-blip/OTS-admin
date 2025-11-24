import React, { useState, useEffect } from "react";
import { getAllData, updateData, deleteData } from "../Helper/firebaseHelper";
import { 
  FaEdit, 
  FaTrash, 
  FaSearch, 
  FaCheckCircle,
  FaTimesCircle,
  FaExclamationTriangle,
  FaMapMarkerAlt,
  FaPhone,
  FaEnvelope,
  FaBox,
  FaDollarSign,
  FaRoute,
  FaWeight,
  FaImage,
  FaUser,
  FaShippingFast
} from 'react-icons/fa';

export default function OrderManagement() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editingOrder, setEditingOrder] = useState(null);
  const [statusModalOrder, setStatusModalOrder] = useState(null);
  const [statusModalValue, setStatusModalValue] = useState('');
  const [riders, setRiders] = useState([]);
  const [assignModalOrder, setAssignModalOrder] = useState(null);
  const [selectedRiderId, setSelectedRiderId] = useState(null);
  const [assignLoading, setAssignLoading] = useState(false);
  const [isReassigning, setIsReassigning] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('All');
  const [viewDetails, setViewDetails] = useState(null);

  const fetchOrders = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getAllData("orders");
      // getAllData returns array of { id, ...data }
      setOrders(data || []);
    } catch (err) {
      console.error("Error fetching orders:", err);
      setError("Failed to fetch orders");
      setOrders([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
    // fetch riders for assignment (only approved riders)
    (async () => {
      try {
        const users = await getAllData('users');
        if (Array.isArray(users)) {
          const onlyRiders = users.filter(u => 
            (u.role || '').toLowerCase() === 'rider' && 
            (u.status === 'approved' || u.status === 'Active')
          );
          setRiders(onlyRiders);
        } else {
          setRiders([]);
        }
      } catch (err) {
        console.error('Error fetching riders:', err);
        setRiders([]);
      }
    })();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this order? This action cannot be undone.")) return;
    try {
      await deleteData("orders", id);
      await fetchOrders(); // Refresh orders from Firebase
      alert("Order deleted successfully!");
    } catch (err) {
      console.error("Error deleting order:", err);
      alert("Failed to delete order");
    }
  };

  const handleOpenEdit = (order) => {
    setEditingOrder({ ...order });
  };

  const handleCloseEdit = () => setEditingOrder(null);

  const handleSaveEdit = async () => {
    if (!editingOrder) return;
    try {
      const { id, ...rest } = editingOrder;
      await updateData("orders", editingOrder.id, { ...rest, updatedAt: new Date().toISOString() });
      await fetchOrders(); // Refresh orders from Firebase
      setEditingOrder(null);
      alert("Order updated successfully!");
    } catch (err) {
      console.error("Error updating order:", err);
      alert("Failed to update order");
    }
  };


  const openStatusModal = (order) => {
    setStatusModalOrder(order);
    setStatusModalValue(order.status || 'pending');
  };

  const closeStatusModal = () => {
    setStatusModalOrder(null);
    setStatusModalValue('');
  };

  const saveStatusModal = async () => {
    if (!statusModalOrder) return;
    try {
      await updateData('orders', statusModalOrder.id, { status: statusModalValue, updatedAt: new Date().toISOString() });
      await fetchOrders(); // Refresh orders from Firebase
      closeStatusModal();
      alert("Order status updated successfully!");
    } catch (err) {
      console.error('Error saving status:', err);
      alert('Failed to save status');
    }
  };

  // Assign rider handlers
  const openAssignModal = (order, isReassign = false) => {
    setAssignModalOrder(order);
    setSelectedRiderId(order?.riderId || order?.riderUid || null);
    setIsReassigning(isReassign || !!(order?.riderId || order?.riderUid));
  };

  const closeAssignModal = () => {
    setAssignModalOrder(null);
    setSelectedRiderId(null);
    setIsReassigning(false);
  };

  const saveAssignModal = async () => {
    if (!assignModalOrder) return;
    if (!selectedRiderId) {
      alert('Please select a rider');
      return;
    }
    setAssignLoading(true);
    try {
      const rider = riders.find(r => r.id === selectedRiderId) || riders.find(r => r.uid === selectedRiderId) || null;
      const riderName = rider?.firstName ? `${rider.firstName} ${rider.lastName || ''}`.trim() : (rider?.name || '');
      const riderPhone = rider?.phone || rider?.driverPhone || '';

      await updateData('orders', assignModalOrder.id, {
        riderId: selectedRiderId,
        riderName: riderName || null,
        riderPhone: riderPhone || null,
        status: assignModalOrder.status === 'pending' ? 'assigned' : assignModalOrder.status,
        updatedAt: new Date().toISOString()
      });

      await fetchOrders(); // Refresh orders from Firebase
      closeAssignModal();
      alert(isReassigning ? "Rider reassigned successfully!" : "Rider assigned successfully!");
    } catch (err) {
      console.error('Error assigning rider:', err);
      alert('Failed to assign rider');
    } finally {
      setAssignLoading(false);
    }
  };

  const getStatusIcon = (status) => {
    switch (status?.toLowerCase()) {
      case 'pending':
        return <FaExclamationTriangle style={{ color: '#F59E0B' }} />;
      case 'assigned':
      case 'in-progress':
        return <FaShippingFast style={{ color: '#3B82F6' }} />;
      case 'delivered':
        return <FaCheckCircle style={{ color: '#10B981' }} />;
      case 'cancelled':
        return <FaTimesCircle style={{ color: '#EF4444' }} />;
      default:
        return <FaExclamationTriangle style={{ color: '#F59E0B' }} />;
    }
  };

  const pendingOrders = orders.filter(o => o.status === 'pending');
  const filteredOrders = orders.filter(order => {
    const matchesSearch = 
      (order.customerName || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (order.customerEmail || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (order.originCity || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (order.destinationCity || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (order.id || '').toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'All' || order.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const totalRevenue = orders
    .filter(o => o.status === 'delivered')
    .reduce((sum, o) => sum + (o.price || 0), 0);

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
          Manage customer orders, track deliveries, and monitor order status.
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
                {orders.length}
              </p>
            </div>
            <FaBox style={{ fontSize: '24px', color: '#667eea' }} />
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
                {pendingOrders.length}
              </p>
            </div>
            <FaExclamationTriangle style={{ fontSize: '24px', color: '#F59E0B' }} />
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
              <p style={{ fontSize: '24px', fontWeight: 'bold', color: '#10B981', margin: 0 }}>
                Rs. {totalRevenue.toLocaleString()}
              </p>
            </div>
            <FaDollarSign style={{ fontSize: '24px', color: '#10B981' }} />
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
                {orders.filter(o => o.status === 'delivered').length}
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

      {/* Pending Orders Section */}
      {pendingOrders.length > 0 && (
        <div style={{
          background: 'white',
          borderRadius: '12px',
          boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
          border: '1px solid #E5E7EB',
          overflow: 'hidden',
          marginBottom: '30px'
        }}>
          <div style={{ padding: '16px', background: '#F9FAFB', borderBottom: '1px solid #E5E7EB' }}>
            <strong style={{ fontSize: '18px', color: '#1F2937' }}>Pending Orders ({pendingOrders.length})</strong>
          </div>
          <div style={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
                <tr style={{ background: '#F9FAFB', borderBottom: '1px solid #E5E7EB' }}>
                  <th style={{ padding: '16px', textAlign: 'left', fontWeight: '600', color: '#374151' }}>Order ID</th>
                  <th style={{ padding: '16px', textAlign: 'left', fontWeight: '600', color: '#374151' }}>Customer</th>
                  <th style={{ padding: '16px', textAlign: 'left', fontWeight: '600', color: '#374151' }}>Route</th>
                  <th style={{ padding: '16px', textAlign: 'left', fontWeight: '600', color: '#374151' }}>Package Details</th>
                  <th style={{ padding: '16px', textAlign: 'left', fontWeight: '600', color: '#374151' }}>Price</th>
                  <th style={{ padding: '16px', textAlign: 'left', fontWeight: '600', color: '#374151' }}>Payment</th>
                  <th style={{ padding: '16px', textAlign: 'left', fontWeight: '600', color: '#374151' }}>Status</th>
                  <th style={{ padding: '16px', textAlign: 'center', fontWeight: '600', color: '#374151' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
                {pendingOrders.map(order => (
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
                      </div>
                    </td>
                    <td style={{ padding: '16px' }}>
                      <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '4px' }}>
                          <FaMapMarkerAlt style={{ fontSize: '12px', color: '#10B981' }} />
                          <span style={{ fontSize: '12px', color: '#6B7280' }}>From: {order.originCity || 'N/A'}</span>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                          <FaMapMarkerAlt style={{ fontSize: '12px', color: '#EF4444' }} />
                          <span style={{ fontSize: '12px', color: '#6B7280' }}>To: {order.destinationCity || 'N/A'}</span>
                        </div>
                        {order.distance && (
                          <div style={{ color: '#9CA3AF', fontSize: '11px', marginTop: '4px' }}>
                            {order.distance.toFixed(2)} km
                          </div>
                        )}
                      </div>
                    </td>
                    <td style={{ padding: '16px' }}>
                      <div>
                        <div style={{ fontSize: '12px', color: '#6B7280', marginBottom: '2px' }}>
                          Type: {order.packageType || 'N/A'}
                        </div>
                        <div style={{ fontSize: '12px', color: '#6B7280', marginBottom: '2px' }}>
                          Weight: {order.weight || 'N/A'} kg
                        </div>
                        <div style={{ fontSize: '12px', color: '#6B7280' }}>
                          Category: {order.categoryName || 'N/A'}
                        </div>
                      </div>
                    </td>
                    <td style={{ padding: '16px' }}>
                      <div style={{ color: '#059669', fontSize: '14px', fontWeight: '600' }}>
                        Rs. {(order.price || 0).toLocaleString()}
                      </div>
                    </td>
                    <td style={{ padding: '16px' }}>
                      {order.paymentProof ? (
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                          <FaCheckCircle style={{ color: '#10B981', fontSize: '16px' }} />
                          <span style={{ fontSize: '12px', color: '#10B981', fontWeight: '500' }}>Verified</span>
                        </div>
                      ) : (
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                          <FaTimesCircle style={{ color: '#EF4444', fontSize: '16px' }} />
                          <span style={{ fontSize: '12px', color: '#EF4444' }}>Missing</span>
                        </div>
                      )}
                    </td>
                    <td style={{ padding: '16px' }}>
                      <div 
                        style={{ 
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '6px',
                          fontSize: '14px', 
                          color: '#F59E0B',
                          fontWeight: '500',
                          padding: '4px 8px',
                          background: '#FEF3C7',
                          borderRadius: '4px',
                          cursor: 'pointer',
                          transition: 'all 0.2s'
                        }}
                        onClick={() => openStatusModal(order)}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.background = '#FDE68A';
                          e.currentTarget.style.transform = 'scale(1.05)';
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.background = '#FEF3C7';
                          e.currentTarget.style.transform = 'scale(1)';
                        }}
                        title="Click to change status"
                      >
                        <FaExclamationTriangle style={{ fontSize: '12px' }} />
                        Pending
                      </div>
                    </td>
                    <td style={{ padding: '16px', textAlign: 'center' }}>
                      <div style={{ display: 'flex', gap: '8px', justifyContent: 'center', flexWrap: 'wrap' }}>
                        <button
                          onClick={() => setViewDetails(order)}
                          style={{ 
                            background: '#3B82F6', 
                            color: 'white', 
                            border: 'none', 
                            padding: '6px 12px', 
                            borderRadius: '6px', 
                            cursor: 'pointer', 
                            fontSize: '11px', 
                            fontWeight: 600
                          }}
                        >
                          View
                        </button>
                        <button
                          onClick={() => handleOpenEdit(order)}
                          style={{ 
                            background: '#10B981', 
                            color: 'white', 
                            border: 'none', 
                            padding: '6px 12px', 
                            borderRadius: '6px', 
                            cursor: 'pointer', 
                            fontSize: '11px', 
                            fontWeight: 600
                          }}
                        >
                          Edit
                        </button>
                        {order.riderId || order.riderUid ? (
                          <button
                            onClick={() => openAssignModal(order, true)}
                            style={{ 
                              background: '#F59E0B', 
                              color: 'white', 
                              border: 'none', 
                              padding: '6px 12px', 
                              borderRadius: '6px', 
                              cursor: 'pointer', 
                              fontSize: '11px', 
                              fontWeight: 600
                            }}
                            title="Reassign rider"
                          >
                            Reassign
                          </button>
                        ) : (
                          <button
                            onClick={() => openAssignModal(order)}
                            style={{ 
                              background: '#8B5CF6', 
                              color: 'white', 
                              border: 'none', 
                              padding: '6px 12px', 
                              borderRadius: '6px', 
                              cursor: 'pointer', 
                              fontSize: '11px', 
                              fontWeight: 600
                            }}
                          >
                            Assign
                          </button>
                        )}
                        <button
                          onClick={() => handleDelete(order.id)}
                          style={{ 
                            background: '#EF4444', 
                            color: 'white', 
                            border: 'none', 
                            padding: '6px 12px', 
                            borderRadius: '6px', 
                            cursor: 'pointer', 
                            fontSize: '11px', 
                            fontWeight: 600
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
      )}

      {/* All Orders Table */}
      <div style={{
        background: 'white',
        borderRadius: '12px',
        boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
        border: '1px solid #E5E7EB',
        overflow: 'hidden'
      }}>
        <div style={{ padding: '16px', background: '#F9FAFB', borderBottom: '1px solid #E5E7EB' }}>
          <strong style={{ fontSize: '18px', color: '#1F2937' }}>All Orders</strong>
        </div>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ background: '#F9FAFB', borderBottom: '1px solid #E5E7EB' }}>
                <th style={{ padding: '16px', textAlign: 'left', fontWeight: '600', color: '#374151' }}>Order ID</th>
                <th style={{ padding: '16px', textAlign: 'left', fontWeight: '600', color: '#374151' }}>Customer</th>
                <th style={{ padding: '16px', textAlign: 'left', fontWeight: '600', color: '#374151' }}>Route</th>
                <th style={{ padding: '16px', textAlign: 'left', fontWeight: '600', color: '#374151' }}>Package</th>
                <th style={{ padding: '16px', textAlign: 'left', fontWeight: '600', color: '#374151' }}>Price</th>
                <th style={{ padding: '16px', textAlign: 'left', fontWeight: '600', color: '#374151' }}>Payment</th>
                <th style={{ padding: '16px', textAlign: 'left', fontWeight: '600', color: '#374151' }}>Status</th>
                <th style={{ padding: '16px', textAlign: 'left', fontWeight: '600', color: '#374151' }}>Date</th>
                <th style={{ padding: '16px', textAlign: 'center', fontWeight: '600', color: '#374151' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredOrders.length > 0 ? (
                filteredOrders.map(order => (
                  <tr key={order.id} style={{ borderBottom: '1px solid #F3F4F6' }}>
                    <td style={{ padding: '16px' }}>
                      <div style={{ fontWeight: '600', color: '#1F2937', fontSize: '14px' }}>
                        {order.id?.substring(0, 12)}...
                      </div>
                    </td>
                    <td style={{ padding: '16px' }}>
                      <div>
                        <div style={{ fontWeight: '500', color: '#1F2937', fontSize: '14px', marginBottom: '4px' }}>
                          {order.customerName || 'N/A'}
                        </div>
                        <div style={{ color: '#6B7280', fontSize: '12px' }}>
                          {order.customerEmail || 'N/A'}
                        </div>
                      </div>
                    </td>
                    <td style={{ padding: '16px' }}>
                      <div>
                        <div style={{ fontSize: '12px', color: '#6B7280', marginBottom: '2px' }}>
                          {order.originCity || 'N/A'} → {order.destinationCity || 'N/A'}
                        </div>
                        {order.distance && (
                          <div style={{ color: '#9CA3AF', fontSize: '11px' }}>
                            {order.distance.toFixed(2)} km
                          </div>
                        )}
                      </div>
                    </td>
                    <td style={{ padding: '16px' }}>
                      <div>
                        <div style={{ fontSize: '12px', color: '#6B7280' }}>
                          {order.packageType || 'N/A'} • {order.weight || 'N/A'} kg
                        </div>
                        <div style={{ fontSize: '11px', color: '#9CA3AF' }}>
                          {order.categoryName || 'N/A'}
                        </div>
                      </div>
                    </td>
                    <td style={{ padding: '16px' }}>
                      <div style={{ color: '#059669', fontSize: '14px', fontWeight: '600' }}>
                        Rs. {(order.price || 0).toLocaleString()}
                      </div>
                    </td>
                    <td style={{ padding: '16px' }}>
                      {order.paymentProof ? (
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                          <FaCheckCircle style={{ color: '#10B981', fontSize: '16px' }} />
                          <span style={{ fontSize: '12px', color: '#10B981', fontWeight: '500' }}>Verified</span>
                        </div>
                      ) : (
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                          <FaTimesCircle style={{ color: '#EF4444', fontSize: '16px' }} />
                          <span style={{ fontSize: '12px', color: '#EF4444' }}>Missing</span>
                        </div>
                      )}
                    </td>
                    <td style={{ padding: '16px' }}>
                      <div 
                        style={{ 
                          display: 'flex', 
                          alignItems: 'center', 
                          gap: '8px',
                          cursor: 'pointer',
                          padding: '4px 8px',
                          borderRadius: '6px',
                          transition: 'background 0.2s'
                        }}
                        onClick={() => openStatusModal(order)}
                        onMouseEnter={(e) => e.currentTarget.style.background = '#F9FAFB'}
                        onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                        title="Click to change status"
                      >
                        {getStatusIcon(order.status)}
                        <span style={{ fontSize: '14px', color: '#374151', textTransform: 'capitalize' }}>
                          {order.status || 'pending'}
                        </span>
                      </div>
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
                        <button
                          onClick={() => handleOpenEdit(order)}
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
                          Edit
                        </button>
                        {order.riderId || order.riderUid ? (
                          <button
                            onClick={() => openAssignModal(order, true)}
                            style={{ 
                              background: '#F59E0B', 
                              color: 'white', 
                              border: 'none', 
                              padding: '6px 10px', 
                              borderRadius: '6px', 
                              cursor: 'pointer', 
                              fontSize: '11px', 
                              fontWeight: 600
                            }}
                            title="Reassign rider"
                          >
                            Reassign
                          </button>
                        ) : (
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
                            Assign
                          </button>
                        )}
                        <button
                          onClick={() => handleDelete(order.id)}
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
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="9" style={{ padding: '40px', textAlign: 'center', color: '#6B7280' }}>
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
                      color: viewDetails.status === 'pending' ? '#F59E0B' : viewDetails.status === 'delivered' ? '#10B981' : '#3B82F6',
                      fontSize: '14px',
                      fontWeight: '500',
                      textTransform: 'capitalize'
                    }}>
                      {viewDetails.status || 'pending'}
                    </span>
                  </div>
                  <div>
                    <span style={{ color: '#6B7280', fontSize: '14px' }}>Price: </span>
                    <span style={{ color: '#059669', fontSize: '14px', fontWeight: '600' }}>Rs. {(viewDetails.price || 0).toLocaleString()}</span>
                  </div>
                  <div>
                    <span style={{ color: '#6B7280', fontSize: '14px' }}>Distance: </span>
                    <span style={{ color: '#1F2937', fontSize: '14px' }}>{viewDetails.distance ? `${viewDetails.distance.toFixed(2)} km` : 'N/A'}</span>
                  </div>
                  {viewDetails.createdAt && (
                    <div>
                      <span style={{ color: '#6B7280', fontSize: '14px' }}>Created: </span>
                      <span style={{ color: '#1F2937', fontSize: '14px' }}>{new Date(viewDetails.createdAt).toLocaleString()}</span>
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
                  {viewDetails.paymentProof && (
                    <div style={{ marginTop: '12px' }}>
                      <div style={{ fontSize: '12px', color: '#6B7280', marginBottom: '4px', fontWeight: '600' }}>Payment Proof:</div>
                      <img 
                        src={viewDetails.paymentProof} 
                        alt="Payment Proof" 
                        style={{ 
                          width: '100%', 
                          maxHeight: '200px', 
                          objectFit: 'cover', 
                          borderRadius: '8px',
                          border: '2px solid #10B981',
                          cursor: 'pointer'
                        }}
                        onClick={() => window.open(viewDetails.paymentProof, '_blank')}
                        title="Click to view full size"
                      />
                      <div style={{ fontSize: '11px', color: '#10B981', marginTop: '4px' }}>
                        ✓ Payment proof verified
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '20px' }}>
              {/* Sender Info */}
              <div style={{ background: '#F9FAFB', padding: '16px', borderRadius: '8px' }}>
                <h3 style={{ fontSize: '16px', fontWeight: '600', color: '#1F2937', marginBottom: '12px' }}>Sender Information</h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  <div>
                    <span style={{ color: '#6B7280', fontSize: '14px' }}>Name: </span>
                    <span style={{ color: '#1F2937', fontSize: '14px', fontWeight: '500' }}>{viewDetails.senderName || 'N/A'}</span>
                  </div>
                  <div>
                    <span style={{ color: '#6B7280', fontSize: '14px' }}>Phone: </span>
                    <span style={{ color: '#1F2937', fontSize: '14px' }}>{viewDetails.senderPhone || 'N/A'}</span>
                  </div>
                  <div>
                    <span style={{ color: '#6B7280', fontSize: '14px' }}>Address: </span>
                    <span style={{ color: '#1F2937', fontSize: '14px' }}>{viewDetails.senderAddress || 'N/A'}</span>
                  </div>
                  <div>
                    <span style={{ color: '#6B7280', fontSize: '14px' }}>City: </span>
                    <span style={{ color: '#1F2937', fontSize: '14px' }}>{viewDetails.originCity || 'N/A'}</span>
                  </div>
                </div>
              </div>

              {/* Receiver Info */}
              <div style={{ background: '#F9FAFB', padding: '16px', borderRadius: '8px' }}>
                <h3 style={{ fontSize: '16px', fontWeight: '600', color: '#1F2937', marginBottom: '12px' }}>Receiver Information</h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  <div>
                    <span style={{ color: '#6B7280', fontSize: '14px' }}>Name: </span>
                    <span style={{ color: '#1F2937', fontSize: '14px', fontWeight: '500' }}>{viewDetails.receiverName || 'N/A'}</span>
                  </div>
                  <div>
                    <span style={{ color: '#6B7280', fontSize: '14px' }}>Phone: </span>
                    <span style={{ color: '#1F2937', fontSize: '14px' }}>{viewDetails.receiverPhone || 'N/A'}</span>
                  </div>
                  <div>
                    <span style={{ color: '#6B7280', fontSize: '14px' }}>Address: </span>
                    <span style={{ color: '#1F2937', fontSize: '14px' }}>{viewDetails.receiverAddress || 'N/A'}</span>
                  </div>
                  <div>
                    <span style={{ color: '#6B7280', fontSize: '14px' }}>City: </span>
                    <span style={{ color: '#1F2937', fontSize: '14px' }}>{viewDetails.destinationCity || 'N/A'}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Customer Info */}
            <div style={{ background: '#F9FAFB', padding: '16px', borderRadius: '8px', marginBottom: '20px' }}>
              <h3 style={{ fontSize: '16px', fontWeight: '600', color: '#1F2937', marginBottom: '12px' }}>Customer Information</h3>
              <div style={{ display: 'flex', gap: '30px', flexWrap: 'wrap' }}>
                <div>
                  <span style={{ color: '#6B7280', fontSize: '14px' }}>Name: </span>
                  <span style={{ color: '#1F2937', fontSize: '14px', fontWeight: '500' }}>{viewDetails.customerName || 'N/A'}</span>
                </div>
                <div>
                  <span style={{ color: '#6B7280', fontSize: '14px' }}>Email: </span>
                  <span style={{ color: '#1F2937', fontSize: '14px' }}>{viewDetails.customerEmail || 'N/A'}</span>
                </div>
                <div>
                  <span style={{ color: '#6B7280', fontSize: '14px' }}>User ID: </span>
                  <span style={{ color: '#1F2937', fontSize: '14px' }}>{viewDetails.userId?.substring(0, 12)}...</span>
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

            {/* Coordinates */}
            {(viewDetails.originLat || viewDetails.destinationLat) && (
              <div style={{ background: '#F9FAFB', padding: '16px', borderRadius: '8px' }}>
                <h3 style={{ fontSize: '16px', fontWeight: '600', color: '#1F2937', marginBottom: '12px' }}>Location Coordinates</h3>
                <div style={{ display: 'flex', gap: '30px', flexWrap: 'wrap' }}>
                  {viewDetails.originLat && (
                    <div>
                      <span style={{ color: '#6B7280', fontSize: '14px' }}>Origin: </span>
                      <span style={{ color: '#1F2937', fontSize: '14px' }}>
                        {viewDetails.originLat.toFixed(6)}, {viewDetails.originLng.toFixed(6)}
                      </span>
                    </div>
                  )}
                  {viewDetails.destinationLat && (
                    <div>
                      <span style={{ color: '#6B7280', fontSize: '14px' }}>Destination: </span>
                      <span style={{ color: '#1F2937', fontSize: '14px' }}>
                        {viewDetails.destinationLat.toFixed(6)}, {viewDetails.destinationLng.toFixed(6)}
                      </span>
                    </div>
                  )}
                </div>
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
              <button 
                onClick={() => {
                  setViewDetails(null);
                  handleOpenEdit(viewDetails);
                }}
                style={{ 
                  padding: '10px 20px', 
                  background: '#10B981', 
                  color: 'white', 
                  border: 'none', 
                  borderRadius: '8px',
                  cursor: 'pointer',
                  fontWeight: '600'
                }}
              >
                Edit Order
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Modal */}
      {editingOrder && (
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
        onClick={handleCloseEdit}
        >
          <div 
            style={{ 
              background: 'white', 
              padding: '30px', 
              borderRadius: '12px', 
              width: '100%', 
              maxWidth: '800px',
              maxHeight: '90vh',
              overflowY: 'auto',
              boxShadow: '0 10px 25px rgba(0,0,0,0.2)'
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <h2 style={{ fontSize: '24px', fontWeight: 'bold', color: '#1F2937', margin: 0 }}>Edit Order</h2>
              <button 
                onClick={handleCloseEdit}
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

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
              <div>
                <label style={{ display: 'block', marginBottom: '6px', color: '#374151', fontSize: '14px', fontWeight: '500' }}>Customer Name</label>
                <input 
                  value={editingOrder.customerName || ''} 
                  onChange={(e) => setEditingOrder(prev => ({ ...prev, customerName: e.target.value }))} 
                  style={{ 
                    width: '100%', 
                    padding: '10px', 
                    border: '1px solid #D1D5DB',
                    borderRadius: '8px',
                    fontSize: '14px'
                  }} 
                />
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: '6px', color: '#374151', fontSize: '14px', fontWeight: '500' }}>Customer Email</label>
                <input 
                  value={editingOrder.customerEmail || ''} 
                  onChange={(e) => setEditingOrder(prev => ({ ...prev, customerEmail: e.target.value }))} 
                  style={{ 
                    width: '100%', 
                    padding: '10px', 
                    border: '1px solid #D1D5DB',
                    borderRadius: '8px',
                    fontSize: '14px'
                  }} 
                />
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: '6px', color: '#374151', fontSize: '14px', fontWeight: '500' }}>Origin City</label>
                <input 
                  value={editingOrder.originCity || ''} 
                  onChange={(e) => setEditingOrder(prev => ({ ...prev, originCity: e.target.value }))} 
                  style={{ 
                    width: '100%', 
                    padding: '10px', 
                    border: '1px solid #D1D5DB',
                    borderRadius: '8px',
                    fontSize: '14px'
                  }} 
                />
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: '6px', color: '#374151', fontSize: '14px', fontWeight: '500' }}>Destination City</label>
                <input 
                  value={editingOrder.destinationCity || ''} 
                  onChange={(e) => setEditingOrder(prev => ({ ...prev, destinationCity: e.target.value }))} 
                  style={{ 
                    width: '100%', 
                    padding: '10px', 
                    border: '1px solid #D1D5DB',
                    borderRadius: '8px',
                    fontSize: '14px'
                  }} 
                />
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: '6px', color: '#374151', fontSize: '14px', fontWeight: '500' }}>Sender Name</label>
                <input 
                  value={editingOrder.senderName || ''} 
                  onChange={(e) => setEditingOrder(prev => ({ ...prev, senderName: e.target.value }))} 
                  style={{ 
                    width: '100%', 
                    padding: '10px', 
                    border: '1px solid #D1D5DB',
                    borderRadius: '8px',
                    fontSize: '14px'
                  }} 
                />
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: '6px', color: '#374151', fontSize: '14px', fontWeight: '500' }}>Sender Phone</label>
                <input 
                  value={editingOrder.senderPhone || ''} 
                  onChange={(e) => setEditingOrder(prev => ({ ...prev, senderPhone: e.target.value }))} 
                  style={{ 
                    width: '100%', 
                    padding: '10px', 
                    border: '1px solid #D1D5DB',
                    borderRadius: '8px',
                    fontSize: '14px'
                  }} 
                />
              </div>
              <div style={{ gridColumn: '1 / -1' }}>
                <label style={{ display: 'block', marginBottom: '6px', color: '#374151', fontSize: '14px', fontWeight: '500' }}>Sender Address</label>
                <input 
                  value={editingOrder.senderAddress || ''} 
                  onChange={(e) => setEditingOrder(prev => ({ ...prev, senderAddress: e.target.value }))} 
                  style={{ 
                    width: '100%', 
                    padding: '10px', 
                    border: '1px solid #D1D5DB',
                    borderRadius: '8px',
                    fontSize: '14px'
                  }} 
                />
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: '6px', color: '#374151', fontSize: '14px', fontWeight: '500' }}>Receiver Name</label>
                <input 
                  value={editingOrder.receiverName || ''} 
                  onChange={(e) => setEditingOrder(prev => ({ ...prev, receiverName: e.target.value }))} 
                  style={{ 
                    width: '100%', 
                    padding: '10px', 
                    border: '1px solid #D1D5DB',
                    borderRadius: '8px',
                    fontSize: '14px'
                  }} 
                />
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: '6px', color: '#374151', fontSize: '14px', fontWeight: '500' }}>Receiver Phone</label>
                <input 
                  value={editingOrder.receiverPhone || ''} 
                  onChange={(e) => setEditingOrder(prev => ({ ...prev, receiverPhone: e.target.value }))} 
                  style={{ 
                    width: '100%', 
                    padding: '10px', 
                    border: '1px solid #D1D5DB',
                    borderRadius: '8px',
                    fontSize: '14px'
                  }} 
                />
              </div>
              <div style={{ gridColumn: '1 / -1' }}>
                <label style={{ display: 'block', marginBottom: '6px', color: '#374151', fontSize: '14px', fontWeight: '500' }}>Receiver Address</label>
                <input 
                  value={editingOrder.receiverAddress || ''} 
                  onChange={(e) => setEditingOrder(prev => ({ ...prev, receiverAddress: e.target.value }))} 
                  style={{ 
                    width: '100%', 
                    padding: '10px', 
                    border: '1px solid #D1D5DB',
                    borderRadius: '8px',
                    fontSize: '14px'
                  }} 
                />
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: '6px', color: '#374151', fontSize: '14px', fontWeight: '500' }}>Category Name</label>
                <input 
                  value={editingOrder.categoryName || ''} 
                  onChange={(e) => setEditingOrder(prev => ({ ...prev, categoryName: e.target.value }))} 
                  style={{ 
                    width: '100%', 
                    padding: '10px', 
                    border: '1px solid #D1D5DB',
                    borderRadius: '8px',
                    fontSize: '14px'
                  }} 
                />
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: '6px', color: '#374151', fontSize: '14px', fontWeight: '500' }}>Package Type</label>
                <select 
                  value={editingOrder.packageType || ''} 
                  onChange={(e) => setEditingOrder(prev => ({ ...prev, packageType: e.target.value }))} 
                  style={{ 
                    width: '100%', 
                    padding: '10px', 
                    border: '1px solid #D1D5DB',
                    borderRadius: '8px',
                    fontSize: '14px',
                    background: 'white'
                  }}
                >
                  <option value="small">Small</option>
                  <option value="medium">Medium</option>
                  <option value="large">Large</option>
                  <option value="extra-large">Extra Large</option>
                </select>
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: '6px', color: '#374151', fontSize: '14px', fontWeight: '500' }}>Weight (kg)</label>
                <input 
                  type="number"
                  value={editingOrder.weight || ''} 
                  onChange={(e) => setEditingOrder(prev => ({ ...prev, weight: e.target.value }))} 
                  style={{ 
                    width: '100%', 
                    padding: '10px', 
                    border: '1px solid #D1D5DB',
                    borderRadius: '8px',
                    fontSize: '14px'
                  }} 
                />
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: '6px', color: '#374151', fontSize: '14px', fontWeight: '500' }}>Price</label>
                <input 
                  type="number"
                  value={editingOrder.price || ''} 
                  onChange={(e) => setEditingOrder(prev => ({ ...prev, price: parseFloat(e.target.value) || 0 }))} 
                  style={{ 
                    width: '100%', 
                    padding: '10px', 
                    border: '1px solid #D1D5DB',
                    borderRadius: '8px',
                    fontSize: '14px'
                  }} 
                />
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: '6px', color: '#374151', fontSize: '14px', fontWeight: '500' }}>Distance (km)</label>
                <input 
                  type="number"
                  step="0.01"
                  value={editingOrder.distance || ''} 
                  onChange={(e) => setEditingOrder(prev => ({ ...prev, distance: parseFloat(e.target.value) || 0 }))} 
                  style={{ 
                    width: '100%', 
                    padding: '10px', 
                    border: '1px solid #D1D5DB',
                    borderRadius: '8px',
                    fontSize: '14px'
                  }} 
                />
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: '6px', color: '#374151', fontSize: '14px', fontWeight: '500' }}>Status</label>
                <select 
                  value={editingOrder.status || 'pending'} 
                  onChange={(e) => setEditingOrder(prev => ({ ...prev, status: e.target.value }))} 
                  style={{ 
                    width: '100%', 
                    padding: '10px', 
                    border: '1px solid #D1D5DB',
                    borderRadius: '8px',
                    fontSize: '14px',
                    background: 'white'
                  }}
                >
                  <option value="pending">Pending</option>
                  <option value="assigned">Assigned</option>
                  <option value="in-progress">In Progress</option>
                  <option value="delivered">Delivered</option>
                  <option value="cancelled">Cancelled</option>
                </select>
              </div>
              <div style={{ gridColumn: '1 / -1' }}>
                <label style={{ display: 'block', marginBottom: '6px', color: '#374151', fontSize: '14px', fontWeight: '500' }}>Package Photo URL</label>
                <input 
                  value={editingOrder.packagePhoto || ''} 
                  onChange={(e) => setEditingOrder(prev => ({ ...prev, packagePhoto: e.target.value }))} 
                  style={{ 
                    width: '100%', 
                    padding: '10px', 
                    border: '1px solid #D1D5DB',
                    borderRadius: '8px',
                    fontSize: '14px'
                  }} 
                  placeholder="https://..."
                />
              </div>
              <div style={{ gridColumn: '1 / -1' }}>
                <label style={{ display: 'block', marginBottom: '6px', color: '#374151', fontSize: '14px', fontWeight: '500' }}>Additional Notes</label>
                <textarea 
                  value={editingOrder.additionalNotes || ''} 
                  onChange={(e) => setEditingOrder(prev => ({ ...prev, additionalNotes: e.target.value }))} 
                  style={{ 
                    width: '100%', 
                    padding: '10px', 
                    border: '1px solid #D1D5DB',
                    borderRadius: '8px',
                    fontSize: '14px',
                    minHeight: '100px',
                    resize: 'vertical'
                  }} 
                  rows={4}
                />
            </div>
            </div>
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '20px' }}>
              <button 
                onClick={handleCloseEdit} 
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
                onClick={handleSaveEdit} 
                style={{ 
                  padding: '10px 20px', 
                  background: '#10B981', 
                  color: 'white', 
                  border: 'none', 
                  borderRadius: '8px',
                  cursor: 'pointer',
                  fontWeight: '600'
                }}
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}
      {/* Status Modal */}
      {statusModalOrder && (
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
        onClick={closeStatusModal}
        >
          <div 
            style={{ 
              background: 'white', 
              padding: '30px', 
              borderRadius: '12px', 
              width: '100%', 
              maxWidth: '450px',
              boxShadow: '0 10px 25px rgba(0,0,0,0.2)'
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <h2 style={{ fontSize: '20px', fontWeight: 'bold', color: '#1F2937', margin: 0 }}>Change Order Status</h2>
              <button 
                onClick={closeStatusModal}
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
              <p style={{ color: '#6B7280', fontSize: '14px', marginBottom: '10px' }}>Order ID: {statusModalOrder.id}</p>
              <label style={{ display: 'block', marginBottom: '8px', color: '#374151', fontSize: '14px', fontWeight: '500' }}>Status</label>
              <select 
                value={statusModalValue} 
                onChange={(e) => setStatusModalValue(e.target.value)} 
                style={{ 
                  width: '100%', 
                  padding: '10px', 
                  border: '1px solid #D1D5DB',
                  borderRadius: '8px',
                  fontSize: '14px',
                  background: 'white'
                }}
              >
                <option value="pending">Pending</option>
                <option value="assigned">Assigned</option>
                <option value="in-progress">In Progress</option>
                <option value="delivered">Delivered</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </div>
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
              <button 
                onClick={closeStatusModal} 
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
                onClick={saveStatusModal} 
                style={{ 
                  padding: '10px 20px', 
                  background: '#10B981', 
                  color: 'white', 
                  border: 'none', 
                  borderRadius: '8px',
                  cursor: 'pointer',
                  fontWeight: '600'
                }}
              >
                Save
              </button>
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
              <h2 style={{ fontSize: '20px', fontWeight: 'bold', color: '#1F2937', margin: 0 }}>
                {isReassigning ? 'Reassign Rider' : 'Assign Rider'}
              </h2>
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
              {isReassigning && assignModalOrder.riderName && (
                <div style={{ 
                  padding: '10px', 
                  background: '#FEF3C7', 
                  borderRadius: '6px', 
                  marginBottom: '15px',
                  border: '1px solid #FCD34D'
                }}>
                  <p style={{ margin: 0, fontSize: '13px', color: '#92400E' }}>
                    Current Rider: <strong>{assignModalOrder.riderName}</strong>
                    {assignModalOrder.riderPhone && ` (${assignModalOrder.riderPhone})`}
                  </p>
                </div>
              )}
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
                          <div style={{ fontSize: 12, color: r.status === 'approved' ? '#10B981' : '#F59E0B', marginTop: '4px' }}>
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
                {assignLoading ? (isReassigning ? 'Reassigning...' : 'Assigning...') : (isReassigning ? 'Reassign Rider' : 'Assign Rider')}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}