// Utility functions for the Sweet Shop application

// Format currency
export const formatCurrency = (amount, currency = 'USD') => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currency
  }).format(amount);
};

// Format date
export const formatDate = (date, options = {}) => {
  const defaultOptions = {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  };
  
  return new Intl.DateTimeFormat('en-US', { ...defaultOptions, ...options }).format(new Date(date));
};

// Debounce function for search
export const debounce = (func, wait) => {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
};

// Validate email
export const isValidEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

// Generate random ID (fallback when no backend)
export const generateId = () => {
  return Date.now() + Math.random().toString(36).substr(2, 9);
};

// Local storage helpers
export const storage = {
  get: (key, defaultValue = null) => {
    try {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : defaultValue;
    } catch {
      return defaultValue;
    }
  },
  
  set: (key, value) => {
    try {
      localStorage.setItem(key, JSON.stringify(value));
      return true;
    } catch {
      return false;
    }
  },
  
  remove: (key) => {
    try {
      localStorage.removeItem(key);
      return true;
    } catch {
      return false;
    }
  }
};

// Calculate stock status
export const getStockStatus = (quantity) => {
  if (quantity === 0) return { status: 'out-of-stock', text: 'Out of Stock', class: 'out-of-stock' };
  if (quantity < 5) return { status: 'low-stock', text: 'Low Stock', class: 'low-stock' };
  if (quantity < 10) return { status: 'medium-stock', text: 'Medium Stock', class: 'medium-stock' };
  return { status: 'in-stock', text: 'In Stock', class: 'in-stock' };
};

// Truncate text
export const truncateText = (text, maxLength = 100) => {
  if (text.length <= maxLength) return text;
  return text.substr(0, maxLength) + '...';
};

// Capitalize first letter
export const capitalize = (str) => {
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
};

// Sort functions
export const sortBy = {
  name: (a, b) => a.name.localeCompare(b.name),
  price: (a, b) => a.price - b.price,
  quantity: (a, b) => b.quantity - a.quantity,
  category: (a, b) => a.category.localeCompare(b.category)
};

// Error handling
export const handleApiError = (error) => {
  if (error.response) {
    // Server responded with error status
    return error.response.data?.message || `Error: ${error.response.status}`;
  } else if (error.request) {
    // Request was made but no response
    return 'Network error. Please check your connection.';
  } else {
    // Something else happened
    return error.message || 'An unexpected error occurred.';
  }
};

export default {
  formatCurrency,
  formatDate,
  debounce,
  isValidEmail,
  generateId,
  storage,
  getStockStatus,
  truncateText,
  capitalize,
  sortBy,
  handleApiError
};