### Client Proxy ###

The image consists of a nginx.conf file that applies the format of the registers and the basic settings.
It also provides a secure.conf file that implements the best SSL security practice to include in the required server declaration. The path is /etc/nginx/secure.conf.
The SSL configuration is based on the availability of three files within the / etc / usr / ssl / directory:

- dhparam: a Diffie-Helman key generated with at least 2048 bits (4096 bits are a bit slow at this time)

- sslcrt: the certificate for SSL configuration

- sslkey: the private key for SSL configuration

By default the Nginx server will look for the server declaration within the .conf file within the /etc/nginx/conf.d directory.
To write the various server declarations, you must follow the [official Nginx documentation](https://nginx.org/en/docs/).
