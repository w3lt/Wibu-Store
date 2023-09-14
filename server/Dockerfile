FROM node:18-alpine

WORKDIR /server

COPY package*.json ./

RUN npm install
RUN npm install -g nodemon

COPY . .

CMD [ "nodemon", "index.js" ]