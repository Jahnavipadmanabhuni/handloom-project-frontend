// src/pages/ProductDetail.js  — UPDATED: fetches from real backend API
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getProduct, addToCart } from '../services/api';
import './ProductDetail.css';

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');

  useEffect(() => {
    getProduct(id)
      .then(setProduct)
      .catch(() => setProduct(null))
      .finally(() => setLoading(false));
  }, [id]);

  const handleAddToCart = async () => {
    try {
      await addToCart(product.id, quantity);
      setMessage('Added to cart successfully!');
      setTimeout(() => setMessage(''), 2500);
    } catch (err) {
      alert('Please login to add items to cart.');
    }
  };

  if (loading) return <div className="product-detail"><p>Loading...</p></div>;
  if (!product) return <div className="product-detail"><p>Product not found.</p></div>;

  return (
    <div className="product-detail">
      <div className="container">
        <button onClick={() => navigate(-1)} className="btn btn-secondary back-btn">
          ← Back
        </button>

        {message && (
          <div style={{
            background: '#d4edda', color: '#155724', padding: '10px 16px',
            borderRadius: '6px', margin: '12px 0', fontWeight: 500
          }}>
            ✅ {message}
          </div>
        )}

        <div className="product-detail-content">
          <div className="product-image">
            <img src={product.image} alt={product.name} />
          </div>
          <div className="product-info">
            <h1>{product.name}</h1>
            <p className="artisan-name">By {product.artisan?.name || 'Artisan'}</p>
            <p className="price">₹{product.price}</p>
            <p className="description">{product.description}</p>

            {product.materials && (
              <div className="detail-row">
                <strong>Materials:</strong> {product.materials}
              </div>
            )}
            {product.dimensions && (
              <div className="detail-row">
                <strong>Dimensions:</strong> {product.dimensions}
              </div>
            )}
            <div className="detail-row">
              <strong>Stock:</strong> {product.stock > 0 ? `${product.stock} available` : 'Out of stock'}
            </div>

            <div className="quantity-section">
              <label>Quantity:</label>
              <div className="quantity-controls">
                <button onClick={() => setQuantity(q => Math.max(1, q - 1))}>-</button>
                <span>{quantity}</span>
                <button onClick={() => setQuantity(q => Math.min(product.stock, q + 1))}>+</button>
              </div>
            </div>

            <button
              onClick={handleAddToCart}
              className="btn btn-primary btn-large"
              disabled={product.stock === 0}
            >
              {product.stock === 0 ? 'Out of Stock' : 'Add to Cart'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
