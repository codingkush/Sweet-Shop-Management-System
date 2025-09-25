import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { authService } from '../services/authService';
import { 
  FaUser, 
  FaLock, 
  FaEye, 
  FaEyeSlash, 
  FaEnvelope, 
  FaUserShield, 
  FaUserCheck, 
  FaStar,
  FaHeart,
  FaGift,
  FaTrophy
} from 'react-icons/fa';
import TestCredentials from './TestCredentials.jsx';
import '../styles/enhanced-landing.css';

const EnhancedLandingPage = () => {
  const [isSignUp, setIsSignUp] = useState(false);
  const [selectedRole, setSelectedRole] = useState('USER');
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear errors when user starts typing
    if (error) setError('');
  };

  const handleTestCredentialFill = (username, password, role) => {
    setFormData(prev => ({
      ...prev,
      username,
      password
    }));
    setSelectedRole(role);
    if (isSignUp) {
      setIsSignUp(false);
    }
  };

  const validateForm = () => {
    if (!formData.username || !formData.password) {
      setError('Username and password are required');
      return false;
    }

    if (isSignUp) {
      if (!formData.email) {
        setError('Email is required for registration');
        return false;
      }
      if (formData.password !== formData.confirmPassword) {
        setError('Passwords do not match');
        return false;
      }
      if (formData.password.length < 6) {
        setError('Password must be at least 6 characters long');
        return false;
      }
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!validateForm()) {
      return;
    }

    setIsLoading(true);

    try {
      if (isSignUp) {
        const registerData = {
          username: formData.username,
          email: formData.email,
          password: formData.password,
          role: selectedRole
        };
        await authService.register(registerData);
        setSuccess('Registration successful! Please sign in.');
        setTimeout(() => {
          setIsSignUp(false);
          setFormData({
            username: formData.username,
            email: '',
            password: formData.password,
            confirmPassword: ''
          });
          setSuccess('');
        }, 2000);
      } else {
        await authService.login({
          username: formData.username,
          password: formData.password
        });
        navigate('/dashboard');
      }
    } catch (err) {
      setError(err.message || `${isSignUp ? 'Registration' : 'Login'} failed. Please try again.`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="enhanced-landing">
      {/* Animated Background */}
      <div className="background-layer">
        <div className="gradient-orbs">
          <div className="orb orb-1"></div>
          <div className="orb orb-2"></div>
          <div className="orb orb-3"></div>
          <div className="orb orb-4"></div>
        </div>
        <div className="floating-particles">
          {Array.from({ length: 30 }).map((_, i) => (
            <div key={i} className={`particle particle-${i + 1}`}></div>
          ))}
        </div>
        <div className="grid-overlay"></div>
      </div>

      <div className="content-wrapper">
        {/* Hero Section */}
        <div className="hero-section">
          <div className="brand-logo">
            <div className="logo-circle">
              <FaGift className="logo-icon" />
            </div>
            <div className="brand-text">
              <h1 className="brand-title">
                Sweet<span className="highlight">Shop</span>
              </h1>
              <p className="brand-tagline">Management Excellence</p>
            </div>
          </div>

          <div className="hero-content">
            <h2 className="hero-title">
              Transform Your Sweet Business
            </h2>
            <p className="hero-description">
              Experience next-generation inventory management, seamless transactions, 
              and powerful analytics in one beautiful platform
            </p>
          </div>

          {/* Feature Highlights */}
          <div className="features-grid">
            <div className="feature-highlight">
              <FaStar className="feature-icon" />
              <span>Premium Quality</span>
            </div>
            <div className="feature-highlight">
              <FaHeart className="feature-icon" />
              <span>Customer Loved</span>
            </div>
            <div className="feature-highlight">
              <FaTrophy className="feature-icon" />
              <span>Award Winning</span>
            </div>
          </div>
        </div>

        {/* Auth Card */}
        <div className="auth-container">
          <div className="auth-card">
            <div className="card-header">
              <div className="auth-tabs">
                <button
                  type="button"
                  className={`tab-btn ${!isSignUp ? 'active' : ''}`}
                  onClick={() => {
                    setIsSignUp(false);
                    setError('');
                    setSuccess('');
                  }}
                >
                  Sign In
                </button>
                <button
                  type="button"
                  className={`tab-btn ${isSignUp ? 'active' : ''}`}
                  onClick={() => {
                    setIsSignUp(true);
                    setError('');
                    setSuccess('');
                  }}
                >
                  Sign Up
                </button>
              </div>
              <div className="tab-indicator"></div>
            </div>

            <div className="card-body">
              {error && (
                <div className="alert error-alert">
                  <span>{error}</span>
                </div>
              )}
              
              {success && (
                <div className="alert success-alert">
                  <span>{success}</span>
                </div>
              )}

              <form onSubmit={handleSubmit} className="auth-form">
                {/* Role Selection for Sign Up */}
                {isSignUp && (
                  <div className="role-section">
                    <label className="section-label">Choose Your Role</label>
                    <div className="role-grid">
                      <button
                        type="button"
                        className={`role-card ${selectedRole === 'USER' ? 'selected' : ''}`}
                        onClick={() => setSelectedRole('USER')}
                      >
                        <FaUserCheck className="role-icon" />
                        <div className="role-info">
                          <h4>Customer</h4>
                          <p>Browse & purchase sweets</p>
                        </div>
                      </button>
                      <button
                        type="button"
                        className={`role-card ${selectedRole === 'ADMIN' ? 'selected' : ''}`}
                        onClick={() => setSelectedRole('ADMIN')}
                      >
                        <FaUserShield className="role-icon" />
                        <div className="role-info">
                          <h4>Admin</h4>
                          <p>Manage inventory & sales</p>
                        </div>
                      </button>
                    </div>
                  </div>
                )}

                {/* Form Fields */}
                <div className="form-fields">
                  <div className="input-group">
                    <div className="input-wrapper">
                      <FaUser className="input-icon" />
                      <input
                        type="text"
                        name="username"
                        placeholder="Username"
                        value={formData.username}
                        onChange={handleInputChange}
                        className="form-input"
                        required
                      />
                    </div>
                  </div>

                  {isSignUp && (
                    <div className="input-group">
                      <div className="input-wrapper">
                        <FaEnvelope className="input-icon" />
                        <input
                          type="email"
                          name="email"
                          placeholder="Email Address"
                          value={formData.email}
                          onChange={handleInputChange}
                          className="form-input"
                          required
                        />
                      </div>
                    </div>
                  )}

                  <div className="input-group">
                    <div className="input-wrapper">
                      <FaLock className="input-icon" />
                      <input
                        type={showPassword ? 'text' : 'password'}
                        name="password"
                        placeholder="Password"
                        value={formData.password}
                        onChange={handleInputChange}
                        className="form-input"
                        required
                      />
                      <button
                        type="button"
                        className="toggle-password"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? <FaEyeSlash /> : <FaEye />}
                      </button>
                    </div>
                  </div>

                  {isSignUp && (
                    <div className="input-group">
                      <div className="input-wrapper">
                        <FaLock className="input-icon" />
                        <input
                          type={showPassword ? 'text' : 'password'}
                          name="confirmPassword"
                          placeholder="Confirm Password"
                          value={formData.confirmPassword}
                          onChange={handleInputChange}
                          className="form-input"
                          required
                        />
                      </div>
                    </div>
                  )}
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className={`submit-btn ${isLoading ? 'loading' : ''}`}
                >
                  {isLoading ? (
                    <span className="loading-spinner"></span>
                  ) : (
                    isSignUp ? 'Create Account' : 'Sign In'
                  )}
                </button>
              </form>
            </div>
          </div>

          {/* Test Credentials */}
          <div className="test-panel">
            <TestCredentials onCredentialSelect={handleTestCredentialFill} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default EnhancedLandingPage;