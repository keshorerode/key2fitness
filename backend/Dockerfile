# ============================================
# Stage 1: Build — install deps & compile TS
# ============================================
FROM node:20-alpine AS builder

WORKDIR /app

# Copy package files first (layer caching)
COPY package.json package-lock.json ./

# Install ALL deps (including devDependencies for tsc)
RUN npm ci

# Copy source code & TypeScript config
COPY tsconfig.json ./
COPY src/ ./src/

# Compile TypeScript → dist/
RUN npm run build

# ============================================
# Stage 2: Runtime — slim production image
# ============================================
FROM node:20-alpine AS runner

WORKDIR /app

ENV NODE_ENV=production

# Install only production dependencies
COPY package.json package-lock.json ./
RUN npm ci --omit=dev

# Copy compiled JS from builder
COPY --from=builder /app/dist ./dist

# Copy the CMS data file (seed data for first run)
COPY cms-data.json ./

# Create data directory for persistent storage
RUN mkdir -p /app/data

EXPOSE 5000

CMD ["node", "dist/index.js"]
