const { pool } = require('../config/database');
const logger = require('../utils/logger');

class Order {
    static async create({
        customer_id,
        service_type,
        audio_file_name,
        duration_minutes,
        urgent = false,
        special_instructions = null
    }) {
        const connection = await pool.getConnection();
        try {
            const [result] = await connection.query(
                `INSERT INTO orders 
                (customer_id, service_type, audio_file_name, duration_minutes, urgent, special_instructions)
                VALUES (?, ?, ?, ?, ?, ?)`,
                [customer_id, service_type, audio_file_name, duration_minutes, urgent, special_instructions]
            );

            return { id: result.insertId };
        } catch (error) {
            logger.error('Error creating order:', error);
            throw error;
        } finally {
            connection.release();
        }
    }

    static async getById(id) {
        const connection = await pool.getConnection();
        try {
            const [orders] = await connection.query(
                `SELECT o.*, 
                    c.email as customer_email,
                    c.first_name as customer_first_name,
                    c.last_name as customer_last_name,
                    s.first_name as staff_first_name,
                    s.last_name as staff_last_name
                FROM orders o
                LEFT JOIN users c ON o.customer_id = c.id
                LEFT JOIN users s ON o.staff_id = s.id
                WHERE o.id = ?`,
                [id]
            );

            if (orders.length === 0) {
                return null;
            }

            // Get order history
            const [history] = await connection.query(
                `SELECT oh.*, u.first_name, u.last_name
                FROM order_history oh
                JOIN users u ON oh.updated_by = u.id
                WHERE oh.order_id = ?
                ORDER BY oh.created_at DESC`,
                [id]
            );

            const order = orders[0];
            order.history = history;

            return order;
        } catch (error) {
            logger.error('Error getting order:', error);
            throw error;
        } finally {
            connection.release();
        }
    }

    static async getAll({ page = 1, limit = 10, filters = {} }) {
        const connection = await pool.getConnection();
        try {
            let query = `SELECT o.*, 
                c.email as customer_email,
                c.first_name as customer_first_name,
                c.last_name as customer_last_name,
                s.first_name as staff_first_name,
                s.last_name as staff_last_name
                FROM orders o
                LEFT JOIN users c ON o.customer_id = c.id
                LEFT JOIN users s ON o.staff_id = s.id`;

            const queryParams = [];
            const conditions = [];

            if (filters.status) {
                conditions.push('o.status = ?');
                queryParams.push(filters.status);
            }

            if (filters.customer_id) {
                conditions.push('o.customer_id = ?');
                queryParams.push(filters.customer_id);
            }

            if (filters.staff_id) {
                conditions.push('o.staff_id = ?');
                queryParams.push(filters.staff_id);
            }

            if (filters.search) {
                conditions.push('(o.id LIKE ? OR o.service_type LIKE ? OR c.email LIKE ?)');
                const searchTerm = `%${filters.search}%`;
                queryParams.push(searchTerm, searchTerm, searchTerm);
            }

            if (conditions.length > 0) {
                query += ' WHERE ' + conditions.join(' AND ');
            }

            query += ' ORDER BY o.created_at DESC LIMIT ? OFFSET ?';
            queryParams.push(parseInt(limit), (parseInt(page) - 1) * parseInt(limit));

            const [orders] = await connection.query(query, queryParams);

            // Get total count
            let countQuery = 'SELECT COUNT(*) as total FROM orders o';
            if (conditions.length > 0) {
                countQuery += ' WHERE ' + conditions.join(' AND ');
            }

            const [totalResult] = await connection.query(countQuery, queryParams.slice(0, -2));
            const { total } = totalResult[0];

            return {
                orders,
                pagination: {
                    page: parseInt(page),
                    limit: parseInt(limit),
                    total
                }
            };
        } catch (error) {
            logger.error('Error getting orders:', error);
            throw error;
        } finally {
            connection.release();
        }
    }

    static async updateStatus(id, status, updatedBy) {
        const connection = await pool.getConnection();
        try {
            await connection.beginTransaction();

            // Update order status
            await connection.query(
                'UPDATE orders SET status = ? WHERE id = ?',
                [status, id]
            );

            // Add to history
            await connection.query(
                'INSERT INTO order_history (order_id, status, updated_by) VALUES (?, ?, ?)',
                [id, status, updatedBy]
            );

            await connection.commit();

            return this.getById(id);
        } catch (error) {
            await connection.rollback();
            logger.error('Error updating order status:', error);
            throw error;
        } finally {
            connection.release();
        }
    }

    static async assign(id, staffId) {
        const connection = await pool.getConnection();
        try {
            await connection.query(
                'UPDATE orders SET staff_id = ?, status = "in_progress" WHERE id = ?',
                [staffId, id]
            );

            return this.getById(id);
        } catch (error) {
            logger.error('Error assigning order:', error);
            throw error;
        } finally {
            connection.release();
        }
    }

    static async getDashboardStats() {
        const connection = await pool.getConnection();
        try {
            const [stats] = await connection.query(`
                SELECT
                    (SELECT COUNT(*) FROM orders) as total_orders,
                    (SELECT COUNT(*) FROM orders WHERE status = 'pending') as pending_orders,
                    (SELECT COUNT(*) FROM orders WHERE status = 'in_progress') as in_progress_orders,
                    (SELECT COUNT(*) FROM orders WHERE status = 'completed') as completed_orders,
                    (SELECT COUNT(*) FROM orders WHERE urgent = true AND status != 'completed') as urgent_orders
            `);

            const [recentOrders] = await connection.query(
                `SELECT o.*, 
                    c.email as customer_email,
                    c.first_name as customer_first_name,
                    c.last_name as customer_last_name
                FROM orders o
                LEFT JOIN users c ON o.customer_id = c.id
                ORDER BY o.created_at DESC
                LIMIT 5`
            );

            return {
                ...stats[0],
                recent_orders: recentOrders
            };
        } catch (error) {
            logger.error('Error getting dashboard stats:', error);
            throw error;
        } finally {
            connection.release();
        }
    }
}

module.exports = Order;