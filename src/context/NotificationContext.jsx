import React, { createContext, useContext, useState, useEffect } from 'react';
import { getAllData } from '../Helper/firebaseHelper';
import { collection, onSnapshot, query, where } from 'firebase/firestore';
import { db } from '../../firebase.js';

const NotificationContext = createContext();

export const useNotifications = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotifications must be used within a NotificationProvider');
  }
  return context;
};

export const NotificationProvider = ({ children }) => {
  const [notifications, setNotifications] = useState({
    pendingOrders: 0,
    pendingRiders: 0,
    pendingVehicles: 0,
    pendingCustomers: 0,
    unreadMessages: 0,
    total: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch initial counts
    const fetchInitialCounts = async () => {
      try {
        // Pending Orders
        const orders = await getAllData('orders');
        const pendingOrders = orders?.filter(o => o.status === 'pending')?.length || 0;

        // Pending Riders
        const users = await getAllData('users');
        const pendingRiders = users?.filter(u => 
          (u.role || '').toLowerCase() === 'rider' && 
          (u.status === 'pending' || u.status === 'Pending')
        )?.length || 0;

        // Pending Vehicles
        const vehicles = await getAllData('vehicles');
        const pendingVehicles = vehicles?.filter(v => 
          v.status === 'pending' || v.status === 'Pending'
        )?.length || 0;

        // Pending Customers
        const pendingCustomers = users?.filter(u => 
          (u.role || '').toLowerCase() === 'customer' && 
          (u.status === 'pending' || u.status === 'Pending')
        )?.length || 0;

        // Unread Messages (assuming messages collection exists)
        let unreadMessages = 0;
        try {
          const messages = await getAllData('messages');
          unreadMessages = messages?.filter(m => !m.read && m.to === 'admin')?.length || 0;
        } catch (e) {
          console.log('Messages collection not found or error:', e);
        }

        const total = pendingOrders + pendingRiders + pendingVehicles + pendingCustomers + unreadMessages;

        setNotifications({
          pendingOrders,
          pendingRiders,
          pendingVehicles,
          pendingCustomers,
          unreadMessages,
          total
        });
      } catch (error) {
        console.error('Error fetching notification counts:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchInitialCounts();

    // Set up real-time listeners
    const unsubscribeOrders = onSnapshot(
      query(collection(db, 'orders'), where('status', '==', 'pending')),
      (snapshot) => {
        const count = snapshot.size;
        setNotifications(prev => ({
          ...prev,
          pendingOrders: count,
          total: count + prev.pendingRiders + prev.pendingVehicles + prev.pendingCustomers + prev.unreadMessages
        }));
      },
      (error) => console.error('Error listening to orders:', error)
    );

    const unsubscribeUsers = onSnapshot(
      collection(db, 'users'),
      (snapshot) => {
        let pendingRiders = 0;
        let pendingCustomers = 0;
        
        snapshot.forEach((doc) => {
          const user = doc.data();
          const role = (user.role || '').toLowerCase();
          const status = user.status || '';
          
          if (role === 'rider' && (status === 'pending' || status === 'Pending')) {
            pendingRiders++;
          }
          if (role === 'customer' && (status === 'pending' || status === 'Pending')) {
            pendingCustomers++;
          }
        });

        setNotifications(prev => ({
          ...prev,
          pendingRiders,
          pendingCustomers,
          total: prev.pendingOrders + pendingRiders + prev.pendingVehicles + pendingCustomers + prev.unreadMessages
        }));
      },
      (error) => console.error('Error listening to users:', error)
    );

    const unsubscribeVehicles = onSnapshot(
      query(collection(db, 'vehicles'), where('status', '==', 'pending')),
      (snapshot) => {
        const count = snapshot.size;
        setNotifications(prev => ({
          ...prev,
          pendingVehicles: count,
          total: prev.pendingOrders + prev.pendingRiders + count + prev.pendingCustomers + prev.unreadMessages
        }));
      },
      (error) => console.error('Error listening to vehicles:', error)
    );

    // Cleanup listeners on unmount
    return () => {
      unsubscribeOrders();
      unsubscribeUsers();
      unsubscribeVehicles();
    };
  }, []);

  return (
    <NotificationContext.Provider value={{ notifications, loading }}>
      {children}
    </NotificationContext.Provider>
  );
};

