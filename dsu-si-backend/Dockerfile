FROM node:12-alphine
WORKDIR /usr/src/app
COPY ./package.json ./
RUN npm install
EXPOSE 3001
CMD ["node", "app.js"]