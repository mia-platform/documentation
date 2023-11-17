---
id: configuration
title: Configuration
sidebar_label: Configuration
---
In order to configure the Teleconsultation Service with the console you need to deploy two services: the Teleconsultation Service Backend and the Teleconsultation Service Frontend. Both are available in the marketplace.

Configure the Teleconsultation Service Backend following [this guide][teleconsultation-service-be] before using the Teleconsultation Service Frontend.

## Endpoint configuration

In order to make the route accessible to the page where the teleconsultation will take place, you need to create an additional **endpoint** to expose that route.

Example:
1. Custom **endpoint** to expose teleconsultation-service-fe: `/telecons-fe`

## Config Map (optional)

The teleconsultation-service-fe normally does not require any config map. But, if you plan to embed the teleconsultation-service-fe inside an iframe or web-view, you might run into a CSP error ([Content Security Policy][mdn-csp]). To avoid this error you could set the right Content Security Policy through the config map.


<details>
<summary>Example of config map that implement a custom CSP</summary>

```
location / {
  include /etc/nginx/security.d/cross-site_script.conf;
  add_header 'Content-Security-Policy' "default-src 'self'; frame-src https://sandbox.bandyer.com https://<YOUR_PROD_BASE_PATH>.bandyer.com; script-src 'self' https://cdn.bandyer.com https://static.bandyer.com https://<YOUR_PROD_BASE_PATH>.bandyer.com 'unsafe-eval'; connect-src 'self' https://sandbox.bandyer.com https://<YOUR_PROD_BASE_PATH>.bandyer.com wss://sandbox.bandyer.com wss://<YOUR_PROD_BASE_PATH>.bandyer.com 'unsafe-eval'; object-src 'none'; style-src 'self' 'unsafe-inline'; img-src 'self' https://static.bandyer.com; font-src 'self'" always;
  
  expires $expires;

  try_files $uri $uri/index.html /index.html =404;
}
```

</details>

:::note
Mount your config map in the right place in order to override the default one, e.g.: `/etc/nginx/conf.d/website.conf`.
:::


[mdn-csp]: https://developer.mozilla.org/en-US/docs/Web/HTTP/CSP
[teleconsultation-service-be]: ../../runtime_suite/teleconsultation-service-backend/overview
