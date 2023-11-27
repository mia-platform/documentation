---
id: traefik
title:  Traefik
sidebar_label: Traefik
---
If your project is situated on Mia-Platform PaaS, you can immediately take advantage of a Traefik installation to fulfill all your networking needs.

But what can you do exactly with Traefik?
- Expose endpoints with ease and route traffic to your services (through the api-gateway);
- Configure various middlewares, such as basic authentication for specific pages, forwards or whitelists;
- Set up TLS connections with a simple configuration.

To configure TLS capabilities in the PaaS, you can check our Cert-Manager [Documentation](./cert-manager.md).


In order to configure the routing to your services, you need to create a DNS records pointing to the public IP address exposed by Traefik. Once the DNS is set up correctly, you can start writing Traefik configuration files to set up the rest.

## Expose an endpoint

The YAML configuration file responsible to route traffic to your services is the `IngressRoute`. The service where we route the traffic will always be the `api-gateway`. 
You can check a `IngressRoute` example configuration below: 

```yaml
apiVersion: traefik.containo.us/v1alpha1
kind: IngressRoute
metadata:
  name: default-ingress
  labels:
    app.kubernetes.io/instance: "ingress-controller"
spec:
  entryPoints:
    - websecure
  routes:
    - match: Host(`<host>`)
      middlewares:
        - name: ingress-controller-hsts-headers
          namespace: mia-platform
        - name: "<middleware-name>"
          namespace: <middleware-namespace>
      kind: Rule
      services:
        - name: api-gateway
          port: 8080
  tls:
    secretName: <tls-secret>
```
You will need to valorize the fields contained in the angle brackets (`<>`):
- **host:** the hostname that you want to expose (e.g. example.com) 
- **middleware-name:** The name of the Traefik Middleware resource that you want to apply
- **middleware-namespace:** The nama of the namespace where the middleware has been created
- **tls-secret:** the name of the secret containing the tls certificate

:::info
You need to include the middleware `ingress-controller-hsts-headers` to allow clients to upgrade the connection to https.
:::
:::info
The label `app.kubernetes.io/instance: "ingress-controller"` is necessary in this resources to let Traefik discover them.
:::

This configuration need to be put in the intended Environment configuration folder of your project, it differs between *Base projects* and *Kustomize projects*.
- **Base project:** The resource needs to be saved in the path `configuration/<environmentId>/<resource.yaml>`.
- **Kustomize project:** The resource needs to be saved in the path `overlays/<environmentId>/<resource.yaml>`.

## Middlewares

Traefik implements a number of Middlewares[[1](https://doc.traefik.io/traefik/middlewares/overview/)] that are available for everyone on the PaaS to use. The Traefik resource to use in this case is the `Middleware` resource and it may be created in the environment where the `Ingressroute` is placed, but it is possible to refer to `Middlewares` from other environments.

Below a simple example of `Basic Authentication`, a `Middleware` useful to set a username-password authentication to selected endpoints.
First of all, you need to create a resource `Middleware` in your configuration folder (if you want to create it in every Environment) or in the path `configuration/<environmentId>/<resource.yaml>` if you want to create it in an Environment of a Base project, or in the path `overlays/<environmentId>/<resource.yaml>` if you want to create it in a specific environment in a Kustomize project.

```yaml
apiVersion: traefik.containo.us/v1alpha1
kind: Middleware
metadata:
  name: test-auth
  labels:
    app.kubernetes.io/instance: "ingress-controller"
spec:
  basicAuth:
    secret: authsecret
```
Above an example of Middleware. (to make it work, this specific middleware also needs a secret with the credentials [[1](https://doc.traefik.io/traefik/middlewares/http/basicauth/)])

:::info
Also in middlewares the label `app.kubernetes.io/instance: "ingress-controller"` is needed. 
:::

## TLS Configuration

To enable TLS for an your hostname is necessary to create a TLS Certificate and store it as secret in the environment where the `Ingressroute` is present.

To create the certificate in the PaaS, you can use the Cert-Manager instance already present in the cluster, you can find more on that in the dedicated section.

After creating the certificate, you can select it in the section `tls/SecretName` in the `IngressRoute` resource.

```yaml
tls:
    secretName: <tls-secret>
```

### TLSOptions

When deploying resources of type `IngressRoute` in Mia-platform's PaaS, you have to your disposal various `TLSOptions` files that can be used as pre-made set of configurations.

The `TLSOptions` ready to be used are:
- `ingress-controller-old-tls`: supports older clients and TLS 1.0
- `ingress-controller-modern-tls`: drops support for older clients and supports only TLS 1.3
- `ingress-controller-intermediate-tls`: the balanced option, optimal to achieve A+ on [SSLLabs](https://www.ssllabs.com/ssltest/) test

Note: If you do not specify a TLSOption, the intermediate is applied by default. 

You can use these `TLSOptions` in your `IngressRoute` by specifying them in your configuration:

```yaml
tls:
    options:
      name: ingress-controller-old-tls
      namespace: mia-platform
```
Note: These resources are deployed in the namespace `mia-platform`

In addition, you can deploy your personal `TLSOption` and then refer it in the same way in your Traefik resources.

### Leaving the TLS block empty
It is also possible to leave the TLS block empty when building your `IngressRoute`. Doing so, your `IngressRoute` will use a default certificate issued for the cluster, created to match:
- '*.cloud.mia-platform.eu'
- '*.cms-cloud.mia-platform.eu'

In the production cluster, and:

- '*.test.mia-platform.eu'
- '*.preprod.mia-platform.eu'
- '*.demo.mia-platform.eu'
- '*.cms-demo.mia-platform.eu'
- '*.cms-test.mia-platform.eu'
- '*.cms-preprod.mia-platform.eu'

In the development cluster.

## Managing multiple DNS records

If you want multiple access points for the users to the API exposed in your Project, you can create a new DNS record pointing to another IP exposed by Traefik. 

This configuration is useful if you want to achieve, for example:
- a set of APIs exposed only inside the Kubernetes Cluster - by creating Traefik's new IP as private;
- different DNSs for managing different access points based on the clients - achieving multichannel API management.

To achieve this result, you need to add a new entry into the `routes` array, specifying the new host that will receive calls. An example of configuration is below:

```yaml
apiVersion: traefik.containo.us/v1alpha1
kind: IngressRoute
metadata:
  name: default-ingress
  labels:
    app.kubernetes.io/instance: "ingress-controller"
spec:
  entryPoints:
    - websecure
  routes:
    - match: Host(`<host-1>`)
      middlewares:
        - name: ingress-controller-hsts-headers
          namespace: mia-platform
        - name: "<middleware-name>"
          namespace: <middleware-namespace>
      kind: Rule
      services:
        - name: api-gateway
          port: 8080
    - match: Host(`<host-2>`)
      middlewares:
        - name: ingress-controller-hsts-headers
          namespace: mia-platform
        - name: "<middleware-name>"
          namespace: <middleware-namespace>
      kind: Rule
      services:
        - name: api-gateway
          port: 8081
  tls:
    secretName: <tls-secret>
```

In the example, Traefik will forward requests to the `api-gateway` to the appropriate port based on the host that has been called.

### Managing API Exposition

With the multiple DNS configuration, you can rely on Rules to decide to not expose specific APIs to unwanted DNS (check [Traefik Rules](https://doc.traefik.io/traefik/routing/routers/#rule)).

To achieve this result, you need to update the `match` condition of the `route` entry as the following example:

```yaml
match: Host(`<host-1>`) && !Path(`/api/v1`)
```

In the example above, you are requesting Traefik to block the requests for the API exposed via the URI `/api/v1` when the host of the request is `<host-1>`.
In this way, you are ensuring that the `/api/v1` will only be served if the called host is different from the one defined in the rules.

:::caution
The management of the API exposition will be available directly from the Mia-Platform Console in the following versions of the Products via the `Listeners` feature!

Be aware that this feature will only be available if you are using the [Envoy API Gateway](/runtime_suite/envoy-api-gateway/overview.md). 

If you are using the [Nginx API Gateway](/runtime_suite/api-gateway/10_overview.md), or you want to edit the hosts used for exposing the APIs from your Project, you will need to manually edit the `default.ingressroute.yml` file.
:::
