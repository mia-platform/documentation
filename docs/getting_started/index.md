# Dockerbox
The **Dockerbox** is the simplest way to deploy a fully functioning and autocontained *Mia Platform Suite* deployment.  
The Docker image is very simple and it contains all the databases and routing logic and ***two*** BaaS instances,
one **global** and one called **dockerbox**. 
The dockerbox instance contains all the custom plugins developed by MIA, the basics themes for handling the data and
the Swagger UI theme for checking the available APIs.

## Getting Started
### Requirements
Install on your computer
- [Docker](https://www.docker.com) Installing via the preferred method for the platform of your choosing.
- [mongoDB](https://www.mongodb.com) This is optional, only if you want persistence between different deployment,
    can be installed locally or via a docker image.

### Login to docker registry
The Docker images for the Mia Platform Suite are hosted on a private registry, if you want pull and/or push access,
plese ask nicely to the Mia Platform Suite maintainers.  
Once your request has been accepted and you have received your credentials you should login with the following commands:

```bash
docker login nexus.mia-platform.eu
username: your choosen username
password: your password
```

### Pull the image
After you had made a successful login, now you can access the images hosted on the Mia Platform registry,
to get the Dockerbox image please execute the following command:
```bash
docker pull nexus.mia-platform.eu/dockerbox:latest
```

The available tags for now are *latest* and *3*.

#### Prepare directories, just for the first time
```bash
mkdir -p ~/baas/custom-plugins ~/baas/custom-themes
```
##### Note for Windows users
You can’t use the `~` character in the path so you have to use the absolute path from one of the volumes on your pc:
```bash
mkdir -p C:\baas\custom-plugins C:\baas\custom-themes
```

## Run the Mia Platform Suite Dockerbox
After you have prepared your environment and pulled the image you are ready to run your first Dockerbox and get ready to
hack things on it. To start you have to run the following command:

```bash
docker run --name dockerbox \
           --detach \
           --publish 9999:9999 \
           --mount type=bind,source="$HOME/baas/custom-themes",target=/var/baas/custom-themes \
           --mount type=bind,source="$HOME/baas/custom-plugins",target=/var/baas/custom-plugins \
           nexus.mia-platform.eu/dockerbox
```

#### Note for Windows users
You can’t use the `~` character in the path so you have to use the absolute path from one of the volume
you have selected to be shared within the Docker environment.
The modified run command supposed you have run the command in [Getting Started](#getting-started) will be:
```
docker run --name dockerbox ^
           --detach ^
           --publish 9999:9999 ^
           --mount type=bind,source=C:\baas\custom-themes,target=/var/baas/custom-themes ^
           --mount type=bind,source=C:\baas\custom-plugins,target=/var/baas/custom-plugins ^
           nexus.mia-platform.eu/dockerbox
```

### Start to Hack!
You are all set! Now you can start to familiarized with the environment, so head to your favorite browser
and type [http://localhost:9999/app_dataentry/](http://localhost:9999/app_dataentry/),
to login in use the following credentials:

```
email: email@email.local
password: makeitapp
key: key
secret: secret
```

For more information about how to use the Data Entry, the Data Modeller or on how to create custom API and themes on
the Mia Platform Suite Dockerbox please head to the documentation at
[https://docs.mia-platform.eu](https://docs.mia-platform.eu).

### Useful Commands
* Reboot the Mia Platform Suite after adding a plugin or a theme for the first time
    `docker exec -it dockerbox pm2 restart all`
* Read the logs `docker exec -it dockerbox pm2 logs 1`


### Use your local mongoDB
This image contains a mongoDB instance. In order to use another one,
you need to figure out which ip is used by docker daemon.

#### mongoDB instance as another docker container
```
docker inspect -f '{{.Name}} - {{.NetworkSettings.IPAddress }}' <your mongo docker container id>
```

The output should be like this
```
/stupefied_babbage - 172.17.0.2
```

So when you run the Dockerbox use this ip as `MONGO_URL` parameter

```
docker run --name dockerbox \
           --detach \
           --env MONGO_URL=172.17.0.2 \
           --env MONGO_PORT=27017 \
           --env MONGO_DB_NAME=dockerbox \
           --publish 9999:9999 \
           --mount type=bind,source="$HOME/baas/custom-themes",target=/var/baas/custom-themes \
           --mount type=bind,source="$HOME/baas/custom-plugins",target=/var/baas/custom-plugins \
           nexus.mia-platform.eu/dockerbox
```
