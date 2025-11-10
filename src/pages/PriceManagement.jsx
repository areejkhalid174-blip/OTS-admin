import React, { useState, useEffect } from 'react';
import { usePrice } from '../context/PriceContext';

export default function PriceManagement() {
  const { prices, loading, error, fetchPrices, addPrice, updatePrice, deletePrice } = usePrice();
  const [newPrice, setNewPrice] = useState({ price: '', unit: 'km' });
  const [editingPrice, setEditingPrice] = useState(null);

  useEffect(() => {
    fetchPrices();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (editingPrice) {
      if (await updatePrice(editingPrice.id, newPrice)) {
        setEditingPrice(null);
        setNewPrice({ price: '', unit: 'km' });
      }
    } else {
      if (await addPrice(newPrice)) {
        setNewPrice({ price: '', unit: 'km' });
      }
    }
  };

  const handleEdit = (price) => {
    setEditingPrice(price);
    setNewPrice({ price: price.price, unit: price.unit });
  };

  const handleDelete = async (priceId) => {
    if (window.confirm('Are you sure you want to delete this price?')) {
      await deletePrice(priceId);
    }
  };

  const handleCancel = () => {
    setEditingPrice(null);
    setNewPrice({ price: '', unit: 'km' });
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div style={{ padding: '20px' }}>
      <h2>{editingPrice ? 'Edit Price' : 'Price Management'}</h2>

      {/* Add/Edit Price Form */}
      <div style={{ 
        backgroundColor: 'white', 
        padding: '20px', 
        borderRadius: '8px',
        marginBottom: '20px',
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
      }}>
        <h3>{editingPrice ? 'Edit Price' : 'Add New Price'}</h3>
        <form onSubmit={handleSubmit} style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
          <input
            type="number"
            step="0.01"
            placeholder="Price"
            value={newPrice.price}
            onChange={(e) => setNewPrice({ ...newPrice, price: e.target.value })}
            required
            style={{
              padding: '8px',
              borderRadius: '4px',
              border: '1px solid #ddd'
            }}
          />
          <select
            value={newPrice.unit}
            onChange={(e) => setNewPrice({ ...newPrice, unit: e.target.value })}
            style={{
              padding: '8px',
              borderRadius: '4px',
              border: '1px solid #ddd'
            }}
          >
            <option value="km">Kilometer (km)</option>
          </select>
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
            {editingPrice ? 'Update Price' : 'Add Price'}
          </button>
          {editingPrice && (
            <button
              type="button"
              onClick={handleCancel}
              style={{
                padding: '8px 16px',
                backgroundColor: '#gray',
                color: 'black',
                border: '1px solid #ddd',
                borderRadius: '4px',
                cursor: 'pointer'
              }}
            >
              Cancel
            </button>
          )}
        </form>
      </div>

      {/* Prices List */}
      <div style={{ 
        backgroundColor: 'white', 
        padding: '20px', 
        borderRadius: '8px',
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
      }}>
        <h3>Prices List</h3>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr>
                <th style={{ textAlign: 'left', padding: '12px', borderBottom: '2px solid #ddd' }}>Price</th>
                <th style={{ textAlign: 'left', padding: '12px', borderBottom: '2px solid #ddd' }}>Unit</th>
                <th style={{ textAlign: 'left', padding: '12px', borderBottom: '2px solid #ddd' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {prices.map((price) => (
                <tr key={price.id}>
                  <td style={{ padding: '12px', borderBottom: '1px solid #ddd' }}>{price.price}</td>
                  <td style={{ padding: '12px', borderBottom: '1px solid #ddd' }}>{price.unit}</td>
                  <td style={{ padding: '12px', borderBottom: '1px solid #ddd' }}>
                    <button
                      onClick={() => handleEdit(price)}
                      style={{
                        padding: '6px 12px',
                        backgroundColor: '#667eea',
                        color: 'white',
                        border: 'none',
                        borderRadius: '4px',
                        cursor: 'pointer',
                        marginRight: '8px'
                      }}
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(price.id)}
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