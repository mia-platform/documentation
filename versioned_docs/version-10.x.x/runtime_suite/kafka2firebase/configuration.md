---
id: configuration
title: Kafka2Firebase Configuration
sidebar_label: Configuration
---
To use this plugin you only need to deploy the docker image eu.mia-platform.eu/plugins/kafka2firebase with the environment 
variables of your system and create a config map with the Google credential given by Firebase (see the file example 
google-credential.example.json).

The environment variables needed are:

* `HTTP_PORT`: the port of the service
* `SERVICE_VERSION`: the service version
* `KAFKA_HOST`: the host of kafka
* `KAFKA_TOPICS`: the list of the kafka topics to which take the messages. They must be separated by comma, ex KAFKA_TOPICS=topi1,topic2
* `KAFKA_CONSUMER_GROUP_ID`: the name of the group of this project
* `KAFKA_SECURITY_PROTOCOL`: e.g. SASL_SSL
* `KAFKA_AUTH_MECHANISM`: authentication mechanism, used only if `KAFKA_USERNAME` and `KAFKA_PASSWORD` have a value (e.g. PLAIN, SCRAM-SHA-256, SCRAM-SHA-512)
* `KAFKA_USERNAME`
* `KAFKA_PASSWORD`
* `AUTO_OFFSET_RESET`: the kafka setting for the reset
* `HEADERS_TO_PROXY`: the headers you want to send with the hooks. This env can be null, in this case no header will
be pass with the call. Note that can be null but not empty string, if you don't need headers don't set this variable.
The format of the headers need to be `name:value,name:value`, ex HEADERS_TO_PROXY=secret:1234,client:app
* `OK_URL`: the url to cal if the push is sent correctly. As for headers can be null but not empty. The url need 
to be well formatted, ex: http://endpoint-to-call/ok
* `KO_URL`: the url to cal if the push is not sent correctly. As for headers can be null but not empty. The url need 
to be well formatted, ex: http://endpoint-to-call/ko
* `GOOGLE_APPLICATION_CREDENTIALS`: the location of the file credentials given by Firebase, ex `/home/app/google-credential.json`.
For putting this file inside the project use the k8s config map.

Note that the firebase credentials can be put in wherever position you want and the file can be called as you prefer,
but remember to specify the entire location of the file in the GOOGLE_APPLICATION_CREDENTIALS env variable.

The OK and KO requests send a body composed as the kafka message received. This means that it will contain the message id, 
the push, the topics and the devices token, but in this case only one between devices tokens and topics has a value according
to the kind of push that has been sent. 

Once you prepared the service, the deployment with the env variables specified above and the config map with the google 
application credentials, you can deploy and start using the plugin.
