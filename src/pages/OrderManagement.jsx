import React, { useState, useEffect } from "react";
import { getAllData, updateData, deleteData } from "../Helper/firebaseHelper";

export default function OrderManagement() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingOrder, setEditingOrder] = useState(null);
  const [statusChange, setStatusChange] = useState({});
  const [statusModalOrder, setStatusModalOrder] = useState(null);
  const [statusModalValue, setStatusModalValue] = useState('');
  const [riders, setRiders] = useState([]);
  const [assignModalOrder, setAssignModalOrder] = useState(null);
  const [selectedRiderId, setSelectedRiderId] = useState(null);
  const [assignLoading, setAssignLoading] = useState(false);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const data = await getAllData("orders");
      // getAllData returns array of { id, ...data }
      setOrders(data || []);
    } catch (err) {
      console.error("Error fetching orders:", err);
      setOrders([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
    // fetch riders for assignment
    (async () => {
      try {
        const users = await getAllData('users');
        if (Array.isArray(users)) {
          const onlyRiders = users.filter(u => (u.role || '').toLowerCase() === 'rider');
          setRiders(onlyRiders);
        } else {
          setRiders([]);
        }
      } catch (err) {
        console.error('Error fetching riders:', err);
        setRiders([]);
      }
    })();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this order?")) return;
    try {
      await deleteData("orders", id);
      setOrders(prev => prev.filter(o => o.id !== id));
    } catch (err) {
      console.error("Error deleting order:", err);
      alert("Failed to delete order");
    }
  };

  const handleOpenEdit = (order) => {
    setEditingOrder({ ...order });
  };

  const handleCloseEdit = () => setEditingOrder(null);

  const handleSaveEdit = async () => {
    if (!editingOrder) return;
    try {
      const { id, ...rest } = editingOrder;
      await updateData("orders", editingOrder.id, { ...rest, updatedAt: new Date().toISOString() });
      // refresh local list
      setOrders(prev => prev.map(o => (o.id === id ? { ...o, ...rest, updatedAt: new Date().toISOString() } : o)));
      setEditingOrder(null);
    } catch (err) {
      console.error("Error updating order:", err);
      alert("Failed to update order");
    }
  };

  const handleChangeStatus = async (orderId) => {
    const newStatus = statusChange[orderId];
    if (!newStatus) return;
    try {
      await updateData("orders", orderId, { status: newStatus, updatedAt: new Date().toISOString() });
      setOrders(prev => prev.map(o => o.id === orderId ? { ...o, status: newStatus, updatedAt: new Date().toISOString() } : o));
    } catch (err) {
      console.error("Error changing status:", err);
      alert("Failed to change status");
    }
  };

  const openStatusModal = (order) => {
    setStatusModalOrder(order);
    setStatusModalValue(order.status || 'pending');
  };

  const closeStatusModal = () => {
    setStatusModalOrder(null);
    setStatusModalValue('');
  };

  const saveStatusModal = async () => {
    if (!statusModalOrder) return;
    try {
      await updateData('orders', statusModalOrder.id, { status: statusModalValue, updatedAt: new Date().toISOString() });
      setOrders(prev => prev.map(o => o.id === statusModalOrder.id ? { ...o, status: statusModalValue, updatedAt: new Date().toISOString() } : o));
      closeStatusModal();
    } catch (err) {
      console.error('Error saving status:', err);
      alert('Failed to save status');
    }
  };

  // Assign rider handlers
  const openAssignModal = (order) => {
    setAssignModalOrder(order);
    setSelectedRiderId(order?.riderId || null);
  };

  const closeAssignModal = () => {
    setAssignModalOrder(null);
    setSelectedRiderId(null);
  };

  const saveAssignModal = async () => {
    if (!assignModalOrder) return;
    if (!selectedRiderId) {
      alert('Please select a rider');
      return;
    }
    setAssignLoading(true);
    try {
      const rider = riders.find(r => r.id === selectedRiderId) || riders.find(r => r.uid === selectedRiderId) || null;
      const riderName = rider?.firstName ? `${rider.firstName} ${rider.lastName || ''}`.trim() : (rider?.name || '');
      const riderPhone = rider?.phone || rider?.driverPhone || '';

      await updateData('orders', assignModalOrder.id, {
        riderId: selectedRiderId,
        riderName: riderName || null,
        riderPhone: riderPhone || null,
        updatedAt: new Date().toISOString()
      });

      setOrders(prev => prev.map(o => o.id === assignModalOrder.id ? { ...o, riderId: selectedRiderId, riderName, riderPhone, updatedAt: new Date().toISOString() } : o));
      closeAssignModal();
    } catch (err) {
      console.error('Error assigning rider:', err);
      alert('Failed to assign rider');
    } finally {
      setAssignLoading(false);
    }
  };

  if (loading) return <div>Loading orders...</div>;

  return (
    <div style={{ padding: 20 }}>
      <h1>Order Management</h1>
      <p>Manage customer orders: view, edit, change status, or delete.</p>

      <div style={{ marginTop: 20 }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ textAlign: 'left', borderBottom: '1px solid #ddd' }}>
              <th style={{ padding: '8px' }}>Order ID</th>
              <th style={{ padding: '8px' }}>Customer</th>
              <th style={{ padding: '8px' }}>Email</th>
              <th style={{ padding: '8px' }}>Pickup</th>
              <th style={{ padding: '8px' }}>Drop</th>
              <th style={{ padding: '8px' }}>Category</th>
              <th style={{ padding: '8px' }}>Type</th>
              <th style={{ padding: '8px' }}>Weight</th>
              <th style={{ padding: '8px' }}>Notes</th>
              <th style={{ padding: '8px' }}>Status</th>
              <th style={{ padding: '8px', textAlign: 'center' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {orders.map(order => (
              <tr key={order.id} style={{ borderBottom: '1px solid #f0f0f0' }}>
                <td style={{ padding: '8px' }}>{order.id}</td>
                <td style={{ padding: '8px' }}>{order.customerName || order.firstName || order.userId}</td>
                <td style={{ padding: '8px' }}>{order.customerEmail || order.email}</td>
                <td style={{ padding: '8px' }}>{order.pickupLocation || order.pickup}</td>
                <td style={{ padding: '8px' }}>{order.dropLocation || order.drop}</td>
                <td style={{ padding: '8px' }}>{order.categoryName || order.category}</td>
                <td style={{ padding: '8px' }}>{order.packageType || order.package}</td>
                <td style={{ padding: '8px' }}>{order.weight}</td>
                <td style={{ padding: '8px' }}>{order.additionalNotes || order.specialInstructions || '—'}</td>
                <td style={{ padding: '8px' }}>
                  <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                    <span style={{ textTransform: 'capitalize' }}>{order.status}</span>
                    <button onClick={() => openStatusModal(order)} style={{ padding: '6px 10px' }}>Change</button>
                  </div>
                </td>
                <td style={{ padding: '8px', textAlign: 'center' }}>
                  <div style={{ display: 'flex', gap: 8, justifyContent: 'center' }}>
                    <button onClick={() => handleOpenEdit(order)} style={{ padding: '6px 10px' }}>Edit</button>
                    <button onClick={() => openAssignModal(order)} style={{ padding: '6px 10px', background: '#3B82F6', color: 'white', border: 'none' }}>Assign</button>
                    <button onClick={() => handleDelete(order.id)} style={{ padding: '6px 10px', background: '#ef4444', color: 'white', border: 'none' }}>Delete</button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Edit Modal */}
      {editingOrder && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div style={{ background: 'white', padding: 20, borderRadius: 8, width: '90%', maxWidth: 700 }}>
            <h3>Edit Order {editingOrder.id}</h3>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
              <div>
                <label>Pickup Location</label>
                <input value={editingOrder.pickupLocation || ''} onChange={(e) => setEditingOrder(prev => ({ ...prev, pickupLocation: e.target.value }))} style={{ width: '100%', padding: 8 }} />
              </div>
              <div>
                <label>Drop Location</label>
                <input value={editingOrder.dropLocation || ''} onChange={(e) => setEditingOrder(prev => ({ ...prev, dropLocation: e.target.value }))} style={{ width: '100%', padding: 8 }} />
              </div>
              <div>
                <label>Category Name</label>
                <input value={editingOrder.categoryName || ''} onChange={(e) => setEditingOrder(prev => ({ ...prev, categoryName: e.target.value }))} style={{ width: '100%', padding: 8 }} />
              </div>
              <div>
                <label>Package Type</label>
                <input value={editingOrder.packageType || ''} onChange={(e) => setEditingOrder(prev => ({ ...prev, packageType: e.target.value }))} style={{ width: '100%', padding: 8 }} />
              </div>
              <div>
                <label>Weight</label>
                <input value={editingOrder.weight || ''} onChange={(e) => setEditingOrder(prev => ({ ...prev, weight: e.target.value }))} style={{ width: '100%', padding: 8 }} />
              </div>
              <div>
                <label>Status</label>
                <select value={editingOrder.status || ''} onChange={(e) => setEditingOrder(prev => ({ ...prev, status: e.target.value }))} style={{ width: '100%', padding: 8 }}>
                  <option value="pending">pending</option>
                  <option value="assigned">assigned</option>
                  <option value="in-progress">in-progress</option>
                  <option value="delivered">delivered</option>
                  <option value="cancelled">cancelled</option>
                </select>
              </div>
              <div style={{ gridColumn: '1 / -1' }}>
                <label>Additional Notes</label>
                <textarea value={editingOrder.additionalNotes || editingOrder.specialInstructions || ''} onChange={(e) => setEditingOrder(prev => ({ ...prev, additionalNotes: e.target.value }))} style={{ width: '100%', padding: 8 }} rows={4} />
              </div>
            </div>
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8, marginTop: 12 }}>
              <button onClick={handleCloseEdit} style={{ padding: '8px 14px' }}>Cancel</button>
              <button onClick={handleSaveEdit} style={{ padding: '8px 14px', background: '#10b981', color: 'white', border: 'none' }}>Save</button>
            </div>
          </div>
        </div>
      )}
      {/* Status Modal */}
      {statusModalOrder && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div style={{ background: 'white', padding: 20, borderRadius: 8, width: '90%', maxWidth: 420 }}>
            <h3>Change Status for {statusModalOrder.id}</h3>
            <div style={{ marginTop: 8 }}>
              <label style={{ display: 'block', marginBottom: 6 }}>Status</label>
              <select value={statusModalValue} onChange={(e) => setStatusModalValue(e.target.value)} style={{ width: '100%', padding: 8 }}>
                <option value="pending">pending</option>
                <option value="assigned">assigned</option>
                <option value="in-progress">in-progress</option>
                <option value="delivered">delivered</option>
                <option value="cancelled">cancelled</option>
              </select>
            </div>
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8, marginTop: 12 }}>
              <button onClick={closeStatusModal} style={{ padding: '8px 14px' }}>Cancel</button>
              <button onClick={saveStatusModal} style={{ padding: '8px 14px', background: '#10b981', color: 'white', border: 'none' }}>Save</button>
            </div>
          </div>
        </div>
      )}
      {/* Assign Rider Modal */}
      {assignModalOrder && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div style={{ background: 'white', padding: 20, borderRadius: 8, width: '90%', maxWidth: 600 }}>
            <h3>Assign Rider for {assignModalOrder.id}</h3>
            <div style={{ marginTop: 8 }}>
              {riders.length === 0 ? (
                <div>No riders available</div>
              ) : (
                <div style={{ maxHeight: 300, overflowY: 'auto', border: '1px solid #eee', padding: 8 }}>
                  {riders.map(r => (
                    <label key={r.id || r.uid} style={{ display: 'flex', alignItems: 'center', gap: 8, padding: 8, borderBottom: '1px solid #f5f5f5' }}>
                      <input type="radio" name="selectedRider" value={r.id || r.uid} checked={(selectedRiderId === (r.id || r.uid))} onChange={() => setSelectedRiderId(r.id || r.uid)} />
                      <div>
                        <div style={{ fontWeight: 600 }}>{r.firstName ? `${r.firstName} ${r.lastName || ''}`.trim() : r.name}</div>
                        <div style={{ fontSize: 13, color: '#666' }}>{r.email || r.phone || ''}</div>
                      </div>
                    </label>
                  ))}
                </div>
              )}
            </div>
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8, marginTop: 12 }}>
              <button onClick={closeAssignModal} style={{ padding: '8px 14px' }}>Cancel</button>
              <button onClick={saveAssignModal} disabled={assignLoading} style={{ padding: '8px 14px', background: '#10b981', color: 'white', border: 'none' }}>{assignLoading ? 'Saving...' : 'Save'}</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}