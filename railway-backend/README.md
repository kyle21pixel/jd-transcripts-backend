# JD Reporting Company - Backend API

A robust Node.js/Express backend for JD Reporting Company's transcription services platform.

## 🚀 Features

- **Authentication:** JWT-based user and admin authentication
- **Order Management:** Complete order lifecycle management
- **Email Integration:** Automated notifications and confirmations
- **File Upload:** Secure audio/video file handling
- **Payment Processing:** Stripe and PayPal integration
- **Admin Dashboard:** Comprehensive admin interface
- **API Documentation:** Swagger API docs
- **Security:** Rate limiting, CORS protection, and more

## 🔐 Admin Credentials

- **Admin:** `admin@jdreporting.org` / `admin123`

## 📡 API Endpoints

### Authentication
- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login a user
- `POST /api/auth/logout` - Logout a user

### Orders
- `POST /api/orders` - Create a new order
- `GET /api/orders` - Get user orders
- `GET /api/orders/:id` - Get a specific order
- `PUT /api/orders/:id` - Update an order
- `POST /api/orders/:id/upload` - Upload a transcript file

### Payments
- `POST /api/payment/create-payment-intent` - Create a Stripe payment intent
- `POST /api/payment/process-paypal` - Process a PayPal payment
- `POST /api/payment/webhook` - Webhook for Stripe events

### Health Check
- `GET /api/health` - API status

### API Documentation
- `GET /api-docs` - Swagger API documentation

## 🔧 Environment Variables

```env
# Server Configuration
PORT=5000
NODE_ENV=production

# MongoDB Configuration
MONGODB_URI=your_mongodb_connection_string

# JWT Configuration
JWT_SECRET=your_jwt_secret
JWT_EXPIRE=7d

# Email Configuration
EMAIL_SERVICE=gmail
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_email_password
ADMIN_EMAIL=admin@example.com

# Frontend URL
FRONTEND_URL=https://jd-reporting-company.netlify.app
CORS_ORIGIN=https://jd-reporting-company.netlify.app

# File Upload Configuration
MAX_FILE_SIZE=100MB
UPLOAD_PATH=./uploads

# Security Configuration
BCRYPT_ROUNDS=12
SESSION_SECRET=your_session_secret

# Rate Limiting
RATE_LIMIT_WINDOW=15
RATE_LIMIT_MAX_REQUESTS=100

# Payment Processing
STRIPE_SECRET_KEY=your_stripe_secret_key
STRIPE_PUBLISHABLE_KEY=your_stripe_publishable_key
STRIPE_WEBHOOK_SECRET=your_stripe_webhook_secret

PAYPAL_CLIENT_ID=your_paypal_client_id
PAYPAL_CLIENT_SECRET=your_paypal_client_secret
PAYPAL_MODE=sandbox
```

## 🚀 Getting Started

### Prerequisites
- Node.js (v18 or higher)
- MongoDB
- npm or yarn

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/your-username/jd-reporting-api.git
   cd jd-reporting-api
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file with the environment variables listed above

4. Start the development server:
   ```bash
   npm run dev
   ```

### Testing

```bash
# Run tests
npm test

# Run tests with watch mode
npm run test:watch

# Run tests with coverage
npm run test:coverage
```

## 🚀 Deployment

### Railway (Recommended)
1. Create a new project on Railway
2. Connect your GitHub repository
3. Add environment variables
4. Deploy

### Other Platforms
- Heroku
- Vercel
- Any Node.js hosting service

## 📦 Dependencies

- **Express.js** - Web framework
- **Mongoose** - MongoDB ODM
- **JWT** - Authentication
- **Bcrypt** - Password hashing
- **Nodemailer** - Email sending
- **Express-fileupload** - File upload handling
- **Stripe & PayPal** - Payment processing
- **Swagger** - API documentation
- **Jest** - Testing framework
- **Helmet** - Security headers
- **Compression** - Response compression
- **Rate-limit** - API rate limiting

## 📝 API Documentation

Once the server is running, you can access the API documentation at:
```
https://jd-transcripts-server-production.railway.app/api-docs
```

Built with ❤️ for JD Reporting Company