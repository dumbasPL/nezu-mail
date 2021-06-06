FROM node:16-alpine

WORKDIR /usr/src/app

COPY package*.json ./

COPY front/package*.json ./front/

RUN npm install && cd ./front && npm install

COPY . .

RUN cd ./front && npm run build

EXPOSE 3000

CMD [ "npm", "start" ]