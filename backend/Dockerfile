FROM node:20.12-alpine3.19 AS build
WORKDIR /app
COPY package*.json ./
RUN npm ci

FROM node:20.12-alpine3.19
WORKDIR /app
COPY --from=build /app/node_modules ./node_modules
COPY package*.json ./
COPY src/ ./src/
RUN npm cache clean --force
USER node
EXPOSE 3000
CMD ["node", "src/app.js"]
