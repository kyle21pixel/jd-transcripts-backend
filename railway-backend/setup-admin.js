const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config();

// Import User model
const User = require('./models/user');

async function setupAdmin() {
    try {
        // Connect to MongoDB
        await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/jd-transcripts', {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        
        console.log('✅ Connected to MongoDB');

        // Check if admin already exists
        const existingAdmin = await User.findOne({ email: 'admin@jdlegaltranscripts.com' });
        
        if (existingAdmin) {
            console.log('⚠️  Admin user already exists');
            process.exit(0);
        }

        // Create admin user
        const hashedPassword = await bcrypt.hash('admin123', 10);
        
        const adminUser = new User({
            name: 'Admin User',
            email: 'admin@jdlegaltranscripts.com',
            password: hashedPassword,
            role: 'admin'
        });

        await adminUser.save();
        
        console.log('✅ Admin user created successfully!');
        console.log('📧 Email: admin@jdlegaltranscripts.com');
        console.log('🔑 Password: admin123');
        console.log('⚠️  Please change the password after first login!');
        
    } catch (error) {
        console.error('❌ Setup failed:', error);
    } finally {
        mongoose.connection.close();
    }
}

setupAdmin();