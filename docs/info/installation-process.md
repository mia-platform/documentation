#Installation Process

Mia s.r.l. is always aware about the installation status of the Mia-platform's suites.
When a customer want to install the platform, Mia provides an installation key.

This key is injected in the cluster configuration.
When the platform starts, the key is hashed and sent to activation serivce, hosted by Mia-platform.
If the key is correct, the service provides the authorization and the platform starts.
Otherwise, the services don't start.
