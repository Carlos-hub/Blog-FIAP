FROM node:23-alpine

WORKDIR /usr/src/app

COPY package*.json ./
RUN npm ci

COPY . .

ENV NODE_ENV=production
ENV PORT=3000

EXPOSE 3000

CMD ["npx", "ts-node", "src/server.ts"]

