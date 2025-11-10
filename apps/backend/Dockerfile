FROM node:22-alpine

WORKDIR /backend

COPY /package.json /package.json

RUN npm i -g bun

RUN bun install

COPY . .

EXPOSE 3000

CMD [ "bun", "dev" ]


