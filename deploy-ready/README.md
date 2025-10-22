# JD Reporting Company - Test Environment

This is a test environment for the JD Reporting Company website with updated files.

## Getting Started

Follow these instructions to run the test server locally:

1. Install dependencies:
   ```
   npm install
   ```

2. Start the test server:
   ```
   npm start
   ```

3. Open your browser and navigate to:
   ```
   http://localhost:3000
   ```

## Test Credentials

Use these credentials to test the admin dashboard:

- Username: `admin`
- Password: `password123`

## Available Pages

- Home Page: `http://localhost:3000/`
- About Page: `http://localhost:3000/about.html`
- Admin Dashboard: `http://localhost:3000/admin-dashboard-new.html`

## Database Setup

The database configuration files are located in the `database` directory. In a production environment, you would need to:

1. Import the SQL schema from `database/setup.sql`
2. Configure the database connection in `database/config.php`
3. Run the initialization script at `http://your-domain.com/database/init.php`

## Testing Features

1. **Order Form**:
   - Fill out the order form on the home page
   - Submit to see the order confirmation

2. **Admin Dashboard**:
   - Login with the test credentials
   - View mock orders
   - Test the various dashboard features

## Notes

This is a test environment with mock API endpoints. In a production environment, you would need to:

1. Deploy the frontend to a web hosting service like Netlify
2. Deploy the backend to a server with PHP and MySQL support
3. Configure the database with real credentials
4. Set up proper authentication and security measures