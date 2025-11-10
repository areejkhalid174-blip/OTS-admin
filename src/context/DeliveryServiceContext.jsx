import React, { createContext, useContext, useState, useEffect } from 'react';

const DeliveryServiceContext = createContext();

export const useDeliveryService = () => {
  const context = useContext(DeliveryServiceContext);
  if (!context) {
    throw new Error('useDeliveryService must be used within a DeliveryServiceProvider');
  }
  return context;
};

export const DeliveryServiceProvider = ({ children }) => {
  const [deliveryServices, setDeliveryServices] = useState([]);
  const [loading, setLoading] = useState(true);

  // Load delivery services from localStorage
  useEffect(() => {
    const savedServices = localStorage.getItem('deliveryServices');
    if (savedServices) {
      setDeliveryServices(JSON.parse(savedServices));
    } else {
      // Initialize with sample delivery services
      const sampleServices = [
        {
          id: 1,
          name: "Bicycle Delivery",
          price: "1k.00",
          time: "60 mins to deliver",
          icon: "bicycle",
          description: "Fast and eco-friendly bicycle delivery service",
          status: "Active",
          maxDistance: "10 km",
          weightLimit: "5 kg",
          createdAt: new Date().toISOString()
        },
        {
          id: 2,
          name: "Motorcycle Delivery",
          price: "2k.00",
          time: "30 mins to deliver",
          icon: "motorcycle",
          description: "Quick motorcycle delivery for urgent packages",
          status: "Active",
          maxDistance: "25 km",
          weightLimit: "15 kg",
          createdAt: new Date().toISOString()
        },
        {
          id: 3,
          name: "Car Delivery",
          price: "3k.00",
          time: "45 mins to deliver",
          icon: "car",
          description: "Reliable car delivery for larger packages",
          status: "Active",
          maxDistance: "50 km",
          weightLimit: "50 kg",
          createdAt: new Date().toISOString()
        },
        {
          id: 4,
          name: "Van Delivery",
          price: "4k.00",
          time: "90 mins to deliver",
          icon: "van",
          description: "Heavy-duty van delivery for bulk items",
          status: "Active",
          maxDistance: "100 km",
          weightLimit: "200 kg",
          createdAt: new Date().toISOString()
        },
        {
          id: 5,
          name: "Express Delivery",
          price: "5k.00",
          time: "15 mins to deliver",
          icon: "express",
          description: "Premium express delivery service",
          status: "Active",
          maxDistance: "15 km",
          weightLimit: "10 kg",
          createdAt: new Date().toISOString()
        }
      ];
      setDeliveryServices(sampleServices);
      localStorage.setItem('deliveryServices', JSON.stringify(sampleServices));
    }
    setLoading(false);
  }, []);

  const addDeliveryService = (serviceData) => {
    const newId = Math.max(...deliveryServices.map(s => s.id), 0) + 1;
    const newService = {
      id: newId,
      ...serviceData,
      createdAt: new Date().toISOString()
    };
    const updatedServices = [...deliveryServices, newService];
    setDeliveryServices(updatedServices);
    localStorage.setItem('deliveryServices', JSON.stringify(updatedServices));
    return { success: true, service: newService };
  };

  const updateDeliveryService = (id, serviceData) => {
    const updatedServices = deliveryServices.map(service => 
      service.id === id ? { ...service, ...serviceData, updatedAt: new Date().toISOString() } : service
    );
    setDeliveryServices(updatedServices);
    localStorage.setItem('deliveryServices', JSON.stringify(updatedServices));
    return { success: true };
  };

  const deleteDeliveryService = (id) => {
    const updatedServices = deliveryServices.filter(service => service.id !== id);
    setDeliveryServices(updatedServices);
    localStorage.setItem('deliveryServices', JSON.stringify(updatedServices));
    return { success: true };
  };

  const getDeliveryServiceById = (id) => {
    return deliveryServices.find(service => service.id === id);
  };

  const getDeliveryServicesByStatus = (status) => {
    return deliveryServices.filter(service => service.status === status);
  };

  const getDeliveryServicesByPriceRange = (minPrice, maxPrice) => {
    return deliveryServices.filter(service => {
      const price = parseFloat(service.price.replace('k.00', ''));
      return price >= minPrice && price <= maxPrice;
    });
  };

  const value = {
    deliveryServices,
    loading,
    addDeliveryService,
    updateDeliveryService,
    deleteDeliveryService,
    getDeliveryServiceById,
    getDeliveryServicesByStatus,
    getDeliveryServicesByPriceRange
  };

  return (
    <DeliveryServiceContext.Provider value={value}>
      {children}
    </DeliveryServiceContext.Provider>
  );
};




