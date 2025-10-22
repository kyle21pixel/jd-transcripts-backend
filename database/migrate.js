require('dotenv').config();
const mysql = require('mysql2/promise');
const fs = require('fs').promises;
const path = require('path');

async function runMigrations() {
    let connection;
    try {

        // Use DB_DATABASE if present, otherwise fallback to DB_NAME
        const dbName = process.env.DB_DATABASE || process.env.DB_NAME;
        if (!dbName) {
            throw new Error('Database name not specified in .env (DB_DATABASE or DB_NAME)');
        }

        // Create database connection
        connection = await mysql.createConnection({
            host: process.env.DB_HOST,
            user: process.env.DB_USER,
            password: process.env.DB_PASSWORD,
            multipleStatements: true
        });

        // Create database if it doesn't exist
        await connection.query(`CREATE DATABASE IF NOT EXISTS \
            ${'`' + dbName + '`'}
        `);
        await connection.query(`USE ${'`' + dbName + '`'}`);

        // Get all migration files
        const migrationsDir = path.join(__dirname, 'migrations');
        const files = await fs.readdir(migrationsDir);
        const sqlFiles = files.filter(f => f.endsWith('.sql'));

        // Sort files to ensure consistent order
        sqlFiles.sort();

        // Execute each migration file
        for (const file of sqlFiles) {
            console.log(`Running migration: ${file}`);
            const filePath = path.join(migrationsDir, file);
            const sql = await fs.readFile(filePath, 'utf8');
            
            try {
                await connection.query(sql);
                console.log(`Successfully executed ${file}`);
            } catch (error) {
                console.error(`Error executing ${file}:`, error);
                throw error;
            }
        }

        console.log('All migrations completed successfully');
    } catch (error) {
        console.error('Migration error:', error);
        process.exit(1);
    } finally {
        if (connection) {
            await connection.end();
        }
    }
}

runMigrations();