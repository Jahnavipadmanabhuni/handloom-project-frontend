// src/components/admin/AdminDashboard.js  — UPDATED: uses real backend API
import React, { useState, useEffect } from 'react';
import { Routes, Route, Link, useLocation } from 'react-router-dom';
import { getAllUsers, deleteUser, getAllOrders, updateOrderStatus, getProducts } from '../../services/api';
import './AdminDashboard.css';

const AdminDashboard = () => {
  const location = useLocation();
  const [stats, setStats] = useState({ totalUsers: 0, totalProducts: 0, totalOrders: 0 });

  useEffect(() => {
    Promise.all([getAllUsers(), getProducts(), getAllOrders()])
      .then(([users, products, orders]) => {
        setStats({
          totalUsers: users.length,
          totalProducts: products.length,
          totalOrders: orders.length,
          pendingOrders: orders.filter(o => o.status === 'pending').length,
        });
      })
      .catch(() => {});
  }, []);

  return (
    <div className="admin-dashboard">
      <div className="dashboard-sidebar">
        <h2>Admin Panel</h2>
        <nav>
          <Link to="/admin" className={location.pathname === '/admin' ? 'active' : ''}>Dashboard</Link>
          <Link to="/admin/users" className={location.pathname === '/admin/users' ? 'active' : ''}>User Management</Link>
          <Link to="/admin/products" className={location.pathname === '/admin/products' ? 'active' : ''}>Products</Link>
          <Link to="/admin/orders" className={location.pathname === '/admin/orders' ? 'active' : ''}>Order Management</Link>
        </nav>
      </div>

      <div className="dashboard-content">
        <Routes>
          <Route path="/" element={<AdminHome stats={stats} />} />
          <Route path="/users" element={<UserManagement />} />
          <Route path="/products" element={<ProductManagement />} />
          <Route path="/orders" element={<OrderManagement />} />
        </Routes>
      </div>
    </div>
  );
};

const AdminHome = ({ stats }) => (
  <div>
    <h1>Admin Dashboard</h1>
    <div className="stats-grid">
      {[
        { label: 'Total Users', value: stats.totalUsers },
        { label: 'Total Products', value: stats.totalProducts },
        { label: 'Total Orders', value: stats.totalOrders },
        { label: 'Pending Orders', value: stats.pendingOrders },
      ].map(s => (
        <div className="stat-card" key={s.label}>
          <h3>{s.label}</h3>
          <p className="stat-number">{s.value ?? 0}</p>
        </div>
      ))}
    </div>
  </div>
);

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getAllUsers().then(setUsers).catch(() => setUsers([])).finally(() => setLoading(false));
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this user?')) return;
    await deleteUser(id);
    setUsers(prev => prev.filter(u => u.id !== id));
  };

  if (loading) return <p>Loading users...</p>;

  return (
    <div>
      <h1>User Management</h1>
      <table className="admin-table">
        <thead>
          <tr><th>ID</th><th>Name</th><th>Email</th><th>Role</th><th>Actions</th></tr>
        </thead>
        <tbody>
          {users.map(user => (
            <tr key={user.id}>
              <td>{user.id}</td>
              <td>{user.name}</td>
              <td>{user.email}</td>
              <td><span className={`role-badge role-${user.role}`}>{user.role}</span></td>
              <td>
                <button className="btn btn-delete" onClick={() => handleDelete(user.id)}>
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

const ProductManagement = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getProducts().then(setProducts).catch(() => setProducts([])).finally(() => setLoading(false));
  }, []);

  if (loading) return <p>Loading products...</p>;

  return (
    <div>
      <h1>Product Management</h1>
      <table className="admin-table">
        <thead>
          <tr><th>ID</th><th>Name</th><th>Category</th><th>Price</th><th>Stock</th><th>Artisan</th></tr>
        </thead>
        <tbody>
          {products.map(p => (
            <tr key={p.id}>
              <td>{p.id}</td>
              <td>{p.name}</td>
              <td>{p.category}</td>
              <td>₹{p.price}</td>
              <td>{p.stock}</td>
              <td>{p.artisan?.name}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

const OrderManagement = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getAllOrders().then(setOrders).catch(() => setOrders([])).finally(() => setLoading(false));
  }, []);

  const handleStatusChange = async (id, status) => {
    const updated = await updateOrderStatus(id, status);
    setOrders(prev => prev.map(o => (o.id === id ? updated : o)));
  };

  if (loading) return <p>Loading orders...</p>;

  return (
    <div>
      <h1>Order Management</h1>
      <table className="admin-table">
        <thead>
          <tr><th>ID</th><th>Buyer</th><th>Date</th><th>Total</th><th>Status</th><th>Actions</th></tr>
        </thead>
        <tbody>
          {orders.map(order => (
            <tr key={order.id}>
              <td>#{order.id}</td>
              <td>{order.buyer?.name}</td>
              <td>{order.orderDate}</td>
              <td>₹{order.total?.toFixed(2)}</td>
              <td><span className={`status status-${order.status}`}>{order.status}</span></td>
              <td>
                <select
                  value={order.status}
                  onChange={(e) => handleStatusChange(order.id, e.target.value)}
                >
                  <option value="pending">Pending</option>
                  <option value="confirmed">Confirmed</option>
                  <option value="shipped">Shipped</option>
                  <option value="delivered">Delivered</option>
                </select>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AdminDashboard;
