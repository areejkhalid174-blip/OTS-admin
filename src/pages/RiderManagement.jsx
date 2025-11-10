import React, { useState, useEffect } from 'react';
import { useRider } from '../context/RiderContext';
import { 
  FaPlus, 
  FaEdit, 
  FaTrash, 
  FaSearch, 
  FaUser,
  FaMotorcycle,
  FaCar,
  FaTruck,
  FaCheckCircle,
  FaExclamationTriangle,
  FaTimesCircle,
  FaStar,
  FaMapMarkerAlt,
  FaPhone,
  FaEnvelope,
  FaIdCard,
  FaCalendarAlt
} from 'react-icons/fa';

const RiderManagement = () => {
  const { riders, loading, addRider, updateRider, deleteRider, getAvailableRiders } = useRider();
  const [showModal, setShowModal] = useState(false);
  const [editingRider, setEditingRider] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('All');
  const [filterAvailability, setFilterAvailability] = useState('All');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    cnic: '',
    address: '',
    licenseNumber: '',
    licenseExpiry: '',
    vehicleType: 'Motorcycle',
    vehicleNumber: '',
    status: 'Active',
    availability: 'Available',
    bankAccount: '',
    emergencyContact: ''
  });

  const vehicleTypes = ['Motorcycle', 'Car', 'Van', 'Truck'];
  const statusOptions = ['Active', 'Inactive', 'Suspended'];
  const availabilityOptions = ['Available', 'Busy', 'Offline'];

  const getStatusIcon = (status) => {
    switch (status) {
      case 'Active':
        return <FaCheckCircle style={{ color: '#10B981' }} />;
      case 'Inactive':
        return <FaExclamationTriangle style={{ color: '#F59E0B' }} />;
      case 'Suspended':
        return <FaTimesCircle style={{ color: '#EF4444' }} />;
      default:
        return <FaCheckCircle style={{ color: '#10B981' }} />;
    }
  };

  const getAvailabilityIcon = (availability) => {
    switch (availability) {
      case 'Available':
        return <FaCheckCircle style={{ color: '#10B981' }} />;
      case 'Busy':
        return <FaExclamationTriangle style={{ color: '#F59E0B' }} />;
      case 'Offline':
        return <FaTimesCircle style={{ color: '#6B7280' }} />;
      default:
        return <FaCheckCircle style={{ color: '#10B981' }} />;
    }
  };

  const getVehicleTypeIcon = (type) => {
    switch (type) {
      case 'Motorcycle':
        return <FaMotorcycle />;
      case 'Car':
        return <FaCar />;
      case 'Van':
      case 'Truck':
        return <FaTruck />;
      default:
        return <FaMotorcycle />;
    }
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
    
    if (editingRider) {
      updateRider(editingRider.id, formData);
    } else {
      addRider(formData);
    }
    
    setFormData({
      name: '',
      email: '',
      phone: '',
      cnic: '',
      address: '',
      licenseNumber: '',
      licenseExpiry: '',
      vehicleType: 'Motorcycle',
      vehicleNumber: '',
      status: 'Active',
      availability: 'Available',
      bankAccount: '',
      emergencyContact: ''
    });
    setShowModal(false);
    setEditingRider(null);
  };

  const handleEdit = (rider) => {
    setEditingRider(rider);
    setFormData({
      name: rider.name,
      email: rider.email,
      phone: rider.phone,
      cnic: rider.cnic,
      address: rider.address,
      licenseNumber: rider.licenseNumber,
      licenseExpiry: rider.licenseExpiry,
      vehicleType: rider.vehicleType,
      vehicleNumber: rider.vehicleNumber,
      status: rider.status,
      availability: rider.availability,
      bankAccount: rider.bankAccount,
      emergencyContact: rider.emergencyContact
    });
    setShowModal(true);
  };

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this rider?')) {
      deleteRider(id);
    }
  };

  const filteredRiders = riders.filter(rider => {
    const matchesSearch = rider.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                        rider.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                        rider.phone.includes(searchTerm) ||
                        rider.vehicleNumber.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'All' || rider.status === filterStatus;
    const matchesAvailability = filterAvailability === 'All' || rider.availability === filterAvailability;
    
    return matchesSearch && matchesStatus && matchesAvailability;
  });

  const availableRiders = getAvailableRiders();
  const activeRiders = riders.filter(r => r.status === 'Active');
  const averageRating = riders.length > 0 ? 
    (riders.reduce((sum, r) => sum + r.rating, 0) / riders.length).toFixed(1) : 0;

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '50vh' }}>
        <div>Loading riders...</div>
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
          Rider Management
        </h1>
        <p style={{ color: '#6B7280', fontSize: '16px' }}>
          Manage delivery riders, track their performance, and monitor availability.
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
              <p style={{ color: '#6B7280', fontSize: '14px', margin: '0 0 5px 0' }}>Total Riders</p>
              <p style={{ fontSize: '24px', fontWeight: 'bold', color: '#1F2937', margin: 0 }}>
                {riders.length}
              </p>
              <p style={{ color: '#10B981', fontSize: '12px', margin: '5px 0 0 0' }}>
                +{Math.floor(riders.length * 0.1)} this month
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
              <p style={{ color: '#6B7280', fontSize: '14px', margin: '0 0 5px 0' }}>Active Riders</p>
              <p style={{ fontSize: '24px', fontWeight: 'bold', color: '#10B981', margin: 0 }}>
                {activeRiders.length}
              </p>
              <p style={{ color: '#10B981', fontSize: '12px', margin: '5px 0 0 0' }}>
                Currently Online
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
              <p style={{ color: '#6B7280', fontSize: '14px', margin: '0 0 5px 0' }}>Average Rating</p>
              <p style={{ fontSize: '24px', fontWeight: 'bold', color: '#F59E0B', margin: 0 }}>
                {averageRating}
              </p>
              <p style={{ color: '#F59E0B', fontSize: '12px', margin: '5px 0 0 0' }}>
                out of 5.0
              </p>
            </div>
            <FaStar style={{ fontSize: '24px', color: '#F59E0B' }} />
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
              <p style={{ color: '#6B7280', fontSize: '14px', margin: '0 0 5px 0' }}>Available Now</p>
              <p style={{ fontSize: '24px', fontWeight: 'bold', color: '#3B82F6', margin: 0 }}>
                {availableRiders.length}
              </p>
              <p style={{ color: '#3B82F6', fontSize: '12px', margin: '5px 0 0 0' }}>
                Ready for orders
              </p>
            </div>
            <FaMapMarkerAlt style={{ fontSize: '24px', color: '#3B82F6' }} />
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
              placeholder="Search riders..."
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
            value={filterAvailability}
            onChange={(e) => setFilterAvailability(e.target.value)}
            style={{
              padding: '10px 15px',
              border: '1px solid #D1D5DB',
              borderRadius: '8px',
              fontSize: '14px',
              background: 'white'
            }}
          >
            <option value="All">All Availability</option>
            {availabilityOptions.map(availability => (
              <option key={availability} value={availability}>{availability}</option>
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
          Add Rider
        </button>
      </div>

      {/* Riders Table */}
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
                <th style={{ padding: '16px', textAlign: 'left', fontWeight: '600', color: '#374151' }}>Rider</th>
                <th style={{ padding: '16px', textAlign: 'left', fontWeight: '600', color: '#374151' }}>Contact</th>
                <th style={{ padding: '16px', textAlign: 'left', fontWeight: '600', color: '#374151' }}>Vehicle</th>
                <th style={{ padding: '16px', textAlign: 'left', fontWeight: '600', color: '#374151' }}>Status</th>
                <th style={{ padding: '16px', textAlign: 'left', fontWeight: '600', color: '#374151' }}>Availability</th>
                <th style={{ padding: '16px', textAlign: 'left', fontWeight: '600', color: '#374151' }}>Rating</th>
                <th style={{ padding: '16px', textAlign: 'left', fontWeight: '600', color: '#374151' }}>Deliveries</th>
                <th style={{ padding: '16px', textAlign: 'center', fontWeight: '600', color: '#374151' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredRiders.map((rider) => (
                <tr key={rider.id} style={{ borderBottom: '1px solid #F3F4F6' }}>
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
                        {rider.name.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <div style={{ fontWeight: '600', color: '#1F2937', fontSize: '14px' }}>
                          {rider.name}
                        </div>
                        <div style={{ color: '#6B7280', fontSize: '12px' }}>
                          ID: {rider.id}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td style={{ padding: '16px' }}>
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '4px' }}>
                        <FaPhone style={{ fontSize: '12px', color: '#6B7280' }} />
                        <span style={{ fontSize: '14px', color: '#1F2937' }}>{rider.phone}</span>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <FaEnvelope style={{ fontSize: '12px', color: '#6B7280' }} />
                        <span style={{ fontSize: '12px', color: '#6B7280' }}>{rider.email}</span>
                      </div>
                    </div>
                  </td>
                  <td style={{ padding: '16px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      {getVehicleTypeIcon(rider.vehicleType)}
                      <div>
                        <div style={{ fontSize: '14px', color: '#1F2937', fontWeight: '500' }}>
                          {rider.vehicleNumber}
                        </div>
                        <div style={{ fontSize: '12px', color: '#6B7280' }}>
                          {rider.vehicleType}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td style={{ padding: '16px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      {getStatusIcon(rider.status)}
                      <span style={{ fontSize: '14px', color: '#374151' }}>{rider.status}</span>
                    </div>
                  </td>
                  <td style={{ padding: '16px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      {getAvailabilityIcon(rider.availability)}
                      <span style={{ fontSize: '14px', color: '#374151' }}>{rider.availability}</span>
                    </div>
                  </td>
                  <td style={{ padding: '16px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <FaStar style={{ color: '#F59E0B', fontSize: '14px' }} />
                      <span style={{ fontSize: '14px', color: '#1F2937', fontWeight: '500' }}>
                        {rider.rating.toFixed(1)}
                      </span>
                    </div>
                  </td>
                  <td style={{ padding: '16px', color: '#6B7280', fontSize: '14px' }}>
                    {rider.totalDeliveries}
                  </td>
                  <td style={{ padding: '16px', textAlign: 'center' }}>
                    <div style={{ display: 'flex', gap: '8px', justifyContent: 'center' }}>
                      <button
                        onClick={() => handleEdit(rider)}
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
                        onClick={() => handleDelete(rider.id)}
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
              {editingRider ? 'Edit Rider' : 'Add New Rider'}
            </h2>

            <form onSubmit={handleSubmit}>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '20px' }}>
                <div>
                  <label style={{ display: 'block', marginBottom: '5px', fontWeight: '500', color: '#374151' }}>
                    Full Name *
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
                    CNIC *
                  </label>
                  <input
                    type="text"
                    name="cnic"
                    value={formData.cnic}
                    onChange={handleInputChange}
                    required
                    placeholder="12345-1234567-1"
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
                  <label style={{ display: 'block', marginBottom: '5px', fontWeight: '500', color: '#374151' }}>
                    Address *
                  </label>
                  <textarea
                    name="address"
                    value={formData.address}
                    onChange={handleInputChange}
                    required
                    rows="2"
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
                    License Number *
                  </label>
                  <input
                    type="text"
                    name="licenseNumber"
                    value={formData.licenseNumber}
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
                    License Expiry *
                  </label>
                  <input
                    type="date"
                    name="licenseExpiry"
                    value={formData.licenseExpiry}
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
                    Vehicle Type *
                  </label>
                  <select
                    name="vehicleType"
                    value={formData.vehicleType}
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
                    {vehicleTypes.map(type => (
                      <option key={type} value={type}>{type}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label style={{ display: 'block', marginBottom: '5px', fontWeight: '500', color: '#374151' }}>
                    Vehicle Number *
                  </label>
                  <input
                    type="text"
                    name="vehicleNumber"
                    value={formData.vehicleNumber}
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
                    Availability *
                  </label>
                  <select
                    name="availability"
                    value={formData.availability}
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
                    {availabilityOptions.map(availability => (
                      <option key={availability} value={availability}>{availability}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label style={{ display: 'block', marginBottom: '5px', fontWeight: '500', color: '#374151' }}>
                    Bank Account
                  </label>
                  <input
                    type="text"
                    name="bankAccount"
                    value={formData.bankAccount}
                    onChange={handleInputChange}
                    placeholder="1234567890123456"
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
                    setEditingRider(null);
                    setFormData({
                      name: '',
                      email: '',
                      phone: '',
                      cnic: '',
                      address: '',
                      licenseNumber: '',
                      licenseExpiry: '',
                      vehicleType: 'Motorcycle',
                      vehicleNumber: '',
                      status: 'Active',
                      availability: 'Available',
                      bankAccount: '',
                      emergencyContact: ''
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
                  {editingRider ? 'Update Rider' : 'Add Rider'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default RiderManagement;