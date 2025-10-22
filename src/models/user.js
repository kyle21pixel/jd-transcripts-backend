const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const pool = require('../config/database').pool;
const logger = require('../utils/logger');

class User {
    static async create({ email, password, role, firstName, lastName }) {
        const connection = await pool.getConnection();
        try {
            // Hash password
            const salt = await bcrypt.genSalt(10);
            const passwordHash = await bcrypt.hash(password, salt);

            // Insert user
            const [result] = await connection.query(
                'INSERT INTO users (email, password_hash, role, first_name, last_name) VALUES (?, ?, ?, ?, ?)',
                [email, passwordHash, role, firstName, lastName]
            );

            // Get created user
            const [user] = await connection.query(
                'SELECT id, email, role, first_name, last_name, created_at FROM users WHERE id = ?',
                [result.insertId]
            );

            return user[0];
        } catch (error) {
            logger.error('Error creating user:', error);
            throw error;
        } finally {
            connection.release();
        }
    }

    static async authenticate(email, password) {
        const connection = await pool.getConnection();
        try {
            // Get user
            const [users] = await connection.query(
                'SELECT * FROM users WHERE email = ?',
                [email]
            );

            if (users.length === 0) {
                return null;
            }

            const user = users[0];

            // Check password
            const isMatch = await bcrypt.compare(password, user.password_hash);
            if (!isMatch) {
                return null;
            }

            // Create token
            const token = jwt.sign(
                { id: user.id, role: user.role },
                process.env.JWT_SECRET || 'your-secret-key',
                { expiresIn: '24h' }
            );

            return {
                user: {
                    id: user.id,
                    email: user.email,
                    role: user.role,
                    firstName: user.first_name,
                    lastName: user.last_name
                },
                token
            };
        } catch (error) {
            logger.error('Error authenticating user:', error);
            throw error;
        } finally {
            connection.release();
        }
    }

    static async getById(id) {
        const connection = await pool.getConnection();
        try {
            const [users] = await connection.query(
                'SELECT id, email, role, first_name, last_name, created_at FROM users WHERE id = ?',
                [id]
            );

            return users[0] || null;
        } catch (error) {
            logger.error('Error getting user:', error);
            throw error;
        } finally {
            connection.release();
        }
    }

    static async update(id, updates) {
        const connection = await pool.getConnection();
        try {
            const allowedUpdates = ['first_name', 'last_name', 'email'];
            const updateFields = [];
            const updateValues = [];

            Object.keys(updates).forEach(key => {
                if (allowedUpdates.includes(key)) {
                    updateFields.push(`${key} = ?`);
                    updateValues.push(updates[key]);
                }
            });

            if (updateFields.length === 0) {
                return null;
            }

            updateValues.push(id);

            await connection.query(
                `UPDATE users SET ${updateFields.join(', ')} WHERE id = ?`,
                updateValues
            );

            return this.getById(id);
        } catch (error) {
            logger.error('Error updating user:', error);
            throw error;
        } finally {
            connection.release();
        }
    }

    static async getAll({ page = 1, limit = 10, role = null }) {
        const connection = await pool.getConnection();
        try {
            let query = 'SELECT id, email, role, first_name, last_name, created_at FROM users';
            const queryParams = [];

            if (role) {
                query += ' WHERE role = ?';
                queryParams.push(role);
            }

            query += ' ORDER BY created_at DESC LIMIT ? OFFSET ?';
            queryParams.push(parseInt(limit), (parseInt(page) - 1) * parseInt(limit));

            const [users] = await connection.query(query, queryParams);
            const [{ total }] = await connection.query(
                'SELECT COUNT(*) as total FROM users' + (role ? ' WHERE role = ?' : ''),
                role ? [role] : []
            );

            return {
                users,
                pagination: {
                    page: parseInt(page),
                    limit: parseInt(limit),
                    total
                }
            };
        } catch (error) {
            logger.error('Error getting users:', error);
            throw error;
        } finally {
            connection.release();
        }
    }
}

module.exports = User;