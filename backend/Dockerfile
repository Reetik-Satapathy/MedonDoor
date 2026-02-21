FROM node:18-alpine

WORKDIR /app

# Copy backend package files
COPY backend/package*.json ./

RUN npm install

# Copy backend files
COPY backend/ ./

# Copy frontend directory
COPY frontend/ ./frontend/

EXPOSE 5000

CMD ["npx", "nodemon", "server.js"]