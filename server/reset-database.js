const sqlite3 = require('sqlite3').verbose();
const bcrypt = require('bcrypt');
const path = require('path');
const fs = require('fs');

// Database path
const dbPath = path.join(__dirname, 'database', 'jd_reporting.db');

console.log('🔄 JD Reporting Company - Complete Database Reset');
console.log('==================================================');

// Delete existing database file
if (fs.existsSync(dbPath)) {
    fs.unlinkSync(dbPath);
    console.log('✅ Old database deleted');
}

// Create new database
const db = new sqlite3.Database(dbPath, (err) => {
    if (err) {
        console.error('❌ Error creating database:', err.message);
        process.exit(1);
    }
    console.log('✅ New database created');
});

// Create all tables
async function createTables() {
    return new Promise((resolve, reject) => {
        db.serialize(() => {
            // Users table
            db.run(`
                CREATE TABLE users (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    name TEXT NOT NULL,
                    email TEXT UNIQUE NOT NULL,
                    password TEXT NOT NULL,
                    phone TEXT,
                    role TEXT DEFAULT 'transcriber',
                    status TEXT DEFAULT 'pending_approval',
                    specializations TEXT,
                    experience TEXT,
                    typing_speed INTEGER,
                    accuracy REAL,
                    previous_work TEXT,
                    user_references TEXT,
                    equipment TEXT,
                    availability TEXT,
                    motivation TEXT,
                    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
                    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
                    last_login DATETIME
                )
            `, (err) => {
                if (err) console.error('Error creating users table:', err);
                else console.log('✅ Users table created');
            });

            // Orders table
            db.run(`
                CREATE TABLE orders (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    order_number TEXT UNIQUE NOT NULL,
                    client_name TEXT NOT NULL,
                    client_email TEXT NOT NULL,
                    client_phone TEXT,
                    service_type TEXT NOT NULL,
                    turnaround TEXT NOT NULL,
                    estimated_cost REAL NOT NULL,
                    actual_cost REAL,
                    duration INTEGER NOT NULL,
                    speakers TEXT,
                    notes TEXT,
                    status TEXT DEFAULT 'pending',
                    assigned_transcriber_id INTEGER,
                    progress INTEGER DEFAULT 0,
                    due_date DATETIME,
                    completed_at DATETIME,
                    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
                    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
                    FOREIGN KEY (assigned_transcriber_id) REFERENCES users (id)
                )
            `, (err) => {
                if (err) console.error('Error creating orders table:', err);
                else console.log('✅ Orders table created');
            });

            // Order timeline table
            db.run(`
                CREATE TABLE order_timeline (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    order_id INTEGER NOT NULL,
                    user_id INTEGER,
                    action TEXT NOT NULL,
                    description TEXT,
                    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
                    FOREIGN KEY (order_id) REFERENCES orders (id),
                    FOREIGN KEY (user_id) REFERENCES users (id)
                )
            `, (err) => {
                if (err) console.error('Error creating order_timeline table:', err);
                else console.log('✅ Order timeline table created');
            });

            // Notifications table
            db.run(`
                CREATE TABLE notifications (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    user_id INTEGER NOT NULL,
                    title TEXT NOT NULL,
                    message TEXT NOT NULL,
                    type TEXT DEFAULT 'info',
                    read_status INTEGER DEFAULT 0,
                    order_id INTEGER,
                    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
                    FOREIGN KEY (user_id) REFERENCES users (id),
                    FOREIGN KEY (order_id) REFERENCES orders (id)
                )
            `, (err) => {
                if (err) console.error('Error creating notifications table:', err);
                else console.log('✅ Notifications table created');
            });

            // Payments table
            db.run(`
                CREATE TABLE payments (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    order_id INTEGER NOT NULL,
                    transcriber_id INTEGER,
                    amount REAL NOT NULL,
                    payment_type TEXT DEFAULT 'order_payment',
                    status TEXT DEFAULT 'pending',
                    payment_date DATETIME,
                    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
                    FOREIGN KEY (order_id) REFERENCES orders (id),
                    FOREIGN KEY (transcriber_id) REFERENCES users (id)
                )
            `, (err) => {
                if (err) console.error('Error creating payments table:', err);
                else console.log('✅ Payments table created');
                resolve();
            });
        });
    });
}

// Create admin user
async function createAdminUser() {
    return new Promise(async (resolve, reject) => {
        try {
            const hashedPassword = await bcrypt.hash('admin123', 10);
            
            db.run(`
                INSERT INTO users (name, email, password, role, status, created_at)
                VALUES (?, ?, ?, ?, ?, CURRENT_TIMESTAMP)
            `, [
                'System Administrator',
                'admin@jdreporting.com',
                hashedPassword,
                'admin',
                'active'
            ], function(err) {
                if (err) {
                    console.error('Error creating admin user:', err);
                    reject(err);
                } else {
                    console.log('✅ Admin user created');
                    console.log('   Email: admin@jdreporting.com');
                    console.log('   Password: admin123');
                    resolve();
                }
            });
        } catch (error) {
            reject(error);
        }
    });
}

// Main setup function
async function setupDatabase() {
    try {
        await createTables();
        await createAdminUser();
        
        console.log('\n🎉 Database setup completed successfully!');
        console.log('=======================================');
        console.log('✅ Fresh database with only admin user');
        console.log('✅ All tables created and ready');
        console.log('✅ System ready for real transcribers');
        console.log('\n🚀 Next steps:');
        console.log('1. Restart your server: npm start');
        console.log('2. Login as admin to test the system');
        console.log('3. Share registration link with qualified transcribers');
        
    } catch (error) {
        console.error('❌ Error during setup:', error);
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

// Run setup
setupDatabase();