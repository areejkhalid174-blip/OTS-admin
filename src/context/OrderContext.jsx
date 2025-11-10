import React, { createContext, useContext, useState, useEffect } from 'react';

const OrderContext = createContext();

export const useOrder = () => {
  const context = useContext(OrderContext);
  if (!context) {
    throw new Error('useOrder must be used within an OrderProvider');
  }
  return context;
};

export const OrderProvider = ({ children }) => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  // Load orders from localStorage
  useEffect(() => {
    const savedOrders = localStorage.getItem('orders');
    if (savedOrders) {
      setOrders(JSON.parse(savedOrders));
    } else {
      // Initialize with sample orders
      const sampleOrders = [
        {
          id: "ORD-001",
          customerId: "customer_1",
          customerName: "Ali Ahmed",
          customerPhone: "+92-300-1111111",
          customerAddress: "House 123, Block A, Gulberg, Lahore",
          items: [
            {
              id: "item_1",
              name: "Chicken Biryani",
              quantity: 2,
              price: 800,
              category: "Food"
            },
            {
              id: "item_2",
              name: "Coca Cola",
              quantity: 2,
              price: 100,
              category: "Beverages"
            }
          ],
          deliveryService: "Bicycle Delivery",
          deliveryFee: 100,
          subtotal: 1800,
          total: 1900,
          status: "Delivered",
          paymentMethod: "Cash on Delivery",
          paymentStatus: "Paid",
          orderDate: "2024-01-20T10:30:00Z",
          estimatedDelivery: "2024-01-20T11:30:00Z",
          actualDelivery: "2024-01-20T11:45:00Z",
          riderId: "rider_1",
          riderName: "Ahmed Khan",
          specialInstructions: "Ring the doorbell twice",
          createdAt: new Date().toISOString()
        },
        {
          id: "ORD-002",
          customerId: "customer_2",
          customerName: "Fatima Khan",
          customerPhone: "+92-300-3333333",
          customerAddress: "Apartment 456, Building B, DHA Phase 2, Karachi",
          items: [
            {
              id: "item_3",
              name: "Pizza Margherita",
              quantity: 1,
              price: 1200,
              category: "Food"
            },
            {
              id: "item_4",
              name: "Garlic Bread",
              quantity: 1,
              price: 300,
              category: "Food"
            }
          ],
          deliveryService: "Motorcycle Delivery",
          deliveryFee: 200,
          subtotal: 1500,
          total: 1700,
          status: "In Progress",
          paymentMethod: "Online Payment",
          paymentStatus: "Paid",
          orderDate: "2024-01-20T14:15:00Z",
          estimatedDelivery: "2024-01-20T14:45:00Z",
          riderId: "rider_2",
          riderName: "Hassan Ali",
          specialInstructions: "Leave at door if no answer",
          createdAt: new Date().toISOString()
        },
        {
          id: "ORD-003",
          customerId: "customer_3",
          customerName: "Hassan Ali",
          customerPhone: "+92-300-5555555",
          customerAddress: "Villa 789, Sector F-8, Islamabad",
          items: [
            {
              id: "item_5",
              name: "Beef Karahi",
              quantity: 1,
              price: 1500,
              category: "Food"
            },
            {
              id: "item_6",
              name: "Naan",
              quantity: 4,
              price: 200,
              category: "Food"
            },
            {
              id: "item_7",
              name: "Lassi",
              quantity: 2,
              price: 150,
              category: "Beverages"
            }
          ],
          deliveryService: "Car Delivery",
          deliveryFee: 300,
          subtotal: 2300,
          total: 2600,
          status: "Pending",
          paymentMethod: "Cash on Delivery",
          paymentStatus: "Pending",
          orderDate: "2024-01-20T16:00:00Z",
          estimatedDelivery: "2024-01-20T17:00:00Z",
          riderId: null,
          riderName: null,
          specialInstructions: "Call when arrived",
          createdAt: new Date().toISOString()
        },
        {
          id: "ORD-004",
          customerId: "customer_5",
          customerName: "Usman Shah",
          customerPhone: "+92-300-9999999",
          customerAddress: "Flat 654, Tower C, Bahria Town, Rawalpindi",
          items: [
            {
              id: "item_8",
              name: "Chicken Tikka",
              quantity: 1,
              price: 900,
              category: "Food"
            },
            {
              id: "item_9",
              name: "Raita",
              quantity: 1,
              price: 150,
              category: "Food"
            }
          ],
          deliveryService: "Express Delivery",
          deliveryFee: 500,
          subtotal: 1050,
          total: 1550,
          status: "Cancelled",
          paymentMethod: "Online Payment",
          paymentStatus: "Refunded",
          orderDate: "2024-01-19T19:30:00Z",
          estimatedDelivery: "2024-01-19T19:45:00Z",
          cancellationReason: "Customer requested cancellation",
          createdAt: new Date().toISOString()
        }
      ];
      setOrders(sampleOrders);
      localStorage.setItem('orders', JSON.stringify(sampleOrders));
    }
    setLoading(false);
  }, []);

  const addOrder = (orderData) => {
    const newOrder = {
      id: `ORD-${String(orders.length + 1).padStart(3, '0')}`,
      ...orderData,
      status: "Pending",
      paymentStatus: "Pending",
      orderDate: new Date().toISOString(),
      createdAt: new Date().toISOString()
    };
    const updatedOrders = [...orders, newOrder];
    setOrders(updatedOrders);
    localStorage.setItem('orders', JSON.stringify(updatedOrders));
    return { success: true, order: newOrder };
  };

  const updateOrder = (id, orderData) => {
    const updatedOrders = orders.map(order => 
      order.id === id ? { ...order, ...orderData, updatedAt: new Date().toISOString() } : order
    );
    setOrders(updatedOrders);
    localStorage.setItem('orders', JSON.stringify(updatedOrders));
    return { success: true };
  };

  const deleteOrder = (id) => {
    const updatedOrders = orders.filter(order => order.id !== id);
    setOrders(updatedOrders);
    localStorage.setItem('orders', JSON.stringify(updatedOrders));
    return { success: true };
  };

  const getOrderById = (id) => {
    return orders.find(order => order.id === id);
  };

  const getOrdersByStatus = (status) => {
    return orders.filter(order => order.status === status);
  };

  const getOrdersByCustomer = (customerId) => {
    return orders.filter(order => order.customerId === customerId);
  };

  const getOrdersByRider = (riderId) => {
    return orders.filter(order => order.riderId === riderId);
  };

  const getOrdersByDateRange = (startDate, endDate) => {
    return orders.filter(order => {
      const orderDate = new Date(order.orderDate);
      return orderDate >= new Date(startDate) && orderDate <= new Date(endDate);
    });
  };

  const assignRider = (orderId, riderId, riderName) => {
    return updateOrder(orderId, { riderId, riderName, status: "Assigned" });
  };

  const updateOrderStatus = (orderId, status, additionalData = {}) => {
    const updateData = { status, ...additionalData };
    
    if (status === "Delivered") {
      updateData.actualDelivery = new Date().toISOString();
      updateData.paymentStatus = "Paid";
    }
    
    return updateOrder(orderId, updateData);
  };

  const getOrderStats = () => {
    const totalOrders = orders.length;
    const pendingOrders = orders.filter(o => o.status === "Pending").length;
    const inProgressOrders = orders.filter(o => o.status === "In Progress").length;
    const deliveredOrders = orders.filter(o => o.status === "Delivered").length;
    const cancelledOrders = orders.filter(o => o.status === "Cancelled").length;
    const totalRevenue = orders
      .filter(o => o.status === "Delivered")
      .reduce((sum, o) => sum + o.total, 0);
    const averageOrderValue = deliveredOrders > 0 ? totalRevenue / deliveredOrders : 0;

    return {
      totalOrders,
      pendingOrders,
      inProgressOrders,
      deliveredOrders,
      cancelledOrders,
      totalRevenue,
      averageOrderValue
    };
  };

  const value = {
    orders,
    loading,
    addOrder,
    updateOrder,
    deleteOrder,
    getOrderById,
    getOrdersByStatus,
    getOrdersByCustomer,
    getOrdersByRider,
    getOrdersByDateRange,
    assignRider,
    updateOrderStatus,
    getOrderStats
  };

  return (
    <OrderContext.Provider value={value}>
      {children}
    </OrderContext.Provider>
  );
};

