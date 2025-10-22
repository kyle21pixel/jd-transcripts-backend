const sqlite3 = require('sqlite3').verbose();
const path = require('path');

// Database path
const dbPath = path.join(__dirname, 'database', 'jd_reporting.db');

console.log('🧹 JD Reporting Company - User Cleanup Script');
console.log('===============================================');

// Connect to database
const db = new sqlite3.Database(dbPath, (err) => {
    if (err) {
        console.error('❌ Error connecting to database:', err.message);
        process.exit(1);
    }
    console.log('✅ Connected to SQLite database');
});

// Function to list all users
function listAllUsers() {
    return new Promise((resolve, reject) => {
        db.all(`
            SELECT id, name, email, role, created_at, specializations 
            FROM users 
            ORDER BY role, created_at
        `, (err, rows) => {
            if (err) {
                reject(err);
            } else {
                resolve(rows);
            }
        });
    });
}

// Function to delete fake/demo users (keep only admin)
function deleteFakeUsers() {
    return new Promise((resolve, reject) => {
        // Delete all users except the admin
        db.run(`
            DELETE FROM users 
            WHERE email != 'admin@jdreporting.com'
        `, function(err) {
            if (err) {
                reject(err);
            } else {
                resolve(this.changes);
            }
        });
    });
}

// Function to clean up related data
function cleanupRelatedData() {
    return new Promise((resolve, reject) => {
        // Clean up orders from deleted users
        db.run(`
            DELETE FROM orders 
            WHERE client_email NOT IN (SELECT email FROM users)
            AND assigned_transcriber_id NOT IN (SELECT id FROM users)
        `, function(err) {
            if (err) {
                reject(err);
            } else {
                console.log(`🗑️  Cleaned up ${this.changes} orphaned orders`);
                
                // Clean up notifications
                db.run(`
                    DELETE FROM notifications 
                    WHERE user_id NOT IN (SELECT id FROM users)
                `, function(err) {
                    if (err) {
                        reject(err);
                    } else {
                        console.log(`🗑️  Cleaned up ${this.changes} orphaned notifications`);
                        resolve();
                    }
                });
            }
        });
    });
}

// Main cleanup function
async function performCleanup() {
    try {
        console.log('\n📋 Current users in database:');
        console.log('==============================');
        
        const usersBefore = await listAllUsers();
        if (usersBefore.length === 0) {
            console.log('No users found in database');
        } else {
            usersBefore.forEach((user, index) => {
                console.log(`${index + 1}. ${user.name} (${user.email}) - ${user.role.toUpperCase()}`);
                if (user.specializations) {
                    console.log(`   Specializations: ${user.specializations}`);
                }
                console.log(`   Created: ${new Date(user.created_at).toLocaleString()}`);
                console.log('');
            });
        }

        console.log('🧹 Starting cleanup process...');
        
        // Delete fake users
        const deletedCount = await deleteFakeUsers();
        console.log(`✅ Deleted ${deletedCount} fake/demo users`);
        
        // Clean up related data
        await cleanupRelatedData();
        
        console.log('\n📋 Remaining users after cleanup:');
        console.log('==================================');
        
        const usersAfter = await listAllUsers();
        if (usersAfter.length === 0) {
            console.log('⚠️  No users remaining! You may need to recreate the admin user.');
        } else {
            usersAfter.forEach((user, index) => {
                console.log(`${index + 1}. ${user.name} (${user.email}) - ${user.role.toUpperCase()}`);
                console.log(`   Created: ${new Date(user.created_at).toLocaleString()}`);
                console.log('');
            });
        }
        
        console.log('✅ Cleanup completed successfully!');
        console.log('\n🎯 Next Steps:');
        console.log('==============');
        console.log('1. Restart your server: npm start');
        console.log('2. Share registration link with qualified transcribers');
        console.log('3. Review and approve new transcriber registrations');
        console.log('4. Use admin dashboard to manage real users');
        
    } catch (error) {
        console.error('❌ Error during cleanup:', error.message);
    } finally {
        db.close((err) => {
            if (err) {
                console.error('❌ Error closing database:', err.message);
            } else {
                console.log('\n🔒 Database connection closed');
            }
            process.exit(0);
        });
    }
}

// Run cleanup
performCleanup();