// Configuration for the JD Reporting Company website
const config = {
  // API URL - Change this to your Railway backend URL when deployed
  apiUrl: 'https://jd-reporting-backend.up.railway.app/api',
  
  // Company information
  company: {
    name: 'JD Reporting Company',
    email: 'info@jdreporting.org',
    phone: '+254712345678',
    address: 'Nairobi, Kenya'
  },
  
  // Service types and pricing
  services: {
    legal: {
      name: 'Legal Transcription',
      baseRate: 1.50,
      description: 'Accurate transcription for depositions, hearings, and legal proceedings.'
    },
    medical: {
      name: 'Medical Transcription',
      baseRate: 1.75,
      description: 'Specialized transcription for medical records, patient notes, and consultations.'
    },
    zoom: {
      name: 'Zoom/Video Meetings',
      baseRate: 1.25,
      description: 'Clear transcription of online meetings, webinars, and video conferences.'
    },
    academic: {
      name: 'Academic Transcription',
      baseRate: 1.25,
      description: 'Detailed transcription for interviews, lectures, and research recordings.'
    }
  },
  
  // Turnaround times and pricing multipliers
  turnaround: {
    'same-day': {
      name: 'Same Day',
      multiplier: 1.50,
      description: 'Delivered within 24 hours'
    },
    '24h': {
      name: '24 Hours',
      multiplier: 1.25,
      description: 'Delivered within 24 hours'
    },
    '48h': {
      name: '48 Hours',
      multiplier: 1.10,
      description: 'Delivered within 48 hours'
    },
    '3-5': {
      name: '3-5 Days',
      multiplier: 1.00,
      description: 'Delivered within 3-5 business days'
    }
  }
};

// Make config available globally
window.appConfig = config;