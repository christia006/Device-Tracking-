import React, { useMemo } from 'react';
import { MapPin, Battery, Clock, Wifi, WifiOff } from 'lucide-react';
import { format } from 'date-fns';

const HistoryPanel = ({ history, selectedDevice }) => {
  // Process history to show only status changes and key events
  const processedHistory = useMemo(() => {
    if (!history || history.length === 0) return [];
    
    const processed = [];
    let lastStatus = null;
    let lastBatteryRange = null;
    
    history.forEach((item, index) => {
      const shouldShow = 
        index === 0 || // Always show first item
        index === history.length - 1 || // Always show last item
        item.network !== lastStatus || // Status changed
        Math.floor(item.battery / 20) !== lastBatteryRange; // Battery changed significantly (20% range)
      
      if (shouldShow) {
        processed.push({
          ...item,
          isStatusChange: item.network !== lastStatus,
          isFirst: index === 0,
          isLast: index === history.length - 1
        });
        
        lastStatus = item.network;
        lastBatteryRange = Math.floor(item.battery / 20);
      }
    });
    
    return processed;
  }, [history]);

  if (!selectedDevice) {
    return (
      <div className="empty-state">
        <MapPin className="empty-icon" size={64} />
        <div className="empty-title">Select a Device</div>
        <div className="empty-description">
          Click on a device to view its location history
        </div>
      </div>
    );
  }

  if (!history || history.length === 0) {
    return (
      <div className="empty-state">
        <Clock className="empty-icon" size={64} />
        <div className="empty-title">No History Available</div>
        <div className="empty-description">
          Location history for {selectedDevice.username || selectedDevice.id} will appear here once tracking starts
        </div>
      </div>
    );
  }

  return (
    <div>
      <h3 style={{ marginBottom: '8px', fontSize: '16px', fontWeight: '600' }}>
        📍 {selectedDevice.username || selectedDevice.id}
      </h3>
      {selectedDevice.username && selectedDevice.username !== selectedDevice.id && (
        <p style={{ fontSize: '10px', color: 'var(--text-secondary)', marginBottom: '8px' }}>
          Device ID: {selectedDevice.id}
        </p>
      )}
      <p style={{ fontSize: '12px', color: 'var(--text-secondary)', marginBottom: '16px' }}>
        Last 7 days • {history.length} total locations • Showing {processedHistory.length} key events
      </p>

      <div>
        {processedHistory.map((item, index) => (
          <div 
            key={index} 
            className="history-item"
            style={{
              borderLeftColor: item.network === 'online' ? 'var(--success-color)' : 'var(--warning-color)'
            }}
          >
            <div className="history-time">
              <Clock size={12} style={{ marginRight: '4px', display: 'inline' }} />
              {format(new Date(item.timestamp), 'MMM dd, yyyy - HH:mm:ss')}
              {item.isFirst && (
                <span style={{ marginLeft: '8px', fontSize: '10px', color: 'var(--success-color)' }}>
                  [FIRST]
                </span>
              )}
              {item.isLast && (
                <span style={{ marginLeft: '8px', fontSize: '10px', color: 'var(--primary-color)' }}>
                  [LATEST]
                </span>
              )}
            </div>
            
            <div className="history-location">
              <MapPin size={14} style={{ marginRight: '4px', display: 'inline' }} />
              {item.lat.toFixed(6)}, {item.lng.toFixed(6)}
            </div>

            <div className="history-details">
              <span>
                <Battery size={12} style={{ marginRight: '4px', display: 'inline' }} />
                {item.battery}%
              </span>
              <span style={{ 
                color: item.network === 'online' ? 'var(--success-color)' : 'var(--warning-color)',
                fontWeight: item.isStatusChange ? '600' : '400'
              }}>
                {item.network === 'online' ? (
                  <>
                    <Wifi size={12} style={{ marginRight: '4px', display: 'inline' }} />
                    Online
                  </>
                ) : (
                  <>
                    <WifiOff size={12} style={{ marginRight: '4px', display: 'inline' }} />
                    Offline
                  </>
                )}
                {item.isStatusChange && (
                  <span style={{ marginLeft: '4px', fontSize: '10px' }}>
                    [STATUS CHANGED]
                  </span>
                )}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default HistoryPanel;