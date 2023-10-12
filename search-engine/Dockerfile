FROM node:18-alpine

WORKDIR /search-engine

COPY *.json ./

RUN npm install
RUN npm install -g nodemon
RUN npm install -g ts-node

COPY . .
CMD [ "nodemon" ]