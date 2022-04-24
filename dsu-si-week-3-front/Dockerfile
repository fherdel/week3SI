FROM node:16.3.0-alpine
WORKDIR /usr/src/app
COPY . .
COPY ./package.json .
RUN npm install
ENV REACT_APP_ENDPOINT default 
ENV REACT_APP_ENDPOINT_MESSAGES default 
ENV REACT_APP_ENDPOINT_USER default 
ENV REACT_APP_ENDPOINT_LOGIN default 
EXPOSE 3000
CMD ["npm","start"]
