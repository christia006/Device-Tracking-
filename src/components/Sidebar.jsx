import React, { useState } from 'react';
import { Smartphone, History, FileText } from 'lucide-react';
import DeviceList from './DeviceList';
import HistoryPanel from './HistoryPanel';
import AuditPanel from './AuditPanel';

const Sidebar = ({
  devices,
  selectedDevice,
  weeklyHistory,
  auditLogs,
  onSelectDevice,
  onRevokeDevice,
  onDeleteDevice
}) => {
  const [activeTab, setActiveTab] = useState('devices');

  const renderTabContent = () => {
    switch (activeTab) {
      case 'devices':
        return (
          <DeviceList
            devices={devices}
            selectedDevice={selectedDevice}
            onSelectDevice={onSelectDevice}
            onRevokeDevice={onRevokeDevice}
            onDeleteDevice={onDeleteDevice}
          />
        );
      case 'history':
        return (
          <HistoryPanel
            history={weeklyHistory}
            selectedDevice={selectedDevice}
          />
        );
      case 'audit':
        return <AuditPanel logs={auditLogs} />;
      default:
        return null;
    }
  };

  return (
    <div className="sidebar">
      <div className="sidebar-tabs">
        <button
          className={`tab-button ${activeTab === 'devices' ? 'active' : ''}`}
          onClick={() => setActiveTab('devices')}
        >
          <Smartphone size={18} style={{ marginRight: '6px', display: 'inline' }} />
          Devices
        </button>
        <button
          className={`tab-button ${activeTab === 'history' ? 'active' : ''}`}
          onClick={() => setActiveTab('history')}
        >
          <History size={18} style={{ marginRight: '6px', display: 'inline' }} />
          History
        </button>
        <button
          className={`tab-button ${activeTab === 'audit' ? 'active' : ''}`}
          onClick={() => setActiveTab('audit')}
        >
          <FileText size={18} style={{ marginRight: '6px', display: 'inline' }} />
          Audit
        </button>
      </div>

      <div className="sidebar-content">
        {renderTabContent()}
      </div>
    </div>
  );
};

export default Sidebar;