FROM node:14-alpine as build

WORKDIR /builder

COPY package*.json ./

COPY front/package*.json ./front/

RUN npm install && cd ./front && npm install

COPY . .

RUN npm run build && cd ./front && npm run build

FROM node:14-alpine

ENV NODE_ENV=production
ENV HTTP_PORT=3000
ENV SMTP_PORT=25

WORKDIR /app

COPY package*.json ./

RUN npm ci

COPY --from=build /builder/build ./build
COPY --from=build /builder/front/build ./front/build

EXPOSE ${HTTP_PORT} ${SMTP_PORT}

CMD [ "node", "build/index.js" ]