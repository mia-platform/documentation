---
id: telepresence
title:  Debugging a single service with Telepresence
sidebar_label: Debug a service
---
## Debug Area

In the Debug Area you can see the list of all the microservices developed with Mia-Platform Console.

![Img](img/debug-view.png)

The real potential of this section lies in its connection with telepresence.
Pressing the "Debug" button will in fact display a string to be pasted on your terminal that simulates the behavior of your microservice in a real context.

![Img](img/action-debug.png)

This will allow you to easily test and debug your microservice without compromising the production environments.

## Introduction to Telepresence

Telepresence is an open source tool that lets you run a single service locally, while connecting that service to a remote Kubernetes cluster. This lets developers working on multi-service applications to:

1. Do fast local development of a single service, even if that service depends on other services in your cluster. Make a change to your service, save, and you can immediately see the new service in action.

2. Use any tool installed locally to test/debug/edit your service. For example, you can use a debugger or IDE!

3. Make your local development machine operate as if it's part of your Kubernetes cluster. If you've got an application on your machine that you want to run against a service in the cluster -- it's easy to do.

Telepresence works on both Mac OS X and Linux, with OS-native packages.

## Installing Telepresence

### OS X

On OS X you can install Telepresence by running the following:

```

brew cask install osxfuse
brew install datawire/blackbird/telepresence

```

### Ubuntu 16.04 or later

Run the following to install Telepresence:

```
curl -s https://packagecloud.io/install/repositories/datawireio/telepresence/script.deb.sh | sudo bash
sudo apt install --no-install-recommends telepresence

```

If you are running another Debian-based distribution that has Python 3.5 installable as python3, you may be able to use the Ubuntu 16.04 (Xenial) packages. The following works on Linux Mint 18.2 (Sonya) and Debian 9 (Stretch) by forcing the PackageCloud installer to access Xenial packages.

```

curl -sO https://packagecloud.io/install/repositories/datawireio/telepresence/script.deb.sh
sudo env os=ubuntu dist=xenial bash script.deb.sh
sudo apt install --no-install-recommends telepresence
rm script.deb.sh

```

## Connect to a Kubernetes Cluster and start debugging the microservice

Let's take an example on a test cluster

### 1. Connect to your cluster

```
gcloud container clusters get-credentials your-credential --zone your-zone --project your-project
```

:::info
If you don't have yet installed Google Cloud follow the steps at [this link](https://cloud.google.com/sdk/install)
:::

### 2. Navigate in Kubernetes

```
kubens demo
```

## Node

### 3a. Access to your local source directory

```
cd your-local-source-directory

```

### 4a. Run telepresence and start debugging your-service-node

```

telepresence --swap-deployment your-service-node --expose 3000 --run npm start

```

## Java

### 3b. Access to your local source directory

```
cd your-local-source-directory

```

### 4b. Run telepresence and create env variables

```
telepresence --expose 3000  --swap-deployment your-service-java --env-json your-service-java.json
```

### 5b. Install envfile intellij plugin

[At this link](https://plugins.jetbrains.com/plugin/7861-envfile)

### 6b. Configure Intellij with your service Java JSON as debug configurations

![Img](img/java-intellij.png)

### 7b. Run debug intellij
