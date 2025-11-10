import React, { useState, useEffect } from 'react';
import { useOrder } from '../context/OrderContext';
import { useCustomer } from '../context/CustomerContext';
import { useDeliveryService } from '../context/DeliveryServiceContext';
import { useRider } from '../context/RiderContext';
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
  FaCreditCard
} from 'react-icons/fa';

const OrderPlacement = () => {
  const { orders, loading, addOrder, updateOrderStatus, getOrderStats } = useOrder();
  const { customers } = useCustomer();
  const { deliveryServices } = useDeliveryService();
  const { getAvailableRiders } = useRider();
  
  const [showModal, setShowModal] = useState(false);
  const [editingOrder, setEditingOrder] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('All');
  const [filterPayment, setFilterPayment] = useState('All');
  
  const [formData, setFormData] = useState({
    customerId: '',
    items: [{ name: '', quantity: 1, price: 0, category: 'Food' }],
    deliveryService: '',
    paymentMethod: 'Cash on Delivery',
    specialInstructions: '',
    estimatedDelivery: ''
  });

  const categories = ['Food', 'Beverages', 'Desserts', 'Groceries', 'Pharmacy', 'Electronics'];
  const paymentMethods = ['Cash on Delivery', 'Online Payment', 'Card Payment'];
  const statusOptions = ['Pending', 'Assigned', 'In Progress', 'Delivered', 'Cancelled'];

  const getStatusIcon = (status) => {
    switch (status) {
      case 'Pending':
        return <FaClock style={{ color: '#F59E0B' }} />;
      case 'Assigned':
        return <FaUser style={{ color: '#3B82F6' }} />;
      case 'In Progress':
        return <FaExclamationTriangle style={{ color: '#8B5CF6' }} />;
      case 'Delivered':
        return <FaCheckCircle style={{ color: '#10B981' }} />;
      case 'Cancelled':
        return <FaTimesCircle style={{ color: '#EF4444' }} />;
      default:
        return <FaClock style={{ color: '#F59E0B' }} />;
    }
  };

  const getPaymentIcon = (method) => {
    switch (method) {
      case 'Online Payment':
        return <FaCreditCard style={{ color: '#3B82F6' }} />;
      case 'Card Payment':
        return <FaCreditCard style={{ color: '#059669' }} />;
      case 'Cash on Delivery':
        return <FaDollarSign style={{ color: '#F59E0B' }} />;
      default:
        return <FaDollarSign style={{ color: '#F59E0B' }} />;
    }
  };

  const getServiceIcon = (serviceName) => {
    const service = deliveryServices.find(s => s.name === serviceName);
    if (!service) return <FaMotorcycle />;
    
    switch (service.icon) {
      case 'bicycle':
        return <FaBicycle />;
      case 'motorcycle':
        return <FaMotorcycle />;
      case 'car':
        return <FaCar />;
      case 'van':
        return <FaTruck />;
      default:
        return <FaMotorcycle />;
    }
  };

  const calculateTotal = (items, deliveryServiceName) => {
    const subtotal = items.reduce((sum, item) => sum + (item.quantity * item.price), 0);
    const service = deliveryServices.find(s => s.name === deliveryServiceName);
    const deliveryFee = service ? parseFloat(service.price.replace('k.00', '')) * 100 : 0;
    return {
      subtotal,
      deliveryFee,
      total: subtotal + deliveryFee
    };
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleItemChange = (index, field, value) => {
    const updatedItems = [...formData.items];
    updatedItems[index][field] = field === 'quantity' || field === 'price' ? 
      parseFloat(value) || 0 : value;
    setFormData(prev => ({
      ...prev,
      items: updatedItems
    }));
  };

  const addItem = () => {
    setFormData(prev => ({
      ...prev,
      items: [...prev.items, { name: '', quantity: 1, price: 0, category: 'Food' }]
    }));
  };

  const removeItem = (index) => {
    if (formData.items.length > 1) {
      setFormData(prev => ({
        ...prev,
        items: prev.items.filter((_, i) => i !== index)
      }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    const selectedCustomer = customers.find(c => c.id === formData.customerId);
    const selectedService = deliveryServices.find(s => s.name === formData.deliveryService);
    
    if (!selectedCustomer || !selectedService) {
      alert('Please select a customer and delivery service');
      return;
    }

    const totals = calculateTotal(formData.items, formData.deliveryService);
    
    const orderData = {
      customerId: formData.customerId,
      customerName: selectedCustomer.name,
      customerPhone: selectedCustomer.phone,
      customerAddress: selectedCustomer.address,
      items: formData.items,
      deliveryService: formData.deliveryService,
      deliveryFee: totals.deliveryFee,
      subtotal: totals.subtotal,
      total: totals.total,
      paymentMethod: formData.paymentMethod,
      paymentStatus: formData.paymentMethod === 'Cash on Delivery' ? 'Pending' : 'Paid',
      estimatedDelivery: formData.estimatedDelivery,
      specialInstructions: formData.specialInstructions
    };

    if (editingOrder) {
      updateOrderStatus(editingOrder.id, formData.status || 'Pending');
    } else {
      addOrder(orderData);
    }
    
    setFormData({
      customerId: '',
      items: [{ name: '', quantity: 1, price: 0, category: 'Food' }],
      deliveryService: '',
      paymentMethod: 'Cash on Delivery',
      specialInstructions: '',
      estimatedDelivery: ''
    });
    setShowModal(false);
    setEditingOrder(null);
  };

  const filteredOrders = orders.filter(order => {
    const matchesSearch = order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
                        order.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                        order.customerPhone.includes(searchTerm);
    const matchesStatus = filterStatus === 'All' || order.status === filterStatus;
    const matchesPayment = filterPayment === 'All' || order.paymentStatus === filterPayment;
    
    return matchesSearch && matchesStatus && matchesPayment;
  });

  const stats = getOrderStats();

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '50vh' }}>
        <div>Loading orders...</div>
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
          Place new orders, track existing orders, and manage the complete order lifecycle.
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
              <p style={{ color: '#6B7280', fontSize: '14px', margin: '0 0 5px 0' }}>Total Orders</p>
              <p style={{ fontSize: '24px', fontWeight: 'bold', color: '#1F2937', margin: 0 }}>
                {stats.totalOrders}
              </p>
              <p style={{ color: '#10B981', fontSize: '12px', margin: '5px 0 0 0' }}>
                +{Math.floor(stats.totalOrders * 0.1)} today
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
              <p style={{ color: '#6B7280', fontSize: '14px', margin: '0 0 5px 0' }}>In Progress</p>
              <p style={{ fontSize: '24px', fontWeight: 'bold', color: '#8B5CF6', margin: 0 }}>
                {stats.inProgressOrders}
              </p>
              <p style={{ color: '#8B5CF6', fontSize: '12px', margin: '5px 0 0 0' }}>
                Being delivered
              </p>
            </div>
            <FaExclamationTriangle style={{ fontSize: '24px', color: '#8B5CF6' }} />
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
                Rs. {stats.totalRevenue.toLocaleString()}
              </p>
              <p style={{ color: '#10B981', fontSize: '12px', margin: '5px 0 0 0' }}>
                Avg: Rs. {stats.averageOrderValue.toFixed(0)}
              </p>
            </div>
            <FaDollarSign style={{ fontSize: '24px', color: '#10B981' }} />
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
            {statusOptions.map(status => (
              <option key={status} value={status}>{status}</option>
            ))}
          </select>

          <select
            value={filterPayment}
            onChange={(e) => setFilterPayment(e.target.value)}
            style={{
              padding: '10px 15px',
              border: '1px solid #D1D5DB',
              borderRadius: '8px',
              fontSize: '14px',
              background: 'white'
            }}
          >
            <option value="All">All Payment</option>
            <option value="Paid">Paid</option>
            <option value="Pending">Pending</option>
            <option value="Refunded">Refunded</option>
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
          Place New Order
        </button>
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
                <th style={{ padding: '16px', textAlign: 'left', fontWeight: '600', color: '#374151' }}>Items</th>
                <th style={{ padding: '16px', textAlign: 'left', fontWeight: '600', color: '#374151' }}>Delivery Service</th>
                <th style={{ padding: '16px', textAlign: 'left', fontWeight: '600', color: '#374151' }}>Total</th>
                <th style={{ padding: '16px', textAlign: 'left', fontWeight: '600', color: '#374151' }}>Status</th>
                <th style={{ padding: '16px', textAlign: 'left', fontWeight: '600', color: '#374151' }}>Payment</th>
                <th style={{ padding: '16px', textAlign: 'left', fontWeight: '600', color: '#374151' }}>Order Date</th>
                <th style={{ padding: '16px', textAlign: 'center', fontWeight: '600', color: '#374151' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredOrders.map((order) => (
                <tr key={order.id} style={{ borderBottom: '1px solid #F3F4F6' }}>
                  <td style={{ padding: '16px' }}>
                    <div style={{ fontWeight: '600', color: '#1F2937', fontSize: '14px' }}>
                      {order.id}
                    </div>
                  </td>
                  <td style={{ padding: '16px' }}>
                    <div>
                      <div style={{ fontWeight: '500', color: '#1F2937', fontSize: '14px' }}>
                        {order.customerName}
                      </div>
                      <div style={{ color: '#6B7280', fontSize: '12px' }}>
                        {order.customerPhone}
                      </div>
                    </div>
                  </td>
                  <td style={{ padding: '16px' }}>
                    <div style={{ maxWidth: '200px' }}>
                      {order.items.map((item, index) => (
                        <div key={index} style={{ fontSize: '12px', color: '#374151', marginBottom: '2px' }}>
                          {item.quantity}x {item.name}
                        </div>
                      ))}
                    </div>
                  </td>
                  <td style={{ padding: '16px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      {getServiceIcon(order.deliveryService)}
                      <span style={{ fontSize: '14px', color: '#374151' }}>{order.deliveryService}</span>
                    </div>
                  </td>
                  <td style={{ padding: '16px', color: '#059669', fontSize: '14px', fontWeight: '500' }}>
                    Rs. {order.total.toLocaleString()}
                  </td>
                  <td style={{ padding: '16px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      {getStatusIcon(order.status)}
                      <span style={{ fontSize: '14px', color: '#374151' }}>{order.status}</span>
                    </div>
                  </td>
                  <td style={{ padding: '16px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      {getPaymentIcon(order.paymentMethod)}
                      <div>
                        <div style={{ fontSize: '12px', color: '#374151' }}>{order.paymentMethod}</div>
                        <div style={{ fontSize: '11px', color: '#6B7280' }}>{order.paymentStatus}</div>
                      </div>
                    </div>
                  </td>
                  <td style={{ padding: '16px', color: '#6B7280', fontSize: '14px' }}>
                    {new Date(order.orderDate).toLocaleDateString()}
                  </td>
                  <td style={{ padding: '16px', textAlign: 'center' }}>
                    <div style={{ display: 'flex', gap: '4px', justifyContent: 'center' }}>
                      <button
                        onClick={() => updateOrderStatus(order.id, 'Delivered')}
                        disabled={order.status === 'Delivered' || order.status === 'Cancelled'}
                        style={{
                          background: order.status === 'Delivered' ? '#D1D5DB' : '#10B981',
                          color: 'white',
                          border: 'none',
                          padding: '6px 10px',
                          borderRadius: '4px',
                          cursor: order.status === 'Delivered' ? 'not-allowed' : 'pointer',
                          fontSize: '11px'
                        }}
                      >
                        Complete
                      </button>
                      <button
                        onClick={() => updateOrderStatus(order.id, 'Cancelled', { cancellationReason: 'Cancelled by admin' })}
                        disabled={order.status === 'Delivered' || order.status === 'Cancelled'}
                        style={{
                          background: order.status === 'Cancelled' ? '#D1D5DB' : '#EF4444',
                          color: 'white',
                          border: 'none',
                          padding: '6px 10px',
                          borderRadius: '4px',
                          cursor: order.status === 'Cancelled' ? 'not-allowed' : 'pointer',
                          fontSize: '11px'
                        }}
                      >
                        Cancel
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
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
            maxWidth: '800px',
            maxHeight: '90vh',
            overflowY: 'auto'
          }}>
            <h2 style={{ 
              fontSize: '20px', 
              fontWeight: 'bold', 
              marginBottom: '20px',
              color: '#1F2937'
            }}>
              Place New Order
            </h2>

            <form onSubmit={handleSubmit}>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '20px' }}>
                <div>
                  <label style={{ display: 'block', marginBottom: '5px', fontWeight: '500', color: '#374151' }}>
                    Customer *
                  </label>
                  <select
                    name="customerId"
                    value={formData.customerId}
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
                    <option value="">Select Customer</option>
                    {customers.map(customer => (
                      <option key={customer.id} value={customer.id}>
                        {customer.name} - {customer.phone}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label style={{ display: 'block', marginBottom: '5px', fontWeight: '500', color: '#374151' }}>
                    Delivery Service *
                  </label>
                  <select
                    name="deliveryService"
                    value={formData.deliveryService}
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
                    <option value="">Select Service</option>
                    {deliveryServices.map(service => (
                      <option key={service.id} value={service.name}>
                        {service.name} - {service.price} ({service.time})
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label style={{ display: 'block', marginBottom: '5px', fontWeight: '500', color: '#374151' }}>
                    Payment Method *
                  </label>
                  <select
                    name="paymentMethod"
                    value={formData.paymentMethod}
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
                    {paymentMethods.map(method => (
                      <option key={method} value={method}>{method}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label style={{ display: 'block', marginBottom: '5px', fontWeight: '500', color: '#374151' }}>
                    Estimated Delivery Time
                  </label>
                  <input
                    type="datetime-local"
                    name="estimatedDelivery"
                    value={formData.estimatedDelivery}
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

                <div style={{ gridColumn: '1 / -1' }}>
                  <label style={{ display: 'block', marginBottom: '10px', fontWeight: '500', color: '#374151' }}>
                    Order Items *
                  </label>
                  {formData.items.map((item, index) => (
                    <div key={index} style={{ 
                      display: 'grid', 
                      gridTemplateColumns: '2fr 1fr 1fr 1fr auto', 
                      gap: '10px', 
                      marginBottom: '10px',
                      alignItems: 'end'
                    }}>
                      <input
                        type="text"
                        placeholder="Item name"
                        value={item.name}
                        onChange={(e) => handleItemChange(index, 'name', e.target.value)}
                        required
                        style={{
                          padding: '10px',
                          border: '1px solid #D1D5DB',
                          borderRadius: '6px',
                          fontSize: '14px'
                        }}
                      />
                      <select
                        value={item.category}
                        onChange={(e) => handleItemChange(index, 'category', e.target.value)}
                        style={{
                          padding: '10px',
                          border: '1px solid #D1D5DB',
                          borderRadius: '6px',
                          fontSize: '14px'
                        }}
                      >
                        {categories.map(category => (
                          <option key={category} value={category}>{category}</option>
                        ))}
                      </select>
                      <input
                        type="number"
                        placeholder="Qty"
                        min="1"
                        value={item.quantity}
                        onChange={(e) => handleItemChange(index, 'quantity', e.target.value)}
                        required
                        style={{
                          padding: '10px',
                          border: '1px solid #D1D5DB',
                          borderRadius: '6px',
                          fontSize: '14px'
                        }}
                      />
                      <input
                        type="number"
                        placeholder="Price"
                        min="0"
                        step="0.01"
                        value={item.price}
                        onChange={(e) => handleItemChange(index, 'price', e.target.value)}
                        required
                        style={{
                          padding: '10px',
                          border: '1px solid #D1D5DB',
                          borderRadius: '6px',
                          fontSize: '14px'
                        }}
                      />
                      <button
                        type="button"
                        onClick={() => removeItem(index)}
                        disabled={formData.items.length === 1}
                        style={{
                          background: formData.items.length === 1 ? '#D1D5DB' : '#EF4444',
                          color: 'white',
                          border: 'none',
                          padding: '10px',
                          borderRadius: '6px',
                          cursor: formData.items.length === 1 ? 'not-allowed' : 'pointer',
                          fontSize: '14px'
                        }}
                      >
                        <FaTrash />
                      </button>
                    </div>
                  ))}
                  <button
                    type="button"
                    onClick={addItem}
                    style={{
                      background: '#3B82F6',
                      color: 'white',
                      border: 'none',
                      padding: '10px 20px',
                      borderRadius: '6px',
                      cursor: 'pointer',
                      fontSize: '14px',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                      marginTop: '10px'
                    }}
                  >
                    <FaPlus />
                    Add Item
                  </button>
                </div>

                <div style={{ gridColumn: '1 / -1' }}>
                  <label style={{ display: 'block', marginBottom: '5px', fontWeight: '500', color: '#374151' }}>
                    Special Instructions
                  </label>
                  <textarea
                    name="specialInstructions"
                    value={formData.specialInstructions}
                    onChange={handleInputChange}
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

                {/* Order Summary */}
                {formData.customerId && formData.deliveryService && (
                  <div style={{ 
                    gridColumn: '1 / -1',
                    background: '#F9FAFB',
                    padding: '20px',
                    borderRadius: '8px',
                    border: '1px solid #E5E7EB'
                  }}>
                    <h4 style={{ margin: '0 0 15px 0', color: '#1F2937' }}>Order Summary</h4>
                    {formData.items.map((item, index) => (
                      <div key={index} style={{ 
                        display: 'flex', 
                        justifyContent: 'space-between', 
                        marginBottom: '5px',
                        fontSize: '14px'
                      }}>
                        <span>{item.quantity}x {item.name}</span>
                        <span>Rs. {(item.quantity * item.price).toLocaleString()}</span>
                      </div>
                    ))}
                    <div style={{ 
                      display: 'flex', 
                      justifyContent: 'space-between', 
                      marginBottom: '5px',
                      fontSize: '14px',
                      fontWeight: '500'
                    }}>
                      <span>Subtotal:</span>
                      <span>Rs. {calculateTotal(formData.items, formData.deliveryService).subtotal.toLocaleString()}</span>
                    </div>
                    <div style={{ 
                      display: 'flex', 
                      justifyContent: 'space-between', 
                      marginBottom: '10px',
                      fontSize: '14px',
                      fontWeight: '500'
                    }}>
                      <span>Delivery Fee:</span>
                      <span>Rs. {calculateTotal(formData.items, formData.deliveryService).deliveryFee.toLocaleString()}</span>
                    </div>
                    <div style={{ 
                      display: 'flex', 
                      justifyContent: 'space-between',
                      fontSize: '16px',
                      fontWeight: 'bold',
                      color: '#059669',
                      borderTop: '1px solid #E5E7EB',
                      paddingTop: '10px'
                    }}>
                      <span>Total:</span>
                      <span>Rs. {calculateTotal(formData.items, formData.deliveryService).total.toLocaleString()}</span>
                    </div>
                  </div>
                )}
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
                    setEditingOrder(null);
                    setFormData({
                      customerId: '',
                      items: [{ name: '', quantity: 1, price: 0, category: 'Food' }],
                      deliveryService: '',
                      paymentMethod: 'Cash on Delivery',
                      specialInstructions: '',
                      estimatedDelivery: ''
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
                  Place Order
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default OrderPlacement;

