import apiClient from './authService';
import { API_ENDPOINTS } from './config';

export const sweetService = {
  // Get all sweets
  getAllSweets: async () => {
    try {
      const response = await apiClient.get(API_ENDPOINTS.SWEETS);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Search sweets
  searchSweets: async (searchParams) => {
    try {
      const params = new URLSearchParams();
      if (searchParams.name) params.append('name', searchParams.name);
      if (searchParams.category) params.append('category', searchParams.category);
      if (searchParams.minPrice) params.append('minPrice', searchParams.minPrice);
      if (searchParams.maxPrice) params.append('maxPrice', searchParams.maxPrice);

      const response = await apiClient.get(`${API_ENDPOINTS.SWEETS_SEARCH}?${params}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Get sweet by ID
  getSweetById: async (id) => {
    try {
      const response = await apiClient.get(API_ENDPOINTS.SWEET_BY_ID(id));
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Add new sweet (Admin only)
  addSweet: async (sweetData) => {
    try {
      const response = await apiClient.post(API_ENDPOINTS.SWEETS, sweetData);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Update sweet (Admin only)
  updateSweet: async (id, sweetData) => {
    try {
      const response = await apiClient.put(API_ENDPOINTS.SWEET_BY_ID(id), sweetData);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Delete sweet (Admin only)
  deleteSweet: async (id) => {
    try {
      const response = await apiClient.delete(API_ENDPOINTS.SWEET_BY_ID(id));
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Purchase sweet
  purchaseSweet: async (id, quantity = 1) => {
    try {
      const response = await apiClient.post(API_ENDPOINTS.PURCHASE_SWEET(id), { quantity });
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Restock sweet (Admin only)
  restockSweet: async (id, quantity) => {
    try {
      const response = await apiClient.post(API_ENDPOINTS.RESTOCK_SWEET(id), { quantity });
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  }
};

export default sweetService;