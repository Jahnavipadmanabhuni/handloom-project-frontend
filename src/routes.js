import { Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import AdminDashboard from './pages/AdminDashboard';
import ArtisanDashboard from './pages/ArtisanDashboard';
import BuyerDashboard from './pages/BuyerDashboard';
import MarketingDashboard from './pages/MarketingDashboard';
import ProductDetails from './pages/ProductDetails';
import Cart from './pages/Cart';
import NotFound from './pages/NotFound';

const AppRoutes = () => (
  <Routes>
    <Route path="/" element={<Home />} />
    <Route path="/login" element={<Login />} />
    <Route path="/register" element={<Register />} />
    <Route path="/admin" element={<AdminDashboard />} />
    <Route path="/artisan" element={<ArtisanDashboard />} />
    <Route path="/buyer" element={<BuyerDashboard />} />
    <Route path="/marketing" element={<MarketingDashboard />} />
    <Route path="/product/:id" element={<ProductDetails />} />
    <Route path="/cart" element={<Cart />} />
    <Route path="*" element={<NotFound />} />
  </Routes>
);
export default AppRoutes;
