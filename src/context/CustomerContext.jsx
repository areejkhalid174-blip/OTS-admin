import React, { createContext, useContext, useState, useEffect } from 'react';

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

  // Load customers from localStorage
  useEffect(() => {
    const savedCustomers = localStorage.getItem('customers');
    if (savedCustomers) {
      setCustomers(JSON.parse(savedCustomers));
    } else {
      // Initialize with sample customers
      const sampleCustomers = [
        {
          id: "customer_1",
          name: "Ali Ahmed",
          email: "ali.ahmed@example.com",
          phone: "+92-300-1111111",
          address: "House 123, Block A, Gulberg, Lahore",
          city: "Lahore",
          postalCode: "54000",
          dateOfBirth: "1990-05-15",
          gender: "Male",
          status: "Active",
          totalOrders: 45,
          totalSpent: 12500,
          lastOrderDate: "2024-01-20",
          joinDate: "2023-01-10",
          preferences: {
            deliveryTime: "Evening",
            paymentMethod: "Cash on Delivery",
            notifications: true
          },
          emergencyContact: "+92-301-2222222",
          createdAt: new Date().toISOString()
        },
        {
          id: "customer_2",
          name: "Fatima Khan",
          email: "fatima.khan@example.com",
          phone: "+92-300-3333333",
          address: "Apartment 456, Building B, DHA Phase 2, Karachi",
          city: "Karachi",
          postalCode: "75500",
          dateOfBirth: "1985-12-03",
          gender: "Female",
          status: "Active",
          totalOrders: 78,
          totalSpent: 23400,
          lastOrderDate: "2024-01-18",
          joinDate: "2022-11-15",
          preferences: {
            deliveryTime: "Morning",
            paymentMethod: "Online Payment",
            notifications: true
          },
          emergencyContact: "+92-302-4444444",
          createdAt: new Date().toISOString()
        },
        {
          id: "customer_3",
          name: "Hassan Ali",
          email: "hassan.ali@example.com",
          phone: "+92-300-5555555",
          address: "Villa 789, Sector F-8, Islamabad",
          city: "Islamabad",
          postalCode: "44000",
          dateOfBirth: "1992-08-22",
          gender: "Male",
          status: "Active",
          totalOrders: 23,
          totalSpent: 8900,
          lastOrderDate: "2024-01-15",
          joinDate: "2023-06-20",
          preferences: {
            deliveryTime: "Afternoon",
            paymentMethod: "Cash on Delivery",
            notifications: false
          },
          emergencyContact: "+92-303-6666666",
          createdAt: new Date().toISOString()
        },
        {
          id: "customer_4",
          name: "Ayesha Malik",
          email: "ayesha.malik@example.com",
          phone: "+92-300-7777777",
          address: "House 321, Street 5, Model Town, Faisalabad",
          city: "Faisalabad",
          postalCode: "38000",
          dateOfBirth: "1988-03-10",
          gender: "Female",
          status: "Inactive",
          totalOrders: 12,
          totalSpent: 4500,
          lastOrderDate: "2023-12-10",
          joinDate: "2023-09-05",
          preferences: {
            deliveryTime: "Evening",
            paymentMethod: "Online Payment",
            notifications: true
          },
          emergencyContact: "+92-304-8888888",
          createdAt: new Date().toISOString()
        },
        {
          id: "customer_5",
          name: "Usman Shah",
          email: "usman.shah@example.com",
          phone: "+92-300-9999999",
          address: "Flat 654, Tower C, Bahria Town, Rawalpindi",
          city: "Rawalpindi",
          postalCode: "46000",
          dateOfBirth: "1995-11-18",
          gender: "Male",
          status: "Active",
          totalOrders: 67,
          totalSpent: 18900,
          lastOrderDate: "2024-01-19",
          joinDate: "2022-08-12",
          preferences: {
            deliveryTime: "Morning",
            paymentMethod: "Cash on Delivery",
            notifications: true
          },
          emergencyContact: "+92-305-0000000",
          createdAt: new Date().toISOString()
        }
      ];
      setCustomers(sampleCustomers);
      localStorage.setItem('customers', JSON.stringify(sampleCustomers));
    }
    setLoading(false);
  }, []);

  const addCustomer = (customerData) => {
    const newCustomer = {
      id: `customer_${Date.now()}`,
      ...customerData,
      totalOrders: 0,
      totalSpent: 0,
      joinDate: new Date().toISOString().split('T')[0],
      status: "Active",
      preferences: {
        deliveryTime: "Evening",
        paymentMethod: "Cash on Delivery",
        notifications: true,
        ...customerData.preferences
      },
      createdAt: new Date().toISOString()
    };
    const updatedCustomers = [...customers, newCustomer];
    setCustomers(updatedCustomers);
    localStorage.setItem('customers', JSON.stringify(updatedCustomers));
    return { success: true, customer: newCustomer };
  };

  const updateCustomer = (id, customerData) => {
    const updatedCustomers = customers.map(customer => 
      customer.id === id ? { ...customer, ...customerData, updatedAt: new Date().toISOString() } : customer
    );
    setCustomers(updatedCustomers);
    localStorage.setItem('customers', JSON.stringify(updatedCustomers));
    return { success: true };
  };

  const deleteCustomer = (id) => {
    const updatedCustomers = customers.filter(customer => customer.id !== id);
    setCustomers(updatedCustomers);
    localStorage.setItem('customers', JSON.stringify(updatedCustomers));
    return { success: true };
  };

  const getCustomerById = (id) => {
    return customers.find(customer => customer.id === id);
  };

  const getCustomersByStatus = (status) => {
    return customers.filter(customer => customer.status === status);
  };

  const getCustomersByCity = (city) => {
    return customers.filter(customer => customer.city === city);
  };

  const getTopCustomers = (limit = 10) => {
    return customers
      .sort((a, b) => b.totalSpent - a.totalSpent)
      .slice(0, limit);
  };

  const updateCustomerOrderStats = (customerId, orderAmount) => {
    const customer = getCustomerById(customerId);
    if (customer) {
      const updatedCustomer = {
        ...customer,
        totalOrders: customer.totalOrders + 1,
        totalSpent: customer.totalSpent + orderAmount,
        lastOrderDate: new Date().toISOString().split('T')[0]
      };
      return updateCustomer(customerId, updatedCustomer);
    }
    return { success: false };
  };

  const value = {
    customers,
    loading,
    addCustomer,
    updateCustomer,
    deleteCustomer,
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

