# ==========================================
# Stage 1: Build the React Client Frontend
# ==========================================
FROM node:20-alpine AS client-builder

WORKDIR /app/client

# Copy package manifests and install frontend dependencies
COPY client/package*.json ./
RUN npm install

# Copy source code and build production bundle
COPY client/ ./
RUN npm run build

# ==========================================
# Stage 2: Production Server Runtime
# ==========================================
FROM node:20-alpine AS runner

WORKDIR /app/server

ENV NODE_ENV=production
ENV PORT=5000

# Copy server package manifests and install production dependencies
COPY server/package*.json ./
RUN npm install --omit=dev

# Copy server source code
COPY server/ ./

# Copy compiled frontend assets from client-builder
COPY --from=client-builder /app/client/dist /app/client/dist

# Expose server port
EXPOSE 5000

# Health check
HEALTHCHECK --interval=30s --timeout=5s --start-period=5s --retries=3 \
  CMD wget --no-verbose --tries=1 --spider http://localhost:5000/api/health || exit 1

# Start backend server
CMD ["node", "server.js"]
