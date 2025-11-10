import { createContext, useContext, useState } from 'react';
import { db } from '../../firebase';
import { collection, addDoc, getDocs, deleteDoc, doc } from 'firebase/firestore';

const CityContext = createContext();

export const CityProvider = ({ children }) => {
  const [cities, setCities] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Fetch all cities
  const fetchCities = async () => {
    setLoading(true);
    try {
      const citiesCollection = collection(db, 'cities');
      const citiesSnapshot = await getDocs(citiesCollection);
      const citiesList = citiesSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setCities(citiesList);
      setError(null);
    } catch (err) {
      setError('Failed to fetch cities');
      console.error('Error fetching cities:', err);
    }
    setLoading(false);
  };

  // Add a new city
  const addCity = async (cityData) => {
    setLoading(true);
    try {
      const citiesCollection = collection(db, 'cities');
      await addDoc(citiesCollection, {
        name: cityData.name,
        lat: parseFloat(cityData.lat),
        lng: parseFloat(cityData.lng)
      });
      await fetchCities(); // Refresh the cities list
      setError(null);
      return true;
    } catch (err) {
      setError('Failed to add city');
      console.error('Error adding city:', err);
      return false;
    } finally {
      setLoading(false);
    }
  };

  // Delete a city
  const deleteCity = async (cityId) => {
    setLoading(true);
    try {
      const cityDoc = doc(db, 'cities', cityId);
      await deleteDoc(cityDoc);
      await fetchCities(); // Refresh the cities list
      setError(null);
      return true;
    } catch (err) {
      setError('Failed to delete city');
      console.error('Error deleting city:', err);
      return false;
    } finally {
      setLoading(false);
    }
  };

  return (
    <CityContext.Provider value={{
      cities,
      loading,
      error,
      fetchCities,
      addCity,
      deleteCity
    }}>
      {children}
    </CityContext.Provider>
  );
};

export const useCity = () => {
  const context = useContext(CityContext);
  if (!context) {
    throw new Error('useCity must be used within a CityProvider');
  }
  return context;
};

export default CityContext;