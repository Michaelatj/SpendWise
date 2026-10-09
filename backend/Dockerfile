# Use official Node.js runtime image (Alpine for lightweight image size)
FROM node:20-alpine

# Set working directory inside container
WORKDIR /app

# Copy package management files first for efficient layer caching
COPY package*.json ./

# Install production dependencies only
RUN npm ci --only=production

# Copy application source code
COPY . .

# Expose backend API port
EXPOSE 5000

# Set default environment variables
ENV NODE_ENV=production \
    PORT=5000

# Command to run the application
CMD ["npm", "start"]
