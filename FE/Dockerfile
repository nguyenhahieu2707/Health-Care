# Image để build Vite app
FROM node:20-alpine AS builder

WORKDIR /app

COPY package*.json ./
COPY vite.config.js ./
COPY . .

RUN npm install
RUN npm run build

# Image để serve frontend
FROM nginx:alpine

COPY --from=builder /app/dist /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
