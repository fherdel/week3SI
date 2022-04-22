FROM node:lts-alpine
ENV IP_POINT=192.168.0.7
WORKDIR /usr/src/app
COPY . .
RUN npm install
EXPOSE 3001
CMD ["npm", "start"]
