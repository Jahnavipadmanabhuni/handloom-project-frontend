// utils/auth.js
export const getUserRole = () => {
  // Use localStorage or cookies in real use
  return localStorage.getItem('role'); // 'Admin', 'Artisan', 'Buyer', 'Marketing'
};
