import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { authService } from '../services/authService';
import { useUser } from '../App';
import { 
  FaHome, 
  FaSignOutAlt, 
  FaUser, 
  FaCog,
  FaBars,
  FaTimes,
  FaShoppingBag,
  FaUserCircle,
  FaCrown,
  FaChevronDown
} from 'react-icons/fa';

const Navigation = ({ currentPage, onPageChange }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [showUserDropdown, setShowUserDropdown] = useState(false);
  const navigate = useNavigate();
  const { currentUser } = useUser();
  const isAdmin = authService.isAdmin();
  const username = currentUser?.username || 'User';
  const userRole = currentUser?.role || 'USER';

  const handleLogout = () => {
    authService.logout();
    navigate('/login');
  };

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: FaHome },
    { id: 'purchases', label: 'My Purchases', icon: FaShoppingBag },
    ...(isAdmin ? [{ id: 'admin', label: 'Admin Panel', icon: FaCog }] : [])
  ];

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <div className="navbar-brand">
          <h1>🍭 Sweet Shop</h1>
        </div>

        {/* Desktop Navigation */}
        <div className="navbar-nav">
          {navItems.map(item => {
            const Icon = item.icon;
            return (
              <button
                key={item.id}
                className={`nav-item ${currentPage === item.id ? 'active' : ''}`}
                onClick={() => onPageChange(item.id)}
              >
                <Icon />
                {item.label}
              </button>
            );
          })}
        </div>

        {/* Enhanced User Menu */}
        <div className="navbar-user">
          <div className="user-dropdown" onClick={() => setShowUserDropdown(!showUserDropdown)}>
            <div className="user-avatar">
              <FaUserCircle className="avatar-icon" />
            </div>
            <div className="user-details">
              <span className="user-name">{username}</span>
              <span className="user-role">
                {isAdmin && <FaCrown className="role-icon" />}
                {userRole === 'ADMIN' ? 'Administrator' : 'Customer'}
              </span>
            </div>
            <FaChevronDown className={`dropdown-arrow ${showUserDropdown ? 'open' : ''}`} />
          </div>

          {/* User Dropdown Menu */}
          {showUserDropdown && (
            <div className="user-dropdown-menu">
              <div className="dropdown-header">
                <div className="user-avatar-large">
                  <FaUserCircle />
                </div>
                <div>
                  <div className="dropdown-username">{username}</div>
                  <div className="dropdown-role">{userRole === 'ADMIN' ? 'Administrator' : 'Customer'}</div>
                </div>
              </div>
              <div className="dropdown-divider"></div>
              <button className="dropdown-item" onClick={() => alert('Profile settings coming soon!')}>
                <FaUser />
                <span>Profile Settings</span>
              </button>
              <button className="dropdown-item logout" onClick={handleLogout}>
                <FaSignOutAlt />
                <span>Sign Out</span>
              </button>
            </div>
          )}
        </div>

        {/* Mobile Menu Toggle */}
        <button className="mobile-menu-toggle" onClick={toggleMobileMenu}>
          {isMobileMenuOpen ? <FaTimes /> : <FaBars />}
        </button>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="mobile-menu">
          {navItems.map(item => {
            const Icon = item.icon;
            return (
              <button
                key={item.id}
                className={`mobile-nav-item ${currentPage === item.id ? 'active' : ''}`}
                onClick={() => {
                  onPageChange(item.id);
                  setIsMobileMenuOpen(false);
                }}
              >
                <Icon />
                {item.label}
              </button>
            );
          })}
          <button className="mobile-nav-item logout" onClick={handleLogout}>
            <FaSignOutAlt />
            Logout
          </button>
        </div>
      )}
    </nav>
  );
};

export default Navigation;