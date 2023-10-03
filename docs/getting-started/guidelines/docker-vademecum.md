---
id: docker-vademecum
title:  Docker Vademecum
sidebar_label: Docker Vademecum
---
## Why Docker

[The purpose of Docker](https://www.docker.com/why-docker#copy1) is to make it easier to create, deploy, and run applications using **containers**. Containers allow the developer to package an application with all the necessary parts (libraries and other related resources) and deliver it as a single package.

Thanks to Containers, the developer is certain that the application will run on any Linux machine, regardless of any customization of the settings of that same machine. In fact, without Containers, if the settings of the machine hosting the Container are different from the settings of the machine that was used for writing the application (or for testing the code), compatibility issues may occur.

:::tip
If you are not familiar with containers and you want to know more about it, read our blog post: [Containerization explained: run your code on any infrastructure](https://blog.mia-platform.eu/en/containerization-explained-run-your-code-on-any-infrastructure).
:::

## Installation

Below you can find some guidelines on how to install Docker on your machine, according to the OS you are using.

### Linux

For Linux users there are 3 different alternatives to install Docker:

- [Tutorial for those who have never used Docker](https://docs.docker.com/get-started/);
- **Generic script provided by docker**: `curl -sSL https://get.docker.com/ | sh`;
- For those who want to follow the [specific instructions](https://docs.docker.com/install/) on their operating system.

### MacOS

If you have a MacOS machine, follow the steps below:

1. Download and Install [Docker Community Edition](https://www.docker.com/products/docker-engine);
2. Once installed, click on the icon and start the app: `docker run hello-world`.

### Windows

If you are using Windows, you will need to install Docker Desktop. Please refer to the official [Docker documentation](https://docs.docker.com/desktop/install/windows-install/).

## Basic Commands - Life Cycle

* `docker create` creates a container but does not start it.
* `docker rename` allows you to rename the container.
* `docker run` creates and starts a container in one operation.
* `docker rm` deletes a container.
* `docker update` updates the resource limits of a container.

## Start and Stop

* `docker start` starts a container so that it is running.
* `docker stop` stops a running container.
* `docker restart` stops and starts a container.
* `docker pause` pauses a working container, "freezing it" instead.
* `docker unpause` reactivates a paused container.
* `docker wait` blocks until the container stops.
* `docker kill` sends a SIGKILL to a running container.
* `docker attach` will connect to a working container.

## Information

* `docker ps` shows the working containers.
* `docker logs` gets the logs from the container.
* `docker inspect` gets all the information about a container (including the IP address).
* `docker events` gets events from the container.
* `docker port` shows the public port of the container.
* `docker top` shows the processes running in the container.
* `docker stats` shows statistics on the use of container resources.
* `docker diff` shows the modified files in the container's filesystem.
* `docker ps -a` shows the working and stopped containers.
* `docker stats --all` shows the list of running containers.

## Import / Export

* `docker cp` copies files or folders between a container and the local filesystem.
* `docker export` transforms the container filesystem into the tarball archive stream in STDOUT.

## Docker images

The images are container templates. [At this link](https://docs.docker.com/engine/docker-overview/) you can find more information about images.

* `docker images` shows all images.
* `docker import` creates an image from a tarball.
* `docker build` creates an image from Dockerfile.
* `docker commit` creates an image from a container, temporarily interrupting it if it is running.
* `docker rmi` removes an image.
* `docker load` loads an image from a tar archive like STDIN, including images and tags (starting at 0.7).
* `docker save` saves an image in a tar archive stream on STDOUT with all levels, tags and parent versions (starting at 0.7).
* `docker history` shows the history of the image.
* `docker tag` tags an image with a name (local or registry).

:::tip
For further useful tips, visit this [link](https://github.com/wsargent/docker-cheat-sheet#dockerfile).
:::
