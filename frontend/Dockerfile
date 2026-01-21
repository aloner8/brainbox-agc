# ---------- Stage 1: Build ----------
FROM node:20-alpine AS build
WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .
RUN npm run build

# ---------- Stage 2: Nginx ----------
FROM nginx:alpine

# ⚠️ แก้ชื่อตรงนี้ให้ตรงกับ angular.json
# dist/<project-name>/browser
COPY --from=build /app/dist/browser /usr/share/nginx/html

COPY nginx.conf /etc/nginx/conf.d/default.conf
