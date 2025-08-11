# JD Legal Transcripts - Backend API

Node.js/Express backend for JD Legal Transcripts website.

## 🚀 Features

- **Authentication:** JWT-based admin login
- **Order Management:** Handle transcription orders
- **Email Integration:** Contact forms and notifications
- **File Upload:** Handle audio/video files
- **Admin Dashboard:** API endpoints for admin interface

## 🔐 Admin Credentials

- **Admin:** `jd.admin` / `admin123`
- **Manager:** `jd.manager` / `manager123`
- **Supervisor:** `jd.supervisor` / `super123`

## 📡 API Endpoints

### Authentication
- `POST /api/auth/login` - Admin login

### Orders
- `POST /api/orders` - Create new order
- `GET /api/orders` - Get orders (admin)

### Health Check
- `GET /api/health` - API status

### Email
- `POST /api/email/contact` - Contact form

## 🔧 Environment Variables

```env
NODE_ENV=production
PORT=5000
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
EMAIL_USER=your_email
EMAIL_PASS=your_email_password
FRONTEND_URL=your_frontend_url
```

## 🚀 Deployment

Ready for deployment on:
- Railway (recommended)
- Heroku
- Vercel
- Any Node.js hosting service

## 📦 Dependencies

- Express.js - Web framework
- Mongoose - MongoDB ODM
- JWT - Authentication
- Nodemailer - Email sending
- CORS - Cross-origin requests
- Multer - File uploads

Built with ❤️ for JD Legal Transcripts