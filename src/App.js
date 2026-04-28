// src/App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Navbar from './components/common/Navbar';
import Footer from './components/common/Footer';
import Login from './components/auth/Login';
import Register from './components/auth/Register';
import AdminDashboard from './components/admin/AdminDashboard';
import ArtisanDashboard from './components/artisan/ArtisanDashboard';
import BuyerDashboard from './components/buyer/BuyerDashboard';
import MarketingDashboard from './components/marketing/MarketingDashboard';
import HomePage from './pages/HomePage';
import ProductsPage from './pages/ProductsPage';
import ProductDetail from './pages/ProductDetail';
import CartPage from './pages/CartPage';
import './App.css';

// Protected Route Component
const ProtectedRoute = ({ children, allowedRoles }) => {
  const { user } = useAuth();
  
  if (!user) {
    return <Navigate to="/login" />;
  }
  
  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return <Navigate to="/" />;
  }
  
  return children;
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="App">
          <Navbar />
          <main>
            <Routes>
              {/* Public Routes */}
              <Route path="/" element={<HomePage />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/products" element={<ProductsPage />} />
              <Route path="/product/:id" element={<ProductDetail />} />
              <Route path="/cart" element={<CartPage />} />

              {/* Protected Routes */}
              <Route 
                path="/admin/*" 
                element={
                  <ProtectedRoute allowedRoles={['admin']}>
                    <AdminDashboard />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/artisan/*" 
                element={
                  <ProtectedRoute allowedRoles={['artisan']}>
                    <ArtisanDashboard />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/buyer/*" 
                element={
                  <ProtectedRoute allowedRoles={['buyer']}>
                    <BuyerDashboard />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/marketing/*" 
                element={
                  <ProtectedRoute allowedRoles={['marketing']}>
                    <MarketingDashboard />
                  </ProtectedRoute>
                } 
              />
            </Routes>
          </main>
          <Footer />
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;