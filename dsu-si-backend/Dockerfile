FROM node:16.3.0-alpine
WORKDIR /dsu-si-backend
COPY . .
RUN npm install
ENV MONGO_URL localhost
EXPOSE 3001
CMD ["npm","start"]