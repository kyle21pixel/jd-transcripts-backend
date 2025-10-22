// Real-Time Integration System
// Provides seamless real-time updates between customer orders and admin dashboards

(function() {
  'use strict';

  // Configuration
  const API_BASE = '/api';
  const WS_URL = window.location.protocol === 'https:' ? 'wss://' : 'ws://' + window.location.host;
  const NOTIFICATION_DURATION = 5000;
  let socket;

  // Global state
  let lastOrderCount = 0;
  let lastOrderIds = new Set();
  let isInitialized = false;

  // Enhanced notification system
  function showRealTimeNotification(type, title, message, duration = NOTIFICATION_DURATION) {
    // Create notification container if it doesn't exist
    let container = document.getElementById('realTimeNotifications');
    if (!container) {
      container = document.createElement('div');
      container.id = 'realTimeNotifications';
      container.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        z-index: 10000;
        max-width: 400px;
      `;
      document.body.appendChild(container);
    }

    // Create notification element
    const notification = document.createElement('div');
    notification.className = `real-time-notification notification-${type}`;
    notification.style.cssText = `
      background: ${type === 'success' ? '#4CAF50' : type === 'info' ? '#2196F3' : type === 'warning' ? '#FF9800' : '#f44336'};
      color: white;
      padding: 16px 20px;
      margin-bottom: 10px;
      border-radius: 8px;
      box-shadow: 0 4px 12px rgba(0,0,0,0.15);
      transform: translateX(100%);
      transition: transform 0.3s ease;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      font-size: 14px;
      line-height: 1.4;
    `;

    const icon = type === 'success' ? '✅' : type === 'info' ? 'ℹ️' : type === 'warning' ? '⚠️' : '❌';
    notification.innerHTML = `
      <div style="display: flex; align-items: center; gap: 10px;">
        <span style="font-size: 18px;">${icon}</span>
        <div>
          <div style="font-weight: 600; margin-bottom: 4px;">${title}</div>
          <div style="opacity: 0.9;">${message}</div>
        </div>
      </div>
    `;

    container.appendChild(notification);

    // Animate in
    setTimeout(() => {
      notification.style.transform = 'translateX(0)';
    }, 100);

    // Auto remove
    setTimeout(() => {
      notification.style.transform = 'translateX(100%)';
      setTimeout(() => {
        if (notification.parentNode) {
          notification.parentNode.removeChild(notification);
        }
      }, 300);
    }, duration);

    // Play notification sound (if available)
    try {
      const audio = new Audio('data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBSuBzvLZiTYIG2m98OScTgwOUarm7blmGgU7k9n1unEiBC13yO/eizEIHWq+8+OWT');
      audio.volume = 0.1;
      audio.play().catch(() => {}); // Silent fail if audio not supported
    } catch (e) {}
  }

  // Enhanced order monitoring
  async function checkForNewOrders() {
    try {
      const response = await fetch(`${API_BASE}/orders`);
      if (!response.ok) return;

      const data = await response.json();
      const orders = data.data || [];
      const currentOrderIds = new Set(orders.map(o => o.orderId || o._id));
      const currentCount = orders.length;

      if (isInitialized) {
        // Check for new orders
        const newOrders = orders.filter(o => !lastOrderIds.has(o.orderId || o._id));
        
        if (newOrders.length > 0) {
          newOrders.forEach(order => {
            showRealTimeNotification(
              'success',
              '🎉 New Order Received!',
              `Order ${order.orderId} from ${order.clientName} - ${order.serviceType} ($${order.estimatedCost})`
            );
          });

          // Trigger refresh in admin dashboards
          if (typeof window.refreshOrders === 'function') {
            window.refreshOrders();
          }
          if (typeof window.refreshDashboard === 'function') {
            window.refreshDashboard();
          }

          // Dispatch custom event for other components
          window.dispatchEvent(new CustomEvent('newOrderReceived', {
            detail: { orders: newOrders, totalCount: currentCount }
          }));
        }

        // Check for order updates
        const updatedOrders = orders.filter(order => {
          const existingOrder = window.lastOrdersCache?.find(o => (o.orderId || o._id) === (order.orderId || order._id));
          return existingOrder && existingOrder.status !== order.status;
        });

        if (updatedOrders.length > 0) {
          updatedOrders.forEach(order => {
            showRealTimeNotification(
              'info',
              '📋 Order Updated',
              `Order ${order.orderId} status changed to: ${order.status}`
            );
          });
        }
      }

      // Update state
      lastOrderCount = currentCount;
      lastOrderIds = currentOrderIds;
      window.lastOrdersCache = orders;
      isInitialized = true;

    } catch (error) {
      console.error('Real-time monitoring error:', error);
    }
  }

  // Enhanced dashboard stats monitoring
  async function updateDashboardStats() {
    try {
      const response = await fetch(`${API_BASE}/admin/dashboard`);
      if (!response.ok) return;

      const data = await response.json();
      const stats = data.data;

      // Update dashboard elements if they exist
      const elements = {
        totalOrders: document.getElementById('totalOrders'),
        pendingOrders: document.getElementById('pendingOrders'),
        processingOrders: document.getElementById('processingOrders'),
        completedOrders: document.getElementById('completedOrders'),
        totalRevenue: document.getElementById('totalRevenue')
      };

      if (elements.totalOrders) elements.totalOrders.textContent = stats.totalOrders || 0;
      if (elements.pendingOrders) elements.pendingOrders.textContent = stats.pendingOrders || 0;
      if (elements.processingOrders) elements.processingOrders.textContent = (stats.inProgressOrders || stats.processingOrders) || 0;
      if (elements.completedOrders) elements.completedOrders.textContent = stats.completedOrders || 0;
      if (elements.totalRevenue) elements.totalRevenue.textContent = stats.totalRevenue ? `$${stats.totalRevenue}` : '$0';

      // Dispatch custom event
      window.dispatchEvent(new CustomEvent('dashboardStatsUpdated', {
        detail: stats
      }));

    } catch (error) {
      console.error('Dashboard stats update error:', error);
    }
  }

  // Initialize real-time system
  function initializeRealTimeSystem() {
    console.log('🔄 Initializing real-time integration system...');

    // Initial check
    checkForNewOrders();
    updateDashboardStats();

    // Set up intervals
    setInterval(checkForNewOrders, REFRESH_INTERVAL);
    setInterval(updateDashboardStats, REFRESH_INTERVAL * 2); // Less frequent for stats

    // Show initialization notification
    setTimeout(() => {
      showRealTimeNotification(
        'success',
        '🚀 Real-Time System Active',
        'Orders will appear instantly across all dashboards'
      );
    }, 1000);

    console.log('✅ Real-time integration system initialized');
  }

  // Enhanced order form submission handler
  function enhanceOrderForm() {
    const orderForm = document.getElementById('order-form');
    if (!orderForm) return;

    const originalSubmitHandler = orderForm.onsubmit;
    
    orderForm.addEventListener('submit', function(e) {
      // Add real-time notification for order submission
      const formData = new FormData(this);
      const customerName = formData.get('name');
      const serviceType = formData.get('service');

      // Show immediate feedback
      showRealTimeNotification(
        'info',
        '📤 Submitting Order...',
        `Processing order for ${customerName} - ${serviceType}`
      );

      // Enhanced success handling
      const originalFetch = window.fetch;
      window.fetch = function(...args) {
        return originalFetch.apply(this, args).then(response => {
          if (args[0].includes('/orders') && response.ok) {
            response.clone().json().then(data => {
              if (data.success) {
                showRealTimeNotification(
                  'success',
                  '🎉 Order Submitted Successfully!',
                  `Order ${data.orderId} created - Check admin dashboards for real-time updates`
                );
                
                // Trigger immediate refresh in admin dashboards
                setTimeout(() => {
                  checkForNewOrders();
                }, 1000);
              }
            });
          }
          return response;
        });
      };
    });
  }

  // Auto-initialize when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      initializeRealTimeSystem();
      enhanceOrderForm();
    });
  } else {
    initializeRealTimeSystem();
    enhanceOrderForm();
  }

  // Export functions for manual use
  window.RealTimeIntegration = {
    checkForNewOrders,
    updateDashboardStats,
    showRealTimeNotification,
    initializeRealTimeSystem
  };

})();