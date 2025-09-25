import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { authService } from '../services/authService';
import { FaUser, FaLock, FaEye, FaEyeSlash, FaEnvelope, FaUserShield, FaUserCheck, FaCrown, FaUsers, FaShoppingCart, FaChartBar, FaTestTube } from 'react-icons/fa';
import TestCredentials from './TestCredentials.jsx';
import '../styles/landing.css';

const LandingPage = () => {
  const [isSignUp, setIsSignUp] = useState(false);
  const [selectedRole, setSelectedRole] = useState('USER');
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    if (error) setError('');
    if (success) setSuccess('');
  };

  const handleFillCredentials = (credentials) => {
    if (isSignUp) {
      setFormData({
        username: credentials.username,
        email: `${credentials.username}@sweetshop.com`,
        password: credentials.password,
        confirmPassword: credentials.password
      });
      setSelectedRole(credentials.username === 'admin' ? 'ADMIN' : 'USER');
    } else {
      setFormData({
        ...formData,
        username: credentials.username,
        password: credentials.password
      });
    }
    setError('');
    setSuccess('');
  };

  const validateForm = () => {
    if (isSignUp) {
      if (!formData.username || !formData.email || !formData.password || !formData.confirmPassword) {
        return 'Please fill in all fields';
      }
      if (formData.username.length < 3) {
        return 'Username must be at least 3 characters long';
      }
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(formData.email)) {
        return 'Please enter a valid email address';
      }
      if (formData.password.length < 6) {
        return 'Password must be at least 6 characters long';
      }
      if (formData.password !== formData.confirmPassword) {
        return 'Passwords do not match';
      }
    } else {
      if (!formData.username || !formData.password) {
        return 'Please fill in all fields';
      }
    }
    return null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    const validationError = validateForm();
    if (validationError) {
      setError(validationError);
      setLoading(false);
      return;
    }

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
      setLoading(false);
    }
  };

  const switchMode = () => {
    setIsSignUp(!isSignUp);
    setFormData({
      username: '',
      email: '',
      password: '',
      confirmPassword: ''
    });
    setSelectedRole('USER');
    setError('');
    setSuccess('');
    setShowPassword(false);
    setShowConfirmPassword(false);
  };

  return (
    <div className="landing-page">
      <div className="landing-container">
        {/* Project Header */}
        <div className="project-header">
          <div className="project-logo">
            🍭
          </div>
          <h1 className="project-title">Sweet Shop Management System</h1>
          <p className="project-subtitle">
            Your comprehensive solution for managing sweet inventory, sales, and customer experience
          </p>
        </div>

        {/* Authentication Card */}
        <div className="auth-section">
          <div className="auth-card card">
            <div className="auth-header">
              <h2>{isSignUp ? 'Create Your Account' : 'Welcome Back'}</h2>
              <p>{isSignUp ? 'Join our sweet community' : 'Sign in to continue'}</p>
            </div>

            {error && <div className="alert alert-error">{error}</div>}
            {success && <div className="alert alert-success">{success}</div>}

            {/* Role Selection for Sign Up */}
            {isSignUp && (
              <div className="role-selection">
                <label className="form-label">Select Your Role</label>
                <div className="role-buttons">
                  <button
                    type="button"
                    className={`role-btn ${selectedRole === 'USER' ? 'active' : ''}`}
                    onClick={() => setSelectedRole('USER')}
                  >
                    <FaUserCheck />
                    <div>
                      <strong>Customer</strong>
                      <small>Browse and purchase sweets</small>
                    </div>
                  </button>
                  <button
                    type="button"
                    className={`role-btn ${selectedRole === 'ADMIN' ? 'active' : ''}`}
                    onClick={() => setSelectedRole('ADMIN')}
                  >
                    <FaUserShield />
                    <div>
                      <strong>Admin</strong>
                      <small>Manage inventory and sales</small>
                    </div>
                  </button>
                </div>
              </div>
            )}

            <form onSubmit={handleSubmit} className="auth-form">
              <div className="form-group">
                <label className="form-label">
                  <FaUser /> Username
                </label>
                <input
                  type="text"
                  name="username"
                  value={formData.username}
                  onChange={handleChange}
                  className="form-input"
                  placeholder={isSignUp ? "Choose a username" : "Enter your username"}
                  disabled={loading}
                />
              </div>

              {isSignUp && (
                <div className="form-group">
                  <label className="form-label">
                    <FaEnvelope /> Email
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="form-input"
                    placeholder="Enter your email"
                    disabled={loading}
                  />
                </div>
              )}

              <div className="form-group">
                <label className="form-label">
                  <FaLock /> Password
                </label>
                <div className="password-input-container">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    className="form-input"
                    placeholder={isSignUp ? "Create a password" : "Enter your password"}
                    disabled={loading}
                  />
                  <button
                    type="button"
                    className="password-toggle"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <FaEyeSlash /> : <FaEye />}
                  </button>
                </div>
              </div>

              {isSignUp && (
                <div className="form-group">
                  <label className="form-label">
                    <FaLock /> Confirm Password
                  </label>
                  <div className="password-input-container">
                    <input
                      type={showConfirmPassword ? 'text' : 'password'}
                      name="confirmPassword"
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      className="form-input"
                      placeholder="Confirm your password"
                      disabled={loading}
                    />
                    <button
                      type="button"
                      className="password-toggle"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    >
                      {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
                    </button>
                  </div>
                </div>
              )}

              <button
                type="submit"
                className="btn btn-primary btn-lg auth-submit"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <span className="loading"></span>
                    {isSignUp ? 'Creating account...' : 'Signing in...'}
                  </>
                ) : (
                  isSignUp ? 'Create Account' : 'Sign In'
                )}
              </button>
            </form>

            <TestCredentials onFillCredentials={handleFillCredentials} isLogin={!isSignUp} />

            <div className="auth-footer">
              <p>
                {isSignUp ? 'Already have an account?' : "Don't have an account?"}{' '}
                <button type="button" className="auth-link" onClick={switchMode}>
                  {isSignUp ? 'Sign in here' : 'Create one here'}
                </button>
              </p>
            </div>
          </div>
        </div>

        {/* Features Preview */}
        <div className="features-preview">
          <h3>🌟 What You Can Do</h3>
          <div className="features-grid">
            <div className="feature-card">
              <div className="feature-icon">🍬</div>
              <h4>Browse Sweets</h4>
              <p>Explore our delicious collection of sweets with beautiful images and detailed descriptions</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">🛒</div>
              <h4>Easy Purchasing</h4>
              <p>Quick and simple purchase process with real-time inventory tracking</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">📊</div>
              <h4>Purchase History</h4>
              <p>Keep track of all your purchases with detailed history and statistics</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">⚙️</div>
              <h4>Admin Management</h4>
              <p>Complete inventory management system for administrators</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LandingPage;