import React, { useState } from 'react';
import { Shield, AlertCircle } from 'lucide-react';
import { authAPI } from '../services/api';
import authService from '../services/auth';

const LoginPage = ({ onLoginSuccess }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await authAPI.login(username, password);
      const { token, user } = response.data;

      authService.setToken(token);
      authService.setUser(user);

      onLoginSuccess();
    } catch (err) {
     setError(
  err.response?.data?.detail ||
  err.response?.data?.message ||
  'Login failed. Please check your credentials.'
);

    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <div className="login-logo">
          <Shield size={40} color="white" />
        </div>
        
        <h1 className="login-title">Device Tracking System</h1>
        <p className="login-subtitle">Consent-Based Monitoring Platform</p>

        {error && (
          <div className="alert alert-danger">
            <AlertCircle size={16} style={{ marginRight: '8px' }} />
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label htmlFor="username" className="form-label">Username</label>
            <input
              type="text"
              className="form-control"
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Enter username"
              required
              disabled={loading}
            />
          </div>

          <div className="mb-3">
            <label htmlFor="password" className="form-label">Password</label>
            <input
              type="password"
              className="form-control"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter password"
              required
              disabled={loading}
            />
          </div>

          <button type="submit" className="btn btn-login" disabled={loading}>
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>

        <div className="mt-4 text-center" style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>
         <p>Default credentials: admin / admin123</p>

        </div>
      </div>
    </div>
  );
};

export default LoginPage;
