---
description: Repository Information Overview
alwaysApply: true
---

# Repository Information Overview

## Repository Summary
This is a full-stack web application with a React frontend and Node.js/Express backend. The application appears to be an e-commerce or order management system with authentication, admin functionality, and email capabilities.

## Repository Structure
- **client/**: React frontend application created with Create React App
- **server/**: Node.js/Express backend API server
- **Root files**: Contains HTML, CSS, and JavaScript files that appear to be separate from the main application

### Main Repository Components
- **Frontend (client/)**: React-based user interface
- **Backend (server/)**: Express API with MongoDB database connection
- **Authentication**: JWT-based auth system with user roles (admin, regular users)
- **Order Management**: API endpoints for creating and managing orders

## Projects

### Backend API (server/)
**Configuration File**: package.json

#### Language & Runtime
**Language**: JavaScript (Node.js)
**Version**: Node.js (version not specified)
**Package Manager**: npm

#### Dependencies
**Main Dependencies**:
- express (^5.1.0): Web framework
- mongoose (^8.17.0): MongoDB ODM
- bcrypt (^6.0.0): Password hashing
- jsonwebtoken (^9.0.2): JWT authentication
- nodemailer (^7.0.5): Email sending
- dotenv (^17.2.1): Environment variable management
- cors (^2.8.5): Cross-origin resource sharing
- express-fileupload (^1.5.2): File upload handling

**Development Dependencies**:
- nodemon (^3.1.10): Development server with auto-restart

#### Build & Installation
```bash
cd server
npm install
```

#### Usage & Operations
```bash
# Development mode with auto-restart
npx nodemon app.js

# Production mode
node app.js
```

#### Main Files & Resources
- **app.js**: Main entry point and server configuration
- **routes/**: API route definitions (auth.js, order.js, admin.js)
- **controllers/**: Business logic (authcontroller.js, ordercontroller.js, emailcontroller.js)
- **models/**: Database schemas (user.js, order.js)
- **middleware/**: Request processing (auth.js, admin.js)
- **utils/**: Helper functions (sendEmail.js)

### Frontend (client/)
**Configuration File**: package.json

#### Language & Runtime
**Language**: JavaScript (React)
**Version**: React 19.1.1
**Package Manager**: npm

#### Dependencies
**Main Dependencies**:
- react (^19.1.1): UI library
- react-dom (^19.1.1): DOM rendering for React
- react-scripts (5.0.1): Create React App scripts
- axios (^1.11.0): HTTP client for API requests

**Development Dependencies**:
- @testing-library/react (^16.3.0): Testing utilities
- @testing-library/jest-dom (^6.6.4): DOM testing utilities

#### Build & Installation
```bash
cd client
npm install
```

#### Usage & Operations
```bash
# Development server
npm start

# Build for production
npm run build

# Run tests
npm test
```

#### Main Files & Resources
- **src/App.js**: Main React component
- **src/index.js**: Application entry point
- **public/index.html**: HTML template