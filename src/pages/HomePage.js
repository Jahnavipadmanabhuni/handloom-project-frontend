// src/pages/HomePage.js
import React from 'react';
import { Link } from 'react-router-dom';
import './HomePage.css';

const HomePage = () => {
  return (
    <div
      className="homepage"
      style={{
        minHeight: '100vh',
        background: "url('/background.png') no-repeat center center fixed",
        backgroundSize: 'cover',
      }}
    >
      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-content">
          <h1>Discover Authentic Handloom Treasures</h1>
          <p>Connect with skilled artisans and own a piece of cultural heritage</p>
          <Link to="/products" className="cta-button">Shop Now</Link>
        </div>
      </section>

      {/* Features Section */}
      <section className="features-section">
        <div className="container">
          <h2>Why Choose HandloomHub?</h2>
          <div className="features-grid">
            <div className="feature-card">
              <h3>Authentic Crafts</h3>
              <p>Direct from artisans, preserving traditional techniques</p>
            </div>
            <div className="feature-card">
              <h3>Global Reach</h3>
              <p>Connecting local artisans with international buyers</p>
            </div>
            <div className="feature-card">
              <h3>Fair Trade</h3>
              <p>Ensuring fair compensation for skilled artisans</p>
            </div>
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="categories-section">
        <div className="container">
          <h2>Shop by Category</h2>
          <div className="categories-grid">
            <div className="category-card">
              <h3>Clothing</h3>
              <p>Traditional wear and modern designs</p>
            </div>
            <div className="category-card">
              <h3>Accessories</h3>
              <p>Handcrafted jewelry and accessories</p>
            </div>
            <div className="category-card">
              <h3>Home Decor</h3>
              <p>Beautiful textiles for your home</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;