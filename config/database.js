require('dotenv').config();
const mysql = require('mysql2/promise');

// Database configuration
const dbConfig = {
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASS || '',
    database: process.env.DB_NAME || 'jd_reporting',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
};

// Debug: print DB config to verify env variables
console.log('DB config:', dbConfig);

// Create connection pool
const pool = mysql.createPool(dbConfig);

// Test database connection
async function testConnection() {
    try {
        const connection = await pool.getConnection();
        console.log('Database connected successfully');
        connection.release();
        return true;
    } catch (error) {
        console.error('Database connection failed:', error);
        return false;
    }
}

// Query helper for consistent usage
const query = async (sql, params = []) => {
    const [rows] = await pool.execute(sql, params);
    return rows;
};

module.exports = {
    pool,
    query,
    testConnection
};