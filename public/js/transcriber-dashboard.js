// transcriber-dashboard.js
// Handles navigation, real-time updates, task management, and notifications for transcribers

document.addEventListener('DOMContentLoaded', () => {
    // Auth check
    if (!localStorage.getItem('token')) {
        window.location.href = '/login.html';
        return;
    }

    // Navigation
    const dashboardView = document.getElementById('dashboardView');
    const performanceView = document.getElementById('performanceView');
    const notificationsView = document.getElementById('notificationsView');
    document.getElementById('navTasks').onclick = () => {
        dashboardView.style.display = '';
        performanceView.style.display = 'none';
        notificationsView.style.display = 'none';
    };
    document.getElementById('navPerformance').onclick = () => {
        dashboardView.style.display = 'none';
        performanceView.style.display = '';
        notificationsView.style.display = 'none';
        loadPerformance();
    };
    document.getElementById('navNotifications').onclick = () => {
        dashboardView.style.display = 'none';
        performanceView.style.display = 'none';
        notificationsView.style.display = '';
        loadNotifications();
    };
    document.getElementById('logoutBtn').onclick = () => {
        localStorage.removeItem('token');
        window.location.href = '/login.html';
    };

    // Load tasks on page load
    loadTasks();
    document.getElementById('refreshTasksBtn').onclick = loadTasks;

    // WebSocket for real-time updates
    let ws;
    function connectWebSocket() {
        ws = new WebSocket('ws://' + window.location.hostname + ':3000');
        ws.onmessage = (event) => {
            const data = JSON.parse(event.data);
            if (data.type === 'order_update' || data.type === 'new_order') {
                loadTasks();
            }
            if (data.type === 'notification') {
                loadNotifications();
            }
        };
        ws.onclose = () => setTimeout(connectWebSocket, 2000);
    }
    connectWebSocket();

    // Load assigned tasks
    function loadTasks() {
        fetch('/api/orders/assigned', {
            headers: { 'Authorization': 'Bearer ' + localStorage.getItem('token') }
        })
        .then(res => res.json())
        .then(data => {
            const tbody = document.querySelector('#tasksTable tbody');
            tbody.innerHTML = '';
            if (Array.isArray(data.orders)) {
                data.orders.forEach(order => {
                    const tr = document.createElement('tr');
                    tr.innerHTML = `
                        <td>${order.id}</td>
                        <td>${order.client_name}</td>
                        <td>${order.service_type}</td>
                        <td>${order.status}</td>
                        <td>${order.deadline ? new Date(order.deadline).toLocaleString() : ''}</td>
                        <td><input type="file" data-order="${order.id}" class="form-control form-control-sm upload-input"></td>
                    `;
                    tbody.appendChild(tr);
                });
                // Add upload listeners
                document.querySelectorAll('.upload-input').forEach(input => {
                    input.addEventListener('change', handleUpload);
                });
            }
        });
    }

    // Handle file upload
    function handleUpload(e) {
        const orderId = e.target.getAttribute('data-order');
        const file = e.target.files[0];
        if (!file) return;
        const formData = new FormData();
        formData.append('file', file);
        fetch(`/api/orders/${orderId}/upload`, {
            method: 'POST',
            headers: { 'Authorization': 'Bearer ' + localStorage.getItem('token') },
            body: formData
        })
        .then(res => res.json())
        .then(data => {
            if (data.success) {
                alert('File uploaded successfully!');
                loadTasks();
            } else {
                alert('Upload failed: ' + (data.message || 'Unknown error'));
            }
        });
    }

    // Load performance stats
    function loadPerformance() {
        performanceView.innerHTML = '<div class="text-center">Loading...</div>';
        fetch('/api/transcriber/performance', {
            headers: { 'Authorization': 'Bearer ' + localStorage.getItem('token') }
        })
        .then(res => res.json())
        .then(data => {
            performanceView.innerHTML = `
                <h2>Performance</h2>
                <ul class="list-group">
                    <li class="list-group-item">Completed Orders: <b>${data.completed || 0}</b></li>
                    <li class="list-group-item">Pending Orders: <b>${data.pending || 0}</b></li>
                    <li class="list-group-item">Average Turnaround: <b>${data.avg_turnaround || 'N/A'}</b></li>
                </ul>
            `;
        });
    }

    // Load notifications
    function loadNotifications() {
        notificationsView.innerHTML = '<div class="text-center">Loading...</div>';
        fetch('/api/notifications', {
            headers: { 'Authorization': 'Bearer ' + localStorage.getItem('token') }
        })
        .then(res => res.json())
        .then(data => {
            notificationsView.innerHTML = '<h2>Notifications</h2>';
            if (Array.isArray(data.notifications) && data.notifications.length) {
                notificationsView.innerHTML += '<ul class="list-group">' +
                    data.notifications.map(n => `<li class="list-group-item">${n.message} <span class="text-muted small">${new Date(n.created_at).toLocaleString()}</span></li>`).join('') +
                    '</ul>';
            } else {
                notificationsView.innerHTML += '<div class="alert alert-info">No notifications.</div>';
            }
        });
    }
});
