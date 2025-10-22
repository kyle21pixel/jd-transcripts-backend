# Build and deploy both frontend and backend

echo "🚀 Starting deployment process..."

# Step 1: Install backend dependencies
echo "Installing backend dependencies..."
npm install

# Step 2: Install frontend dependencies
echo "Installing frontend dependencies..."
cd client && npm install

# Step 3: Build frontend
echo "Building frontend..."
npm run build

# Step 4: Copy frontend build to backend
echo "Copying frontend build to backend..."
cd ..
cp -r client/build public/

# Step 5: Create production env file
echo "Setting up environment variables..."
cp .env.example .env

# Step 6: Initialize database
echo "Initializing database..."
node src/scripts/initDb.js

# Step 7: Start the application
echo "Starting the application..."
npm start