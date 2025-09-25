import axios from 'axios';
import { API_ENDPOINTS } from './config';
import { mockUsers, generateMockToken } from '../data/mockAuth';

// Create axios instance with default config
const apiClient = axios.create({
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('authToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('authToken');
      localStorage.removeItem('userRole');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Authentication Services
export const authService = {
  register: async (userData) => {
    try {
      const response = await apiClient.post(API_ENDPOINTS.REGISTER, userData);
      return response.data;
    } catch (error) {
      // Fallback to mock registration when API is not available
      console.log('API not available, using mock registration');
      
      // Check if user already exists
      const existingUser = mockUsers.find(u => 
        u.username === userData.username || u.email === userData.email
      );
      
      if (existingUser) {
        throw { message: 'User already exists with this username or email' };
      }
      
      // Create new mock user
      const newUser = {
        id: mockUsers.length + 1,
        username: userData.username,
        email: userData.email,
        password: userData.password,
        role: userData.role || 'USER'
      };
      
      mockUsers.push(newUser);
      
      return { 
        message: 'Registration successful', 
        user: { 
          id: newUser.id, 
          username: newUser.username, 
          email: newUser.email, 
          role: newUser.role 
        } 
      };
    }
  },

  login: async (credentials) => {
    try {
      const response = await apiClient.post(API_ENDPOINTS.LOGIN, credentials);
      const { token, user } = response.data;
      
      // Store token and user info
      localStorage.setItem('authToken', token);
      localStorage.setItem('userRole', user.role || 'USER');
      localStorage.setItem('userId', user.id);
      localStorage.setItem('username', user.username);
      
      return response.data;
    } catch (error) {
      // Fallback to mock authentication when API is not available
      console.log('API not available, using mock authentication');
      
      const user = mockUsers.find(u => 
        u.username === credentials.username && u.password === credentials.password
      );
      
      if (!user) {
        throw { message: 'Invalid username or password' };
      }
      
      const token = generateMockToken(user);
      
      // Store token and user info
      localStorage.setItem('authToken', token);
      localStorage.setItem('userRole', user.role);
      localStorage.setItem('userId', user.id.toString());
      localStorage.setItem('username', user.username);
      
      return {
        token,
        user: {
          id: user.id,
          username: user.username,
          email: user.email,
          role: user.role
        }
      };
    }
  },

  logout: () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('userRole');
    localStorage.removeItem('userId');
    localStorage.removeItem('username');
  },

  isAuthenticated: () => {
    return !!localStorage.getItem('authToken');
  },

  getUserRole: () => {
    return localStorage.getItem('userRole') || 'USER';
  },

  isAdmin: () => {
    return localStorage.getItem('userRole') === 'ADMIN';
  }
};

export default apiClient;