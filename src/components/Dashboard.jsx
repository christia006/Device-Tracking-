import React, { useState, useEffect, useCallback } from 'react';
import Header from './Header';
import MapView from './MapView';
import Sidebar from './Sidebar';
import { deviceAPI, locationAPI, auditAPI } from '../services/api';
import config from '../config';

const Dashboard = ({ onLogout }) => {
  const [devices, setDevices] = useState([]);
  const [selectedDevice, setSelectedDevice] = useState(null);
  const [weeklyTrack, setWeeklyTrack] = useState([]);
  const [auditLogs, setAuditLogs] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch all devices
  const fetchDevices = useCallback(async () => {
    try {
      const response = await deviceAPI.getAll();
      setDevices(response.data.devices || []);
    } catch (error) {
      console.error('Error fetching devices:', error);
    }
  }, []);

  // Fetch weekly track for selected device
  const fetchWeeklyTrack = useCallback(async (deviceId) => {
    try {
      const response = await locationAPI.getWeekly(deviceId);
      setWeeklyTrack(response.data.track || []);
    } catch (error) {
      console.error('Error fetching weekly track:', error);
      setWeeklyTrack([]);
    }
  }, []);

  // Fetch audit logs
  const fetchAuditLogs = useCallback(async () => {
    try {
      const response = await auditAPI.getLogs(50);
      setAuditLogs(response.data.logs || []);
    } catch (error) {
      console.error('Error fetching audit logs:', error);
    }
  }, []);

  // Initial load
  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      await Promise.all([
        fetchDevices(),
        fetchAuditLogs()
      ]);
      setLoading(false);
    };

    loadData();
  }, [fetchDevices, fetchAuditLogs]);

  // Auto-refresh devices every 10 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      fetchDevices();
    }, 10000); // 10 seconds for testing, change to 30000 for production

    return () => clearInterval(interval);
  }, [fetchDevices]);

  // Handle device selection
  const handleSelectDevice = useCallback((device) => {
    setSelectedDevice(device);
    if (device) {
      fetchWeeklyTrack(device.id);
    } else {
      setWeeklyTrack([]);
    }
  }, [fetchWeeklyTrack]);

  // Handle device revoke
  const handleRevokeDevice = async (deviceId) => {
    try {
      await deviceAPI.revoke(deviceId);
      
      // Remove from state immediately
      setDevices(prev => prev.filter(d => d.id !== deviceId));
      
      // Clear selection if this device was selected
      if (selectedDevice?.id === deviceId) {
        setSelectedDevice(null);
        setWeeklyTrack([]);
      }
      
      await fetchAuditLogs();
      alert('Device revoked and all data deleted successfully');
    } catch (error) {
      console.error('Error revoking device:', error);
      alert('Failed to revoke device');
    }
  };

  // Handle device delete
  const handleDeleteDevice = async (deviceId) => {
    try {
      await deviceAPI.delete(deviceId);
      
      // Remove from state immediately
      setDevices(prev => prev.filter(d => d.id !== deviceId));
      
      // Clear selection if this device was selected
      if (selectedDevice?.id === deviceId) {
        setSelectedDevice(null);
        setWeeklyTrack([]);
      }
      
      await fetchAuditLogs();
      alert('Device and all data permanently deleted');
    } catch (error) {
      console.error('Error deleting device:', error);
      alert('Failed to delete device');
    }
  };

  if (loading) {
    return (
      <div className="loading-spinner">
        <div className="spinner"></div>
      </div>
    );
  }

  return (
    <div className="dashboard-container">
      <Header onLogout={onLogout} />
      
      <div className="dashboard-content">
        <div className="map-section">
          <MapView
            devices={devices}
            selectedDevice={selectedDevice}
            weeklyTrack={weeklyTrack}
          />
        </div>

        <Sidebar
          devices={devices}
          selectedDevice={selectedDevice}
          weeklyHistory={weeklyTrack}
          auditLogs={auditLogs}
          onSelectDevice={handleSelectDevice}
          onRevokeDevice={handleRevokeDevice}
          onDeleteDevice={handleDeleteDevice}
        />
      </div>
    </div>
  );
};

export default Dashboard;