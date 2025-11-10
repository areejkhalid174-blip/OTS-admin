import React, { useState, useEffect } from 'react';
import { useDeliveryService } from '../context/DeliveryServiceContext';
import { 
  FaPlus, 
  FaEdit, 
  FaTrash, 
  FaSearch, 
  FaFilter,
  FaBicycle,
  FaMotorcycle,
  FaCar,
  FaTruck,
  FaCheckCircle,
  FaExclamationTriangle,
  FaTimesCircle,
  FaClock,
  FaDollarSign
} from 'react-icons/fa';

const DeliveryServiceManagement = () => {
  const { deliveryServices, loading, addDeliveryService, updateDeliveryService, deleteDeliveryService } = useDeliveryService();
  const [showModal, setShowModal] = useState(false);
  const [editingService, setEditingService] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('All');
  const [formData, setFormData] = useState({
    name: '',
    price: '',
    time: '',
    icon: 'bicycle',
    description: '',
    status: 'Active',
    maxDistance: '',
    weightLimit: ''
  });

  const iconOptions = [
    { value: 'bicycle', label: 'Bicycle', icon: FaBicycle },
    { value: 'motorcycle', label: 'Motorcycle', icon: FaMotorcycle },
    { value: 'car', label: 'Car', icon: FaCar },
    { value: 'van', label: 'Van', icon: FaTruck },
    { value: 'express', label: 'Express', icon: FaClock }
  ];

  const statusOptions = ['Active', 'Inactive', 'Maintenance'];

  const getStatusIcon = (status) => {
    switch (status) {
      case 'Active':
        return <FaCheckCircle style={{ color: '#10B981' }} />;
      case 'Maintenance':
        return <FaExclamationTriangle style={{ color: '#F59E0B' }} />;
      case 'Inactive':
        return <FaTimesCircle style={{ color: '#EF4444' }} />;
      default:
        return <FaCheckCircle style={{ color: '#10B981' }} />;
    }
  };

  const getServiceIcon = (iconType) => {
    const iconOption = iconOptions.find(option => option.value === iconType);
    return iconOption ? <iconOption.icon style={{ fontSize: '20px', color: '#667eea' }} /> : <FaCar />;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (editingService) {
      updateDeliveryService(editingService.id, formData);
    } else {
      addDeliveryService(formData);
    }
    
    setFormData({
      name: '',
      price: '',
      time: '',
      icon: 'bicycle',
      description: '',
      status: 'Active',
      maxDistance: '',
      weightLimit: ''
    });
    setShowModal(false);
    setEditingService(null);
  };

  const handleEdit = (service) => {
    setEditingService(service);
    setFormData({
      name: service.name,
      price: service.price,
      time: service.time,
      icon: service.icon,
      description: service.description || '',
      status: service.status,
      maxDistance: service.maxDistance || '',
      weightLimit: service.weightLimit || ''
    });
    setShowModal(true);
  };

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this delivery service?')) {
      deleteDeliveryService(id);
    }
  };

  const filteredServices = deliveryServices.filter(service => {
    const matchesSearch = service.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                        service.description?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'All' || service.status === filterStatus;
    
    return matchesSearch && matchesStatus;
  });

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '50vh' }}>
        <div>Loading delivery services...</div>
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
          Delivery Service Management
        </h1>
        <p style={{ color: '#6B7280', fontSize: '16px' }}>
          Manage your delivery services, pricing, and availability.
        </p>
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
              placeholder="Search services..."
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
          Add Service
        </button>
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
              <p style={{ color: '#6B7280', fontSize: '14px', margin: '0 0 5px 0' }}>Total Services</p>
              <p style={{ fontSize: '24px', fontWeight: 'bold', color: '#1F2937', margin: 0 }}>
                {deliveryServices.length}
              </p>
            </div>
            <FaTruck style={{ fontSize: '24px', color: '#667eea' }} />
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
              <p style={{ color: '#6B7280', fontSize: '14px', margin: '0 0 5px 0' }}>Active Services</p>
              <p style={{ fontSize: '24px', fontWeight: 'bold', color: '#10B981', margin: 0 }}>
                {deliveryServices.filter(s => s.status === 'Active').length}
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
              <p style={{ color: '#6B7280', fontSize: '14px', margin: '0 0 5px 0' }}>Average Price</p>
              <p style={{ fontSize: '24px', fontWeight: 'bold', color: '#F59E0B', margin: 0 }}>
                {deliveryServices.length > 0 ? 
                  (deliveryServices.reduce((sum, s) => sum + parseFloat(s.price.replace('k.00', '')), 0) / deliveryServices.length).toFixed(1) + 'k' 
                  : '0k'
                }
              </p>
            </div>
            <FaDollarSign style={{ fontSize: '24px', color: '#F59E0B' }} />
          </div>
        </div>
      </div>

      {/* Services Grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))',
        gap: '20px'
      }}>
        {filteredServices.map((service) => (
          <div key={service.id} style={{
            background: 'white',
            borderRadius: '12px',
            boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
            border: '1px solid #E5E7EB',
            padding: '20px',
            transition: 'all 0.3s ease'
          }}
          onMouseOver={(e) => {
            e.currentTarget.style.transform = 'translateY(-2px)';
            e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.15)';
          }}
          onMouseOut={(e) => {
            e.currentTarget.style.transform = 'translateY(0)';
            e.currentTarget.style.boxShadow = '0 1px 3px rgba(0,0,0,0.1)';
          }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '15px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div style={{ 
                  width: '50px', 
                  height: '50px', 
                  background: '#F3F4F6', 
                  borderRadius: '12px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#667eea'
                }}>
                  {getServiceIcon(service.icon)}
                </div>
                <div>
                  <h3 style={{ 
                    fontSize: '18px', 
                    fontWeight: 'bold', 
                    color: '#1F2937', 
                    margin: '0 0 5px 0' 
                  }}>
                    {service.name}
                  </h3>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    {getStatusIcon(service.status)}
                    <span style={{ fontSize: '14px', color: '#374151' }}>{service.status}</span>
                  </div>
                </div>
              </div>
            </div>

            <div style={{ marginBottom: '15px' }}>
              <p style={{ color: '#6B7280', fontSize: '14px', margin: '0 0 10px 0' }}>
                {service.description || 'No description available'}
              </p>
            </div>

            <div style={{ 
              display: 'grid', 
              gridTemplateColumns: '1fr 1fr', 
              gap: '10px', 
              marginBottom: '20px' 
            }}>
              <div style={{ 
                background: '#F9FAFB', 
                padding: '10px', 
                borderRadius: '8px',
                textAlign: 'center'
              }}>
                <div style={{ fontSize: '12px', color: '#6B7280', marginBottom: '2px' }}>Price</div>
                <div style={{ fontSize: '16px', fontWeight: 'bold', color: '#1F2937' }}>
                  {service.price}
                </div>
              </div>
              <div style={{ 
                background: '#F9FAFB', 
                padding: '10px', 
                borderRadius: '8px',
                textAlign: 'center'
              }}>
                <div style={{ fontSize: '12px', color: '#6B7280', marginBottom: '2px' }}>Delivery Time</div>
                <div style={{ fontSize: '14px', fontWeight: 'bold', color: '#1F2937' }}>
                  {service.time}
                </div>
              </div>
            </div>

            {(service.maxDistance || service.weightLimit) && (
              <div style={{ 
                display: 'grid', 
                gridTemplateColumns: service.maxDistance && service.weightLimit ? '1fr 1fr' : '1fr', 
                gap: '10px', 
                marginBottom: '20px' 
              }}>
                {service.maxDistance && (
                  <div style={{ 
                    background: '#F0FDF4', 
                    padding: '8px', 
                    borderRadius: '6px',
                    textAlign: 'center'
                  }}>
                    <div style={{ fontSize: '12px', color: '#059669', marginBottom: '2px' }}>Max Distance</div>
                    <div style={{ fontSize: '14px', fontWeight: 'bold', color: '#065F46' }}>
                      {service.maxDistance}
                    </div>
                  </div>
                )}
                {service.weightLimit && (
                  <div style={{ 
                    background: '#FEF3C7', 
                    padding: '8px', 
                    borderRadius: '6px',
                    textAlign: 'center'
                  }}>
                    <div style={{ fontSize: '12px', color: '#D97706', marginBottom: '2px' }}>Weight Limit</div>
                    <div style={{ fontSize: '14px', fontWeight: 'bold', color: '#92400E' }}>
                      {service.weightLimit}
                    </div>
                  </div>
                )}
              </div>
            )}

            <div style={{ display: 'flex', gap: '10px' }}>
              <button
                onClick={() => handleEdit(service)}
                style={{
                  flex: 1,
                  background: '#3B82F6',
                  color: 'white',
                  border: 'none',
                  padding: '10px',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  fontSize: '14px',
                  fontWeight: '500',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '6px'
                }}
              >
                <FaEdit />
                Edit
              </button>
              <button
                onClick={() => handleDelete(service.id)}
                style={{
                  flex: 1,
                  background: '#EF4444',
                  color: 'white',
                  border: 'none',
                  padding: '10px',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  fontSize: '14px',
                  fontWeight: '500',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '6px'
                }}
              >
                <FaTrash />
                Delete
              </button>
            </div>
          </div>
        ))}
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
            maxWidth: '500px',
            maxHeight: '90vh',
            overflowY: 'auto'
          }}>
            <h2 style={{ 
              fontSize: '20px', 
              fontWeight: 'bold', 
              marginBottom: '20px',
              color: '#1F2937'
            }}>
              {editingService ? 'Edit Delivery Service' : 'Add New Delivery Service'}
            </h2>

            <form onSubmit={handleSubmit}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                <div>
                  <label style={{ display: 'block', marginBottom: '5px', fontWeight: '500', color: '#374151' }}>
                    Service Name *
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
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
                    Price *
                  </label>
                  <input
                    type="text"
                    name="price"
                    value={formData.price}
                    onChange={handleInputChange}
                    required
                    placeholder="e.g., 1k.00, 2k.50"
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
                    Delivery Time *
                  </label>
                  <input
                    type="text"
                    name="time"
                    value={formData.time}
                    onChange={handleInputChange}
                    required
                    placeholder="e.g., 60 mins to deliver"
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
                    Icon *
                  </label>
                  <select
                    name="icon"
                    value={formData.icon}
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
                    {iconOptions.map(option => (
                      <option key={option.value} value={option.value}>{option.label}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label style={{ display: 'block', marginBottom: '5px', fontWeight: '500', color: '#374151' }}>
                    Description
                  </label>
                  <textarea
                    name="description"
                    value={formData.description}
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

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
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

                  <div>
                    <label style={{ display: 'block', marginBottom: '5px', fontWeight: '500', color: '#374151' }}>
                      Max Distance
                    </label>
                    <input
                      type="text"
                      name="maxDistance"
                      value={formData.maxDistance}
                      onChange={handleInputChange}
                      placeholder="e.g., 10 km"
                      style={{
                        width: '100%',
                        padding: '10px',
                        border: '1px solid #D1D5DB',
                        borderRadius: '6px',
                        fontSize: '14px'
                      }}
                    />
                  </div>
                </div>

                <div>
                  <label style={{ display: 'block', marginBottom: '5px', fontWeight: '500', color: '#374151' }}>
                    Weight Limit
                  </label>
                  <input
                    type="text"
                    name="weightLimit"
                    value={formData.weightLimit}
                    onChange={handleInputChange}
                    placeholder="e.g., 5 kg"
                    style={{
                      width: '100%',
                      padding: '10px',
                      border: '1px solid #D1D5DB',
                      borderRadius: '6px',
                      fontSize: '14px'
                    }}
                  />
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
                    setEditingService(null);
                    setFormData({
                      name: '',
                      price: '',
                      time: '',
                      icon: 'bicycle',
                      description: '',
                      status: 'Active',
                      maxDistance: '',
                      weightLimit: ''
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
                  {editingService ? 'Update Service' : 'Add Service'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default DeliveryServiceManagement;


