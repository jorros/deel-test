FROM node:18.11-slim

COPY package*.json ./
COPY swagger.json .
ADD src src

RUN npm ci

CMD [ "node", "src/server.js" ]