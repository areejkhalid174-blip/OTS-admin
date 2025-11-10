import { createContext, useContext, useState } from 'react';
import { db } from '../../firebase';
import { collection, addDoc, getDocs, deleteDoc, doc, updateDoc } from 'firebase/firestore';

const PriceContext = createContext();

export const PriceProvider = ({ children }) => {
  const [prices, setPrices] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Fetch all prices
  const fetchPrices = async () => {
    setLoading(true);
    try {
      const pricesCollection = collection(db, 'prices');
      const pricesSnapshot = await getDocs(pricesCollection);
      const pricesList = pricesSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setPrices(pricesList);
      setError(null);
    } catch (err) {
      setError('Failed to fetch prices');
      console.error('Error fetching prices:', err);
    }
    setLoading(false);
  };

  // Add a new price
  const addPrice = async (priceData) => {
    setLoading(true);
    try {
      const pricesCollection = collection(db, 'prices');
      await addDoc(pricesCollection, {
        price: Number(priceData.price),
        unit: priceData.unit
      });
      await fetchPrices(); // Refresh the prices list
      setError(null);
      return true;
    } catch (err) {
      setError('Failed to add price');
      console.error('Error adding price:', err);
      return false;
    } finally {
      setLoading(false);
    }
  };

  // Update a price
  const updatePrice = async (priceId, priceData) => {
    setLoading(true);
    try {
      const priceDoc = doc(db, 'prices', priceId);
      await updateDoc(priceDoc, {
        price: Number(priceData.price),
        unit: priceData.unit
      });
      await fetchPrices(); // Refresh the prices list
      setError(null);
      return true;
    } catch (err) {
      setError('Failed to update price');
      console.error('Error updating price:', err);
      return false;
    } finally {
      setLoading(false);
    }
  };

  // Delete a price
  const deletePrice = async (priceId) => {
    setLoading(true);
    try {
      const priceDoc = doc(db, 'prices', priceId);
      await deleteDoc(priceDoc);
      await fetchPrices(); // Refresh the prices list
      setError(null);
      return true;
    } catch (err) {
      setError('Failed to delete price');
      console.error('Error deleting price:', err);
      return false;
    } finally {
      setLoading(false);
    }
  };

  return (
    <PriceContext.Provider value={{
      prices,
      loading,
      error,
      fetchPrices,
      addPrice,
      updatePrice,
      deletePrice
    }}>
      {children}
    </PriceContext.Provider>
  );
};

export const usePrice = () => {
  const context = useContext(PriceContext);
  if (!context) {
    throw new Error('usePrice must be used within a PriceProvider');
  }
  return context;
};

export default PriceContext;