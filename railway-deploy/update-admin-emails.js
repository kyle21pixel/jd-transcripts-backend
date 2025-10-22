const mongoose = require('mongoose');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config();

// Import User model
const User = require('./models/user');

async function updateAdminEmails() {
    try {
        // Connect to MongoDB
        await mongoose.connect(process.env.MONGODB_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        
        console.log('✅ Connected to MongoDB');

        // Update admin user emails
        const updates = [
            { oldEmail: 'admin@jdlegaltranscripts.com', newEmail: 'admin@jdreporting.org' },
            { oldEmail: 'manager@jdlegaltranscripts.com', newEmail: 'manager@jdreporting.org' },
            { oldEmail: 'supervisor@jdlegaltranscripts.com', newEmail: 'supervisor@jdreporting.org' }
        ];

        for (const update of updates) {
            const result = await User.updateOne(
                { email: update.oldEmail },
                { $set: { email: update.newEmail } }
            );

            if (result.modifiedCount > 0) {
                console.log(`✅ Updated email from ${update.oldEmail} to ${update.newEmail}`);
            } else {
                console.log(`⚠️ No user found with email ${update.oldEmail}`);
            }
        }
        
        // List all admin users after update
        const adminUsers = await User.find({ isAdmin: true });
        
        console.log('\n📋 Current Admin Users:');
        adminUsers.forEach(user => {
            console.log(`   👤 ${user.name || user.username}`);
            console.log(`      📧 Email: ${user.email}`);
            console.log(`      🔑 Username: ${user.username || 'N/A'}`);
            console.log(`      👑 Role: ${user.role}`);
            console.log('');
        });
        
        console.log('🎉 Admin email update completed!');
        
    } catch (error) {
        console.error('❌ Update failed:', error);
    } finally {
        mongoose.connection.close();
    }
}

updateAdminEmails();