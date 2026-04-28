// src/services/api.js
// Central API service — replaces all localStorage calls in the original frontend

const BASE_URL = process.env.REACT_APP_API_URL 
  ? process.env.REACT_APP_API_URL + '/api' 
  : 'http://localhost:8080/api';

const getAuthHeader = () => {
  const token = localStorage.getItem('handloom_token');
  return token ? { 'Authorization': `Bearer ${token}` } : {};
};

const handleResponse = async (res) => {
  if (!res.ok) {
    const text = await res.text();
    throw new Error(text || 'Request failed');
  }
  // Handle empty responses (e.g. 204 No Content)
  const text = await res.text();
  return text ? JSON.parse(text) : null;
};

// ─── AUTH ────────────────────────────────────────────────────────────────────
export const registerUser = (data) =>
  fetch(`${BASE_URL}/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  }).then(handleResponse);

export const loginUser = (data) =>
  fetch(`${BASE_URL}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  }).then(handleResponse);

// ─── PRODUCTS ────────────────────────────────────────────────────────────────
export const getProducts = (filters = {}) => {
  const params = new URLSearchParams();
  if (filters.category) params.append('category', filters.category);
  if (filters.search)   params.append('search', filters.search);
  const qs = params.toString();
  return fetch(`${BASE_URL}/products${qs ? '?' + qs : ''}`).then(handleResponse);
};

export const getProduct = (id) =>
  fetch(`${BASE_URL}/products/${id}`).then(handleResponse);

export const getMyProducts = () =>
  fetch(`${BASE_URL}/products/my-products`, {
    headers: getAuthHeader(),
  }).then(handleResponse);

export const createProduct = (data) =>
  fetch(`${BASE_URL}/products`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', ...getAuthHeader() },
    body: JSON.stringify(data),
  }).then(handleResponse);

export const updateProduct = (id, data) =>
  fetch(`${BASE_URL}/products/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json', ...getAuthHeader() },
    body: JSON.stringify(data),
  }).then(handleResponse);

export const deleteProduct = (id) =>
  fetch(`${BASE_URL}/products/${id}`, {
    method: 'DELETE',
    headers: getAuthHeader(),
  }).then(handleResponse);

// ─── CART ────────────────────────────────────────────────────────────────────
export const getCart = () =>
  fetch(`${BASE_URL}/cart`, { headers: getAuthHeader() }).then(handleResponse);

export const addToCart = async (productId, quantity) => {
  const token = localStorage.getItem('handloom_token');
  console.log('Sending token:', token);
  console.log('Adding to cart:', productId, quantity);
  
  const response = await fetch(`${BASE_URL}/cart/add`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify({ productId, quantity }),
  });

  const text = await response.text();
  console.log('Cart response:', response.status, text);

  if (!response.ok) {
    throw new Error(text || 'Failed to add to cart');
  }
  return text ? JSON.parse(text) : null;
};

export const updateCartItem = (productId, quantity) =>
  fetch(`${BASE_URL}/cart/update`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json', ...getAuthHeader() },
    body: JSON.stringify({ productId, quantity }),
  }).then(handleResponse);

export const removeFromCart = (productId) =>
  fetch(`${BASE_URL}/cart/remove/${productId}`, {
    method: 'DELETE',
    headers: getAuthHeader(),
  }).then(handleResponse);

export const clearCart = () =>
  fetch(`${BASE_URL}/cart/clear`, {
    method: 'DELETE',
    headers: getAuthHeader(),
  }).then(handleResponse);

// ─── ORDERS ──────────────────────────────────────────────────────────────────
export const placeOrder = (orderData) =>
  fetch(`${BASE_URL}/orders`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', ...getAuthHeader() },
    body: JSON.stringify(orderData),
  }).then(handleResponse);

export const getMyOrders = () =>
  fetch(`${BASE_URL}/orders/my-orders`, {
    headers: getAuthHeader(),
  }).then(handleResponse);

export const getAllOrders = () =>
  fetch(`${BASE_URL}/orders`, { headers: getAuthHeader() }).then(handleResponse);

export const updateOrderStatus = (orderId, status) =>
  fetch(`${BASE_URL}/orders/${orderId}/status`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json', ...getAuthHeader() },
    body: JSON.stringify({ status }),
  }).then(handleResponse);

// ─── CAMPAIGNS ───────────────────────────────────────────────────────────────
export const getAllCampaigns = () =>
  fetch(`${BASE_URL}/campaigns`, { headers: getAuthHeader() }).then(handleResponse);

export const getMyCampaigns = () =>
  fetch(`${BASE_URL}/campaigns/my-campaigns`, {
    headers: getAuthHeader(),
  }).then(handleResponse);

export const createCampaign = (data) =>
  fetch(`${BASE_URL}/campaigns`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', ...getAuthHeader() },
    body: JSON.stringify(data),
  }).then(handleResponse);

export const updateCampaign = (id, data) =>
  fetch(`${BASE_URL}/campaigns/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json', ...getAuthHeader() },
    body: JSON.stringify(data),
  }).then(handleResponse);

export const deleteCampaign = (id) =>
  fetch(`${BASE_URL}/campaigns/${id}`, {
    method: 'DELETE',
    headers: getAuthHeader(),
  }).then(handleResponse);

// ─── ADMIN ───────────────────────────────────────────────────────────────────
export const getAllUsers = () =>
  fetch(`${BASE_URL}/admin/users`, { headers: getAuthHeader() }).then(handleResponse);

export const deleteUser = (id) =>
  fetch(`${BASE_URL}/admin/users/${id}`, {
    method: 'DELETE',
    headers: getAuthHeader(),
  }).then(handleResponse);
