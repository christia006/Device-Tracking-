import React, { useEffect, useRef } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Polyline, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { format } from 'date-fns';
import config from '../config';

// Fix Leaflet default marker icon issue
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

// Component to handle map centering
const MapController = ({ center, zoom }) => {
  const map = useMap();
  
  useEffect(() => {
    if (center) {
      map.setView(center, zoom);
    }
  }, [center, zoom, map]);
  
  return null;
};

const MapView = ({ devices, selectedDevice, weeklyTrack }) => {
  const mapRef = useRef();
  
  // Determine map center based on selected device or default
  const getMapCenter = () => {
    if (selectedDevice && weeklyTrack && weeklyTrack.length > 0) {
      const lastLocation = weeklyTrack[weeklyTrack.length - 1];
      return [lastLocation.lat, lastLocation.lng];
    }
    return config.MAP_CENTER;
  };

  // Get devices to display
  const devicesToShow = selectedDevice ? [selectedDevice] : devices;

  // Prepare polyline coordinates for weekly track
  const polylinePositions = weeklyTrack?.map(point => [point.lat, point.lng]) || [];

  // Color for the route line
  const routeColor = selectedDevice?.id ? `hsl(${selectedDevice.id.charCodeAt(0) * 137.5 % 360}, 70%, 50%)` : '#2563eb';

  return (
    <div className="map-container">
      <MapContainer
        ref={mapRef}
        center={getMapCenter()}
        zoom={config.MAP_ZOOM}
        style={{ height: '100%', width: '100%' }}
        zoomControl={true}
      >
        <MapController center={getMapCenter()} zoom={config.MAP_ZOOM} />
        
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {/* Display weekly route as polyline */}
        {polylinePositions.length > 1 && (
          <Polyline
            positions={polylinePositions}
            color={routeColor}
            weight={3}
            opacity={0.7}
          />
        )}

        {/* Display device markers */}
        {devicesToShow?.map((device) => {
          if (!device.last_location) return null;
          
          const position = [device.last_location.lat, device.last_location.lng];
          
          return (
            <Marker key={device.id} position={position}>
              <Popup>
                <div style={{ minWidth: '200px' }}>
                  <h4 style={{ margin: '0 0 8px 0', fontSize: '14px', fontWeight: '600' }}>
                    {device.username || device.id}
                  </h4>
                  {device.username && device.username !== device.id && (
                    <div style={{ fontSize: '10px', color: '#666', marginBottom: '8px' }}>
                      ID: {device.id.substring(0, 25)}...
                    </div>
                  )}
                  <div style={{ fontSize: '12px', lineHeight: '1.6' }}>
                    <div><strong>Status:</strong> {device.status}</div>
                    <div><strong>Battery:</strong> {device.battery}%</div>
                    <div><strong>Network:</strong> {device.network}</div>
                    {device.last_seen && (
                      <div>
                        <strong>Last Seen:</strong>{' '}
                        {format(new Date(device.last_seen), 'MMM dd, HH:mm')}
                      </div>
                    )}
                    <div style={{ marginTop: '8px', paddingTop: '8px', borderTop: '1px solid #ddd' }}>
                      <strong>Location:</strong><br />
                      {position[0].toFixed(6)}, {position[1].toFixed(6)}
                    </div>
                  </div>
                </div>
              </Popup>
            </Marker>
          );
        })}

        {/* Start marker for weekly track */}
        {polylinePositions.length > 0 && (
          <Marker
            position={polylinePositions[0]}
            icon={L.divIcon({
              className: 'custom-div-icon',
              html: `<div style="background: #10b981; color: white; width: 30px; height: 30px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-weight: bold; border: 3px solid white; box-shadow: 0 2px 8px rgba(0,0,0,0.3);">S</div>`,
              iconSize: [30, 30],
              iconAnchor: [15, 15],
            })}
          >
            <Popup>
              <div style={{ fontSize: '12px' }}>
                <strong>Start Point</strong><br />
                {weeklyTrack[0] && format(new Date(weeklyTrack[0].timestamp), 'MMM dd, HH:mm')}
              </div>
            </Popup>
          </Marker>
        )}

        {/* End marker for weekly track */}
        {polylinePositions.length > 1 && (
          <Marker
            position={polylinePositions[polylinePositions.length - 1]}
            icon={L.divIcon({
              className: 'custom-div-icon',
              html: `<div style="background: #ef4444; color: white; width: 30px; height: 30px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-weight: bold; border: 3px solid white; box-shadow: 0 2px 8px rgba(0,0,0,0.3);">E</div>`,
              iconSize: [30, 30],
              iconAnchor: [15, 15],
            })}
          >
            <Popup>
              <div style={{ fontSize: '12px' }}>
                <strong>End Point</strong><br />
                {weeklyTrack[weeklyTrack.length - 1] && 
                  format(new Date(weeklyTrack[weeklyTrack.length - 1].timestamp), 'MMM dd, HH:mm')}
              </div>
            </Popup>
          </Marker>
        )}
      </MapContainer>
    </div>
  );
};

export default MapView;