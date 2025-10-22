const { pool } = require('../config/database');

const UserModel = {
    // Create new user
    async create(userData) {
        const [result] = await pool.execute(
            'INSERT INTO users (username, email, password_hash, role) VALUES (?, ?, ?, ?)',
            [userData.username, userData.email, userData.password_hash, userData.role]
        );
        return result.insertId;
    },

    // Get user by email
    async getByEmail(email) {
        const [rows] = await pool.execute(
            'SELECT * FROM users WHERE email = ?',
            [email]
        );
        return rows[0];
    },

    // Get user by username
    async getByUsername(username) {
        const [rows] = await pool.execute(
            'SELECT * FROM users WHERE username = ?',
            [username]
        );
        return rows[0];
    },

    // Get user by ID
    async getById(id) {
        const [rows] = await pool.execute(
            'SELECT * FROM users WHERE id = ?',
            [id]
        );
        return rows[0];
    },

    // Update user
    async update(id, userData) {
        const [result] = await pool.execute(
            `UPDATE users 
             SET username = ?, email = ?, role = ?
             WHERE id = ?`,
            [userData.username, userData.email, userData.role, id]
        );
        return result.affectedRows > 0;
    },

    // Update password
    async updatePassword(id, passwordHash) {
        const [result] = await pool.execute(
            'UPDATE users SET password_hash = ? WHERE id = ?',
            [passwordHash, id]
        );
        return result.affectedRows > 0;
    }
};

module.exports = UserModel;