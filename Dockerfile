FROM node:lts-alpine as build-api

WORKDIR /builder

COPY package.json package-lock.json ./

RUN npm ci

COPY . .

RUN npm run build

FROM node:lts-alpine as build-front

WORKDIR /builder

COPY front/package.json front/package-lock.json ./

RUN npm ci

COPY front .

RUN npm run build

FROM node:lts-alpine

ENV NODE_ENV=production
ENV HTTP_PORT=3000
ENV SMTP_PORT=25

WORKDIR /app

COPY package.json package-lock.json ./

RUN npm ci

COPY --from=build-api /builder/build ./build
COPY --from=build-front /builder/dist ./front/dist

EXPOSE ${HTTP_PORT} ${SMTP_PORT}

CMD [ "node", "build/index.js" ]