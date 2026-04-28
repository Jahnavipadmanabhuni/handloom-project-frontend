// src/pages/CartPage.js  — UPDATED: uses real backend API
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { getCart, updateCartItem, removeFromCart, placeOrder } from '../services/api';
import './CartPage.css';

const CartPage = () => {
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    loadCart();
  }, []);

  const loadCart = async () => {
    try {
      const cart = await getCart();
      setCartItems(cart.items || []);
    } catch (err) {
      setError('Failed to load cart. Please login first.');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateQuantity = async (productId, newQuantity) => {
    if (newQuantity < 1) return;
    try {
      const updated = await updateCartItem(productId, newQuantity);
      setCartItems(updated.items || []);
    } catch (err) {
      alert('Failed to update quantity');
    }
  };

  const handleRemove = async (productId) => {
    try {
      const updated = await removeFromCart(productId);
      setCartItems(updated.items || []);
    } catch (err) {
      alert('Failed to remove item');
    }
  };

  const getTotalPrice = () =>
    cartItems.reduce((total, item) => total + (item.product.price * item.quantity), 0);

  const proceedToCheckout = async () => {
    if (cartItems.length === 0) {
      alert('Your cart is empty!');
      return;
    }
    try {
      await placeOrder({
        items: cartItems.map(item => ({
          productId: item.product.id,
          quantity: item.quantity,
          price: item.product.price,
        })),
        total: getTotalPrice(),
      });
      setCartItems([]);
      alert('Order placed successfully!');
      navigate('/buyer/orders');
    } catch (err) {
      alert('Failed to place order: ' + err.message);
    }
  };

  if (loading) return <div className="cart-page"><div className="container"><p>Loading cart...</p></div></div>;
  if (error)   return <div className="cart-page"><div className="container"><p className="error-message">{error}</p></div></div>;

  return (
    <div className="cart-page">
      <div className="container">
        <h1>Shopping Cart</h1>

        {cartItems.length === 0 ? (
          <div className="empty-cart">
            <h2>Your cart is empty</h2>
            <p>Discover amazing handloom products and add them to your cart.</p>
            <Link to="/products" className="btn btn-primary">Start Shopping</Link>
          </div>
        ) : (
          <div className="cart-content">
            <div className="cart-items">
              {cartItems.map(item => (
                <div key={item.id} className="cart-item">
                  <img src={item.product.image} alt={item.product.name} />
                  <div className="item-details">
                    <h3>{item.product.name}</h3>
                    <p className="artisan">By {item.product.artisan?.name || 'Artisan'}</p>
                    <p className="price">₹{item.product.price}</p>
                  </div>
                  <div className="quantity-controls">
                    <button
                      onClick={() => handleUpdateQuantity(item.product.id, item.quantity - 1)}
                      disabled={item.quantity <= 1}
                    >-</button>
                    <span>{item.quantity}</span>
                    <button
                      onClick={() => handleUpdateQuantity(item.product.id, item.quantity + 1)}
                      disabled={item.quantity >= item.product.stock}
                    >+</button>
                  </div>
                  <div className="item-total">
                    ₹{(item.product.price * item.quantity).toFixed(2)}
                  </div>
                  <button onClick={() => handleRemove(item.product.id)} className="remove-btn">
                    Remove
                  </button>
                </div>
              ))}
            </div>

            <div className="cart-summary">
              <h2>Order Summary</h2>
              <div className="summary-row">
                <span>Subtotal:</span>
                <span>₹{getTotalPrice().toFixed(2)}</span>
              </div>
              <div className="summary-row">
                <span>Shipping:</span>
                <span>₹10.00</span>
              </div>
              <div className="summary-row">
                <span>Tax (10%):</span>
                <span>₹{(getTotalPrice() * 0.1).toFixed(2)}</span>
              </div>
              <div className="summary-row total">
                <span>Total:</span>
                <span>₹{(getTotalPrice() + 10 + getTotalPrice() * 0.1).toFixed(2)}</span>
              </div>

              <button
                onClick={proceedToCheckout}
                className="btn btn-primary btn-large checkout-btn"
              >
                Proceed to Checkout
              </button>

              <Link to="/products" className="continue-shopping">
                Continue Shopping
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CartPage;
