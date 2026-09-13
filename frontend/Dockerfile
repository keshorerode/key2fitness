# ============================================
# Stage 1: Dependencies
# ============================================
FROM node:20-alpine AS deps

WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci

# ============================================
# Stage 2: Build — compile Next.js app
# ============================================
FROM node:20-alpine AS builder

WORKDIR /app

# Copy deps from previous stage
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Build-time env var (passed via --build-arg or docker-compose)
ARG NEXT_PUBLIC_API_URL

ENV NEXT_PUBLIC_API_URL=$NEXT_PUBLIC_API_URL

# Build the Next.js app (standalone mode)
RUN npm run build

# ============================================
# Stage 3: Runtime — minimal production image
# ============================================
FROM node:20-alpine AS runner

WORKDIR /app

ENV NODE_ENV=production

# Create non-root user for security
RUN addgroup --system --gid 1001 nodejs && \
    adduser --system --uid 1001 nextjs

# Copy only what's needed to run the standalone server
# COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs

EXPOSE 3000

ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

CMD ["node", "server.js"]
