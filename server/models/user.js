const mysql = require('../config/mysql');
const bcrypt = require('bcryptjs');

class User {
    constructor(data) {
        this.id = data.id;
        this.username = data.username;
        this.email = data.email;
        this.password = data.password;
        this.first_name = data.first_name;
        this.last_name = data.last_name;
        this.role = data.role;
        this.phone = data.phone;
        this.created_at = data.created_at;
        this.updated_at = data.updated_at;
        this.status = data.status;
    }

    // Create a new user
    static async create(userData) {
        const { username, email, password, first_name, last_name, role = 'client', phone } = userData;

        // Hash password
        const saltRounds = parseInt(process.env.BCRYPT_ROUNDS) || 12;
        const hashedPassword = await bcrypt.hash(password, saltRounds);

        const sql = `INSERT INTO users (username, email, password, first_name, last_name, role, phone)
                     VALUES (?, ?, ?, ?, ?, ?, ?)`;

        try {
            const [result] = await mysql.pool.execute(sql, [
                username, email, hashedPassword, first_name, last_name, role, phone
            ]);

            return new User({
                id: result.insertId,
                username,
                email,
                password: hashedPassword,
                first_name,
                last_name,
                role,
                phone,
                status: 'active'
            });
        } catch (error) {
            throw new Error(`Failed to create user: ${error.message}`);
        }
    }

    // Find user by email
    static async findByEmail(email) {
        const sql = 'SELECT * FROM users WHERE email = ? AND status = "active"';
        try {
            const [rows] = await mysql.pool.execute(sql, [email]);
            return rows.length > 0 ? new User(rows[0]) : null;
        } catch (error) {
            throw new Error(`Failed to find user by email: ${error.message}`);
        }
    }

    // Find user by ID
    static async findById(id) {
        const sql = 'SELECT * FROM users WHERE id = ? AND status = "active"';
        try {
            const [rows] = await mysql.pool.execute(sql, [id]);
            return rows.length > 0 ? new User(rows[0]) : null;
        } catch (error) {
            throw new Error(`Failed to find user by ID: ${error.message}`);
        }
    }

    // Find user by username
    static async findByUsername(username) {
        const sql = 'SELECT * FROM users WHERE username = ? AND status = "active"';
        try {
            const [rows] = await mysql.pool.execute(sql, [username]);
            return rows.length > 0 ? new User(rows[0]) : null;
        } catch (error) {
            throw new Error(`Failed to find user by username: ${error.message}`);
        }
    }

    // Get all users
    static async findAll() {
        const sql = 'SELECT * FROM users WHERE status = "active" ORDER BY created_at DESC';
        try {
            const [rows] = await mysql.pool.execute(sql);
            return rows.map(row => new User(row));
        } catch (error) {
            throw new Error(`Failed to get all users: ${error.message}`);
        }
    }

    // Update user
    async update(updateData) {
        const fields = [];
        const values = [];

        Object.keys(updateData).forEach(key => {
            if (key !== 'id' && updateData[key] !== undefined) {
                fields.push(`${key} = ?`);
                values.push(updateData[key]);
            }
        });

        if (fields.length === 0) return this;

        const sql = `UPDATE users SET ${fields.join(', ')}, updated_at = NOW() WHERE id = ?`;
        values.push(this.id);

        try {
            await mysql.pool.execute(sql, values);

            // Fetch updated user data
            const updatedUser = await User.findById(this.id);
            Object.assign(this, updatedUser);
            return this;
        } catch (error) {
            throw new Error(`Failed to update user: ${error.message}`);
        }
    }

    // Delete user (soft delete)
    async delete() {
        const sql = 'UPDATE users SET status = "inactive", updated_at = NOW() WHERE id = ?';
        try {
            await mysql.pool.execute(sql, [this.id]);
            this.status = 'inactive';
            return this;
        } catch (error) {
            throw new Error(`Failed to delete user: ${error.message}`);
        }
    }

    // Compare password
    async comparePassword(candidatePassword) {
        return bcrypt.compare(candidatePassword, this.password);
    }

    // Update last login
    async updateLastLogin() {
        const sql = 'UPDATE users SET last_login = NOW(), updated_at = NOW() WHERE id = ?';
        try {
            await mysql.pool.execute(sql, [this.id]);
            return this;
        } catch (error) {
            throw new Error(`Failed to update last login: ${error.message}`);
        }
    }

    // Get user roles
    static async getRoles() {
        const sql = 'SELECT DISTINCT role FROM users WHERE status = "active"';
        try {
            const [rows] = await mysql.pool.execute(sql);
            return rows.map(row => row.role);
        } catch (error) {
            throw new Error(`Failed to get user roles: ${error.message}`);
        }
    }

    // Check if user is admin
    get isAdmin() {
        return this.role === 'admin';
    }

    // Get full name
    get name() {
        return `${this.first_name} ${this.last_name}`;
    }
}

module.exports = User;