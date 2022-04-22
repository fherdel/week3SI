## App Dockerizada
```sh
# Build de las imagenes
docker build --platform linux/amd64 -t racarlosdavid/dsu_frontend_chatapp .
docker build --platform linux/amd64 -t racarlosdavid/dsu_backend_chatapp .

# Push al registry
docker push racarlosdavid/dsu_frontend_chatapp
docker push racarlosdavid/dsu_backend_chatapp

# Para prueba local de los contenedores

docker network create mysupernetwork

docker run -d -p 27017:27017 --name dbmongo -v ~/mongo/data:/data/db --network mysupernetwork mongo

docker run -d -p 3000:3000 --name dsu_backend_chatapp --network mysupernetwork  \
    -e REACT_APP_BACKEND_URL=http://192.168.1.13:3001  \
    racarlosdavid/dsu_frontend_chatapp

docker run -d -p 3001:3001 --name dsu_backend_chatapp --network mysupernetwork \
    -e MONGO_URL=dbmongo \
    -e TOKEN_SECRET=Rocinante92129Alpha \
    racarlosdavid/dsu_backend_chatapp
```

```sh
# Lista las imagenes de los so disponibles
gcloud compute images list
```