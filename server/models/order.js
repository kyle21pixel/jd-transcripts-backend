const mysql = require('../config/mysql');

class Order {
    constructor(data) {
        this.id = data.id;
        this.order_number = data.order_number;
        this.client_name = data.client_name;
        this.client_email = data.client_email;
        this.client_phone = data.client_phone;
        this.service_type = data.service_type;
        this.turnaround = data.turnaround;
        this.file_name = data.file_name;
        this.file_path = data.file_path;
        this.file_size = data.file_size;
        this.duration_minutes = data.duration_minutes;
        this.estimated_cost = data.estimated_cost;
        this.special_instructions = data.special_instructions;
        this.status = data.status;
        this.assigned_to = data.assigned_to;
        this.assigned_by = data.assigned_by;
        this.assigned_at = data.assigned_at;
        this.deadline = data.deadline;
        this.completed_at = data.completed_at;
        this.delivered_at = data.delivered_at;
        this.created_at = data.created_at;
        this.updated_at = data.updated_at;
        this.assigned_transcriber_name = data.assigned_transcriber_name || null;
    }

    // Create a new order
    static async create(orderData) {
        const {
            client_name, client_email, client_phone, service_type, turnaround,
            file_name, file_path, file_size, duration_minutes, estimated_cost,
            special_instructions, deadline
        } = orderData;

        // Generate order number
        const order_number = `ORD-${Date.now()}`;

        const sql = `INSERT INTO orders
                     (order_number, client_name, client_email, client_phone, service_type,
                      turnaround, file_name, file_path, file_size, duration_minutes,
                      estimated_cost, special_instructions, deadline)
                     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;

        try {
            const [result] = await mysql.pool.execute(sql, [
                order_number, client_name, client_email, client_phone, service_type,
                turnaround, file_name, file_path, file_size, duration_minutes,
                estimated_cost, special_instructions, deadline
            ]);

            return new Order({
                id: result.insertId,
                order_number,
                client_name,
                client_email,
                client_phone,
                service_type,
                turnaround,
                file_name,
                file_path,
                file_size,
                duration_minutes,
                estimated_cost,
                special_instructions,
                status: 'pending',
                deadline,
                created_at: new Date(),
                updated_at: new Date()
            });
        } catch (error) {
            throw new Error(`Failed to create order: ${error.message}`);
        }
    }

    // Find order by ID
    static async findById(id) {
        const sql = 'SELECT * FROM orders WHERE id = ?';
        try {
            const [rows] = await mysql.pool.execute(sql, [id]);
            return rows.length > 0 ? new Order(rows[0]) : null;
        } catch (error) {
            throw new Error(`Failed to find order by ID: ${error.message}`);
        }
    }

    // Find order by order number
    static async findByOrderNumber(order_number) {
        const sql = 'SELECT * FROM orders WHERE order_number = ?';
        try {
            const [rows] = await mysql.pool.execute(sql, [order_number]);
            return rows.length > 0 ? new Order(rows[0]) : null;
        } catch (error) {
            throw new Error(`Failed to find order by number: ${error.message}`);
        }
    }

    // Get all orders with optional filters
    static async findAll(filters = {}) {
        let sql = 'SELECT o.*, u.first_name, u.last_name FROM orders o LEFT JOIN users u ON o.assigned_to = u.id';
        const conditions = [];
        const values = [];

        if (filters.status) {
            conditions.push('o.status = ?');
            values.push(filters.status);
        }

        if (filters.client_email) {
            conditions.push('o.client_email = ?');
            values.push(filters.client_email);
        }

        if (filters.assigned_to) {
            conditions.push('o.assigned_to = ?');
            values.push(filters.assigned_to);
        }

        if (conditions.length > 0) {
            sql += ' WHERE ' + conditions.join(' AND ');
        }

        sql += ' ORDER BY o.created_at DESC';

        try {
            const [rows] = await mysql.pool.execute(sql, values);
            return rows.map(row => ({
                ...new Order(row),
                assigned_transcriber_name: row.first_name && row.last_name ? `${row.first_name} ${row.last_name}` : null
            }));
        } catch (error) {
            throw new Error(`Failed to get orders: ${error.message}`);
        }
    }

    // Update order
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

        const sql = `UPDATE orders SET ${fields.join(', ')}, updated_at = NOW() WHERE id = ?`;
        values.push(this.id);

        try {
            await mysql.pool.execute(sql, values);

            // Fetch updated order data
            const updatedOrder = await Order.findById(this.id);
            Object.assign(this, updatedOrder);
            return this;
        } catch (error) {
            throw new Error(`Failed to update order: ${error.message}`);
        }
    }

    // Update status with history tracking
    async updateStatus(newStatus, changedBy, notes = null) {
        const oldStatus = this.status;

        // Update order status
        await this.update({ status: newStatus });

        // Add status change to history
        const sql = `INSERT INTO order_status_history (order_id, old_status, new_status, changed_by, notes)
                     VALUES (?, ?, ?, ?, ?)`;

        try {
            await mysql.pool.execute(sql, [this.id, oldStatus, newStatus, changedBy, notes]);
        } catch (error) {
            console.error('Failed to log status change:', error);
            // Don't throw error for history logging failure
        }

        return this;
    }

    // Assign to transcriber
    async assignTo(transcriberId, assignedBy) {
        const assigned_at = new Date();
        await this.update({
            assigned_to: transcriberId,
            assigned_by: assignedBy,
            assigned_at: assigned_at
        });
        return this;
    }

    // Mark as completed
    async markCompleted() {
        const completed_at = new Date();
        await this.update({
            status: 'completed',
            completed_at: completed_at
        });
        return this;
    }

    // Mark as delivered
    async markDelivered() {
        const delivered_at = new Date();
        await this.update({
            status: 'delivered',
            delivered_at: delivered_at
        });
        return this;
    }

    // Check if order is overdue
    isOverdue() {
        return this.status !== 'completed' && this.status !== 'cancelled' && new Date() > new Date(this.deadline);
    }

    // Calculate estimated duration based on service type
    calculateEstimatedDuration() {
        const baseDurations = {
            'legal': 24,
            'medical': 48,
            'zoom': 24,
            'academic': 72
        };

        return baseDurations[this.service_type] || 24;
    }

    // Get order statistics
    static async getStats() {
        const sql = `
            SELECT
                COUNT(*) as total_orders,
                SUM(CASE WHEN status = 'pending' THEN 1 ELSE 0 END) as pending_orders,
                SUM(CASE WHEN status = 'completed' THEN 1 ELSE 0 END) as completed_orders,
                SUM(CASE WHEN status = 'in_progress' THEN 1 ELSE 0 END) as in_progress_orders,
                AVG(estimated_cost) as avg_cost
            FROM orders
        `;

        try {
            const [rows] = await mysql.pool.execute(sql);
            return rows[0];
        } catch (error) {
            throw new Error(`Failed to get order stats: ${error.message}`);
        }
    }
}

module.exports = Order;