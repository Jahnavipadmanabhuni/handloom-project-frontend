// src/components/artisan/ArtisanDashboard.js  — UPDATED: uses real backend API
import React, { useState, useEffect } from 'react';
import { Routes, Route, Link, useLocation } from 'react-router-dom';
import { getMyProducts, createProduct, updateProduct, deleteProduct } from '../../services/api';
import './ArtisanDashboard.css';

const ArtisanDashboard = () => {
  const location = useLocation();
  const [products, setProducts] = useState([]);

  useEffect(() => {
    getMyProducts()
      .then(setProducts)
      .catch(() => setProducts([]));
  }, []);

  const handleAddProduct = async (product) => {
    const created = await createProduct(product);
    setProducts(prev => [...prev, created]);
  };

  const handleUpdateProduct = async (id, data) => {
    const updated = await updateProduct(id, data);
    setProducts(prev => prev.map(p => (p.id === id ? updated : p)));
  };

  const handleDeleteProduct = async (id) => {
    if (!window.confirm('Delete this product?')) return;
    await deleteProduct(id);
    setProducts(prev => prev.filter(p => p.id !== id));
  };

  return (
    <div className="artisan-dashboard">
      <div className="dashboard-sidebar">
        <h2>Artisan Panel</h2>
        <nav>
          <Link to="/artisan" className={location.pathname === '/artisan' ? 'active' : ''}>
            My Products
          </Link>
          <Link to="/artisan/add" className={location.pathname === '/artisan/add' ? 'active' : ''}>
            Add Product
          </Link>
          <Link to="/artisan/orders" className={location.pathname === '/artisan/orders' ? 'active' : ''}>
            Orders
          </Link>
        </nav>
      </div>

      <div className="dashboard-content">
        <Routes>
          <Route path="/" element={
            <ArtisanHome
              products={products}
              onDelete={handleDeleteProduct}
            />
          } />
          <Route path="/add" element={<AddProduct onAddProduct={handleAddProduct} />} />
          <Route path="/orders" element={<ArtisanOrders />} />
        </Routes>
      </div>
    </div>
  );
};

const ArtisanHome = ({ products, onDelete }) => (
  <div>
    <h1>My Products</h1>
    {products.length === 0 ? (
      <p>No products yet. <Link to="/artisan/add">Add your first product →</Link></p>
    ) : (
      <div className="products-grid">
        {products.map(product => (
          <div key={product.id} className="product-card">
            <img src={product.image} alt={product.name} />
            <h3>{product.name}</h3>
            <p>₹{product.price}</p>
            <p>Stock: {product.stock}</p>
            <p>Category: {product.category}</p>
            <div className="product-actions">
              <button className="btn btn-edit">Edit</button>
              <button className="btn btn-delete" onClick={() => onDelete(product.id)}>Delete</button>
            </div>
          </div>
        ))}
      </div>
    )}
  </div>
);

const AddProduct = ({ onAddProduct }) => {
  const [formData, setFormData] = useState({
    name: '', description: '', price: '', stock: '',
    category: '', image: '', materials: '', dimensions: ''
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState('');

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await onAddProduct({
        ...formData,
        price: parseFloat(formData.price),
        stock: parseInt(formData.stock),
      });
      setSuccess('Product added successfully!');
      setFormData({ name: '', description: '', price: '', stock: '', category: '', image: '', materials: '', dimensions: '' });
    } catch (err) {
      alert('Failed to add product: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h1>Add New Product</h1>
      {success && <div style={{ color: 'green', marginBottom: 12 }}>✅ {success}</div>}
      <form onSubmit={handleSubmit} className="product-form">
        {[
          { label: 'Product Name', name: 'name', type: 'text', required: true },
          { label: 'Price (₹)', name: 'price', type: 'number', required: true },
          { label: 'Stock Quantity', name: 'stock', type: 'number', required: true },
          { label: 'Image URL', name: 'image', type: 'text' },
          { label: 'Materials', name: 'materials', type: 'text' },
          { label: 'Dimensions', name: 'dimensions', type: 'text' },
        ].map(field => (
          <div className="form-group" key={field.name}>
            <label>{field.label}:</label>
            <input
              type={field.type}
              name={field.name}
              value={formData[field.name]}
              onChange={handleChange}
              required={field.required}
            />
          </div>
        ))}

        <div className="form-group">
          <label>Category:</label>
          <select name="category" value={formData.category} onChange={handleChange} required>
            <option value="">Select Category</option>
            <option value="clothing">Clothing</option>
            <option value="accessories">Accessories</option>
            <option value="home-decor">Home Decor</option>
            <option value="textiles">Textiles</option>
          </select>
        </div>

        <div className="form-group">
          <label>Description:</label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            rows="4"
            required
          />
        </div>

        <button type="submit" className="btn btn-primary" disabled={loading}>
          {loading ? 'Adding...' : 'Add Product'}
        </button>
      </form>
    </div>
  );
};

const ArtisanOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Admin/artisan can view all orders
    import('../../services/api').then(({ getAllOrders }) => {
      getAllOrders()
        .then(setOrders)
        .catch(() => setOrders([]))
        .finally(() => setLoading(false));
    });
  }, []);

  if (loading) return <p>Loading orders...</p>;

  return (
    <div>
      <h1>Orders</h1>
      {orders.length === 0 ? (
        <p>No orders yet.</p>
      ) : (
        <div className="orders-list">
          {orders.map(order => (
            <div key={order.id} className="order-card">
              <div className="order-header">
                <span>Order #{order.id}</span>
                <span className={`status status-${order.status}`}>{order.status}</span>
                <span>{order.orderDate}</span>
              </div>
              <p>Total: ₹{order.total?.toFixed(2)}</p>
              <p>Buyer: {order.buyer?.name}</p>
              <p>Items: {order.items?.length || 0}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ArtisanDashboard;
