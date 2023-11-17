---
id: request-size
title: "Advanced API Gateway: Requests Size"
sidebar_label: Requests size
---

The API Gateway uses the [default NGINX value](https://nginx.org/en/docs/http/ngx_http_core_module.html#client_max_body_size) of `1MiB`.

:::info Definition 
The _request size_ is the maximum value of the _payload body size_ associated with the request.
:::

If a body exceeds the `client_max_body_size` value, a _413 Request Entity Too Large_ response will be sent to the client.   

## Change the default size

Through the advanced section of the API Gateway is possible to change the default size allowed by client requests.

For example the directive

```
client_max_body_size 10m;
```

will allow for any request to have a request body up until a size of `10 MiB`.

:::tip
If you put **0** as value, then any size of body request will be accepted.
:::

### How can you change the default size for all the request?

1. Go to **Section: api-gateway/request-size.conf**

2. To change the value just enter the following string and choose the value you want to set:

  ```
  client_max_body_size 10m;
  ```

### How can you change only the Microfrontend Composer request size?

1. Go to **Section: api-gateway/backoffice-root-location-extension.conf**

2. To change the value just enter the following string and choose the value you want to set:

  ```
  client_max_body_size 16k;
  ```

  In this case you'll change the maximum request size to `16KiB` only for the endpoints of the Microfrontend Composer Application.


### How can you change only the request size of a specific root?

1. Go to **Section: api-gateway/root-location-extension.conf**

2. Here you fill find an empty file. To change the value just enter the following string and choose the value you want to set:

  ```
  location ~ "^/example" {
    client_max_body_size 1m;

    proxy_pass http://$proxy_name$proxy_url;
  }
  ```
  
  In this case you'll change the request size only for the locations that starts with the   path `/example`.

:::caution 
Since the `proxy_pass` variable is not inherited inside the location block, you must define it again. 

In case of a change in `proxy_name` or `proxy_url` variables names this configuration will not work.
:::
