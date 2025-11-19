import React, { createContext, useContext, useState, useEffect } from 'react';
import { db } from '../../firebase';
import { collection, getDocs, addDoc, updateDoc, deleteDoc, doc } from 'firebase/firestore';

const VehicleContext = createContext();

export const useVehicle = () => {
  const context = useContext(VehicleContext);
  if (!context) {
    throw new Error('useVehicle must be used within a VehicleProvider');
  }
  return context;
};

export const VehicleProvider = ({ children }) => {
  const [vehicles, setVehicles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch vehicles from Firebase
  const fetchVehicles = async () => {
    setLoading(true);
    setError(null);
    try {
      const vehiclesCollection = collection(db, 'vehicles');
      const vehiclesSnapshot = await getDocs(vehiclesCollection);
      const vehiclesList = vehiclesSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setVehicles(vehiclesList);
    } catch (err) {
      setError('Failed to fetch vehicles');
      console.error('Error fetching vehicles:', err);
    } finally {
      setLoading(false);
    }
  };

  // Load vehicles on mount
  useEffect(() => {
    fetchVehicles();
  }, []);

  // Add vehicle with approval status (pending by default)
  const addVehicle = async (vehicleData) => {
    setLoading(true);
    setError(null);
    try {
      const vehiclesCollection = collection(db, 'vehicles');
      const newVehicle = {
        ...vehicleData,
        status: vehicleData.status || 'pending',
        createdAt: new Date().toISOString()
      };
      await addDoc(vehiclesCollection, newVehicle);
      await fetchVehicles(); // Refresh the vehicles list
      return { success: true };
    } catch (err) {
      setError('Failed to add vehicle');
      console.error('Error adding vehicle:', err);
      return { success: false, error: err.message };
    } finally {
      setLoading(false);
    }
  };

  const updateVehicle = async (id, vehicleData) => {
    setLoading(true);
    setError(null);
    try {
      const vehicleDoc = doc(db, 'vehicles', id);
      await updateDoc(vehicleDoc, {
        ...vehicleData,
        updatedAt: new Date().toISOString()
      });
      await fetchVehicles(); // Refresh the vehicles list
      return { success: true };
    } catch (err) {
      setError('Failed to update vehicle');
      console.error('Error updating vehicle:', err);
      return { success: false, error: err.message };
    } finally {
      setLoading(false);
    }
  };

  const deleteVehicle = async (id) => {
    setLoading(true);
    setError(null);
    try {
      const vehicleDoc = doc(db, 'vehicles', id);
      await deleteDoc(vehicleDoc);
      await fetchVehicles(); // Refresh the vehicles list
      return { success: true };
    } catch (err) {
      setError('Failed to delete vehicle');
      console.error('Error deleting vehicle:', err);
      return { success: false, error: err.message };
    } finally {
      setLoading(false);
    }
  };

  // Approve vehicle (change status from pending to approved)
  const approveVehicle = async (id) => {
    return updateVehicle(id, { status: 'approved' });
  };

  const getVehicleById = (id) => {
    return vehicles.find(vehicle => vehicle.id === id);
  };

  const getVehiclesByStatus = (status) => {
    return vehicles.filter(vehicle => vehicle.status === status);
  };

  const getVehiclesByType = (type) => {
    return vehicles.filter(vehicle => vehicle.vehicleType === type || vehicle.category === type);
  };

  // Get pending vehicles
  const getPendingVehicles = () => {
    return vehicles.filter(vehicle => vehicle.status === 'pending');
  };

  const value = {
    vehicles,
    loading,
    error,
    fetchVehicles,
    addVehicle,
    updateVehicle,
    deleteVehicle,
    approveVehicle,
    getVehicleById,
    getVehiclesByStatus,
    getVehiclesByType,
    getPendingVehicles
  };

  return (
    <VehicleContext.Provider value={value}>
      {children}
    </VehicleContext.Provider>
  );
};
