# ---------- Build Angular ----------
FROM node:20-alpine AS build

WORKDIR /app

COPY frontend/package*.json ./
RUN npm install

COPY frontend/ .
RUN npm run build

# ---------- Runtime: Nginx ----------
FROM nginx:alpine

# ลบ default config
RUN rm /etc/nginx/conf.d/default.conf

# ใส่ nginx config ของเรา
COPY nginx/nginx.conf /etc/nginx/conf.d/default.conf

# เอา Angular build มาใส่
COPY --from=build /app/dist/browser  /usr/share/nginx/html

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
