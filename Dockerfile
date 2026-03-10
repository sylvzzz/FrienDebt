ARG NODE_VERSION=24.13.0

# Stage 1: Build do frontend
FROM node:${NODE_VERSION}-alpine AS frontend
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
ARG VITE_GOOGLE_CLIENT_ID
ENV VITE_GOOGLE_CLIENT_ID=$VITE_GOOGLE_CLIENT_ID
RUN npm run build

# Stage 2: Backend + ficheiros do frontend
FROM node:${NODE_VERSION}-alpine AS backend
ENV NODE_ENV=production
WORKDIR /usr/src/app

COPY server/package*.json ./
RUN npm ci --omit=dev

USER node
COPY server/ .
COPY --from=frontend /app/dist ./public

EXPOSE 3000
CMD ["node", "server.js"]