import React, { createContext, useContext, useState, useEffect } from 'react';
import { db } from '../../firebase';
import { collection, getDocs, updateDoc, deleteDoc, doc, query, where } from 'firebase/firestore';

const RiderContext = createContext();

export const useRider = () => {
  const context = useContext(RiderContext);
  if (!context) {
    throw new Error('useRider must be used within a RiderProvider');
  }
  return context;
};

export const RiderProvider = ({ children }) => {
  const [riders, setRiders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch riders from Firebase (users with role="Rider")
  const fetchRiders = async () => {
    setLoading(true);
    setError(null);
    try {
      const usersCollection = collection(db, 'users');
      const q = query(usersCollection, where('role', '==', 'Rider'));
      const querySnapshot = await getDocs(q);
      const ridersList = querySnapshot.docs.map(doc => ({
        id: doc.id,
        uid: doc.id,
        ...doc.data()
      }));
      setRiders(ridersList);
    } catch (err) {
      setError('Failed to fetch riders');
      console.error('Error fetching riders:', err);
    } finally {
      setLoading(false);
    }
  };

  // Load riders on mount
  useEffect(() => {
    fetchRiders();
  }, []);

  const addRider = async (riderData) => {
    // Riders are added through user signup, so this might not be needed
    // But keeping it for admin to manually add riders
    setLoading(true);
    setError(null);
    try {
      await fetchRiders(); // Refresh after potential addition
      return { success: true };
    } catch (err) {
      setError('Failed to add rider');
      console.error('Error adding rider:', err);
      return { success: false, error: err.message };
    } finally {
      setLoading(false);
    }
  };

  const updateRider = async (id, riderData) => {
    setLoading(true);
    setError(null);
    try {
      const riderDoc = doc(db, 'users', id);
      await updateDoc(riderDoc, {
        ...riderData,
        updatedAt: new Date().toISOString()
      });
      await fetchRiders(); // Refresh the riders list
      return { success: true };
    } catch (err) {
      setError('Failed to update rider');
      console.error('Error updating rider:', err);
      return { success: false, error: err.message };
    } finally {
      setLoading(false);
    }
  };

  const deleteRider = async (id) => {
    setLoading(true);
    setError(null);
    try {
      const riderDoc = doc(db, 'users', id);
      await deleteDoc(riderDoc);
      await fetchRiders(); // Refresh the riders list
      return { success: true };
    } catch (err) {
      setError('Failed to delete rider');
      console.error('Error deleting rider:', err);
      return { success: false, error: err.message };
    } finally {
      setLoading(false);
    }
  };

  // Approve rider (change status from pending to approved/active)
  const approveRider = async (id) => {
    return updateRider(id, { status: 'approved' });
  };

  // Reject/Remove rider (change status or delete)
  const rejectRider = async (id) => {
    return updateRider(id, { status: 'rejected' });
  };

  const getRiderById = (id) => {
    return riders.find(rider => rider.id === id || rider.uid === id);
  };

  const getRidersByStatus = (status) => {
    return riders.filter(rider => rider.status === status);
  };

  // Get pending riders
  const getPendingRiders = () => {
    return riders.filter(rider => rider.status === 'pending');
  };

  const getAvailableRiders = () => {
    return riders.filter(rider => 
      (rider.availability === "Available" || !rider.availability) && 
      (rider.status === "approved" || rider.status === "Active")
    );
  };

  const updateRiderAvailability = (id, availability) => {
    return updateRider(id, { availability });
  };

  const updateRiderRating = async (id, newRating) => {
    const rider = getRiderById(id);
    if (rider) {
      const totalDeliveries = (rider.totalDeliveries || 0) + 1;
      const currentRating = (rider.ratting || 0) * (rider.totalDeliveries || 0);
      const updatedRating = (currentRating + newRating) / totalDeliveries;
      return updateRider(id, { ratting: updatedRating, totalDeliveries });
    }
    return { success: false };
  };

  const value = {
    riders,
    loading,
    error,
    fetchRiders,
    addRider,
    updateRider,
    deleteRider,
    approveRider,
    rejectRider,
    getRiderById,
    getRidersByStatus,
    getPendingRiders,
    getAvailableRiders,
    updateRiderAvailability,
    updateRiderRating
  };

  return (
    <RiderContext.Provider value={value}>
      {children}
    </RiderContext.Provider>
  );
};

