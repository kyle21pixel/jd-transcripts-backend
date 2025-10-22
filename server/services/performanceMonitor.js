class PerformanceMonitor {
  constructor() {
    this.metrics = {
      requests: {
        total: 0,
        byMethod: {},
        byRoute: {},
        byStatus: {},
        responseTimes: []
      },
      database: {
        queries: 0,
        slowQueries: [],
        connectionPool: {
          active: 0,
          idle: 0,
          total: 0
        }
      },
      cache: {
        hits: 0,
        misses: 0,
        size: 0
      },
      memory: {
        usage: [],
        peak: 0
      },
      errors: {
        total: 0,
        byType: {},
        recent: []
      }
    };
    
    this.startTime = Date.now();
    this.lastCleanup = Date.now();
    
    // Start monitoring
    this.startMonitoring();
  }

  // Start performance monitoring
  startMonitoring() {
    // Monitor memory usage every 30 seconds
    setInterval(() => {
      this.recordMemoryUsage();
    }, 30000);

    // Clean up old metrics every 5 minutes
    setInterval(() => {
      this.cleanupMetrics();
    }, 300000);

    // Log performance summary every hour
    setInterval(() => {
      this.logPerformanceSummary();
    }, 3600000);
  }

  // Record request metrics
  recordRequest(req, res, responseTime) {
    this.metrics.requests.total++;
    
    // By method
    this.metrics.requests.byMethod[req.method] = 
      (this.metrics.requests.byMethod[req.method] || 0) + 1;
    
    // By route
    const route = req.route ? req.route.path : req.path;
    this.metrics.requests.byRoute[route] = 
      (this.metrics.requests.byRoute[route] || 0) + 1;
    
    // By status
    this.metrics.requests.byStatus[res.statusCode] = 
      (this.metrics.requests.byStatus[res.statusCode] || 0) + 1;
    
    // Response times (keep last 1000)
    this.metrics.requests.responseTimes.push(responseTime);
    if (this.metrics.requests.responseTimes.length > 1000) {
      this.metrics.requests.responseTimes.shift();
    }
  }

  // Record database query
  recordDatabaseQuery(query, executionTime) {
    this.metrics.database.queries++;
    
    if (executionTime > 1000) { // Slow query threshold: 1 second
      this.metrics.database.slowQueries.push({
        query: query.substring(0, 100), // Truncate for storage
        executionTime,
        timestamp: Date.now()
      });
      
      // Keep only last 100 slow queries
      if (this.metrics.database.slowQueries.length > 100) {
        this.metrics.database.slowQueries.shift();
      }
    }
  }

  // Record cache hit/miss
  recordCacheHit() {
    this.metrics.cache.hits++;
  }

  recordCacheMiss() {
    this.metrics.cache.misses++;
  }

  // Record error
  recordError(error, req) {
    this.metrics.errors.total++;
    
    const errorType = error.name || 'UnknownError';
    this.metrics.errors.byType[errorType] = 
      (this.metrics.errors.byType[errorType] || 0) + 1;
    
    // Recent errors (keep last 50)
    this.metrics.errors.recent.push({
      type: errorType,
      message: error.message,
      route: req.path,
      method: req.method,
      timestamp: Date.now()
    });
    
    if (this.metrics.errors.recent.length > 50) {
      this.metrics.errors.recent.shift();
    }
  }

  // Record memory usage
  recordMemoryUsage() {
    const usage = process.memoryUsage();
    this.metrics.memory.usage.push({
      timestamp: Date.now(),
      rss: usage.rss,
      heapTotal: usage.heapTotal,
      heapUsed: usage.heapUsed,
      external: usage.external
    });
    
    // Keep only last 100 memory readings
    if (this.metrics.memory.usage.length > 100) {
      this.metrics.memory.usage.shift();
    }
    
    // Track peak memory usage
    if (usage.rss > this.metrics.memory.peak) {
      this.metrics.memory.peak = usage.rss;
    }
  }

  // Get performance metrics
  getMetrics() {
    const uptime = Date.now() - this.startTime;
    const avgResponseTime = this.metrics.requests.responseTimes.length > 0
      ? this.metrics.requests.responseTimes.reduce((a, b) => a + b, 0) / this.metrics.requests.responseTimes.length
      : 0;
    
    const cacheHitRate = this.metrics.cache.hits + this.metrics.cache.misses > 0
      ? (this.metrics.cache.hits / (this.metrics.cache.hits + this.metrics.cache.misses)) * 100
      : 0;

    return {
      uptime,
      requests: {
        ...this.metrics.requests,
        avgResponseTime: Math.round(avgResponseTime),
        requestsPerMinute: Math.round((this.metrics.requests.total / (uptime / 60000)) * 100) / 100
      },
      database: this.metrics.database,
      cache: {
        ...this.metrics.cache,
        hitRate: Math.round(cacheHitRate * 100) / 100
      },
      memory: {
        ...this.metrics.memory,
        current: process.memoryUsage()
      },
      errors: this.metrics.errors
    };
  }

  // Get health status
  getHealthStatus() {
    const metrics = this.getMetrics();
    const issues = [];
    
    // Check response time
    if (metrics.requests.avgResponseTime > 2000) {
      issues.push('High average response time');
    }
    
    // Check error rate
    const errorRate = (metrics.errors.total / metrics.requests.total) * 100;
    if (errorRate > 5) {
      issues.push('High error rate');
    }
    
    // Check memory usage
    const memoryUsagePercent = (metrics.memory.current.rss / (1024 * 1024 * 1024)) * 100; // Convert to GB
    if (memoryUsagePercent > 80) {
      issues.push('High memory usage');
    }
    
    // Check cache hit rate
    if (metrics.cache.hitRate < 50 && metrics.cache.hits + metrics.cache.misses > 100) {
      issues.push('Low cache hit rate');
    }
    
    return {
      status: issues.length === 0 ? 'healthy' : 'degraded',
      issues,
      metrics
    };
  }

  // Clean up old metrics
  cleanupMetrics() {
    const now = Date.now();
    const oneHourAgo = now - (60 * 60 * 1000);
    
    // Clean up old slow queries
    this.metrics.database.slowQueries = this.metrics.database.slowQueries.filter(
      query => query.timestamp > oneHourAgo
    );
    
    // Clean up old errors
    this.metrics.errors.recent = this.metrics.errors.recent.filter(
      error => error.timestamp > oneHourAgo
    );
    
    // Clean up old memory readings
    this.metrics.memory.usage = this.metrics.memory.usage.filter(
      reading => reading.timestamp > oneHourAgo
    );
    
    this.lastCleanup = now;
  }

  // Log performance summary
  logPerformanceSummary() {
    const metrics = this.getMetrics();
    const health = this.getHealthStatus();
    
    console.log('\n📊 Performance Summary (Last Hour)');
    console.log(`🔄 Requests: ${metrics.requests.total} (${metrics.requests.requestsPerMinute}/min)`);
    console.log(`⏱️  Avg Response Time: ${metrics.requests.avgResponseTime}ms`);
    console.log(`🗄️  Database Queries: ${metrics.database.queries}`);
    console.log(`💾 Cache Hit Rate: ${metrics.cache.hitRate}%`);
    console.log(`🧠 Memory Usage: ${Math.round(metrics.memory.current.rss / 1024 / 1024)}MB`);
    console.log(`❌ Errors: ${metrics.errors.total}`);
    console.log(`🏥 Health Status: ${health.status.toUpperCase()}`);
    
    if (health.issues.length > 0) {
      console.log(`⚠️  Issues: ${health.issues.join(', ')}`);
    }
    
    console.log('─'.repeat(50));
  }

  // Middleware for Express
  middleware() {
    return (req, res, next) => {
      const startTime = Date.now();
      
      // Override res.end to capture response time
      const originalEnd = res.end;
      res.end = function(...args) {
        const responseTime = Date.now() - startTime;
        performanceMonitor.recordRequest(req, res, responseTime);
        originalEnd.apply(this, args);
      };
      
      next();
    };
  }

  // Database query wrapper
  wrapDatabaseQuery(queryFn) {
    return async (...args) => {
      const startTime = Date.now();
      try {
        const result = await queryFn(...args);
        const executionTime = Date.now() - startTime;
        this.recordDatabaseQuery(args[0], executionTime);
        return result;
      } catch (error) {
        const executionTime = Date.now() - startTime;
        this.recordDatabaseQuery(args[0], executionTime);
        throw error;
      }
    };
  }

  // Reset metrics
  reset() {
    this.metrics = {
      requests: {
        total: 0,
        byMethod: {},
        byRoute: {},
        byStatus: {},
        responseTimes: []
      },
      database: {
        queries: 0,
        slowQueries: [],
        connectionPool: {
          active: 0,
          idle: 0,
          total: 0
        }
      },
      cache: {
        hits: 0,
        misses: 0,
        size: 0
      },
      memory: {
        usage: [],
        peak: 0
      },
      errors: {
        total: 0,
        byType: {},
        recent: []
      }
    };
    this.startTime = Date.now();
  }
}

// Create singleton instance
const performanceMonitor = new PerformanceMonitor();

module.exports = performanceMonitor;




