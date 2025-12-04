import React, { useState, useEffect } from 'react';
import { useCity } from '../context/CityContext';

export default function CityManagement() {
  console.log("CityManagement component rendered");
  const { cities, loading, error, fetchCities, addCity, deleteCity } = useCity();
  const [newCity, setNewCity] = useState({ name: '', lat: '', lng: '' });
  const [fetchingLocation, setFetchingLocation] = useState(false);
  const [debounceTimer, setDebounceTimer] = useState(null);

  useEffect(() => {
    fetchCities();
  }, []);

  // Fetch latitude and longitude from city name using OpenStreetMap Nominatim API
  const fetchCityCoordinates = async (cityName) => {
    if (!cityName || cityName.trim() === '') {
      return null;
    }

    setFetchingLocation(true);
    try {
      // Using OpenStreetMap Nominatim API (free, no API key required)
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(cityName)}&limit=1`,
        {
          headers: {
            'User-Agent': 'ObjectTransferApp/1.0' // Required by Nominatim
          }
        }
      );
      
      const data = await response.json();
      
      if (data && data.length > 0) {
        const location = data[0];
        return {
          lat: parseFloat(location.lat).toFixed(6),
          lng: parseFloat(location.lon).toFixed(6)
        };
      } else {
        alert(`Location not found for "${cityName}". Please enter coordinates manually.`);
        return null;
      }
    } catch (error) {
      console.error('Error fetching coordinates:', error);
      alert('Failed to fetch location. Please enter coordinates manually.');
      return null;
    } finally {
      setFetchingLocation(false);
    }
  };

  // Handle city name change and auto-fetch coordinates with debounce
  const handleCityNameChange = (cityName) => {
    setNewCity({ ...newCity, name: cityName });
    
    // Clear previous timer
    if (debounceTimer) {
      clearTimeout(debounceTimer);
    }
    
    // Auto-fetch coordinates after user stops typing (1 second delay)
    if (cityName && cityName.trim().length > 2) {
      const timer = setTimeout(async () => {
        const coords = await fetchCityCoordinates(cityName.trim());
        if (coords) {
          setNewCity(prev => ({ 
            ...prev, 
            name: cityName.trim(),
            lat: coords.lat, 
            lng: coords.lng 
          }));
        }
      }, 1000); // Wait 1 second after user stops typing
      
      setDebounceTimer(timer);
    } else {
      // Clear coordinates if city name is too short
      setNewCity(prev => ({ ...prev, lat: '', lng: '' }));
    }
  };

  // Cleanup timer on unmount
  useEffect(() => {
    return () => {
      if (debounceTimer) {
        clearTimeout(debounceTimer);
      }
    };
  }, [debounceTimer]);

  // Manual fetch button
  const handleFetchCoordinates = async () => {
    if (!newCity.name || newCity.name.trim() === '') {
      alert('Please enter a city name first');
      return;
    }
    
    const coords = await fetchCityCoordinates(newCity.name);
    if (coords) {
      setNewCity({ 
        ...newCity, 
        lat: coords.lat, 
        lng: coords.lng 
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!newCity.name || !newCity.lat || !newCity.lng) {
      alert('Please enter city name and coordinates');
      return;
    }
    if (await addCity(newCity)) {
      setNewCity({ name: '', lat: '', lng: '' });
    }
  };

  const handleDelete = async (cityId) => {
    if (window.confirm('Are you sure you want to delete this city?')) {
      await deleteCity(cityId);
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div style={{ padding: '20px' }}>
      <h2>City Management</h2>

      {/* Add City Form */}
      <div style={{ 
        backgroundColor: 'white', 
        padding: '20px', 
        borderRadius: '8px',
        marginBottom: '20px',
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
      }}>
        <h3>Add New City</h3>
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
          <div style={{ display: 'flex', gap: '10px', alignItems: 'flex-end' }}>
            <div style={{ flex: 1 }}>
              <label style={{ display: 'block', marginBottom: '5px', fontSize: '14px', fontWeight: '500', color: '#333' }}>
                City Name
              </label>
              <input
                type="text"
                placeholder="Enter city name (e.g., Karachi, Lahore, Islamabad)"
                value={newCity.name}
                onChange={(e) => handleCityNameChange(e.target.value)}
                required
                style={{
                  padding: '10px',
                  borderRadius: '4px',
                  border: '1px solid #ddd',
                  width: '100%',
                  fontSize: '14px'
                }}
              />
              <small style={{ color: '#666', fontSize: '12px', marginTop: '4px', display: 'block' }}>
                Coordinates will be fetched automatically when you enter city name
              </small>
            </div>
            <button
              type="button"
              onClick={handleFetchCoordinates}
              disabled={fetchingLocation || !newCity.name}
              style={{
                padding: '10px 16px',
                backgroundColor: fetchingLocation ? '#ccc' : '#10B981',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: fetchingLocation ? 'not-allowed' : 'pointer',
                whiteSpace: 'nowrap',
                fontSize: '14px'
              }}
            >
              {fetchingLocation ? 'Fetching...' : '🔍 Fetch Location'}
            </button>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
            <div>
              <label style={{ display: 'block', marginBottom: '5px', fontSize: '14px', fontWeight: '500', color: '#333' }}>
                Latitude
              </label>
              <input
                type="number"
                step="any"
                placeholder="Auto-filled"
                value={newCity.lat}
                onChange={(e) => setNewCity({ ...newCity, lat: e.target.value })}
                required
                style={{
                  padding: '10px',
                  borderRadius: '4px',
                  border: '1px solid #ddd',
                  width: '100%',
                  fontSize: '14px',
                  backgroundColor: newCity.lat ? '#f0f9ff' : '#fff'
                }}
              />
            </div>
            <div>
              <label style={{ display: 'block', marginBottom: '5px', fontSize: '14px', fontWeight: '500', color: '#333' }}>
                Longitude
              </label>
              <input
                type="number"
                step="any"
                placeholder="Auto-filled"
                value={newCity.lng}
                onChange={(e) => setNewCity({ ...newCity, lng: e.target.value })}
                required
                style={{
                  padding: '10px',
                  borderRadius: '4px',
                  border: '1px solid #ddd',
                  width: '100%',
                  fontSize: '14px',
                  backgroundColor: newCity.lng ? '#f0f9ff' : '#fff'
                }}
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading || fetchingLocation}
            style={{
              padding: '12px 24px',
              backgroundColor: (loading || fetchingLocation) ? '#ccc' : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              background: (loading || fetchingLocation) ? '#ccc' : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: (loading || fetchingLocation) ? 'not-allowed' : 'pointer',
              fontWeight: '600',
              fontSize: '15px'
            }}
          >
            {loading ? 'Adding...' : 'Add City'}
          </button>
        </form>
      </div>

      {/* Cities List */}
      <div style={{ 
        backgroundColor: 'white', 
        padding: '20px', 
        borderRadius: '8px',
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
      }}>
        <h3>Cities List</h3>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr>
                <th style={{ textAlign: 'left', padding: '12px', borderBottom: '2px solid #ddd' }}>Name</th>
                <th style={{ textAlign: 'left', padding: '12px', borderBottom: '2px solid #ddd' }}>Latitude</th>
                <th style={{ textAlign: 'left', padding: '12px', borderBottom: '2px solid #ddd' }}>Longitude</th>
                <th style={{ textAlign: 'left', padding: '12px', borderBottom: '2px solid #ddd' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {cities.map((city) => (
                <tr key={city.id}>
                  <td style={{ padding: '12px', borderBottom: '1px solid #ddd' }}>{city.name}</td>
                  <td style={{ padding: '12px', borderBottom: '1px solid #ddd' }}>{city.lat}</td>
                  <td style={{ padding: '12px', borderBottom: '1px solid #ddd' }}>{city.lng}</td>
                  <td style={{ padding: '12px', borderBottom: '1px solid #ddd' }}>
                    <button
                      onClick={() => handleDelete(city.id)}
                      style={{
                        padding: '6px 12px',
                        backgroundColor: '#ff4444',
                        color: 'white',
                        border: 'none',
                        borderRadius: '4px',
                        cursor: 'pointer'
                      }}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}