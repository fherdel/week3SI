FROM node:17-alpine


WORKDIR /usr/src/app

COPY . .

COPY ./package.json .

ENV SECRET=Bruno
ENV MONGO=mongodb://192.168.252.39:27017/admin

RUN npm install

EXPOSE 3001

CMD ["npm", "start"]
