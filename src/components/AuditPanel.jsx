import React from 'react';
import { FileText, Clock } from 'lucide-react';
import { format } from 'date-fns';

const AuditPanel = ({ logs }) => {
  if (!logs || logs.length === 0) {
    return (
      <div className="empty-state">
        <FileText className="empty-icon" size={64} />
        <div className="empty-title">No Audit Logs</div>
        <div className="empty-description">
          System activities will be logged here for security and compliance
        </div>
      </div>
    );
  }

  const getActionColor = (action) => {
    const colors = {
      'LOGIN': 'var(--success-color)',
      'DEVICE_REGISTER': 'var(--primary-color)',
      'DEVICE_REVOKE': 'var(--warning-color)',
      'DEVICE_DELETE': 'var(--danger-color)',
      'DATA_ACCESS': 'var(--text-secondary)'
    };
    return colors[action] || 'var(--text-secondary)';
  };

  return (
    <div>
      <h3 style={{ marginBottom: '16px', fontSize: '16px', fontWeight: '600' }}>
        Audit Logs
      </h3>
      <p style={{ fontSize: '12px', color: 'var(--text-secondary)', marginBottom: '20px' }}>
        Security and compliance tracking • Last {logs.length} events
      </p>

      <div>
        {logs.map((log, index) => (
          <div
            key={index}
            className="audit-item"
            style={{ borderLeftColor: getActionColor(log.action) }}
          >
            <div className="audit-time">
              <Clock size={12} style={{ marginRight: '4px', display: 'inline' }} />
              {format(new Date(log.timestamp), 'MMM dd, yyyy - HH:mm:ss')}
            </div>
            
            <div className="audit-action" style={{ color: getActionColor(log.action) }}>
              {log.action.replace(/_/g, ' ')}
            </div>

            <div className="audit-details">
              <div>User: {log.user || 'System'}</div>
              {log.device_id && <div>Device: {log.device_id}</div>}
              {log.details && <div>Details: {log.details}</div>}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AuditPanel;