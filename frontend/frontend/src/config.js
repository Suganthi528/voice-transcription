// API Configuration
const isDevelopment = process.env.NODE_ENV === 'development';

export const API_CONFIG = {
  // Use localhost for development, Render URL for production
  API_BASE_URL: isDevelopment 
    ? 'http://localhost:5000' 
    : 'https://language-transcription-backend-1.onrender.com',
  
  WS_BASE_URL: isDevelopment 
    ? 'ws://localhost:5000' 
    : 'wss://language-transcription-backend-1.onrender.com'
};

// Export individual URLs for convenience
export const { API_BASE_URL, WS_BASE_URL } = API_CONFIG;

// Default configuration
export default API_CONFIG;