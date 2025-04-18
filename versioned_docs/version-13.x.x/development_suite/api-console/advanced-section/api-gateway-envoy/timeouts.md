---
id: timeouts
title: 'Envoy Use Case: Timeouts'
sidebar_label: 'Use Case: Timeouts'
---

Envoy provides many different options to manage the timeouts of your application, both at HTTP connection manager and route level:

- HTTP connection manager (stream timeouts):
  - `request_timeout`
  - `request_headers_timeout`
  - `stream_idle_timeout`
  - `max_stream_duration`
- Route timeouts:
  - `timeout`
  - `idle_timeout`
  - `per_try_timeout`
  - `per_try_idle_timeout`

In our Envoy API Gateway configuration, the request timeout is handled via the `stream_idle_timeout` and the `idle_timeout` properties, since we need to deal with streaming responses. Therefore, in this guide we will focus on how to configure these fields. If you want to know more about the other timeouts listed above, you are encouraged to visit the [official Envoy documentation](https://www.envoyproxy.io/docs/envoy/latest/faq/configuration/timeouts) on this matter.

To prioritize the afore-mentioned properties, the `request_timeout` and route `timeout` have been disabled by default. On the other hand, `request_headers_timeout` is set to 30 seconds.

### Change the listener's `stream_idle_timeout`

The `stream_idle_timeout` of our Envoy API Gateway defaults to 60 seconds. To change this value, you can use the extension to patch arbitrary listeners properties. The following example sets this timeout to 5 minutes for the frontend listener:

```yaml
- listener_name: frontend
  'filter_chains.0.filters.0.typed_config.stream_idle_timeout': '300s'
```

### Change the route's `idle_timeout`

The `idle_timeout` property overwrites the `stream_idle_timeout` defined at the HTTP connection manager level. As a consequence, you can customize your stream timeout per route without touching the global settings.

To tune this timeout for a route, you will need to add the endpoint via extension, as illustrated [here](/development_suite/api-console/advanced-section/api-gateway-envoy/extensions.md#endpoints). Let's assume you want to increase to 2 minutes the timeout of a specific frontend route. The endpoint extension will look as follows:

```yaml
- listener_name: frontend
  match:
    headers:
    - name: ':method'
      string_match:
        safe_regex:
          google_re2: {}
          regex: ^(GET)$
    prefix: /endpoint/route/
  route:
    timeout: 0s
    idle_timeout: 120s
    prefix_rewrite: /route/
    cluster: my-upstream
```

By setting `timeout` to `0s`, we are disabling the default request timeout of the route (which would be equal to 15 seconds if left unset). Then, through the `idle_timeout` property, we are overwriting the `stream_idle_timeout` for this route and increasing it to 120 seconds.

:::info
Similarly to the `timeout` property, if you want to disable the `stream_idle_timeout` for a specific route, you can set the corresponding `idle_timeout` to `0s`.
:::
