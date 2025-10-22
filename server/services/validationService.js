const bcrypt = require('bcryptjs');

class ValidationService {
  // Email validation
  static validateEmail(email) {
    if (!email) {
      return { isValid: false, error: 'Email is required' };
    }
    
    // Basic email regex validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return { isValid: false, error: 'Please provide a valid email address' };
    }
    
    if (email.length > 255) {
      return { isValid: false, error: 'Email address is too long' };
    }
    
    return { isValid: true };
  }

  // Password validation
  static validatePassword(password, options = {}) {
    const {
      minLength = 6,
      requireUppercase = false,
      requireLowercase = false,
      requireNumbers = false,
      requireSpecialChars = false
    } = options;

    if (!password) {
      return { isValid: false, error: 'Password is required' };
    }

    if (password.length < minLength) {
      return { isValid: false, error: `Password must be at least ${minLength} characters long` };
    }

    if (password.length > 128) {
      return { isValid: false, error: 'Password is too long' };
    }

    if (requireUppercase && !/[A-Z]/.test(password)) {
      return { isValid: false, error: 'Password must contain at least one uppercase letter' };
    }

    if (requireLowercase && !/[a-z]/.test(password)) {
      return { isValid: false, error: 'Password must contain at least one lowercase letter' };
    }

    if (requireNumbers && !/\d/.test(password)) {
      return { isValid: false, error: 'Password must contain at least one number' };
    }

    if (requireSpecialChars && !/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
      return { isValid: false, error: 'Password must contain at least one special character' };
    }

    return { isValid: true };
  }

  // Name validation
  static validateName(name, fieldName = 'Name') {
    if (!name) {
      return { isValid: false, error: `${fieldName} is required` };
    }

    if (typeof name !== 'string') {
      return { isValid: false, error: `${fieldName} must be a string` };
    }

    if (name.trim().length < 2) {
      return { isValid: false, error: `${fieldName} must be at least 2 characters long` };
    }

    if (name.length > 100) {
      return { isValid: false, error: `${fieldName} is too long` };
    }

    if (!/^[a-zA-Z\s\-'\.]+$/.test(name)) {
      return { isValid: false, error: `${fieldName} contains invalid characters` };
    }

    return { isValid: true };
  }

  // Phone number validation
  static validatePhone(phone) {
    if (!phone) {
      return { isValid: true }; // Phone is optional
    }

    // Remove all non-digit characters
    const cleanPhone = phone.replace(/\D/g, '');
    
    if (cleanPhone.length < 10) {
      return { isValid: false, error: 'Phone number must be at least 10 digits' };
    }

    if (cleanPhone.length > 15) {
      return { isValid: false, error: 'Phone number is too long' };
    }

    return { isValid: true };
  }

  // Service type validation
  static validateServiceType(serviceType) {
    const validTypes = ['legal', 'medical', 'business', 'academic'];
    
    if (!serviceType) {
      return { isValid: false, error: 'Service type is required' };
    }

    if (!validTypes.includes(serviceType)) {
      return { isValid: false, error: 'Invalid service type' };
    }

    return { isValid: true };
  }

  // Turnaround time validation
  static validateTurnaround(turnaround) {
    const validTurnarounds = ['same-day', '24h', '48h', 'standard'];
    
    if (!turnaround) {
      return { isValid: false, error: 'Turnaround time is required' };
    }

    if (!validTurnarounds.includes(turnaround)) {
      return { isValid: false, error: 'Invalid turnaround time' };
    }

    return { isValid: true };
  }

  // Cost validation
  static validateCost(cost) {
    if (!cost) {
      return { isValid: false, error: 'Cost is required' };
    }

    const numCost = parseFloat(cost);
    
    if (isNaN(numCost)) {
      return { isValid: false, error: 'Cost must be a valid number' };
    }

    if (numCost < 0) {
      return { isValid: false, error: 'Cost cannot be negative' };
    }

    if (numCost > 10000) {
      return { isValid: false, error: 'Cost is too high' };
    }

    return { isValid: true };
  }

  // Instructions validation
  static validateInstructions(instructions) {
    if (!instructions) {
      return { isValid: true }; // Instructions are optional
    }

    if (instructions.length > 2000) {
      return { isValid: false, error: 'Instructions are too long (max 2000 characters)' };
    }

    return { isValid: true };
  }

  // Role validation
  static validateRole(role) {
    const validRoles = ['admin', 'transcriber', 'client'];
    
    if (!role) {
      return { isValid: false, error: 'Role is required' };
    }

    if (!validRoles.includes(role)) {
      return { isValid: false, error: 'Invalid role' };
    }

    return { isValid: true };
  }

  // UUID validation
  static validateUUID(uuid) {
    if (!uuid) {
      return { isValid: false, error: 'ID is required' };
    }

    // Basic UUID regex validation
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
    if (!uuidRegex.test(uuid)) {
      return { isValid: false, error: 'Invalid ID format' };
    }

    return { isValid: true };
  }

  // Order status validation
  static validateOrderStatus(status) {
    const validStatuses = ['pending', 'assigned', 'in_progress', 'completed', 'delivered', 'cancelled'];
    
    if (!status) {
      return { isValid: false, error: 'Order status is required' };
    }

    if (!validStatuses.includes(status)) {
      return { isValid: false, error: 'Invalid order status' };
    }

    return { isValid: true };
  }

  // User status validation
  static validateUserStatus(status) {
    const validStatuses = ['active', 'pending', 'suspended', 'inactive'];
    
    if (!status) {
      return { isValid: false, error: 'User status is required' };
    }

    if (!validStatuses.includes(status)) {
      return { isValid: false, error: 'Invalid user status' };
    }

    return { isValid: true };
  }

  // File validation
  static validateFile(file, options = {}) {
    const {
      maxSize = 100 * 1024 * 1024, // 100MB default
      allowedTypes = ['audio/*', 'video/*', 'application/pdf'],
      required = false
    } = options;

    if (!file && required) {
      return { isValid: false, error: 'File is required' };
    }

    if (!file) {
      return { isValid: true };
    }

    // Check file size
    if (file.size > maxSize) {
      return { isValid: false, error: `File size must be less than ${Math.round(maxSize / 1024 / 1024)}MB` };
    }

    // Check file type
    const isValidType = allowedTypes.some(type => {
      if (type.endsWith('/*')) {
        return file.mimetype.startsWith(type.slice(0, -1));
      }
      return file.mimetype === type;
    });

    if (!isValidType) {
      return { isValid: false, error: `File type not allowed. Allowed types: ${allowedTypes.join(', ')}` };
    }

    return { isValid: true };
  }

  // Sanitize input
  static sanitizeInput(input) {
    if (typeof input !== 'string') {
      return input;
    }

    // Basic HTML escaping
    return input
      .trim()
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#x27;');
  }

  // Validate pagination parameters
  static validatePagination(page, limit) {
    const pageNum = parseInt(page) || 1;
    const limitNum = parseInt(limit) || 10;

    if (pageNum < 1) {
      return { isValid: false, error: 'Page number must be greater than 0' };
    }

    if (limitNum < 1 || limitNum > 100) {
      return { isValid: false, error: 'Limit must be between 1 and 100' };
    }

    return { 
      isValid: true, 
      data: { page: pageNum, limit: limitNum } 
    };
  }

  // Comprehensive user registration validation
  static validateUserRegistration(userData) {
    const errors = [];

    // Validate name
    const nameValidation = this.validateName(userData.name, 'Name');
    if (!nameValidation.isValid) {
      errors.push(nameValidation.error);
    }

    // Validate email
    const emailValidation = this.validateEmail(userData.email);
    if (!emailValidation.isValid) {
      errors.push(emailValidation.error);
    }

    // Validate password
    const passwordValidation = this.validatePassword(userData.password, {
      minLength: 6,
      requireUppercase: false,
      requireLowercase: true,
      requireNumbers: true
    });
    if (!passwordValidation.isValid) {
      errors.push(passwordValidation.error);
    }

    // Validate phone if provided
    if (userData.phone) {
      const phoneValidation = this.validatePhone(userData.phone);
      if (!phoneValidation.isValid) {
        errors.push(phoneValidation.error);
      }
    }

    // Validate role
    const roleValidation = this.validateRole(userData.role);
    if (!roleValidation.isValid) {
      errors.push(roleValidation.error);
    }

    return {
      isValid: errors.length === 0,
      errors: errors
    };
  }

  // Comprehensive order validation
  static validateOrder(orderData) {
    const errors = [];

    // Validate client name
    const nameValidation = this.validateName(orderData.clientName, 'Client name');
    if (!nameValidation.isValid) {
      errors.push(nameValidation.error);
    }

    // Validate client email
    const emailValidation = this.validateEmail(orderData.clientEmail);
    if (!emailValidation.isValid) {
      errors.push(emailValidation.error);
    }

    // Validate phone if provided
    if (orderData.clientPhone) {
      const phoneValidation = this.validatePhone(orderData.clientPhone);
      if (!phoneValidation.isValid) {
        errors.push(phoneValidation.error);
      }
    }

    // Validate service type
    const serviceValidation = this.validateServiceType(orderData.serviceType);
    if (!serviceValidation.isValid) {
      errors.push(serviceValidation.error);
    }

    // Validate turnaround
    const turnaroundValidation = this.validateTurnaround(orderData.turnaround);
    if (!turnaroundValidation.isValid) {
      errors.push(turnaroundValidation.error);
    }

    // Validate cost
    const costValidation = this.validateCost(orderData.estimatedCost);
    if (!costValidation.isValid) {
      errors.push(costValidation.error);
    }

    // Validate instructions if provided
    if (orderData.instructions) {
      const instructionsValidation = this.validateInstructions(orderData.instructions);
      if (!instructionsValidation.isValid) {
        errors.push(instructionsValidation.error);
      }
    }

    return {
      isValid: errors.length === 0,
      errors: errors
    };
  }

  // Rate limiting validation (simple implementation)
  static validateRateLimit(identifier, maxRequests = 100, windowMs = 15 * 60 * 1000) {
    // This is a simple in-memory rate limiter
    // In production, you'd use Redis or a proper rate limiting service
    if (!this.rateLimitStore) {
      this.rateLimitStore = new Map();
    }

    const now = Date.now();
    const windowStart = now - windowMs;
    const key = `rate_limit_${identifier}`;

    if (!this.rateLimitStore.has(key)) {
      this.rateLimitStore.set(key, []);
    }

    const requests = this.rateLimitStore.get(key);
    
    // Remove old requests outside the window
    const validRequests = requests.filter(timestamp => timestamp > windowStart);
    
    if (validRequests.length >= maxRequests) {
      return { isValid: false, error: 'Too many requests. Please try again later.' };
    }

    // Add current request
    validRequests.push(now);
    this.rateLimitStore.set(key, validRequests);

    return { isValid: true };
  }
}

module.exports = ValidationService;
