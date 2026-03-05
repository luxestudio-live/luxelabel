# Use official Node.js LTS image
FROM node:20-alpine as builder

# Set working directory
WORKDIR /app

# Copy package files
COPY package.json pnpm-lock.yaml ./

# Install pnpm
RUN npm install -g pnpm

# Install dependencies
RUN pnpm install --frozen-lockfile

# Copy all files
COPY . .

# Build Next.js app
RUN pnpm build

# --- Production image ---
FROM node:20-alpine as runner
WORKDIR /app

# Install pnpm
RUN npm install -g pnpm

# Copy only necessary files from builder
COPY --from=builder /app/package.json ./
COPY --from=builder /app/pnpm-lock.yaml ./
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
COPY --from=builder /app/next.config.mjs ./next.config.mjs
COPY --from=builder /app/node_modules ./node_modules

# Expose port
EXPOSE 8080

# Set environment variable for production
ENV NODE_ENV=production

# Start Next.js app
CMD ["pnpm", "start"]
