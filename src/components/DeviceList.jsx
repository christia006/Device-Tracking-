import React from 'react';
import { Smartphone, Battery, Wifi, WifiOff, Ban, Trash2 } from 'lucide-react';
import { format, formatDistanceToNow } from 'date-fns';

const DeviceList = ({ devices, selectedDevice, onSelectDevice, onRevokeDevice, onDeleteDevice }) => {
  // Filter out revoked devices - backend should handle this but double-check
  const activeDevices = (devices || []).filter(device => 
    device && device.status !== 'revoked'
  );
  
  if (!activeDevices || activeDevices.length === 0) {
    return (
      <div className="empty-state">
        <Smartphone className="empty-icon" size={64} />
        <div className="empty-title">No Active Devices</div>
        <div className="empty-description">
          Start a device agent to see it appear here
        </div>
      </div>
    );
  }

  const handleRevoke = (e, deviceId) => {
    e.stopPropagation();
    if (window.confirm('⚠️ WARNING: This will PERMANENTLY DELETE all location data!\n\nAre you sure?')) {
      onRevokeDevice(deviceId);
    }
  };

  const handleDelete = (e, deviceId) => {
    e.stopPropagation();
    if (window.confirm('⚠️ WARNING: This will PERMANENTLY DELETE the device and ALL data!\n\nThis cannot be undone. Are you sure?')) {
      onDeleteDevice(deviceId);
    }
  };

  // Determine if device is truly online (last seen < 5 minutes)
  const isDeviceOnline = (device) => {
    if (!device || !device.last_seen) return false;
    try {
      const lastSeen = new Date(device.last_seen);
      const now = new Date();
      const diffMinutes = (now - lastSeen) / 1000 / 60;
      return diffMinutes < 5;
    } catch {
      return false;
    }
  };

  return (
    <div>
      <h3 style={{ marginBottom: '16px', fontSize: '16px', fontWeight: '600' }}>
        Active Devices ({activeDevices.length})
      </h3>
      
      {activeDevices.map((device) => {
        const deviceOnline = isDeviceOnline(device);
        const displayStatus = deviceOnline ? 'online' : 'offline';
        
        return (
          <div
            key={device.id}
            className={`device-item ${selectedDevice?.id === device.id ? 'active' : ''}`}
            onClick={() => onSelectDevice(device)}
          >
            <div className="device-header">
              <div className="device-id">
                <Smartphone size={16} style={{ marginRight: '6px', display: 'inline' }} />
                {device.username || device.id}
              </div>
              <span className={`device-status ${displayStatus}`}>
                {displayStatus}
              </span>
            </div>

            <div style={{ fontSize: '11px', color: 'var(--text-secondary)', marginTop: '4px' }}>
              ID: {device.id}
            </div>

            <div className="device-info">
              <span>
                <Battery size={14} style={{ marginRight: '4px', display: 'inline' }} />
                {device.battery !== null && device.battery !== undefined ? device.battery : 'N/A'}%
              </span>
              <span>
                {deviceOnline ? (
                  <>
                    <Wifi size={14} style={{ marginRight: '4px', display: 'inline' }} />
                    Online
                  </>
                ) : (
                  <>
                    <WifiOff size={14} style={{ marginRight: '4px', display: 'inline' }} />
                    Offline
                  </>
                )}
              </span>
            </div>

            {device.last_seen && (
              <div style={{ fontSize: '11px', color: 'var(--text-secondary)', marginTop: '8px' }}>
                {deviceOnline ? (
                  <>Active {formatDistanceToNow(new Date(device.last_seen), { addSuffix: true })}</>
                ) : (
                  <>Last seen: {format(new Date(device.last_seen), 'MMM dd, HH:mm')}</>
                )}
              </div>
            )}

            <div className="device-actions">
              <button
                className="btn-sm btn-revoke"
                onClick={(e) => handleRevoke(e, device.id)}
              >
                <Ban size={14} style={{ marginRight: '4px' }} />
                Revoke
              </button>
              <button
                className="btn-sm btn-delete"
                onClick={(e) => handleDelete(e, device.id)}
              >
                <Trash2 size={14} style={{ marginRight: '4px' }} />
                Delete
              </button>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default DeviceList;