const mysql = require('mysql2/promise');
const logger = require('../utils/logger');

// Database configuration
const dbConfig = {
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'jd_reporting_company',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
    multipleStatements: true
};

// Create connection pool
const pool = mysql.createPool(dbConfig);

// Test database connection
async function testConnection() {
    try {
        const connection = await pool.getConnection();
        logger.info('Database connected successfully');
        connection.release();
        return true;
    } catch (error) {
        logger.error('Database connection failed:', error);
        return false;
    }
}

// Initialize database tables
async function initializeTables() {
    try {
        const connection = await pool.getConnection();
        
        // Create tables if they don't exist
        await connection.query(`
            CREATE TABLE IF NOT EXISTS users (
                id INT PRIMARY KEY AUTO_INCREMENT,
                email VARCHAR(255) UNIQUE NOT NULL,
                password_hash VARCHAR(255) NOT NULL,
                role ENUM('admin', 'staff', 'customer') NOT NULL,
                first_name VARCHAR(100),
                last_name VARCHAR(100),
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
            );

            CREATE TABLE IF NOT EXISTS orders (
                id INT PRIMARY KEY AUTO_INCREMENT,
                customer_id INT NOT NULL,
                staff_id INT,
                service_type VARCHAR(50) NOT NULL,
                audio_file_name VARCHAR(255),
                duration_minutes INT,
                status ENUM('pending', 'in_progress', 'completed', 'cancelled') DEFAULT 'pending',
                urgent BOOLEAN DEFAULT FALSE,
                special_instructions TEXT,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
                FOREIGN KEY (customer_id) REFERENCES users(id),
                FOREIGN KEY (staff_id) REFERENCES users(id)
            );

            CREATE TABLE IF NOT EXISTS order_history (
                id INT PRIMARY KEY AUTO_INCREMENT,
                order_id INT NOT NULL,
                status VARCHAR(50) NOT NULL,
                updated_by INT NOT NULL,
                notes TEXT,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (order_id) REFERENCES orders(id),
                FOREIGN KEY (updated_by) REFERENCES users(id)
            );
        `);

        logger.info('Database tables initialized successfully');
        connection.release();
        return true;
    } catch (error) {
        logger.error('Failed to initialize database tables:', error);
        return false;
    }
}

module.exports = {
    pool,
    testConnection,
    initializeTables
};