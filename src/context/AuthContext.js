// src/context/AuthContext.js  — UPDATED: uses real API instead of localStorage
import React, { createContext, useState, useContext, useEffect } from 'react';
import { loginUser, registerUser } from '../services/api';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Restore session from localStorage on page reload
    const savedUser = localStorage.getItem('handloom_user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
    setLoading(false);
  }, []);

  // Call backend API to login — saves token + user to localStorage
  const login = async (credentials) => {
    const data = await loginUser(credentials);
    // data = { token, id, name, email, role }
    localStorage.setItem('handloom_token', data.token);
    localStorage.setItem('handloom_user', JSON.stringify(data));
    setUser(data);
    return data;
  };

  // Call backend API to register — saves token + user to localStorage
  const register = async (formData) => {
    const data = await registerUser(formData);
    localStorage.setItem('handloom_token', data.token);
    localStorage.setItem('handloom_user', JSON.stringify(data));
    setUser(data);
    return data;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('handloom_token');
    localStorage.removeItem('handloom_user');
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};
