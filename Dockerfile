# Use Node.js LTS version
FROM node:18-alpine

# Set working directory
WORKDIR /app

# Copy package files first
COPY package.json ./
COPY package-lock.json ./

# Install dependencies
RUN npm install --production

# Copy the main server file
COPY backend-server.js ./

# Create data directory
RUN mkdir -p /app/data

# Expose port
EXPOSE 3001

# Set environment variable
ENV NODE_ENV=production
ENV PORT=3001

# Start the application
CMD ["node", "backend-server.js"]
