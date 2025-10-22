const { pool } = require('../config/database');

const OrderModel = {
    // Create new order
    create: async (orderData) => {
        const orderNumber = 'JD' + Date.now().toString().slice(-6);
        const connection = await pool.getConnection();
        try {
            await connection.beginTransaction();
            const [result] = await connection.execute(
                'INSERT INTO orders (order_number, client_name, client_email, client_phone, service_type, instructions, status, priority) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
                [
                    orderNumber,
                    orderData.client_name || '',
                    orderData.client_email || '',
                    orderData.client_phone || '',
                    orderData.service_type || '',
                    orderData.instructions || '',
                    'pending',
                    orderData.priority || 'normal'
                ]
            );
            await connection.commit();
            return { id: result.insertId, orderNumber };
        } catch (error) {
            await connection.rollback();
            throw error;
        } finally {
            connection.release();
        }
    },
    // Get all orders
    getAll: async () => {
        const [rows] = await pool.execute('SELECT * FROM orders ORDER BY created_at DESC');
        return rows;
    }
};

module.exports = OrderModel;