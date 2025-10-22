/**
 * Server Configuration
 * Contains environment-specific settings for the application
 */

module.exports = {
  // Server settings
  port: process.env.PORT || 5000,
  nodeEnv: process.env.NODE_ENV || 'development',
  
  // JWT settings
  jwtSecret: process.env.JWT_SECRET || 'your-secret-key-change-in-production',
  jwtExpiresIn: '24h',
  
  // Database settings
  database: {
    host: process.env.DB_HOST || 'localhost',
    port: process.env.DB_PORT || 27017,
    name: process.env.DB_NAME || 'transcription_service',
    user: process.env.DB_USER || '',
    password: process.env.DB_PASSWORD || '',
    url: process.env.MONGODB_URI || 'mongodb://localhost:27017/transcription_service'
  },
  
  // API settings
  apiVersion: 'v1',
  apiPrefix: '/api',
  
  // Transcription service settings
  transcriptionService: {
    apiKey: process.env.TRANSCRIPTION_API_KEY || 'demo-key',
    endpoint: process.env.TRANSCRIPTION_ENDPOINT || 'https://api.transcription-service.com'
  },
  
  // File upload settings
  uploads: {
    maxFileSize: 50 * 1024 * 1024, // 50MB
    allowedFileTypes: ['.mp3', '.wav', '.mp4', '.m4a', '.aac', '.flac'],
    storageDir: process.env.UPLOAD_DIR || 'uploads/'
  },
  
  // CORS settings
  cors: {
    origin: process.env.CORS_ORIGIN || '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
  }
};