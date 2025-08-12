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
        await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/jd-transcripts');
        
        console.log('✅ Connected to MongoDB');

        // Admin users to create
        const adminUsers = [
            {
                name: 'JD Admin',
                email: 'admin@jdreporting.org',
                username: 'jd.admin',
                password: 'admin123',
                role: 'admin',
                isAdmin: true
            },
            {
                name: 'JD Manager',
                email: 'manager@jdreporting.org',
                username: 'jd.manager',
                password: 'manager123',
                role: 'manager',
                isAdmin: true
            },
            {
                name: 'JD Supervisor',
                email: 'supervisor@jdreporting.org',
                username: 'jd.supervisor',
                password: 'super123',
                role: 'supervisor',
                isAdmin: true
            }
        ];

        console.log('🔧 Setting up admin users...');

        for (const userData of adminUsers) {
            // Check if user already exists
            const existingUser = await User.findOne({ 
                $or: [
                    { email: userData.email },
                    { username: userData.username }
                ]
            });
            
            if (existingUser) {
                console.log(`⚠️  User ${userData.username} already exists, skipping...`);
                continue;
            }

            // Create new user (password will be hashed by the pre-save hook)
            const newUser = new User(userData);
            await newUser.save();
            
            console.log(`✅ Created ${userData.role}: ${userData.username}`);
            console.log(`   📧 Email: ${userData.email}`);
            console.log(`   🔑 Password: ${userData.password}`);
        }
        
        console.log('\n🎉 Admin setup completed!');
        console.log('⚠️  Please change all default passwords after first login!');
        console.log('\n📋 Login Credentials:');
        console.log('   Admin: jd.admin / admin123');
        console.log('   Manager: jd.manager / manager123');
        console.log('   Supervisor: jd.supervisor / super123');
        
    } catch (error) {
        console.error('❌ Setup failed:', error);
    } finally {
        mongoose.connection.close();
    }
}

setupAdmin();