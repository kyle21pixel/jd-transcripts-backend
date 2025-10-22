    // Daily stats
    try {
      const dr = await fetch(`${API_BASE}/admin/reports/daily`, { headers: headers() });
      const djson = await dr.json();
      const dd = djson.data || {};
      const dailyGrid = $("#dailyGrid");
      if (dailyGrid) {
        dailyGrid.innerHTML = '';
        dailyGrid.appendChild(createStatCard('Orders Today', dd.ordersToday));
        dailyGrid.appendChild(createStatCard('Completed Today', dd.completedToday));
        dailyGrid.appendChild(createStatCard('Total Revenue', '$' + (dd.totalRevenue || 0)));
        dailyGrid.appendChild(createStatCard('Total Orders', dd.totalOrders));
      }
    } catch (e) {
      // fallback: show dashes if daily stats fail
      const dailyGrid = $("#dailyGrid");
      if (dailyGrid) {
        dailyGrid.innerHTML = '';
        dailyGrid.appendChild(createStatCard('Orders Today', '-'));
        dailyGrid.appendChild(createStatCard('Completed Today', '-'));
        dailyGrid.appendChild(createStatCard('Total Revenue', '-'));
        dailyGrid.appendChild(createStatCard('Total Orders', '-'));
      }
    }
  // Helper for stat cards
  function createStatCard(label, value) {
    const div = document.createElement('div');
    div.className = 'card stat';
    div.innerHTML = `<div>${label}</div><div class="num">${value !== undefined && value !== null ? value : '-'}</div>`;
    return div;
  }
// Admin Dashboard Script
// Provides: auth, tabs, alerts, loading, orders, users, and transcribers management

(function() {
  'use strict';

  // Config - Backend API
  const API_BASE = 'http://localhost:5000/api';
  // Frontend-only fallback flags
  let OFFLINE_MODE = false;
  let offlineNoticeShown = false;

  // API headers
  const headers = () => {
    const h = { 'Content-Type': 'application/json' };
    const token = localStorage.getItem('adminToken');
    if (token) h['Authorization'] = `Bearer ${token}`;
    return h;
  };

  // UI helpers
  function $(sel) { return document.querySelector(sel); }
  function $all(sel) { return Array.from(document.querySelectorAll(sel)); }
  function showAlert(type, message, timeout = 4000) {
    const container = $('#alertContainer');
    if (!container) return;
    const el = document.createElement('div');
    el.className = `alert alert-${type}`;
    el.innerHTML = `<i class="fas ${type === 'success' ? 'fa-check-circle' : type === 'error' ? 'fa-times-circle' : 'fa-info-circle'}"></i> <span>${message}</span>`;
    container.appendChild(el);
    setTimeout(() => el.remove(), timeout);
  }
  function setLoading(isLoading) {
    const overlay = $('#loadingOverlay');
    if (!overlay) return;
    overlay.classList.toggle('show', isLoading);
  }
  window.showModal = function(id) { const el = document.getElementById(id); if (el) el.classList.add('show'); };
  window.closeModal = function(id) { const el = document.getElementById(id); if (el) el.classList.remove('show'); };

  // Auth
  function loadUserInfo() {
    const username = localStorage.getItem('adminUsername');
    const role = localStorage.getItem('adminRole');
    const el = $('#userInfo');
    if (el && username && role) el.textContent = `${username} (${role})`;
  }
  window.logout = function() {
    localStorage.removeItem('adminToken');
    localStorage.removeItem('adminLoggedIn');
    localStorage.removeItem('adminUsername');
    localStorage.removeItem('adminRole');
    localStorage.removeItem('adminLoginTime');
    window.location.href = 'admin-login.html';
  };

  // Tabs
  function activateTab(name) {
    $all('.tab').forEach(btn => btn.classList.toggle('active', btn.dataset.tab === name));
    $all('.tab-content').forEach(p => p.classList.toggle('active', p.id === `${name}-tab`));
  }
  $all('.tab').forEach(btn => {
    btn.addEventListener('click', () => activateTab(btn.dataset.tab));
  });

  // Dashboard stats (real-time updates)
  async function refreshDashboard() {
    try {
      setLoading(true);
      if (OFFLINE_MODE) {
        // Compute stats from local orders
        const localOrders = JSON.parse(localStorage.getItem('orders') || '[]');
        const totalOrders = localOrders.length;
        const pendingOrders = localOrders.filter(o => (o.status || 'pending') === 'pending').length;
        const processingOrders = localOrders.filter(o => (o.status || '') === 'processing' || (o.status || '') === 'in_progress').length;
        const completedOrders = localOrders.filter(o => (o.status || '') === 'completed').length;
        const totalRevenue = localOrders.reduce((sum, o) => sum + (Number(o.estimated_cost) || 0), 0).toFixed(2);
        $('#totalOrders').textContent = totalOrders;
        $('#pendingOrders').textContent = pendingOrders;
        $('#processingOrders').textContent = processingOrders;
        $('#completedOrders').textContent = completedOrders;
        $('#totalRevenue').textContent = `$${totalRevenue}`;
        return;
      }
      const res = await fetch(`${API_BASE}/admin/dashboard`, { headers: headers() });
      if (!res.ok) throw new Error('Failed to load dashboard');
      const { data } = await res.json();
  $("#statTotal").textContent = data.totalOrders ?? '-';
  $("#statPending").textContent = data.pendingOrders ?? '-';
  $("#statProcessing").textContent = data.processingOrders ?? '-';
  $("#statRevenue").textContent = '$' + (data.totalRevenue ?? 0);
    } catch (e) {
      console.warn('Dashboard fallback:', e?.message || e);
      OFFLINE_MODE = true;
      if (!offlineNoticeShown) {
        showAlert('info', 'Using local data (offline mode). Connect API to load live stats.');
        offlineNoticeShown = true;
      }
      // Render from local orders on error
      const localOrders = JSON.parse(localStorage.getItem('orders') || '[]');
      const totalOrders = localOrders.length;
      const pendingOrders = localOrders.filter(o => (o.status || 'pending') === 'pending').length;
      const processingOrders = localOrders.filter(o => (o.status || '') === 'processing' || (o.status || '') === 'in_progress').length;
      const completedOrders = localOrders.filter(o => (o.status || '') === 'completed').length;
      const totalRevenue = localOrders.reduce((sum, o) => sum + (Number(o.estimated_cost) || 0), 0).toFixed(2);
      $('#totalOrders').textContent = totalOrders;
      $('#pendingOrders').textContent = pendingOrders;
      $('#processingOrders').textContent = processingOrders;
      $('#completedOrders').textContent = completedOrders;
      $('#totalRevenue').textContent = `$${totalRevenue}`;
    } finally { setLoading(false); }
  }

  // Orders
  async function refreshOrders() {
    try {
      setLoading(true);
      if (OFFLINE_MODE) {
        const localOrders = JSON.parse(localStorage.getItem('orders') || '[]');
        renderOrders(localOrders);
        return;
      }
      const res = await fetch(`${API_BASE}/admin/orders`, { headers: headers() });
      if (!res.ok) throw new Error('Failed to load orders');
      const json = await res.json();
      renderOrders(json.data || []);
    } catch (e) {
      console.warn('Orders fallback:', e?.message || e);
      OFFLINE_MODE = true;
      if (!offlineNoticeShown) {
        showAlert('info', 'Using local orders (offline mode). Connect API to load live data.');
        offlineNoticeShown = true;
      }
      const localOrders = JSON.parse(localStorage.getItem('orders') || '[]');
      renderOrders(localOrders);
    } finally { setLoading(false); }
  }

  function renderOrders(list) {
    const container = $('#ordersContent');
    if (!container) return;
    if (!list.length) {
      container.innerHTML = `<tr><td colspan="6" class="empty-state"><i class="fas fa-clipboard-list"></i><h3>No Orders Found</h3><p>Orders will appear here once added to the system.</p></td></tr>`;
      return;
    }
    const rows = list.map(o => `
      <tr>
        <td>${o.order_number || o.id}</td>
        <td><strong>${o.client_name}</strong><br><small>${o.client_email}</small></td>
        <td>${o.service_type || 'N/A'}</td>
        <td><span class="status ${o.status || 'pending'}">${o.status || 'pending'}</span></td>
        <td>$${o.estimated_cost || 0}</td>
        <td class="actions">
          <button class="btn-assign" onclick="assignOrder('${o.id}')"><i class="fas fa-user-plus"></i> Assign</button>
        </td>
      </tr>`).join('');
    container.innerHTML = rows;
  }

  window.assignOrder = async function(orderId) {
    try {
      // Fetch available transcribers
      const res = await fetch(`${API_BASE}/transcribers`);
      if (!res.ok) throw new Error('Failed to load transcribers');
      const transcribers = (await res.json()).data || [];

      if (!transcribers.length) {
        showAlert('error', 'No transcribers available for assignment');
        return;
      }

      // Simple prompt for now (can be enhanced with dropdown)
      const transcriberOptions = transcribers.map(t => `${t.id}: ${t.name}`).join('\n');
      const selected = prompt(`Select transcriber:\n${transcriberOptions}`);
      if (!selected) return;

      const transcriberId = selected.split(':')[0].trim();

      // Assign order
      const assignRes = await fetch(`${API_BASE}/admin/orders/${orderId}/assign`, {
        method: 'PUT',
        headers: headers(),
        body: JSON.stringify({ transcriberId })
      });

      if (!assignRes.ok) throw new Error('Failed to assign order');

      showAlert('success', 'Order assigned successfully');
      refreshOrders();
      refreshDashboard();
    } catch (e) {
      console.error(e);
      showAlert('error', 'Could not assign order');
    }
  };

  // Users
  async function refreshUsers() {
    try {
      setLoading(true);
      if (OFFLINE_MODE) {
        const localUsers = JSON.parse(localStorage.getItem('users') || '[]');
        renderUsers(localUsers);
        return;
      }
      const res = await fetch(`${API_BASE}/admin/users`, { headers: headers() });
      if (!res.ok) throw new Error('Failed to load users');
      const json = await res.json();
      renderUsers(json.data || []);
    } catch (e) {
      console.warn('Users fallback:', e?.message || e);
      OFFLINE_MODE = true;
      const localUsers = JSON.parse(localStorage.getItem('users') || '[]');
      renderUsers(localUsers);
    } finally { setLoading(false); }
  }

  function renderUsers(list) {
    const container = $('#usersContent');
    if (!container) return;
    if (!list.length) {
      container.innerHTML = `<tr><td colspan="4" class="empty-state"><i class="fas fa-users"></i><h3>No Users Found</h3><p>Users will appear here once added to the system.</p></td></tr>`;
      return;
    }
    const rows = list.map(u => `
      <tr>
        <td>${u.username}</td>
        <td>${u.role}</td>
        <td>${new Date(u.created_at).toLocaleString()}</td>
        <td class="actions">
          <button class="btn-edit" onclick="editUser('${u.id}')"><i class="fas fa-edit"></i> Edit</button>
          <button class="btn-delete" onclick="deleteUser('${u.id}')"><i class="fas fa-trash"></i> Delete</button>
        </td>
      </tr>`).join('');
    container.innerHTML = rows;
  }

  window.editUser = function(userId) {
    // TODO: Implement edit functionality
    showAlert('info', 'Edit functionality coming soon');
  };

  window.deleteUser = async function(userId) {
    if (!confirm('Are you sure you want to delete this user?')) return;
    try {
      const res = await fetch(`${API_BASE}/admin/users/${userId}`, {
        method: 'DELETE',
        headers: headers()
      });
      if (!res.ok) throw new Error('Failed to delete user');
      showAlert('success', 'User deleted successfully');
      refreshUsers();
    } catch (e) {
      console.error(e);
      showAlert('error', 'Could not delete user');
    }
  };

  window.saveUser = async function(ev) {
    ev.preventDefault();
    const username = $('#userUsername').value.trim();
    const password = $('#userPassword').value.trim();
    const role = $('#userRole').value;
    if (!username || !password || !role) {
      showAlert('error', 'All fields are required');
      return;
    }
    try {
      setLoading(true);
      const res = await fetch(`${API_BASE}/admin/users`, {
        method: 'POST',
        headers: headers(),
        body: JSON.stringify({ username, password, role })
      });
      if (!res.ok) throw new Error('Failed to save user');
      showAlert('success', 'User added successfully');
      closeModal('userModal');
      $('#userForm').reset();
      refreshUsers();
    } catch (e) {
      console.error(e);
      showAlert('error', 'Could not add user');
    } finally { setLoading(false); }
  };

  // Transcribers
  async function refreshTranscribers() {
    try {
      setLoading(true);
      if (OFFLINE_MODE) {
        const localTranscribers = JSON.parse(localStorage.getItem('transcribers') || '[]');
        renderTranscribers(localTranscribers);
        return;
      }
      const res = await fetch(`${API_BASE}/transcribers`);
      if (!res.ok) throw new Error('Failed to load transcribers');
      const json = await res.json();
      renderTranscribers(json.data || []);
    } catch (e) {
      console.warn('Transcribers fallback:', e?.message || e);
      OFFLINE_MODE = true;
      const localTranscribers = JSON.parse(localStorage.getItem('transcribers') || '[]');
      renderTranscribers(localTranscribers);
    } finally { setLoading(false); }
  }

  function renderTranscribers(list) {
    const container = $('#transcribersContent');
    if (!container) return;
    if (!list.length) {
      container.innerHTML = `<tr><td colspan="5" class="empty-state"><i class="fas fa-headset"></i><h3>No Transcribers Found</h3><p>Transcribers will appear here once added to the system.</p></td></tr>`;
      return;
    }
    const rows = list.map(t => `
      <tr>
        <td><strong>${t.name}</strong></td>
        <td>${t.email}</td>
        <td>${t.specialization || 'General'}</td>
        <td><span class="status available">Available</span></td>
        <td>$${t.hourly_rate || 0}/hr</td>
      </tr>`).join('');
    container.innerHTML = rows;
  }

  window.saveTranscriber = async function(ev) {
    ev.preventDefault();
    const name = $('#transcriberName').value.trim();
    const email = $('#transcriberEmail').value.trim();
    const phone = $('#transcriberPhone').value.trim();
    const specialization = $('#transcriberSpecialty').value;
    const hourlyRate = $('#transcriberRate').value;
    if (!name || !email || !specialization) {
      showAlert('error', 'Name, email, and specialization are required');
      return;
    }
    try {
      setLoading(true);
      const res = await fetch(`${API_BASE}/transcribers`, {
        method: 'POST',
        headers: headers(),
        body: JSON.stringify({ name, email, phone, specialization, hourlyRate })
      });
      if (!res.ok) throw new Error('Failed to save transcriber');
      showAlert('success', 'Transcriber added successfully');
      closeModal('transcriberModal');
      $('#transcriberForm').reset();
      refreshTranscribers();
    } catch (e) {
      console.error(e);
      showAlert('error', 'Could not add transcriber');
    } finally { setLoading(false); }
  };

  // Real-time updates
  function startRealTimeUpdates() {
    setInterval(() => {
      refreshDashboard();
      if (document.querySelector('#orders-tab.active')) refreshOrders();
      if (document.querySelector('#users-tab.active')) refreshUsers();
      if (document.querySelector('#transcribers-tab.active')) refreshTranscribers();
    }, 30000); // 30 seconds
  }

  // Initialize
  document.addEventListener('DOMContentLoaded', function() {
    loadUserInfo();
    refreshDashboard();
    startRealTimeUpdates();

    // Tab switching
    $all('.tab').forEach(btn => {
      btn.addEventListener('click', function() {
        const tab = this.dataset.tab;
        if (tab === 'orders') refreshOrders();
        else if (tab === 'users') refreshUsers();
        else if (tab === 'transcribers') refreshTranscribers();
      });
    });
  });

})();