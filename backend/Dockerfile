# Portfolio Backend (Node/Express) - Production Dockerfile
# Platform: linux/amd64

FROM node:20-alpine AS builder
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci
COPY tsconfig.json ./
COPY src ./src
RUN npm run build

FROM node:20-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
COPY package.json package-lock.json ./
RUN npm ci --omit=dev
COPY --from=builder /app/dist ./dist
EXPOSE 4000
ENV PORT=4000
# MONGODB_URI, FRONTEND_URL set at runtime
CMD ["node", "dist/index.js"]
