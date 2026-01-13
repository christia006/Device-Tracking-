const config = {
  // API Configuration
  API_BASE_URL: process.env.REACT_APP_API_URL || 'http://127.0.0.1:8000',
  
  // Auth Configuration
  AUTH_TOKEN_KEY: 'auth_token',
  AUTH_USER_KEY: 'auth_user',
  
  // Map Configuration
  MAP_CENTER: [-6.175, 106.827], // Jakarta
  MAP_ZOOM: 13,
  LOCATION_UPDATE_INTERVAL: 120000, // 2 minutes in ms
  
  // Tracking Configuration
  TRACK_DAYS: 7,
  
  // Admin Credentials (for demo - should be in backend)
  ADMIN_USERNAME: 'ADMIN123',
  ADMIN_PASSWORD: 'ADMIN123'
};

export default config;