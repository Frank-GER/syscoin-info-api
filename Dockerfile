FROM node:24-bookworm-slim

WORKDIR /app

COPY package.json ./

COPY package-lock.json ./

RUN npm ci

COPY ./index.js ./index.js
COPY ./config.js ./config.js

EXPOSE 3000

CMD ["node", "index.js"]
