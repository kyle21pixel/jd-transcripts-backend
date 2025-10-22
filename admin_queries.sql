-- View all tables in the database
SHOW TABLES;

-- View Users table structure
DESCRIBE users;

-- View all users
SELECT 
    id,
    email,
    role,
    first_name,
    last_name,
    created_at,
    updated_at
FROM users
ORDER BY created_at DESC;

-- View Orders table structure
DESCRIBE orders;

-- View all orders with customer and staff details
SELECT 
    o.id,
    o.service_type,
    o.audio_file_name,
    o.duration_minutes,
    o.status,
    o.urgent,
    o.special_instructions,
    o.created_at,
    o.updated_at,
    c.email as customer_email,
    c.first_name as customer_first_name,
    c.last_name as customer_last_name,
    s.email as staff_email,
    s.first_name as staff_first_name,
    s.last_name as staff_last_name
FROM orders o
LEFT JOIN users c ON o.customer_id = c.id
LEFT JOIN users s ON o.staff_id = s.id
ORDER BY o.created_at DESC;

-- View Order History table structure
DESCRIBE order_history;

-- View complete order history with user details
SELECT 
    oh.id,
    oh.order_id,
    oh.status,
    oh.notes,
    oh.created_at,
    u.email as updated_by_email,
    u.first_name as updated_by_first_name,
    u.last_name as updated_by_last_name
FROM order_history oh
JOIN users u ON oh.updated_by = u.id
ORDER BY oh.created_at DESC;

-- View pending orders
SELECT 
    o.id,
    o.service_type,
    o.created_at,
    c.email as customer_email
FROM orders o
JOIN users c ON o.customer_id = c.id
WHERE o.status = 'pending'
ORDER BY o.created_at ASC;

-- View urgent orders
SELECT 
    o.id,
    o.service_type,
    o.created_at,
    o.status,
    c.email as customer_email
FROM orders o
JOIN users c ON o.customer_id = c.id
WHERE o.urgent = true
ORDER BY o.created_at DESC;

-- View orders by status
SELECT 
    status,
    COUNT(*) as count
FROM orders
GROUP BY status;

-- View staff workload
SELECT 
    s.id,
    s.email,
    s.first_name,
    s.last_name,
    COUNT(o.id) as total_orders,
    SUM(CASE WHEN o.status = 'in_progress' THEN 1 ELSE 0 END) as active_orders,
    SUM(CASE WHEN o.status = 'completed' THEN 1 ELSE 0 END) as completed_orders
FROM users s
LEFT JOIN orders o ON s.id = o.staff_id
WHERE s.role = 'staff'
GROUP BY s.id
ORDER BY active_orders DESC;

-- View recent order updates (last 24 hours)
SELECT 
    oh.order_id,
    oh.status,
    oh.created_at,
    u.email as updated_by,
    o.service_type
FROM order_history oh
JOIN users u ON oh.updated_by = u.id
JOIN orders o ON oh.order_id = o.id
WHERE oh.created_at >= NOW() - INTERVAL 24 HOUR
ORDER BY oh.created_at DESC;

-- View average order completion time
SELECT 
    service_type,
    AVG(TIMESTAMPDIFF(HOUR, created_at, updated_at)) as avg_completion_hours,
    COUNT(*) as total_orders
FROM orders
WHERE status = 'completed'
GROUP BY service_type;