import React, { useState, useEffect } from 'react';
import { useCity } from '../context/CityContext';

export default function CityManagement() {
  console.log("CityManagement component rendered");
  const { cities, loading, error, fetchCities, addCity, deleteCity } = useCity();
  const [newCity, setNewCity] = useState({ name: '', lat: '', lng: '' });

  useEffect(() => {
    fetchCities();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
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
        <form onSubmit={handleSubmit} style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
          <input
            type="text"
            placeholder="City Name"
            value={newCity.name}
            onChange={(e) => setNewCity({ ...newCity, name: e.target.value })}
            required
            style={{
              padding: '8px',
              borderRadius: '4px',
              border: '1px solid #ddd'
            }}
          />
          <input
            type="number"
            step="any"
            placeholder="Latitude"
            value={newCity.lat}
            onChange={(e) => setNewCity({ ...newCity, lat: e.target.value })}
            required
            style={{
              padding: '8px',
              borderRadius: '4px',
              border: '1px solid #ddd'
            }}
          />
          <input
            type="number"
            step="any"
            placeholder="Longitude"
            value={newCity.lng}
            onChange={(e) => setNewCity({ ...newCity, lng: e.target.value })}
            required
            style={{
              padding: '8px',
              borderRadius: '4px',
              border: '1px solid #ddd'
            }}
          />
          <button
            type="submit"
            style={{
              padding: '8px 16px',
              backgroundColor: '#667eea',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer'
            }}
          >
            Add City
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