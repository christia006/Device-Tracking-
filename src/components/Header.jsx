import React from 'react';
import { Shield, User, LogOut } from 'lucide-react';
import authService from '../services/auth';

const Header = ({ onLogout }) => {
  const user = authService.getUser();

  return (
    <div className="dashboard-header">
      <div className="header-brand">
        <div className="header-logo">
          <Shield size={24} color="white" />
        </div>
        <div>
          <h1 className="header-title">Device Tracking System</h1>
          <p style={{ fontSize: '12px', color: 'var(--text-secondary)', margin: 0 }}>
            Consent-Based Monitoring
          </p>
        </div>
      </div>

      <div className="header-actions">
        <div className="user-info">
          <User size={18} />
          <span>{user?.username || 'Admin'}</span>
        </div>
        <button className="btn btn-logout" onClick={onLogout}>
          <LogOut size={16} style={{ marginRight: '6px' }} />
          Logout
        </button>
      </div>
    </div>
  );
};

export default Header;