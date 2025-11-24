import React, { useState, useEffect } from 'react';
import { getAllData, addData, updateData, deleteData } from '../Helper/firebaseHelper';
import { insertInitialBanks } from '../Helper/insertInitialBanks';
import { 
  FaPlus, 
  FaEdit, 
  FaTrash, 
  FaSearch, 
  FaBuilding,
  FaCheckCircle,
  FaTimesCircle,
  FaPhone,
  FaEnvelope,
  FaMapMarkerAlt
} from 'react-icons/fa';

const BankAccountManagement = () => {
  const [banks, setBanks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [editingBank, setEditingBank] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('All');
  const [formData, setFormData] = useState({
    name: '',
    accountNumber: '',
    accountHolderName: '',
    branchCode: '',
    branchAddress: '',
    phone: '',
    email: '',
    status: 'active',
    type: 'bank',
    icon: '',
    description: ''
  });

  // Fetch banks from Firebase
  const fetchBanks = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getAllData("banks");
      setBanks(data || []);
    } catch (err) {
      console.error("Error fetching banks:", err);
      setError("Failed to fetch banks");
      setBanks([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const initializeBanks = async () => {
      try {
        const data = await getAllData("banks");
        // Auto-insert initial banks if collection is empty
        if (!data || data.length === 0) {
          const shouldInsert = window.confirm(
            'No banks found. Would you like to insert initial banks (JazzCash, EasyPaisa, UBL, HBL, etc.)?'
          );
          if (shouldInsert) {
            const result = await insertInitialBanks();
            if (result.success) {
              alert(`Successfully inserted ${result.inserted} banks!`);
              await fetchBanks();
            } else {
              alert('Failed to insert banks. Check console for details.');
            }
          } else {
            // Still fetch to update state even if user declined
            await fetchBanks();
          }
        } else {
          await fetchBanks();
        }
      } catch (err) {
        console.error('Error initializing banks:', err);
        await fetchBanks();
      }
    };
    initializeBanks();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.name.trim()) {
      alert('Bank name is required');
      return;
    }

    try {
      if (editingBank) {
        await updateData('banks', editingBank.id, {
          ...formData,
          updatedAt: new Date().toISOString()
        });
        alert('Bank updated successfully!');
      } else {
        await addData('banks', {
          ...formData,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        });
        alert('Bank added successfully!');
      }
      
      await fetchBanks();
      setShowModal(false);
      setEditingBank(null);
      setFormData({
        name: '',
        accountNumber: '',
        accountHolderName: '',
        branchCode: '',
        branchAddress: '',
        phone: '',
        email: '',
        status: 'active',
        type: 'bank',
        icon: '',
        description: ''
      });
    } catch (err) {
      console.error('Error saving bank:', err);
      alert('Failed to save bank');
    }
  };

  const handleEdit = (bank) => {
    setEditingBank(bank);
    setFormData({
      name: bank.name || '',
      accountNumber: bank.accountNumber || '',
      accountHolderName: bank.accountHolderName || '',
      branchCode: bank.branchCode || '',
      branchAddress: bank.branchAddress || '',
      phone: bank.phone || '',
      email: bank.email || '',
      status: bank.status || 'active',
      type: bank.type || 'bank',
      icon: bank.icon || '',
      description: bank.description || ''
    });
    setShowModal(true);
  };

  const handleDelete = async (bankId) => {
    if (!window.confirm("Are you sure you want to delete this bank? This action cannot be undone.")) return;
    try {
      await deleteData("banks", bankId);
      await fetchBanks();
      alert("Bank deleted successfully!");
    } catch (err) {
      console.error("Error deleting bank:", err);
      alert("Failed to delete bank");
    }
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingBank(null);
    setFormData({
      name: '',
      accountNumber: '',
      accountHolderName: '',
      branchCode: '',
      branchAddress: '',
      phone: '',
      email: '',
      status: 'active',
      type: 'bank',
      icon: '',
      description: ''
    });
  };

  const getStatusIcon = (status) => {
    switch (status?.toLowerCase()) {
      case 'active':
        return <FaCheckCircle style={{ color: '#10B981' }} />;
      case 'inactive':
        return <FaTimesCircle style={{ color: '#EF4444' }} />;
      default:
        return <FaCheckCircle style={{ color: '#10B981' }} />;
    }
  };

  const getTypeIcon = (type) => {
    switch (type?.toLowerCase()) {
      case 'mobile_wallet':
        return <FaPhone style={{ color: '#3B82F6' }} />;
      case 'bank':
      default:
        return <FaBuilding style={{ color: '#667eea' }} />;
    }
  };

  const filteredBanks = banks.filter(bank => {
    const matchesSearch = 
      (bank.name || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (bank.accountNumber || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (bank.accountHolderName || '').toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'All' || (bank.status || '').toLowerCase() === filterStatus.toLowerCase();
    
    return matchesSearch && matchesStatus;
  });

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '50vh' }}>
        <div>Loading banks...</div>
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
          Bank Management
        </h1>
        <p style={{ color: '#6B7280', fontSize: '16px' }}>
          Manage bank accounts and payment methods for the system.
        </p>
        {banks.length === 0 && (
          <div style={{ 
            marginTop: '15px', 
            padding: '12px', 
            background: '#FEF3C7', 
            borderRadius: '8px', 
            border: '1px solid #FCD34D'
          }}>
            <p style={{ margin: '0 0 10px 0', color: '#92400E', fontSize: '14px' }}>
              No banks found. Click the button below to insert initial banks (JazzCash, EasyPaisa, UBL, HBL, etc.)
            </p>
            <button
              onClick={async () => {
                if (window.confirm('This will insert initial banks into Firebase. Continue?')) {
                  const result = await insertInitialBanks();
                  if (result.success) {
                    alert(`Successfully inserted ${result.inserted} banks!`);
                    await fetchBanks();
                  } else {
                    alert('Failed to insert banks. Check console for details.');
                  }
                }
              }}
              style={{
                background: '#F59E0B',
                color: 'white',
                border: 'none',
                padding: '8px 16px',
                borderRadius: '6px',
                fontSize: '14px',
                fontWeight: '600',
                cursor: 'pointer'
              }}
            >
              Insert Initial Banks
            </button>
          </div>
        )}
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
              <p style={{ color: '#6B7280', fontSize: '14px', margin: '0 0 5px 0' }}>Total Banks</p>
              <p style={{ fontSize: '24px', fontWeight: 'bold', color: '#1F2937', margin: 0 }}>
                {banks.length}
              </p>
            </div>
            <FaBuilding style={{ fontSize: '24px', color: '#667eea' }} />
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
              <p style={{ color: '#6B7280', fontSize: '14px', margin: '0 0 5px 0' }}>Active Banks</p>
              <p style={{ fontSize: '24px', fontWeight: 'bold', color: '#10B981', margin: 0 }}>
                {banks.filter(b => (b.status || '').toLowerCase() === 'active').length}
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
              placeholder="Search banks..."
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
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
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
            gap: '8px'
          }}
        >
          <FaPlus />
          Add Bank
        </button>
      </div>

      {/* Banks Table */}
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
                <th style={{ padding: '16px', textAlign: 'left', fontWeight: '600', color: '#374151' }}>Bank Name</th>
                <th style={{ padding: '16px', textAlign: 'left', fontWeight: '600', color: '#374151' }}>Type</th>
                <th style={{ padding: '16px', textAlign: 'left', fontWeight: '600', color: '#374151' }}>Account Number</th>
                <th style={{ padding: '16px', textAlign: 'left', fontWeight: '600', color: '#374151' }}>Account Holder</th>
                <th style={{ padding: '16px', textAlign: 'left', fontWeight: '600', color: '#374151' }}>Branch</th>
                <th style={{ padding: '16px', textAlign: 'left', fontWeight: '600', color: '#374151' }}>Status</th>
                <th style={{ padding: '16px', textAlign: 'center', fontWeight: '600', color: '#374151' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredBanks.length > 0 ? (
                filteredBanks.map((bank) => (
                  <tr key={bank.id} style={{ borderBottom: '1px solid #F3F4F6' }}>
                    <td style={{ padding: '16px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        {getTypeIcon(bank.type)}
                        <span style={{ fontWeight: '500', color: '#1F2937', fontSize: '14px' }}>
                          {bank.name || 'N/A'}
                        </span>
                      </div>
                    </td>
                    <td style={{ padding: '16px' }}>
                      <span style={{ 
                        fontSize: '12px',
                        padding: '4px 8px',
                        borderRadius: '4px',
                        background: bank.type === 'mobile_wallet' ? '#DBEAFE' : '#F3F4F6',
                        color: bank.type === 'mobile_wallet' ? '#1E40AF' : '#374151',
                        textTransform: 'capitalize'
                      }}>
                        {bank.type || 'bank'}
                      </span>
                    </td>
                    <td style={{ padding: '16px', color: '#374151', fontSize: '14px' }}>
                      {bank.accountNumber || 'N/A'}
                    </td>
                    <td style={{ padding: '16px', color: '#374151', fontSize: '14px' }}>
                      {bank.accountHolderName || 'N/A'}
                    </td>
                    <td style={{ padding: '16px' }}>
                      <div>
                        <div style={{ fontSize: '12px', color: '#374151', marginBottom: '2px' }}>
                          {bank.branchCode || 'N/A'}
                        </div>
                        {bank.branchAddress && (
                          <div style={{ fontSize: '11px', color: '#9CA3AF' }}>
                            {bank.branchAddress}
                          </div>
                        )}
                      </div>
                    </td>
                    <td style={{ padding: '16px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        {getStatusIcon(bank.status)}
                        <span style={{ 
                          fontSize: '14px', 
                          color: bank.status === 'active' ? '#10B981' : '#EF4444',
                          fontWeight: '500',
                          textTransform: 'capitalize'
                        }}>
                          {bank.status || 'active'}
                        </span>
                      </div>
                    </td>
                    <td style={{ padding: '16px', textAlign: 'center' }}>
                      <div style={{ display: 'flex', gap: '6px', justifyContent: 'center' }}>
                        <button
                          onClick={() => handleEdit(bank)}
                          style={{ 
                            background: '#10B981', 
                            color: 'white', 
                            border: 'none', 
                            padding: '6px 10px', 
                            borderRadius: '6px', 
                            cursor: 'pointer', 
                            fontSize: '11px'
                          }}
                        >
                          <FaEdit />
                        </button>
                        <button
                          onClick={() => handleDelete(bank.id)}
                          style={{ 
                            background: '#EF4444', 
                            color: 'white', 
                            border: 'none', 
                            padding: '6px 10px', 
                            borderRadius: '6px', 
                            cursor: 'pointer', 
                            fontSize: '11px'
                          }}
                        >
                          <FaTrash />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="7" style={{ padding: '40px', textAlign: 'center', color: '#6B7280' }}>
                    No banks found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add/Edit Modal */}
      {showModal && (
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
        onClick={handleCloseModal}
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
              <h2 style={{ fontSize: '20px', fontWeight: 'bold', color: '#1F2937', margin: 0 }}>
                {editingBank ? 'Edit Bank' : 'Add Bank'}
              </h2>
              <button 
                onClick={handleCloseModal}
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

            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                <div>
                  <label style={{ display: 'block', marginBottom: '6px', color: '#374151', fontSize: '14px', fontWeight: '500' }}>
                    Bank Name <span style={{ color: '#EF4444' }}>*</span>
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
                      borderRadius: '8px', 
                      fontSize: '14px'
                    }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', marginBottom: '6px', color: '#374151', fontSize: '14px', fontWeight: '500' }}>
                    Type <span style={{ color: '#EF4444' }}>*</span>
                  </label>
                  <select
                    name="type"
                    value={formData.type}
                    onChange={handleInputChange}
                    required
                    style={{ 
                      width: '100%', 
                      padding: '10px', 
                      border: '1px solid #D1D5DB', 
                      borderRadius: '8px', 
                      fontSize: '14px', 
                      background: 'white'
                    }}
                  >
                    <option value="bank">Bank</option>
                    <option value="mobile_wallet">Mobile Wallet</option>
                  </select>
                </div>

                <div>
                  <label style={{ display: 'block', marginBottom: '6px', color: '#374151', fontSize: '14px', fontWeight: '500' }}>
                    Account Number
                  </label>
                  <input
                    type="text"
                    name="accountNumber"
                    value={formData.accountNumber}
                    onChange={handleInputChange}
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
                  <label style={{ display: 'block', marginBottom: '6px', color: '#374151', fontSize: '14px', fontWeight: '500' }}>
                    Account Holder Name
                  </label>
                  <input
                    type="text"
                    name="accountHolderName"
                    value={formData.accountHolderName}
                    onChange={handleInputChange}
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
                  <label style={{ display: 'block', marginBottom: '6px', color: '#374151', fontSize: '14px', fontWeight: '500' }}>
                    Branch Code
                  </label>
                  <input
                    type="text"
                    name="branchCode"
                    value={formData.branchCode}
                    onChange={handleInputChange}
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
                  <label style={{ display: 'block', marginBottom: '6px', color: '#374151', fontSize: '14px', fontWeight: '500' }}>
                    Status <span style={{ color: '#EF4444' }}>*</span>
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
                      borderRadius: '8px', 
                      fontSize: '14px', 
                      background: 'white'
                    }}
                  >
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                  </select>
                </div>

                <div style={{ gridColumn: '1 / -1' }}>
                  <label style={{ display: 'block', marginBottom: '6px', color: '#374151', fontSize: '14px', fontWeight: '500' }}>
                    Branch Address
                  </label>
                  <input
                    type="text"
                    name="branchAddress"
                    value={formData.branchAddress}
                    onChange={handleInputChange}
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
                  <label style={{ display: 'block', marginBottom: '6px', color: '#374151', fontSize: '14px', fontWeight: '500' }}>
                    Phone
                  </label>
                  <input
                    type="text"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
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
                  <label style={{ display: 'block', marginBottom: '6px', color: '#374151', fontSize: '14px', fontWeight: '500' }}>
                    Email
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
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
                  <label style={{ display: 'block', marginBottom: '6px', color: '#374151', fontSize: '14px', fontWeight: '500' }}>
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
                      borderRadius: '8px', 
                      fontSize: '14px',
                      resize: 'vertical'
                    }}
                  />
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '20px' }}>
                <button 
                  type="button"
                  onClick={handleCloseModal}
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
                  type="submit"
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
                  {editingBank ? 'Update Bank' : 'Add Bank'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default BankAccountManagement;
