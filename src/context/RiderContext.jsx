import React, { createContext, useContext, useState, useEffect } from 'react';

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

  // Load riders from localStorage
  useEffect(() => {
    const savedRiders = localStorage.getItem('riders');
    if (savedRiders) {
      setRiders(JSON.parse(savedRiders));
    } else {
      // Initialize with sample riders
      const sampleRiders = [
        {
          id: "rider_1",
          name: "Ahmed Khan",
          email: "ahmed.khan@example.com",
          phone: "+92-300-1234567",
          cnic: "12345-1234567-1",
          address: "Karachi, Pakistan",
          licenseNumber: "LIC-2024-001",
          licenseExpiry: "2025-12-31",
          vehicleType: "Motorcycle",
          vehicleNumber: "ABC-123",
          status: "Active",
          rating: 4.8,
          totalDeliveries: 245,
          joinDate: "2023-01-15",
          availability: "Available",
          bankAccount: "1234567890123456",
          emergencyContact: "+92-301-9876543",
          createdAt: new Date().toISOString()
        },
        {
          id: "rider_2",
          name: "Hassan Ali",
          email: "hassan.ali@example.com",
          phone: "+92-301-2345678",
          cnic: "23456-2345678-2",
          address: "Lahore, Pakistan",
          licenseNumber: "LIC-2024-002",
          licenseExpiry: "2025-11-30",
          vehicleType: "Car",
          vehicleNumber: "XYZ-456",
          status: "Active",
          rating: 4.6,
          totalDeliveries: 189,
          joinDate: "2023-03-20",
          availability: "Busy",
          bankAccount: "2345678901234567",
          emergencyContact: "+92-302-8765432",
          createdAt: new Date().toISOString()
        },
        {
          id: "rider_3",
          name: "Usman Shah",
          email: "usman.shah@example.com",
          phone: "+92-302-3456789",
          cnic: "34567-3456789-3",
          address: "Islamabad, Pakistan",
          licenseNumber: "LIC-2024-003",
          licenseExpiry: "2025-10-15",
          vehicleType: "Van",
          vehicleNumber: "DEF-789",
          status: "Inactive",
          rating: 4.9,
          totalDeliveries: 312,
          joinDate: "2022-11-10",
          availability: "Offline",
          bankAccount: "3456789012345678",
          emergencyContact: "+92-303-7654321",
          createdAt: new Date().toISOString()
        },
        {
          id: "rider_4",
          name: "Bilal Ahmed",
          email: "bilal.ahmed@example.com",
          phone: "+92-303-4567890",
          cnic: "45678-4567890-4",
          address: "Faisalabad, Pakistan",
          licenseNumber: "LIC-2024-004",
          licenseExpiry: "2025-09-20",
          vehicleType: "Motorcycle",
          vehicleNumber: "GHI-012",
          status: "Active",
          rating: 4.7,
          totalDeliveries: 156,
          joinDate: "2023-06-05",
          availability: "Available",
          bankAccount: "4567890123456789",
          emergencyContact: "+92-304-6543210",
          createdAt: new Date().toISOString()
        }
      ];
      setRiders(sampleRiders);
      localStorage.setItem('riders', JSON.stringify(sampleRiders));
    }
    setLoading(false);
  }, []);

  const addRider = (riderData) => {
    const newRider = {
      id: `rider_${Date.now()}`,
      ...riderData,
      rating: 0,
      totalDeliveries: 0,
      joinDate: new Date().toISOString().split('T')[0],
      availability: "Available",
      createdAt: new Date().toISOString()
    };
    const updatedRiders = [...riders, newRider];
    setRiders(updatedRiders);
    localStorage.setItem('riders', JSON.stringify(updatedRiders));
    return { success: true, rider: newRider };
  };

  const updateRider = (id, riderData) => {
    const updatedRiders = riders.map(rider => 
      rider.id === id ? { ...rider, ...riderData, updatedAt: new Date().toISOString() } : rider
    );
    setRiders(updatedRiders);
    localStorage.setItem('riders', JSON.stringify(updatedRiders));
    return { success: true };
  };

  const deleteRider = (id) => {
    const updatedRiders = riders.filter(rider => rider.id !== id);
    setRiders(updatedRiders);
    localStorage.setItem('riders', JSON.stringify(updatedRiders));
    return { success: true };
  };

  const getRiderById = (id) => {
    return riders.find(rider => rider.id === id);
  };

  const getRidersByStatus = (status) => {
    return riders.filter(rider => rider.status === status);
  };

  const getAvailableRiders = () => {
    return riders.filter(rider => rider.availability === "Available" && rider.status === "Active");
  };

  const updateRiderAvailability = (id, availability) => {
    return updateRider(id, { availability });
  };

  const updateRiderRating = (id, newRating) => {
    const rider = getRiderById(id);
    if (rider) {
      const totalDeliveries = rider.totalDeliveries + 1;
      const currentRating = rider.rating * rider.totalDeliveries;
      const updatedRating = (currentRating + newRating) / totalDeliveries;
      return updateRider(id, { rating: updatedRating, totalDeliveries });
    }
    return { success: false };
  };

  const value = {
    riders,
    loading,
    addRider,
    updateRider,
    deleteRider,
    getRiderById,
    getRidersByStatus,
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

