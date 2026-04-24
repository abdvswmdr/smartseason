FROM node:20.12-alpine3.19 AS build
WORKDIR /app
COPY package-lock.json package.json ./
COPY frontend/package.json ./frontend/
RUN npm ci --workspace=frontend
COPY frontend/ ./frontend/
RUN npm run build --workspace=frontend

FROM nginx:1.25-alpine
COPY --from=build /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 5173
