## API Gateway ##

The API Gateway is the microservice responsible for routing requests to the correct service.
It also manages authentication, performs access control and rate limiting.

Its main features are:

* URL Mapping
* Rate Limit
* Http Secure Headers
* Request Dispaching
* Secret Management API
* Http Utilities
* Proxy-Pass Plain
* SSL Encryption
* URL Rewriting

The service is composed by default from multiple nginx servers, 2 listening on ports 80 and 8080, 4 listening on unix sockets to return the error messages.

Port 80 is used for application routing, while the backoffice is exposed to 8080.

![](img/gateway.PNG)

### Client Proxy ###

The image consists of a nginx.conf file that applies the format of the registers and the basic settings.
It also provides a secure.conf file that implements the best SSL security practice to include in the required server declaration. The path is /etc/nginx/secure.conf.
The SSL configuration is based on the availability of three files within the / etc / usr / ssl / directory:

- dhparam: a Diffie-Helman key generated with at least 2048 bits (4096 bits are a bit slow at this time)

- sslcrt: the certificate for SSL configuration

- sslkey: the private key for SSL configuration

By default the Nginx server will look for the server declaration within the .conf file within the /etc/nginx/conf.d directory.
To write the various server declarations, you must follow the [official Nginx documentation](https://nginx.org/en/docs/).

### Certificate Service ###

This microservice manages the creation of the SSL certificates needed by Nginx to allow https connections to the cluster.
