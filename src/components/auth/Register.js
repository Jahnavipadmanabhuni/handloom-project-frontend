// src/components/auth/Register.js  — UPDATED: calls real backend API
import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import './Auth.css';

const Register = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: 'buyer',
    phone: '',
    address: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    setLoading(true);
    try {
      const { confirmPassword, ...registerData } = formData;
      const data = await register(registerData);
      navigate(`/${data.role}`);
    } catch (err) {
      setError(err.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <form className="auth-form" onSubmit={handleSubmit}>
        <h2>Join HandloomHub</h2>

        {error && <div className="error-message">{error}</div>}

        <div className="form-group">
          <label>Full Name:</label>
          <input type="text" name="name" value={formData.name} onChange={handleChange} required />
        </div>

        <div className="form-group">
          <label>Email:</label>
          <input type="email" name="email" value={formData.email} onChange={handleChange} required />
        </div>

        <div className="form-group">
          <label>Password:</label>
          <input type="password" name="password" value={formData.password} onChange={handleChange} required />
        </div>

        <div className="form-group">
          <label>Confirm Password:</label>
          <input type="password" name="confirmPassword" value={formData.confirmPassword} onChange={handleChange} required />
        </div>

        <div className="form-group">
          <label>Role:</label>
          <select name="role" value={formData.role} onChange={handleChange}>
            <option value="buyer">Buyer</option>
            <option value="artisan">Artisan</option>
            <option value="marketing">Marketing Specialist</option>
          </select>
        </div>

        <div className="form-group">
          <label>Phone:</label>
          <input type="tel" name="phone" value={formData.phone} onChange={handleChange} />
        </div>

        <div className="form-group">
          <label>Address:</label>
          <textarea name="address" value={formData.address} onChange={handleChange} rows="3" />
        </div>

        <button type="submit" className="auth-btn" disabled={loading}>
          {loading ? 'Registering...' : 'Register'}
        </button>

        <p className="auth-link">
          Already have an account? <Link to="/login">Login here</Link>
        </p>
      </form>
    </div>
  );
};

export default Register;
