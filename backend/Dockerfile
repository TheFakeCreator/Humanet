# Backend Dockerfile
FROM node:18-alpine AS base

# Install pnpm
RUN npm install -g pnpm

# Set working directory
WORKDIR /app

# Copy package files
COPY pnpm-workspace.yaml ./
COPY package.json ./
COPY backend/package.json ./backend/
COPY shared/package.json ./shared/

# Install dependencies
RUN pnpm install --frozen-lockfile

# Copy source code
COPY shared/ ./shared/
COPY backend/ ./backend/

# Build shared package
WORKDIR /app/shared
RUN pnpm build

# Build backend
WORKDIR /app/backend
RUN pnpm build

# Production stage
FROM node:18-alpine AS production

# Install pnpm
RUN npm install -g pnpm

WORKDIR /app

# Copy package files
COPY pnpm-workspace.yaml ./
COPY package.json ./
COPY backend/package.json ./backend/
COPY shared/package.json ./shared/

# Install production dependencies only
RUN pnpm install --frozen-lockfile --prod

# Copy built applications
COPY --from=base /app/shared/dist ./shared/dist
COPY --from=base /app/shared/package.json ./shared/
COPY --from=base /app/backend/dist ./backend/dist
COPY --from=base /app/backend/package.json ./backend/

# Set working directory to backend
WORKDIR /app/backend

# Expose port
EXPOSE 4000

# Start the application
CMD ["pnpm", "start"]
