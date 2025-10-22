# Use Node.js LTS version
FROM node:18-alpine

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm install --production

# Copy application files
COPY backend-server.js ./
COPY *.js ./

# Create data directory
RUN mkdir -p data

# Expose port
EXPOSE 3001

# Start the application
CMD ["node", "backend-server.js"]
