# Frontend Dockerfile
FROM node:18-alpine AS base

# Install pnpm
RUN npm install -g pnpm

# Set working directory
WORKDIR /app

# Copy package files
COPY pnpm-workspace.yaml ./
COPY package.json ./
COPY frontend/package.json ./frontend/
COPY shared/package.json ./shared/

# Install dependencies
RUN pnpm install --frozen-lockfile

# Copy source code
COPY shared/ ./shared/
COPY frontend/ ./frontend/

# Build shared package
WORKDIR /app/shared
RUN pnpm build

# Build frontend
WORKDIR /app/frontend
RUN pnpm build

# Production stage
FROM node:18-alpine AS production

# Install pnpm
RUN npm install -g pnpm

WORKDIR /app

# Copy package files
COPY pnpm-workspace.yaml ./
COPY package.json ./
COPY frontend/package.json ./frontend/
COPY shared/package.json ./shared/

# Install production dependencies only
RUN pnpm install --frozen-lockfile --prod

# Copy built applications
COPY --from=base /app/shared/dist ./shared/dist
COPY --from=base /app/shared/package.json ./shared/
COPY --from=base /app/frontend/.next ./frontend/.next
COPY --from=base /app/frontend/next.config.mjs ./frontend/
COPY --from=base /app/frontend/package.json ./frontend/
COPY --from=base /app/frontend/public ./frontend/public

# Set working directory to frontend
WORKDIR /app/frontend

# Expose port
EXPOSE 3000

# Start the application
CMD ["pnpm", "start"]
