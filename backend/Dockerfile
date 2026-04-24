FROM node:20.12-alpine3.19 AS build
WORKDIR /app
COPY package*.json ./
COPY backend/package.json ./backend/
RUN npm ci --workspace=backend

FROM node:20.12-alpine3.19
WORKDIR /app/backend
COPY --from=build /app/node_modules ../node_modules
COPY backend/package.json ./
COPY backend/src/ ./src/
RUN npm cache clean --force
USER node
EXPOSE 3000
CMD ["node", "src/app.js"]
