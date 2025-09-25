import React from 'react';
import { testCredentials } from '../data/mockAuth';

const TestCredentials = ({ onFillCredentials, isLogin = true }) => {
  const handleFillCredentials = (credType) => {
    const creds = testCredentials[credType];
    onFillCredentials({
      username: creds.username,
      password: creds.password
    });
  };

  return (
    <div className="test-credentials">
      <div className="test-credentials-header">
        <h4>🧪 Test Credentials</h4>
        <p>Use these credentials to test the application:</p>
      </div>
      
      <div className="credentials-grid">
        <div className="credential-card">
          <h5>👑 Admin User</h5>
          <p><strong>Username:</strong> admin</p>
          <p><strong>Password:</strong> admin123</p>
          <button 
            className="btn btn-primary btn-sm"
            onClick={() => handleFillCredentials('admin')}
          >
            Use Admin Credentials
          </button>
        </div>
        
        <div className="credential-card">
          <h5>👤 Regular User</h5>
          <p><strong>Username:</strong> user1</p>
          <p><strong>Password:</strong> user123</p>
          <button 
            className="btn btn-secondary btn-sm"
            onClick={() => handleFillCredentials('user')}
          >
            Use User Credentials
          </button>
        </div>
      </div>
      
      {!isLogin && (
        <div className="register-note">
          <p><small>💡 Or register with any new username and email to create a regular user account</small></p>
        </div>
      )}
    </div>
  );
};

export default TestCredentials;