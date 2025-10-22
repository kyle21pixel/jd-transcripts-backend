const { pool } = require('../config/database');

const CustomerModel = {
    // Create new customer
    async create(customerData) {
        const [result] = await pool.execute(
            'INSERT INTO customers (first_name, last_name, email, phone, company) VALUES (?, ?, ?, ?, ?)',
            [customerData.first_name, customerData.last_name, customerData.email, customerData.phone, customerData.company]
        );
        return result.insertId;
    },

    // Get customer by email
    async getByEmail(email) {
        const [rows] = await pool.execute(
            'SELECT * FROM customers WHERE email = ?',
            [email]
        );
        return rows[0];
    },

    // Get customer by ID
    async getById(id) {
        const [rows] = await pool.execute(
            'SELECT * FROM customers WHERE id = ?',
            [id]
        );
        return rows[0];
    },

    // Update customer
    async update(id, customerData) {
        const [result] = await pool.execute(
            `UPDATE customers 
             SET first_name = ?, last_name = ?, phone = ?, company = ?
             WHERE id = ?`,
            [customerData.first_name, customerData.last_name, customerData.phone, customerData.company, id]
        );
        return result.affectedRows > 0;
    }
};

module.exports = CustomerModel;