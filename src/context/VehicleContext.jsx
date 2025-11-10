import React, { createContext, useContext, useState, useEffect } from 'react';

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

  // Load vehicles from localStorage
  useEffect(() => {
    const savedVehicles = localStorage.getItem('vehicles');
    if (savedVehicles) {
      setVehicles(JSON.parse(savedVehicles));
    } else {
      // Initialize with some sample vehicles
      const sampleVehicles = [
        {
          id: "veh_2",
          vehicleNumber: "XYZ-456",
          vehicleType: "Car",
          brand: "Toyota",
          model: "Corolla",
          year: 2021,
          color: "White",
          status: "Active",
          driverName: "Hassan Khan",
          driverPhone: "+92-301-9876543",
          registrationDate: "2021-03-20",
          lastServiceDate: "2024-02-15",
          nextServiceDate: "2024-05-15",
          insuranceExpiry: "2024-11-30",
          createdAt: new Date().toISOString()
        },
        {
          id: "veh_3",
          vehicleNumber: "DEF-789",
          vehicleType: "Van",
          brand: "Suzuki",
          model: "Every",
          year: 2020,
          color: "Blue",
          status: "Maintenance",
          driverName: "Usman Ali",
          driverPhone: "+92-302-5555555",
          registrationDate: "2020-06-10",
          lastServiceDate: "2024-01-20",
          nextServiceDate: "2024-04-20",
          insuranceExpiry: "2024-10-15",
          createdAt: new Date().toISOString()
        }
      ];
      setVehicles(sampleVehicles);
      localStorage.setItem('vehicles', JSON.stringify(sampleVehicles));
    }
    setLoading(false);
  }, []);

  // Add vehicle with approval status (pending by default)
  const addVehicle = (vehicleData) => {
    const newVehicle = {
      id: `veh_${Date.now()}`,
      ...vehicleData,
      approved: false, // pending admin approval
      createdAt: new Date().toISOString()
    };
    const updatedVehicles = [...vehicles, newVehicle];
    setVehicles(updatedVehicles);
    localStorage.setItem('vehicles', JSON.stringify(updatedVehicles));
    return { success: true, vehicle: newVehicle };
  };

  const updateVehicle = (id, vehicleData) => {
    const updatedVehicles = vehicles.map(vehicle => 
      vehicle.id === id ? { ...vehicle, ...vehicleData, updatedAt: new Date().toISOString() } : vehicle
    );
    setVehicles(updatedVehicles);
    localStorage.setItem('vehicles', JSON.stringify(updatedVehicles));
    return { success: true };
  };

  const deleteVehicle = (id) => {
    const updatedVehicles = vehicles.filter(vehicle => vehicle.id !== id);
    setVehicles(updatedVehicles);
    localStorage.setItem('vehicles', JSON.stringify(updatedVehicles));
    return { success: true };
  };

  const getVehicleById = (id) => {
    return vehicles.find(vehicle => vehicle.id === id);
  };

  const getVehiclesByStatus = (status) => {
    return vehicles.filter(vehicle => vehicle.status === status);
  };

  const getVehiclesByType = (type) => {
    return vehicles.filter(vehicle => vehicle.vehicleType === type);
  };

  const value = {
    vehicles,
    loading,
    addVehicle,
    updateVehicle,
    deleteVehicle,
    getVehicleById,
    getVehiclesByStatus,
    getVehiclesByType
  };

  return (
    <VehicleContext.Provider value={value}>
      {children}
    </VehicleContext.Provider>
  );
};
