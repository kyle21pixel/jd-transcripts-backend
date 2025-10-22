// Admin Dashboard JS for JD Reporting

document.addEventListener('DOMContentLoaded', () => {
    // Navigation
    document.getElementById('navTranscribers').onclick = () => showView('transcribersView');
    document.getElementById('navClients').onclick = () => showView('clientsView');
    document.getElementById('navOrders').onclick = () => showView('dashboardView');
    document.getElementById('navAnalytics').onclick = () => showView('analyticsView');
    document.getElementById('refreshOrdersBtn').onclick = loadOrders;
    loadStats();
    loadOrders();
});

function showView(viewId) {
    ['dashboardView','transcribersView','clientsView','analyticsView'].forEach(id => {
        document.getElementById(id).style.display = (id === viewId) ? '' : 'none';
    });
    if(viewId==='transcribersView') loadTranscribers();
    if(viewId==='clientsView') loadClients();
    if(viewId==='analyticsView') loadAnalytics();
}

async function loadStats() {
    // Example: fetch stats from backend
    const res = await fetch('/api/admin/stats');
    const data = await res.json();
    const statsRow = document.getElementById('statsRow');
    statsRow.innerHTML = `
        <div class="col-md-3"><div class="card text-center"><div class="card-body"><h4>${data.orders}</h4><p>Orders</p></div></div></div>
        <div class="col-md-3"><div class="card text-center"><div class="card-body"><h4>${data.transcribers}</h4><p>Transcribers</p></div></div></div>
        <div class="col-md-3"><div class="card text-center"><div class="card-body"><h4>${data.clients}</h4><p>Clients</p></div></div></div>
        <div class="col-md-3"><div class="card text-center"><div class="card-body"><h4>${data.completed}</h4><p>Completed</p></div></div></div>
    `;
}

async function loadOrders() {
    const res = await fetch('/api/orders');
    const data = await res.json();
    const tbody = document.querySelector('#ordersTable tbody');
    tbody.innerHTML = '';
    (data.orders || []).forEach(order => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td>${order.order_number}</td>
            <td>${order.client_name}</td>
            <td>${order.service_type}</td>
            <td>${order.status}</td>
            <td>${order.created_at || ''}</td>
            <td><button class="btn btn-sm btn-danger" onclick="deleteOrder('${order.id}')">Delete</button></td>
        `;
        tbody.appendChild(tr);
    });
}

async function deleteOrder(id) {
    if (!confirm('Delete this order?')) return;
    await fetch(`/api/orders/${id}`, { method: 'DELETE' });
    loadOrders();
}

async function loadTranscribers() {
    const res = await fetch('/api/admin/transcribers');
    const data = await res.json();
    const view = document.getElementById('transcribersView');
    view.innerHTML = `<h3>Transcribers</h3><ul>${(data.transcribers||[]).map(t=>`<li>${t.name} (${t.email})</li>`).join('')}</ul>`;
}

async function loadClients() {
    const res = await fetch('/api/admin/clients');
    const data = await res.json();
    const view = document.getElementById('clientsView');
    view.innerHTML = `<h3>Clients</h3><ul>${(data.clients||[]).map(c=>`<li>${c.name} (${c.email})</li>`).join('')}</ul>`;
}

async function loadAnalytics() {
    const res = await fetch('/api/admin/analytics');
    const data = await res.json();
    const view = document.getElementById('analyticsView');
    view.innerHTML = `<h3>Analytics</h3><pre>${JSON.stringify(data, null, 2)}</pre>`;
}
