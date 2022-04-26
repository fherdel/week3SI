FROM node:12-alpine

WORKDIR /usr/src/app

COPY . .

COPY ./package.json .

ENV REACT_APP_ENDPOINT=http://192.168.252.39:3001

RUN npm install

EXPOSE 3000

CMD ["npm", "start"]