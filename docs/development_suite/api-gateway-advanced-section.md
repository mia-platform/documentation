# API Gateway - Advanced section

## How Controlling Request Sizes

**Definition**

The req size is the maximum value of the payload body size associated with the request.
In our platform the default size is 1Kbyte

Through our extension you can easily change this value.

**How can you change the default size for all the request?**

Action:

1. Access the API console and go to the advanced section

2. Go to **Section: api-gateway/request-size.conf**

3. Here you fill find an empty file.

To change the value just enter the following string and choose the value you want to set:

```
client_max_body_size 16k;

```

If you put **0** value any size is accepted

**How can you change a specific root?**

Action:

1. Access the API console and go to the advanced section

2. Go to **Section: api-gateway/root-location-extension.conf**

3. Here you fill find an empty file.

To change the value just enter the following string and choose the value you want to set:

```
location/example {
  client_max_body_size 16k;
}
```
In this case you change the req size only for the /example location
If you put **0** value any size is accepted

**How can you change only the backoffice request size?**

Action:

1. Access the API console and go to the advanced section

2. Go to **Section: api-gateway/backoffice-root-location-extension.conf**

3. Here you fill find an empty file.

To change the value just enter the following string and choose the value you want to set:

```
client_max_body_size 16k;

```

If you put **0** value any size is accepted
