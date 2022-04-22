FROM node:lts-alpine
ENV REACT_APP_IP_POINT=192.168.0.7
WORKDIR /usr/src/app
COPY . .
RUN npm install
EXPOSE 3000
CMD ["npm", "start"]
