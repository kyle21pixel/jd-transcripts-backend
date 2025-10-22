class CacheService {
  constructor() {
    this.cache = new Map();
    this.ttl = new Map(); // Time to live for cache entries
    this.defaultTTL = 5 * 60 * 1000; // 5 minutes default
  }

  // Set cache entry with TTL
  set(key, value, ttl = this.defaultTTL) {
    const expiry = Date.now() + ttl;
    this.cache.set(key, value);
    this.ttl.set(key, expiry);
    
    // Clean up expired entries periodically
    this.cleanup();
  }

  // Get cache entry
  get(key) {
    const expiry = this.ttl.get(key);
    
    if (!expiry) {
      return null; // Key doesn't exist
    }
    
    if (Date.now() > expiry) {
      // Entry has expired
      this.delete(key);
      return null;
    }
    
    return this.cache.get(key);
  }

  // Delete cache entry
  delete(key) {
    this.cache.delete(key);
    this.ttl.delete(key);
  }

  // Clear all cache
  clear() {
    this.cache.clear();
    this.ttl.clear();
  }

  // Check if key exists and is not expired
  has(key) {
    const expiry = this.ttl.get(key);
    if (!expiry) return false;
    
    if (Date.now() > expiry) {
      this.delete(key);
      return false;
    }
    
    return true;
  }

  // Get cache size
  size() {
    return this.cache.size;
  }

  // Clean up expired entries
  cleanup() {
    const now = Date.now();
    for (const [key, expiry] of this.ttl.entries()) {
      if (now > expiry) {
        this.delete(key);
      }
    }
  }

  // Cache middleware for Express routes
  middleware(ttl = this.defaultTTL) {
    return (req, res, next) => {
      const key = this.generateCacheKey(req);
      
      // Try to get from cache
      const cached = this.get(key);
      if (cached) {
        return res.json(cached);
      }
      
      // Store original res.json
      const originalJson = res.json.bind(res);
      
      // Override res.json to cache the response
      res.json = (data) => {
        // Only cache successful responses
        if (res.statusCode >= 200 && res.statusCode < 300) {
          this.set(key, data, ttl);
        }
        return originalJson(data);
      };
      
      next();
    };
  }

  // Generate cache key from request
  generateCacheKey(req) {
    const { method, originalUrl, query, user } = req;
    const userId = user?.userId || 'anonymous';
    const queryString = Object.keys(query).length > 0 ? JSON.stringify(query) : '';
    return `${method}:${originalUrl}:${userId}:${queryString}`;
  }

  // Cache database queries
  async cacheQuery(query, params = [], ttl = this.defaultTTL) {
    const key = `query:${query}:${JSON.stringify(params)}`;
    
    const cached = this.get(key);
    if (cached) {
      return cached;
    }
    
    return null; // Query not cached, caller should execute and cache result
  }

  // Cache query result
  cacheQueryResult(query, params = [], result, ttl = this.defaultTTL) {
    const key = `query:${query}:${JSON.stringify(params)}`;
    this.set(key, result, ttl);
  }

  // Cache user data
  cacheUser(userId, userData, ttl = 10 * 60 * 1000) { // 10 minutes
    this.set(`user:${userId}`, userData, ttl);
  }

  // Get cached user
  getCachedUser(userId) {
    return this.get(`user:${userId}`);
  }

  // Cache order data
  cacheOrder(orderId, orderData, ttl = 5 * 60 * 1000) { // 5 minutes
    this.set(`order:${orderId}`, orderData, ttl);
  }

  // Get cached order
  getCachedOrder(orderId) {
    return this.get(`order:${orderId}`);
  }

  // Cache dashboard stats
  cacheStats(userId, stats, ttl = 2 * 60 * 1000) { // 2 minutes
    this.set(`stats:${userId}`, stats, ttl);
  }

  // Get cached stats
  getCachedStats(userId) {
    return this.get(`stats:${userId}`);
  }

  // Cache notifications
  cacheNotifications(userId, notifications, ttl = 1 * 60 * 1000) { // 1 minute
    this.set(`notifications:${userId}`, notifications, ttl);
  }

  // Get cached notifications
  getCachedNotifications(userId) {
    return this.get(`notifications:${userId}`);
  }

  // Invalidate cache patterns
  invalidatePattern(pattern) {
    const regex = new RegExp(pattern);
    for (const key of this.cache.keys()) {
      if (regex.test(key)) {
        this.delete(key);
      }
    }
  }

  // Invalidate user-related cache
  invalidateUserCache(userId) {
    this.invalidatePattern(`user:${userId}`);
    this.invalidatePattern(`stats:${userId}`);
    this.invalidatePattern(`notifications:${userId}`);
  }

  // Invalidate order-related cache
  invalidateOrderCache(orderId) {
    this.invalidatePattern(`order:${orderId}`);
    // Also invalidate stats cache as orders affect stats
    this.invalidatePattern('stats:');
  }

  // Get cache statistics
  getStats() {
    const now = Date.now();
    let expiredCount = 0;
    
    for (const [key, expiry] of this.ttl.entries()) {
      if (now > expiry) {
        expiredCount++;
      }
    }
    
    return {
      totalEntries: this.cache.size,
      expiredEntries: expiredCount,
      activeEntries: this.cache.size - expiredCount,
      memoryUsage: process.memoryUsage()
    };
  }

  // Warm up cache with frequently accessed data
  async warmup(db) {
    try {
      console.log('🔥 Warming up cache...');
      
      // Cache active users
      const [users] = await db.query('SELECT id, name, email, role, status FROM users WHERE status = "active" LIMIT 100');
      users.forEach(user => {
        this.cacheUser(user.id, user);
      });
      
      // Cache recent orders
      const [orders] = await db.query('SELECT * FROM orders ORDER BY created_at DESC LIMIT 50');
      orders.forEach(order => {
        this.cacheOrder(order.id, order);
      });
      
      console.log(`✅ Cache warmed up with ${users.length} users and ${orders.length} orders`);
    } catch (error) {
      console.error('❌ Cache warmup failed:', error);
    }
  }
}

// Create singleton instance
const cacheService = new CacheService();

// Cleanup expired entries every 5 minutes
setInterval(() => {
  cacheService.cleanup();
}, 5 * 60 * 1000);

module.exports = cacheService;




