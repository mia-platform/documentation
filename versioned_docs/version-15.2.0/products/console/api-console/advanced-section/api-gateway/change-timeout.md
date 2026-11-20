---
id: change-timeout
title:  "Advanced API Gateway: Change timeout"
sidebar_label: Change timeout
---
## Timeout definitions

:::info Definition
The timeout of a request is the maximum time that the api-gateway will wait before interrupt the request.
:::

### Default timeout

The default timeout is set by default to **60 seconds**.

```
proxy_connect_timeout 60s;
proxy_read_timeout 60s;
proxy_send_timeout 60s;
```

Each timeout property has its own meaning and you should modify one or more of them based on your goal.

For more information about the different timeout meanings, check the official _nginx_ documentation:

- [proxy_connect_timeout](https://nginx.org/en/docs/http/ngx_http_proxy_module.html#proxy_connect_timeout)
- [proxy_read_timeout](https://nginx.org/en/docs/http/ngx_http_proxy_module.html#proxy_read_timeout)
- [proxy_send_timeout](https://nginx.org/en/docs/http/ngx_http_proxy_module.html#proxy_send_timeout)

## Change the default timeout

Through `rate-limit-usage` extension you can easily change one or more of the previous described properties.

For example:
```
proxy_connect_timeout 120s;
proxy_read_timeout 180s;
proxy_send_timeout 120s;
```

or, using the environment variables:
```
proxy_connect_timeout {{API_GATEWAY_CONNECT_TIMEOUT}}s;
proxy_read_timeout {{API_GATEWAY_READ_TIMEOUT}}s;
proxy_send_timeout {{API_GATEWAY_SEND_TIMEOUT}}s;
```

### How can you change the default timeout for all the requests?

Action:

1. Go to **Advanced Section: api-gateway/rate-limit-usage.conf**

2. To change the value just enter one or more of the properties described above and choose the value you want to set:

```
proxy_connect_timeout 120s;
proxy_read_timeout 180s;
proxy_send_timeout 120s;
```
