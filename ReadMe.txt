docker build -t robbot .
docker run -d --restart on-failure robbot


docker container stop <container name>
docker container prune
