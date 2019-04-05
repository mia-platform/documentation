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

### Certificate Service ###

This microservice manages the creation of the SSL certificates needed by Nginx to allow https connections to the cluster.
