// src/components/common/Navbar.js
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import './Navbar.css';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav className="navbar">
      <div className="nav-container">
        <Link to="/" className="nav-logo" style={{ display: 'flex', alignItems: 'left', gap: '0px' }}>
          <img src="/logo.png" alt="HandloomHub Logo" className="nav-logo-img" style={{ height: '120px', width: '120px', objectFit: 'contain', borderRadius: '6px' }} />
          HandloomHub
        </Link>
        
        <div className="nav-menu">
          <Link to="/" className="nav-link">Home</Link>
          <Link to="/products" className="nav-link">Products</Link>
          
          {user ? (
            <>
              <Link to={`/₹{user.role}`} className="nav-link">Dashboard</Link>
              <Link to="/cart" className="nav-link">Cart</Link>
              <button onClick={handleLogout} className="nav-link logout-btn">
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="nav-link">Login</Link>
              <Link to="/register" className="nav-link">Sign In/up</Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;