// src/pages/ProductsPage.js  — UPDATED: fetches from real backend API
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getProducts, addToCart } from '../services/api';
import './ProductsPage.css';

const ProductsPage = () => {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [filters, setFilters] = useState({ category: '', search: '' });
  const [loading, setLoading] = useState(true);
  const [cartMessage, setCartMessage] = useState('');

  // Load all products on mount
  useEffect(() => {
    getProducts()
      .then(data => {
        setProducts(data);
        setFilteredProducts(data);
      })
      .catch(() => setProducts([]))
      .finally(() => setLoading(false));
  }, []);

  // Apply filters locally for fast UX
  useEffect(() => {
    let result = [...products];
    if (filters.category) {
      result = result.filter(p => p.category === filters.category);
    }
    if (filters.search) {
      result = result.filter(p =>
        p.name.toLowerCase().includes(filters.search.toLowerCase())
      );
    }
    setFilteredProducts(result);
  }, [filters, products]);

  const handleFilterChange = (e) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  };

  const handleAddToCart = async (product) => {
    const token = localStorage.getItem('handloom_token');
    if (!token) {
      window.location.href = '/login';
      return;
    }
    try {
      await addToCart(product.id, 1);
      setCartMessage(`"${product.name}" added to cart!`);
      setTimeout(() => setCartMessage(''), 2500);
    } catch (err) {
      console.error('Cart error:', err);
      setCartMessage('Failed to add to cart. Try again.');
      setTimeout(() => setCartMessage(''), 2500);
    }
  };

  if (loading) return <div className="products-page"><div className="container"><p>Loading products...</p></div></div>;

  return (
    <div className="products-page">
      <div className="container">
        <h1>Our Handloom Products</h1>

        {cartMessage && (
          <div style={{
            background: '#d4edda', color: '#155724', padding: '10px 16px',
            borderRadius: '6px', marginBottom: '16px', fontWeight: 500
          }}>
            ✅ {cartMessage}
          </div>
        )}

        {/* Filters */}
        <div className="filters">
          <input
            type="text"
            name="search"
            placeholder="Search products..."
            value={filters.search}
            onChange={handleFilterChange}
            className="search-input"
          />
          <select name="category" value={filters.category} onChange={handleFilterChange}>
            <option value="">All Categories</option>
            <option value="clothing">Clothing</option>
            <option value="accessories">Accessories</option>
            <option value="home-decor">Home Decor</option>
            <option value="textiles">Textiles</option>
          </select>
        </div>

        {/* Product Grid */}
        {filteredProducts.length === 0 ? (
          <p>No products found.</p>
        ) : (
          <div className="products-grid">
            {filteredProducts.map(product => (
              <div key={product.id} className="product-card">
                <img src={product.image} alt={product.name} />
                <div className="product-info">
                  <h3>{product.name}</h3>
                  <p className="artisan">By gajjal berlin</p>
                  <p className="price">₹{product.price}</p>
                  <p className="stock">
                    {product.stock > 0 ? `${product.stock} in stock` : 'Out of stock'}
                  </p>
                </div>
                <div className="product-actions">
                  <Link to={`/product/${product.id}`} className="btn btn-secondary">
                    View Details
                  </Link>
                  <button
                    onClick={() => handleAddToCart(product)}
                    className="btn btn-primary"
                    disabled={product.stock === 0}
                  >
                    Add to Cart
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductsPage;
