// Mock authentication data for testing without backend
export const mockUsers = [
  {
    id: 1,
    username: "admin",
    email: "admin@sweetshop.com",
    password: "admin123", // In real app, this would be hashed
    role: "ADMIN"
  },
  {
    id: 2,
    username: "user1",
    email: "user1@sweetshop.com", 
    password: "user123",
    role: "USER"
  },
  {
    id: 3,
    username: "john",
    email: "john@example.com",
    password: "john123",
    role: "USER"
  },
  {
    id: 4,
    username: "alice",
    email: "alice@example.com",
    password: "alice123", 
    role: "ADMIN"
  }
];

// Generate mock JWT token
export const generateMockToken = (user) => {
  const payload = {
    id: user.id,
    username: user.username,
    role: user.role,
    exp: Date.now() + (24 * 60 * 60 * 1000) // 24 hours
  };
  
  // Simple base64 encoding for mock token
  return 'mock_' + btoa(JSON.stringify(payload));
};

// Test credentials for easy login
export const testCredentials = {
  admin: {
    username: "admin",
    password: "admin123",
    role: "ADMIN"
  },
  user: {
    username: "user1", 
    password: "user123",
    role: "USER"
  }
};

export default mockUsers;