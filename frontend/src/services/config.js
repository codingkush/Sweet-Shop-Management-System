// API Configuration
const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:8080/api';

export const API_ENDPOINTS = {
  // Authentication
  REGISTER: `${API_BASE_URL}/auth/register`,
  LOGIN: `${API_BASE_URL}/auth/login`,
  
  // Sweets Management
  SWEETS: `${API_BASE_URL}/sweets`,
  SWEETS_SEARCH: `${API_BASE_URL}/sweets/search`,
  SWEET_BY_ID: (id) => `${API_BASE_URL}/sweets/${id}`,
  
  // Inventory Management
  PURCHASE_SWEET: (id) => `${API_BASE_URL}/sweets/${id}/purchase`,
  RESTOCK_SWEET: (id) => `${API_BASE_URL}/sweets/${id}/restock`,
};

export default API_BASE_URL;