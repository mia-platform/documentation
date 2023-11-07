---
id: request-size
title: "Advanced API Gateway: Requests Size"
sidebar_label: Requests size
---
## How Controlling Request Sizes

:::info
**Definition**  
The req size is the maximum value of the payload body size associated with the request.
:::

**Default size**

In our platform the default size is 1m

```
client_max_body_size 1m;

```

**Change the default size**

Through our extension you can easily change this value by changing the value.

For example:

```
client_max_body_size 10m;

```

:::info
If you put **0** value any size is accepted
:::

**How can you change the default size for all the request?**

Action:

1. Go to **Section: api-gateway/request-size.conf**

2. To change the value just enter the following string and choose the value you want to set:

```
client_max_body_size 10m;

```

**How can you change only the backoffice request size?**

Action:

1. Go to **Section: api-gateway/backoffice-root-location-extension.conf**

2. To change the value just enter the following string and choose the value you want to set:

```
client_max_body_size 16k;

```

**How can you change a specific root?**

Action:

1. Go to **Section: api-gateway/root-location-extension.conf**

2. Here you fill find an empty file.

To change the value just enter the following string and choose the value you want to set:

```
location ~ "^/example" {
  client_max_body_size 1m;

  proxy_pass http://$proxy_name$proxy_url;
}
```

In this case you change the req size for all the locations starting with /example path.
:::info
Since the `proxy_pass` variable is not inherited inside the location block, you must define it again. In case of a change in `proxy_name` or `proxy_url` variables names this configuration will not work.
:::
