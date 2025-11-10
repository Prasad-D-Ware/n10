FROM node:22-alpine

WORKDIR /frontend

COPY package* .

RUN npm i -g bun

RUN bun install

COPY . .

EXPOSE 5173

CMD ["bun", "dev"]