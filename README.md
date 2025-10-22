# JD Reporting Company - Professional Legal Transcription Website

A modern, professional website for JD Reporting Company offering legal transcription and court reporting services. Built with HTML, CSS, JavaScript, and Netlify Functions for serverless backend functionality.

## 🌟 Features

- **Professional Landing Page** - Clean, modern design with service information
- **Order Tracking System** - Real-time order status tracking with timeline view
- **Contact Forms** - Contact and careers application forms with validation
- **Serverless Backend** - Netlify Functions for API endpoints
- **Local Storage Database** - Client-side data persistence for demo purposes
- **Responsive Design** - Mobile-friendly across all devices
- **Form Validation** - Client and server-side validation
- **Error Handling** - Comprehensive error handling throughout

## 📁 Project Structure

```
jd-reporting-company/
├── public/                 # Frontend files
│   ├── index.html         # Homepage
│   ├── about.html         # About page
│   ├── careers.html       # Careers page
│   ├── contact.html       # Contact page
│   ├── track-order.html   # Order tracking page
│   ├── test.html          # Functionality test page
│   ├── css/
│   │   └── override.css   # Main stylesheet
│   └── js/
│       └── database.js    # Local storage database
├── netlify/
│   └── functions/         # Serverless functions
│       ├── auth.js        # Authentication
│       ├── contact.js     # Contact form handler
│       ├── careers-apply.js # Careers form handler
│       ├── orders-track.js  # Order tracking
│       └── health.js      # Health check
├── netlify.toml          # Netlify configuration
├── package.json          # Project configuration
├── index.js             # Node.js server (for local development)
└── README.md            # This file
```

## 🚀 Quick Start

### Option 1: Deploy to Netlify (Recommended)

1. **Fork/Clone this repository**
2. **Connect to Netlify:**
   - Go to [netlify.com](https://netlify.com)
   - Click "New site from Git"
   - Connect your repository
   - Use these settings:
     - **Build command:** `echo "Static site ready"`
     - **Publish directory:** `public`
3. **Deploy:** Netlify will automatically deploy your site

### Option 2: Local Development

1. **Install Node.js** (version 18+)
2. **Clone and setup:**
   ```bash
   git clone <your-repo-url>
   cd jd-reporting-company
   npm install
   npm start
   ```
3. **Open:** `http://localhost:3000`

### Option 3: Static File Server

Since this is primarily a static site, you can serve the `public` folder with any static file server:
- Python: `python -m http.server 3000` (from public directory)
- PHP: `php -S localhost:3000` (from public directory)
- Live Server extension in VS Code

## 🧪 Testing

1. **Open the test page:** `/test.html`
2. **Run automated tests** for all functionality
3. **Manual testing:**
   - Fill out contact form
   - Test order tracking with sample IDs
   - Submit careers application
   - Verify responsive design

### Sample Test Data

- **Order ID:** `JD123456` or `JDcomplete` (for completed status)
- **Email:** Any valid email format
- **Sample positions:** Transcriptionist, Quality Assurance, Customer Support

## 🔧 Configuration

### Environment Variables (Optional)

For production deployment, you can set these in Netlify:

- `API_BASE_URL` - Base URL for API calls
- `FRONTEND_URL` - Frontend URL for CORS

### Netlify.toml Configuration

The site includes optimized Netlify configuration with:
- Security headers
- API redirects to serverless functions
- SPA fallback routing
- Railway backend fallback for extended API

## 📱 Pages Overview

### 🏠 Homepage (`/index.html`)
- Service overview
- Quick action links
- Professional branding

### 📊 Order Tracking (`/track-order.html`)
- Real-time order status
- Timeline visualization
- Email and Order ID verification

### 📞 Contact (`/contact.html`)
- Contact form with validation
- Professional inquiry handling
- Error handling and feedback

### 💼 Careers (`/careers.html`)
- Job application form
- Position selection
- Resume/message submission

### ℹ️ About (`/about.html`)
- Company information
- Service details
- Value proposition

### 🧪 Test Page (`/test.html`)
- Comprehensive functionality testing
- API endpoint verification
- Local database testing

## 🛠️ API Endpoints

All API endpoints are available at `/api/`:

- `GET /api/health` - Health check
- `POST /api/email/contact` - Contact form submission
- `POST /api/careers/apply` - Careers application
- `POST /api/orders/track` - Order tracking
- `POST /api/auth/*` - Authentication (admin)

## 🔒 Security Features

- **Input Validation** - Client and server-side
- **CORS Headers** - Proper cross-origin handling  
- **Security Headers** - CSP, XSS protection, etc.
- **Error Handling** - No sensitive data exposure
- **Rate Limiting** - Built into Netlify Functions

## 🎨 Customization

### Styling
- Edit `public/css/override.css`
- CSS variables for consistent theming
- Responsive design with mobile-first approach

### Content
- Update HTML files in `public/` directory
- Modify company information in about.html
- Customize form fields as needed

### Functionality
- Extend Netlify Functions in `netlify/functions/`
- Add new API endpoints
- Enhance local database schema

## 📈 Performance

- **Static Site Generation** - Fast loading
- **CDN Distribution** - Netlify's global CDN
- **Serverless Functions** - Scalable backend
- **Optimized Assets** - Minimal dependencies
- **Local Caching** - localStorage for offline functionality

## 🔄 Development Workflow

1. **Make changes** to files
2. **Test locally** using test.html
3. **Commit changes** to git
4. **Deploy** - Netlify auto-deploys on git push

## 📞 Support

For technical support or customization requests:
- Review this README
- Check the test page for functionality verification
- Contact the development team

## 📄 License

This project is proprietary to JD Reporting Company. All rights reserved.

---

**Built with ❤️ for professional legal transcription services**