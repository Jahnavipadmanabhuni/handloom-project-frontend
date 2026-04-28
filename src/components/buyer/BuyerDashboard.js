// src/components/buyer/BuyerDashboard.js  — UPDATED: uses real backend API
import React, { useState, useEffect } from 'react';
import { Routes, Route, Link, useLocation } from 'react-router-dom';
import { getCart, getMyOrders } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import './BuyerDashboard.css';

const BuyerDashboard = () => {
  const location = useLocation();
  const [cart, setCart] = useState({ items: [] });
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    getCart().then(setCart).catch(() => setCart({ items: [] }));
    getMyOrders().then(setOrders).catch(() => setOrders([]));
  }, []);

  return (
    <div className="buyer-dashboard">
      <div className="dashboard-sidebar">
        <h2>Buyer Panel</h2>
        <nav>
          <Link to="/buyer" className={location.pathname === '/buyer' ? 'active' : ''}>
            My Profile
          </Link>
          <Link to="/buyer/orders" className={location.pathname === '/buyer/orders' ? 'active' : ''}>
            My Orders
          </Link>
          <Link to="/buyer/wishlist" className={location.pathname === '/buyer/wishlist' ? 'active' : ''}>
            Wishlist
          </Link>
        </nav>
      </div>

      <div className="dashboard-content">
        <Routes>
          <Route path="/" element={<BuyerHome cart={cart} orders={orders} />} />
          <Route path="/orders" element={<BuyerOrders />} />
          <Route path="/wishlist" element={<BuyerWishlist />} />
        </Routes>
      </div>
    </div>
  );
};

const BuyerHome = ({ cart, orders }) => {
  const { user } = useAuth();

  return (
    <div>
      <h1>Welcome, {user?.name}!</h1>
      <div className="buyer-stats">
        <div className="stat-card">
          <h3>Cart Items</h3>
          <p className="stat-number">{cart.items?.length || 0}</p>
        </div>
        <div className="stat-card">
          <h3>Total Orders</h3>
          <p className="stat-number">{orders.length}</p>
        </div>
        <div className="stat-card">
          <h3>Pending Orders</h3>
          <p className="stat-number">
            {orders.filter(o => o.status === 'pending').length}
          </p>
        </div>
      </div>

      <div className="quick-actions">
        <h2>Quick Actions</h2>
        <div className="action-buttons">
          <Link to="/products" className="btn btn-primary">Continue Shopping</Link>
          <Link to="/cart" className="btn btn-secondary">View Cart</Link>
          <Link to="/buyer/orders" className="btn btn-secondary">View Orders</Link>
        </div>
      </div>
    </div>
  );
};

const BuyerOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getMyOrders()
      .then(setOrders)
      .catch(() => setOrders([]))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <p>Loading orders...</p>;

  return (
    <div>
      <h1>My Orders</h1>
      {orders.length === 0 ? (
        <p>No orders yet. <Link to="/products">Start shopping →</Link></p>
      ) : (
        <div className="orders-list">
          {orders.map(order => (
            <div key={order.id} className="order-card">
              <div className="order-header">
                <span><strong>Order #{order.id}</strong></span>
                <span className={`status status-${order.status}`}>{order.status}</span>
                <span>{order.orderDate}</span>
              </div>
              <p>Total: ₹{order.total?.toFixed(2)}</p>
              <div className="order-items">
                {order.items?.map(item => (
                  <div key={item.id} className="order-item-row">
                    <span>{item.product?.name}</span>
                    <span>x{item.quantity}</span>
                    <span>₹{item.price?.toFixed(2)}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

const BuyerWishlist = () => (
  <div>
    <h1>My Wishlist</h1>
    <p>Wishlist feature coming soon. <Link to="/products">Browse products →</Link></p>
  </div>
);

export default BuyerDashboard;
