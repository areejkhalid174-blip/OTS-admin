import React, { useState, useEffect } from 'react';
import { useVehicle } from '../context/VehicleContext';
import { 
  FaPlus, 
  FaEdit, 
  FaTrash, 
  FaSearch, 
  FaFilter,
  FaCar,
  FaMotorcycle,
  FaTruck,
  FaCheckCircle,
  FaExclamationTriangle,
  FaTimesCircle
} from 'react-icons/fa';

const VehicleManagement = () => {
  const { vehicles, loading, error, addVehicle, updateVehicle, deleteVehicle, approveVehicle, getPendingVehicles } = useVehicle();
  const [showModal, setShowModal] = useState(false);
  const [editingVehicle, setEditingVehicle] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('All');
  const [filterType, setFilterType] = useState('All');
  const [imageErrors, setImageErrors] = useState({});
  const [viewModal, setViewModal] = useState(false);
  const [viewingVehicle, setViewingVehicle] = useState(null);
  const [formData, setFormData] = useState({
    vehicleNumber: '',
    vehicleType: 'Motorcycle',
    brand: '',
    model: '',
    year: new Date().getFullYear(),
    color: '',
    status: 'Active',
    driverName: '',
    driverPhone: '',
    registrationDate: '',
    lastServiceDate: '',
    nextServiceDate: '',
    insuranceExpiry: ''
  });

  const vehicleTypes = ['Motorcycle', 'Car', 'Van', 'Truck'];
  const statusOptions = ['pending', 'approved', 'Active', 'Inactive', 'Maintenance', 'Out of Service'];

  const getStatusIcon = (status) => {
    switch (status) {
      case 'Active':
        return <FaCheckCircle style={{ color: '#10B981' }} />;
      case 'Maintenance':
        return <FaExclamationTriangle style={{ color: '#F59E0B' }} />;
      case 'Inactive':
      case 'Out of Service':
        return <FaTimesCircle style={{ color: '#EF4444' }} />;
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
        return <FaCar />;
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
    
    if (editingVehicle) {
      updateVehicle(editingVehicle.id, formData);
    } else {
      addVehicle(formData);
    }
    
    setFormData({
      vehicleNumber: '',
      vehicleType: 'Motorcycle',
      brand: '',
      model: '',
      year: new Date().getFullYear(),
      color: '',
      status: 'Active',
      driverName: '',
      driverPhone: '',
      registrationDate: '',
      lastServiceDate: '',
      nextServiceDate: '',
      insuranceExpiry: ''
    });
    setShowModal(false);
    setEditingVehicle(null);
  };

  const handleEdit = (vehicle) => {
    setEditingVehicle(vehicle);
    setFormData({
      vehicleNumber: vehicle.vehicleNumber,
      vehicleType: vehicle.vehicleType,
      brand: vehicle.brand,
      model: vehicle.model,
      year: vehicle.year,
      color: vehicle.color,
      status: vehicle.status,
      driverName: vehicle.driverName,
      driverPhone: vehicle.driverPhone,
      registrationDate: vehicle.registrationDate,
      lastServiceDate: vehicle.lastServiceDate,
      nextServiceDate: vehicle.nextServiceDate,
      insuranceExpiry: vehicle.insuranceExpiry
    });
    setShowModal(true);
  };

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this vehicle?')) {
      deleteVehicle(id);
    }
  };

  const handleView = (vehicle) => {
    setViewingVehicle(vehicle);
    setViewModal(true);
  };


  // Vehicles pending admin approval
  const pendingVehicles = getPendingVehicles ? getPendingVehicles() : vehicles.filter(v => v.status === 'pending');

  const filteredVehicles = vehicles.filter(vehicle => {
    const vehicleNumber = vehicle.vehicleNumber || vehicle.numberPlate || '';
    const driverName = vehicle.driverName || vehicle.riderName || '';
    const brand = vehicle.brand || '';
    const model = vehicle.model || vehicle.modelName || '';
    const category = vehicle.category || '';
    
    const matchesSearch = vehicleNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
                        driverName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                        brand.toLowerCase().includes(searchTerm.toLowerCase()) ||
                        model.toLowerCase().includes(searchTerm.toLowerCase()) ||
                        category.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'All' || vehicle.status === filterStatus;
    const matchesType = filterType === 'All' || vehicle.vehicleType === filterType || vehicle.category === filterType;
    return matchesSearch && matchesStatus && matchesType && vehicle.status !== 'pending';
  });

  // Admin approve/reject handlers
  const handleApprove = async (id) => {
    if (window.confirm('Are you sure you want to approve this vehicle?')) {
      await approveVehicle(id);
    }
  };
  const handleReject = async (id) => {
    if (window.confirm('Are you sure you want to delete this vehicle registration?')) {
      await deleteVehicle(id);
    }
  };

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '50vh' }}>
        <div>Loading vehicles...</div>
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
          Vehicle Management
        </h1>
        <p style={{ color: '#6B7280', fontSize: '16px' }}>
          Manage your fleet of vehicles, track maintenance, and monitor driver assignments.
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
              placeholder="Search vehicles..."
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
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            style={{
              padding: '10px 15px',
              border: '1px solid #D1D5DB',
              borderRadius: '8px',
              fontSize: '14px',
              background: 'white'
            }}
          >
            <option value="All">All Types</option>
            {vehicleTypes.map(type => (
              <option key={type} value={type}>{type}</option>
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
          Add Vehicle
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
              <p style={{ color: '#6B7280', fontSize: '14px', margin: '0 0 5px 0' }}>Total Vehicles</p>
              <p style={{ fontSize: '24px', fontWeight: 'bold', color: '#1F2937', margin: 0 }}>
                {vehicles.length}
              </p>
            </div>
            <FaCar style={{ fontSize: '24px', color: '#667eea' }} />
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
              <p style={{ color: '#6B7280', fontSize: '14px', margin: '0 0 5px 0' }}>Active</p>
              <p style={{ fontSize: '24px', fontWeight: 'bold', color: '#10B981', margin: 0 }}>
                {vehicles.filter(v => v.status === 'Active').length}
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
              <p style={{ color: '#6B7280', fontSize: '14px', margin: '0 0 5px 0' }}>Maintenance</p>
              <p style={{ fontSize: '24px', fontWeight: 'bold', color: '#F59E0B', margin: 0 }}>
                {vehicles.filter(v => v.status === 'Maintenance').length}
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
              <p style={{ color: '#6B7280', fontSize: '14px', margin: '0 0 5px 0' }}>Pending Approval</p>
              <p style={{ fontSize: '24px', fontWeight: 'bold', color: '#F59E0B', margin: 0 }}>
                {pendingVehicles.length}
              </p>
            </div>
            <FaExclamationTriangle style={{ fontSize: '24px', color: '#F59E0B' }} />
          </div>
        </div>
      </div>

      {/* Pending Approval Table (Admin) */}
      <div style={{
        background: 'white',
        borderRadius: '12px',
        boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
        border: '1px solid #E5E7EB',
        overflow: 'hidden',
        marginBottom: '30px'
      }}>
        <div style={{ padding: '16px', background: '#F9FAFB', borderBottom: '1px solid #E5E7EB' }}>
          <strong style={{ fontSize: '18px', color: '#1F2937' }}>Pending Vehicle Approvals ({pendingVehicles.length})</strong>
        </div>
        {pendingVehicles.length > 0 ? (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ background: '#F9FAFB', borderBottom: '1px solid #E5E7EB' }}>
                  <th style={{ padding: '16px', textAlign: 'left', fontWeight: '600', color: '#374151' }}>Vehicle Image</th>
                  <th style={{ padding: '16px', textAlign: 'left', fontWeight: '600', color: '#374151' }}>Vehicle Details</th>
                  <th style={{ padding: '16px', textAlign: 'left', fontWeight: '600', color: '#374151' }}>Rider Information</th>
                  <th style={{ padding: '16px', textAlign: 'left', fontWeight: '600', color: '#374151' }}>Category</th>
                  <th style={{ padding: '16px', textAlign: 'left', fontWeight: '600', color: '#374151' }}>Status</th>
                  <th style={{ padding: '16px', textAlign: 'center', fontWeight: '600', color: '#374151' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {pendingVehicles.map(vehicle => (
                  <tr key={vehicle.id} style={{ borderBottom: '1px solid #F3F4F6' }}>
                    <td style={{ padding: '16px' }}>
                      <div style={{ position: 'relative', width: '80px', height: '80px' }}>
                        {vehicle.vehicleImage && !imageErrors[vehicle.id] ? (
                          <img 
                            src={vehicle.vehicleImage} 
                            alt="Vehicle" 
                            style={{ 
                              width: '100%', 
                              height: '100%', 
                              objectFit: 'cover', 
                              borderRadius: '8px',
                              border: '1px solid #E5E7EB'
                            }} 
                            onError={() => {
                              setImageErrors(prev => ({ ...prev, [vehicle.id]: true }));
                            }}
                          />
                        ) : (
                          <div style={{ 
                            width: '100%', 
                            height: '100%', 
                            background: '#F3F4F6', 
                            borderRadius: '8px', 
                            display: 'flex',
                            alignItems: 'center', 
                            justifyContent: 'center', 
                            color: '#667eea',
                            fontSize: '24px',
                            border: '1px solid #E5E7EB'
                          }}>
                            {getVehicleTypeIcon(vehicle.category || vehicle.vehicleType || 'Car')}
                          </div>
                        )}
                      </div>
                    </td>
                    <td style={{ padding: '16px' }}>
                      <div>
                        <div style={{ fontWeight: '600', color: '#1F2937', fontSize: '14px', marginBottom: '4px' }}>
                          {vehicle.numberPlate || vehicle.vehicleNumber || 'N/A'}
                        </div>
                        <div style={{ color: '#6B7280', fontSize: '12px', marginBottom: '2px' }}>
                          Model: {vehicle.modelName || vehicle.model || 'N/A'}
                        </div>
                        <div style={{ color: '#6B7280', fontSize: '12px', marginBottom: '2px' }}>
                          Color: {vehicle.color || 'N/A'}
                        </div>
                        {vehicle.createdAt && (
                          <div style={{ color: '#9CA3AF', fontSize: '11px', marginTop: '4px' }}>
                            Submitted: {new Date(vehicle.createdAt).toLocaleDateString()}
                          </div>
                        )}
                      </div>
                    </td>
                    <td style={{ padding: '16px' }}>
                      <div>
                        <div style={{ fontWeight: '500', color: '#1F2937', fontSize: '14px', marginBottom: '4px' }}>
                          {vehicle.riderName || vehicle.driverName || 'N/A'}
                        </div>
                        <div style={{ color: '#6B7280', fontSize: '12px', marginBottom: '2px' }}>
                          Email: {vehicle.riderEmail || 'N/A'}
                        </div>
                        {vehicle.riderId && (
                          <div style={{ color: '#9CA3AF', fontSize: '11px', marginTop: '4px' }}>
                            ID: {vehicle.riderId.substring(0, 8)}...
                          </div>
                        )}
                      </div>
                    </td>
                    <td style={{ padding: '16px' }}>
                      <span style={{ 
                        fontSize: '14px', 
                        color: '#667eea',
                        fontWeight: '500',
                        padding: '4px 8px',
                        background: '#EEF2FF',
                        borderRadius: '4px'
                      }}>
                        {vehicle.category || 'N/A'}
                      </span>
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
                          onClick={() => handleApprove(vehicle.id)}
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
                          onClick={() => handleReject(vehicle.id)}
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
            <p style={{ fontSize: '16px', margin: 0 }}>No pending vehicle approvals</p>
            <p style={{ fontSize: '14px', margin: '8px 0 0 0', color: '#9CA3AF' }}>All vehicle registrations have been processed</p>
          </div>
        )}
      </div>

      {/* Vehicles Table */}
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
                <th style={{ padding: '16px', textAlign: 'left', fontWeight: '600', color: '#374151' }}>Vehicle</th>
                <th style={{ padding: '16px', textAlign: 'left', fontWeight: '600', color: '#374151' }}>Driver</th>
                <th style={{ padding: '16px', textAlign: 'left', fontWeight: '600', color: '#374151' }}>Status</th>
                <th style={{ padding: '16px', textAlign: 'left', fontWeight: '600', color: '#374151' }}>Last Service</th>
                <th style={{ padding: '16px', textAlign: 'left', fontWeight: '600', color: '#374151' }}>Next Service</th>
                <th style={{ padding: '16px', textAlign: 'center', fontWeight: '600', color: '#374151' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredVehicles.map((vehicle) => (
                <tr key={vehicle.id} style={{ borderBottom: '1px solid #F3F4F6' }}>
                  <td style={{ padding: '16px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <div style={{ 
                        width: '40px', 
                        height: '40px', 
                        background: '#F3F4F6', 
                        borderRadius: '8px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: '#667eea'
                      }}>
                        {getVehicleTypeIcon(vehicle.vehicleType)}
                      </div>
                      <div>
                        <div style={{ fontWeight: '600', color: '#1F2937', fontSize: '14px' }}>
                          {vehicle.vehicleNumber}
                        </div>
                        <div style={{ color: '#6B7280', fontSize: '12px' }}>
                          {vehicle.brand} {vehicle.model} ({vehicle.year})
                        </div>
                      </div>
                    </div>
                  </td>
                  <td style={{ padding: '16px' }}>
                    <div>
                      <div style={{ fontWeight: '500', color: '#1F2937', fontSize: '14px' }}>
                        {vehicle.driverName}
                      </div>
                      <div style={{ color: '#6B7280', fontSize: '12px' }}>
                        {vehicle.driverPhone}
                      </div>
                    </div>
                  </td>
                  <td style={{ padding: '16px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      {getStatusIcon(vehicle.status)}
                      <span style={{ fontSize: '14px', color: '#374151' }}>{vehicle.status}</span>
                    </div>
                  </td>
                  <td style={{ padding: '16px', color: '#6B7280', fontSize: '14px' }}>
                    {vehicle.lastServiceDate || 'N/A'}
                  </td>
                  <td style={{ padding: '16px', color: '#6B7280', fontSize: '14px' }}>
                    {vehicle.nextServiceDate || 'N/A'}
                  </td>
                  <td style={{ padding: '16px', textAlign: 'center' }}>
                    <div style={{ display: 'flex', gap: '8px', justifyContent: 'center' }}>
                      <button
                        onClick={() => handleView(vehicle)}
                        style={{
                          background: '#10B981',
                          color: 'white',
                          border: 'none',
                          padding: '8px 12px',
                          borderRadius: '6px',
                          cursor: 'pointer',
                          fontSize: '12px',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '4px',
                          transition: 'all 0.2s'
                        }}
                        onMouseOver={(e) => e.target.style.background = '#059669'}
                        onMouseOut={(e) => e.target.style.background = '#10B981'}
                      >
                        <FaSearch />
                        View
                      </button>
                      <button
                        onClick={() => handleEdit(vehicle)}
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
                          gap: '4px',
                          transition: 'all 0.2s'
                        }}
                        onMouseOver={(e) => e.target.style.background = '#2563EB'}
                        onMouseOut={(e) => e.target.style.background = '#3B82F6'}
                      >
                        <FaEdit />
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(vehicle.id)}
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
              {editingVehicle ? 'Edit Vehicle' : 'Add New Vehicle'}
            </h2>

            <form onSubmit={handleSubmit}>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '20px' }}>
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
                    Brand *
                  </label>
                  <input
                    type="text"
                    name="brand"
                    value={formData.brand}
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
                    Model *
                  </label>
                  <input
                    type="text"
                    name="model"
                    value={formData.model}
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
                    Year *
                  </label>
                  <input
                    type="number"
                    name="year"
                    value={formData.year}
                    onChange={handleInputChange}
                    required
                    min="1990"
                    max={new Date().getFullYear() + 1}
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
                    Color *
                  </label>
                  <input
                    type="text"
                    name="color"
                    value={formData.color}
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
                    Driver Name *
                  </label>
                  <input
                    type="text"
                    name="driverName"
                    value={formData.driverName}
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
                    Driver Phone *
                  </label>
                  <input
                    type="tel"
                    name="driverPhone"
                    value={formData.driverPhone}
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
                    Registration Date
                  </label>
                  <input
                    type="date"
                    name="registrationDate"
                    value={formData.registrationDate}
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
                    Last Service Date
                  </label>
                  <input
                    type="date"
                    name="lastServiceDate"
                    value={formData.lastServiceDate}
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
                    Next Service Date
                  </label>
                  <input
                    type="date"
                    name="nextServiceDate"
                    value={formData.nextServiceDate}
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
                    Insurance Expiry
                  </label>
                  <input
                    type="date"
                    name="insuranceExpiry"
                    value={formData.insuranceExpiry}
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
                    setEditingVehicle(null);
                    setFormData({
                      vehicleNumber: '',
                      vehicleType: 'Motorcycle',
                      brand: '',
                      model: '',
                      year: new Date().getFullYear(),
                      color: '',
                      status: 'Active',
                      driverName: '',
                      driverPhone: '',
                      registrationDate: '',
                      lastServiceDate: '',
                      nextServiceDate: '',
                      insuranceExpiry: ''
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
                  {editingVehicle ? 'Update Vehicle' : 'Add Vehicle'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* View Vehicle Modal */}
      {viewModal && viewingVehicle && (
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
            maxWidth: '700px',
            maxHeight: '90vh',
            overflowY: 'auto'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <h2 style={{ 
                fontSize: '24px', 
                fontWeight: 'bold', 
                color: '#1F2937',
                margin: 0
              }}>
                Vehicle Details
              </h2>
              <button
                onClick={() => {
                  setViewModal(false);
                  setViewingVehicle(null);
                }}
                style={{
                  background: 'transparent',
                  border: 'none',
                  fontSize: '24px',
                  cursor: 'pointer',
                  color: '#6B7280',
                  padding: '0',
                  width: '32px',
                  height: '32px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
              >
                ×
              </button>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '20px' }}>
              {/* Vehicle Image */}
              {viewingVehicle.vehicleImage && !imageErrors[viewingVehicle.id] && (
                <div style={{ gridColumn: '1 / -1' }}>
                  <img 
                    src={viewingVehicle.vehicleImage} 
                    alt="Vehicle" 
                    style={{ 
                      width: '100%', 
                      maxHeight: '300px',
                      objectFit: 'contain', 
                      borderRadius: '8px',
                      border: '1px solid #E5E7EB'
                    }} 
                    onError={() => {
                      setImageErrors(prev => ({ ...prev, [viewingVehicle.id]: true }));
                    }}
                  />
                </div>
              )}

              <div>
                <label style={{ display: 'block', marginBottom: '5px', fontWeight: '600', color: '#374151', fontSize: '14px' }}>
                  Vehicle Number
                </label>
                <div style={{ padding: '10px', background: '#F9FAFB', borderRadius: '6px', color: '#1F2937', fontSize: '14px' }}>
                  {viewingVehicle.vehicleNumber || viewingVehicle.numberPlate || 'N/A'}
                </div>
              </div>

              <div>
                <label style={{ display: 'block', marginBottom: '5px', fontWeight: '600', color: '#374151', fontSize: '14px' }}>
                  Vehicle Type
                </label>
                <div style={{ padding: '10px', background: '#F9FAFB', borderRadius: '6px', color: '#1F2937', fontSize: '14px' }}>
                  {viewingVehicle.vehicleType || viewingVehicle.category || 'N/A'}
                </div>
              </div>

              <div>
                <label style={{ display: 'block', marginBottom: '5px', fontWeight: '600', color: '#374151', fontSize: '14px' }}>
                  Brand
                </label>
                <div style={{ padding: '10px', background: '#F9FAFB', borderRadius: '6px', color: '#1F2937', fontSize: '14px' }}>
                  {viewingVehicle.brand || 'N/A'}
                </div>
              </div>

              <div>
                <label style={{ display: 'block', marginBottom: '5px', fontWeight: '600', color: '#374151', fontSize: '14px' }}>
                  Model
                </label>
                <div style={{ padding: '10px', background: '#F9FAFB', borderRadius: '6px', color: '#1F2937', fontSize: '14px' }}>
                  {viewingVehicle.model || viewingVehicle.modelName || 'N/A'}
                </div>
              </div>

              <div>
                <label style={{ display: 'block', marginBottom: '5px', fontWeight: '600', color: '#374151', fontSize: '14px' }}>
                  Year
                </label>
                <div style={{ padding: '10px', background: '#F9FAFB', borderRadius: '6px', color: '#1F2937', fontSize: '14px' }}>
                  {viewingVehicle.year || 'N/A'}
                </div>
              </div>

              <div>
                <label style={{ display: 'block', marginBottom: '5px', fontWeight: '600', color: '#374151', fontSize: '14px' }}>
                  Color
                </label>
                <div style={{ padding: '10px', background: '#F9FAFB', borderRadius: '6px', color: '#1F2937', fontSize: '14px' }}>
                  {viewingVehicle.color || 'N/A'}
                </div>
              </div>

              <div>
                <label style={{ display: 'block', marginBottom: '5px', fontWeight: '600', color: '#374151', fontSize: '14px' }}>
                  Status
                </label>
                <div style={{ padding: '10px', background: '#F9FAFB', borderRadius: '6px', color: '#1F2937', fontSize: '14px' }}>
                  {viewingVehicle.status || 'N/A'}
                </div>
              </div>

              <div>
                <label style={{ display: 'block', marginBottom: '5px', fontWeight: '600', color: '#374151', fontSize: '14px' }}>
                  Driver Name
                </label>
                <div style={{ padding: '10px', background: '#F9FAFB', borderRadius: '6px', color: '#1F2937', fontSize: '14px' }}>
                  {viewingVehicle.driverName || viewingVehicle.riderName || 'N/A'}
                </div>
              </div>

              <div>
                <label style={{ display: 'block', marginBottom: '5px', fontWeight: '600', color: '#374151', fontSize: '14px' }}>
                  Driver Phone
                </label>
                <div style={{ padding: '10px', background: '#F9FAFB', borderRadius: '6px', color: '#1F2937', fontSize: '14px' }}>
                  {viewingVehicle.driverPhone || 'N/A'}
                </div>
              </div>

              {viewingVehicle.registrationDate && (
                <div>
                  <label style={{ display: 'block', marginBottom: '5px', fontWeight: '600', color: '#374151', fontSize: '14px' }}>
                    Registration Date
                  </label>
                  <div style={{ padding: '10px', background: '#F9FAFB', borderRadius: '6px', color: '#1F2937', fontSize: '14px' }}>
                    {new Date(viewingVehicle.registrationDate).toLocaleDateString()}
                  </div>
                </div>
              )}

              {viewingVehicle.lastServiceDate && (
                <div>
                  <label style={{ display: 'block', marginBottom: '5px', fontWeight: '600', color: '#374151', fontSize: '14px' }}>
                    Last Service Date
                  </label>
                  <div style={{ padding: '10px', background: '#F9FAFB', borderRadius: '6px', color: '#1F2937', fontSize: '14px' }}>
                    {new Date(viewingVehicle.lastServiceDate).toLocaleDateString()}
                  </div>
                </div>
              )}

              {viewingVehicle.nextServiceDate && (
                <div>
                  <label style={{ display: 'block', marginBottom: '5px', fontWeight: '600', color: '#374151', fontSize: '14px' }}>
                    Next Service Date
                  </label>
                  <div style={{ padding: '10px', background: '#F9FAFB', borderRadius: '6px', color: '#1F2937', fontSize: '14px' }}>
                    {new Date(viewingVehicle.nextServiceDate).toLocaleDateString()}
                  </div>
                </div>
              )}

              {viewingVehicle.insuranceExpiry && (
                <div>
                  <label style={{ display: 'block', marginBottom: '5px', fontWeight: '600', color: '#374151', fontSize: '14px' }}>
                    Insurance Expiry
                  </label>
                  <div style={{ padding: '10px', background: '#F9FAFB', borderRadius: '6px', color: '#1F2937', fontSize: '14px' }}>
                    {new Date(viewingVehicle.insuranceExpiry).toLocaleDateString()}
                  </div>
                </div>
              )}

              {viewingVehicle.createdAt && (
                <div>
                  <label style={{ display: 'block', marginBottom: '5px', fontWeight: '600', color: '#374151', fontSize: '14px' }}>
                    Created At
                  </label>
                  <div style={{ padding: '10px', background: '#F9FAFB', borderRadius: '6px', color: '#1F2937', fontSize: '14px' }}>
                    {new Date(viewingVehicle.createdAt).toLocaleString()}
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
                onClick={() => {
                  setViewModal(false);
                  setViewingVehicle(null);
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
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default VehicleManagement;
