const mysql = require('mysql2');
const bcrypt = require('bcryptjs');
require('dotenv').config();

// Create connection
const connection = mysql.createConnection({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASS || '',
    database: process.env.DB_NAME || 'jd_reporting'
});

async function insertUsers() {
    try {
        const users = [
            {
                username: 'jd.admin',
                email: 'admin@jdreporting.org',
                password: 'admin123',
                first_name: 'JD',
                last_name: 'Admin',
                role: 'admin',
                phone: '+254712345678'
            },
            {
                username: 'jd.transcriber',
                email: 'transcriber@jdreporting.org',
                password: 'trans123',
                first_name: 'JD',
                last_name: 'Transcriber',
                role: 'transcriber',
                phone: '+254712345679'
            }
        ];

        for (const user of users) {
            // Check if user exists
            const [existing] = await connection.promise().query(
                'SELECT id FROM users WHERE username = ? OR email = ?',
                [user.username, user.email]
            );

            if (existing.length > 0) {
                console.log(`User ${user.username} already exists, skipping...`);
                continue;
            }

            // Hash password
            const hashedPassword = await bcrypt.hash(user.password, 12);

            // Insert user
            await connection.promise().query(
                'INSERT INTO users (username, email, password, first_name, last_name, role, phone) VALUES (?, ?, ?, ?, ?, ?, ?)',
                [user.username, user.email, hashedPassword, user.first_name, user.last_name, user.role, user.phone]
            );

            console.log(`✅ Created user: ${user.username} (${user.role})`);
        }

        console.log('All users inserted successfully!');
    } catch (error) {
        console.error('Error inserting users:', error);
    } finally {
        connection.end();
    }
}

insertUsers();