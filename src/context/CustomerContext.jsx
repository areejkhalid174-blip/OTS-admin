import React, { createContext, useContext, useState, useEffect } from 'react';
import { db } from '../../firebase';
import { collection, getDocs, updateDoc, deleteDoc, doc, query, where } from 'firebase/firestore';

const CustomerContext = createContext();

export const useCustomer = () => {
  const context = useContext(CustomerContext);
  if (!context) {
    throw new Error('useCustomer must be used within a CustomerProvider');
  }
  return context;
};

export const CustomerProvider = ({ children }) => {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch customers from Firebase (users with role="Customer")
  const fetchCustomers = async () => {
    setLoading(true);
    setError(null);
    try {
      const usersCollection = collection(db, 'users');
      const q = query(usersCollection, where('role', '==', 'Customer'));
      const querySnapshot = await getDocs(q);
      const customersList = querySnapshot.docs.map(doc => ({
        id: doc.id,
        uid: doc.id,
        ...doc.data()
      }));
      setCustomers(customersList);
    } catch (err) {
      setError('Failed to fetch customers');
      console.error('Error fetching customers:', err);
    } finally {
      setLoading(false);
    }
  };

  // Load customers on mount
  useEffect(() => {
    fetchCustomers();
  }, []);

  const addCustomer = async (customerData) => {
    // Customers are added through user signup, so this might not be needed
    // But keeping it for admin to manually add customers
    setLoading(true);
    setError(null);
    try {
      await fetchCustomers(); // Refresh after potential addition
      return { success: true };
    } catch (err) {
      setError('Failed to add customer');
      console.error('Error adding customer:', err);
      return { success: false, error: err.message };
    } finally {
      setLoading(false);
    }
  };

  const updateCustomer = async (id, customerData) => {
    setLoading(true);
    setError(null);
    try {
      const customerDoc = doc(db, 'users', id);
      await updateDoc(customerDoc, {
        ...customerData,
        updatedAt: new Date().toISOString()
      });
      await fetchCustomers(); // Refresh the customers list
      return { success: true };
    } catch (err) {
      setError('Failed to update customer');
      console.error('Error updating customer:', err);
      return { success: false, error: err.message };
    } finally {
      setLoading(false);
    }
  };

  const deleteCustomer = async (id) => {
    setLoading(true);
    setError(null);
    try {
      const customerDoc = doc(db, 'users', id);
      await deleteDoc(customerDoc);
      await fetchCustomers(); // Refresh the customers list
      return { success: true };
    } catch (err) {
      setError('Failed to delete customer');
      console.error('Error deleting customer:', err);
      return { success: false, error: err.message };
    } finally {
      setLoading(false);
    }
  };

  // Approve customer (change status if needed)
  const approveCustomer = async (id) => {
    return updateCustomer(id, { status: 'approved' });
  };

  const getCustomerById = (id) => {
    return customers.find(customer => customer.id === id || customer.uid === id);
  };

  const getCustomersByStatus = (status) => {
    return customers.filter(customer => customer.status === status);
  };

  const getCustomersByCity = (city) => {
    return customers.filter(customer => customer.city === city);
  };

  const getTopCustomers = (limit = 10) => {
    return customers
      .sort((a, b) => (b.totalSpent || 0) - (a.totalSpent || 0))
      .slice(0, limit);
  };

  const updateCustomerOrderStats = async (customerId, orderAmount) => {
    const customer = getCustomerById(customerId);
    if (customer) {
      const updatedCustomer = {
        totalOrders: (customer.totalOrders || 0) + 1,
        totalSpent: (customer.totalSpent || 0) + orderAmount,
        lastOrderDate: new Date().toISOString().split('T')[0]
      };
      return updateCustomer(customerId, updatedCustomer);
    }
    return { success: false };
  };

  const value = {
    customers,
    loading,
    error,
    fetchCustomers,
    addCustomer,
    updateCustomer,
    deleteCustomer,
    approveCustomer,
    getCustomerById,
    getCustomersByStatus,
    getCustomersByCity,
    getTopCustomers,
    updateCustomerOrderStats
  };

  return (
    <CustomerContext.Provider value={value}>
      {children}
    </CustomerContext.Provider>
  );
};

