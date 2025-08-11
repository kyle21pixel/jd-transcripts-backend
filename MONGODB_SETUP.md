# MongoDB Atlas Setup Guide

## 🗄️ Setting up MongoDB Atlas (Free Tier)

### Step 1: Create MongoDB Atlas Account
1. Go to https://www.mongodb.com/atlas
2. Click **"Try Free"**
3. Sign up with your email
4. Verify your email address

### Step 2: Create a Cluster
1. Choose **"Build a Database"**
2. Select **"M0 Sandbox"** (Free tier)
3. Choose **"AWS"** as provider
4. Select a region close to you
5. Name your cluster: `jd-transcripts`
6. Click **"Create Cluster"**

### Step 3: Create Database User
1. Go to **"Database Access"** in the left sidebar
2. Click **"Add New Database User"**
3. Choose **"Password"** authentication
4. Username: `jd-admin`
5. Password: Generate a secure password (save it!)
6. Database User Privileges: **"Atlas admin"**
7. Click **"Add User"**

### Step 4: Configure Network Access
1. Go to **"Network Access"** in the left sidebar
2. Click **"Add IP Address"**
3. Click **"Allow Access from Anywhere"** (for Railway deployment)
4. Click **"Confirm"**

### Step 5: Get Connection String
1. Go to **"Database"** in the left sidebar
2. Click **"Connect"** on your cluster
3. Choose **"Connect your application"**
4. Copy the connection string
5. Replace `<password>` with your database user password

Your connection string will look like:
```
mongodb+srv://jd-admin:<password>@jd-transcripts.xxxxx.mongodb.net/?retryWrites=true&w=majority
```

## 🔧 Add to Railway Environment Variables

Add this variable to Railway:
- **Name**: `MONGODB_URI`
- **Value**: Your connection string (with password filled in)

## ✅ Test Connection

Once added to Railway, your backend will automatically connect to MongoDB Atlas!