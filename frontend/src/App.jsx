import React, { useState, useEffect, createContext, useContext } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { authService } from './services/authService';
import Navigation from './components/Navigation.jsx';
import EnhancedLandingPage from './components/EnhancedLandingPage.jsx';
import Dashboard from './components/Dashboard.jsx';
import AdminPanel from './components/AdminPanel.jsx';
import EnhancedPurchasedItems from './components/EnhancedPurchasedItems.jsx';
import './styles/global.css';
import './styles/auth.css';

// User Context
const UserContext = createContext();
export const useUser = () => useContext(UserContext);

// Protected Route Component
const ProtectedRoute = ({ children }) => {
  return authService.isAuthenticated() ? children : <Navigate to="/login" />;
};

// Admin Route Component
const AdminRoute = ({ children }) => {
  return authService.isAuthenticated() && authService.isAdmin() 
    ? children 
    : <Navigate to="/dashboard" />;
};

function App() {
  const [currentPage, setCurrentPage] = useState('dashboard');
  const [isAuthenticated, setIsAuthenticated] = useState(authService.isAuthenticated());
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    // Check authentication status on app load
    const authStatus = authService.isAuthenticated();
    setIsAuthenticated(authStatus);
    if (authStatus) {
      const user = authService.getCurrentUser();
      setCurrentUser(user);
    } else {
      setCurrentUser(null);
    }

    // Listen for auth changes
    const checkAuth = () => {
      const newAuthStatus = authService.isAuthenticated();
      setIsAuthenticated(newAuthStatus);
      if (newAuthStatus) {
        const user = authService.getCurrentUser();
        setCurrentUser(user);
      } else {
        setCurrentUser(null);
      }
    };

    window.addEventListener('storage', checkAuth);
    return () => window.removeEventListener('storage', checkAuth);
  }, []);

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const handleSwitchToAdmin = () => {
    setCurrentPage('admin');
  };

  const handleBackToDashboard = () => {
    setCurrentPage('dashboard');
  };

  return (
    <UserContext.Provider value={{ currentUser, setCurrentUser }}>
      <Router>
        <div className="App">
        <Routes>
          {/* Public Routes */}
          <Route 
            path="/auth" 
            element={
              isAuthenticated ? 
                <Navigate to="/dashboard" /> : 
                <EnhancedLandingPage />
            } 
          />

          {/* Protected Routes */}
          <Route 
            path="/dashboard" 
            element={
              <ProtectedRoute>
                <MainApp 
                  currentPage={currentPage}
                  onPageChange={handlePageChange}
                  onSwitchToAdmin={handleSwitchToAdmin}
                  onBackToDashboard={handleBackToDashboard}
                />
              </ProtectedRoute>
            } 
          />

          {/* Admin Routes */}
          <Route 
            path="/admin" 
            element={
              <AdminRoute>
                <MainApp 
                  currentPage="admin"
                  onPageChange={handlePageChange}
                  onSwitchToAdmin={handleSwitchToAdmin}
                  onBackToDashboard={handleBackToDashboard}
                />
              </AdminRoute>
            } 
          />

          {/* Default Route */}
          <Route 
            path="/" 
            element={
              <Navigate to={isAuthenticated ? "/dashboard" : "/auth"} />
            } 
          />
        </Routes>
      </div>
    </Router>
    </UserContext.Provider>
  );
}

// Main Application Component (after authentication)
const MainApp = ({ currentPage, onPageChange, onSwitchToAdmin, onBackToDashboard }) => {
  return (
    <div className="main-app">
      <Navigation currentPage={currentPage} onPageChange={onPageChange} />
      
      <main className="main-content container">
        {currentPage === 'dashboard' && (
          <Dashboard onSwitchToAdmin={onSwitchToAdmin} />
        )}
        {currentPage === 'purchases' && (
          <EnhancedPurchasedItems />
        )}
        {currentPage === 'admin' && authService.isAdmin() && (
          <AdminPanel onBackToDashboard={onBackToDashboard} />
        )}
      </main>
    </div>
  );
};

export default App;