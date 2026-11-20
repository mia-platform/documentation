---
id: cert-manager
title:  Cert-Manager
sidebar_label: Cert-Manager
---
cert-manager is a tool useful to manage certificates in your Kubernetes cluster. It is available in the 
PaaS and it adds TLS Certificates and Issuers as Kubernetes resources.
With cert-manager you can:

- Generate new certificates
- Renew Certificates
- Use the Certificates in your application

## Resources

The resources made available by cert-manager are the *Certificate* and *Issuer/ClusterIssuer*.

### Certificates

The Certificate resource represent a single TLS certificate, that is provided by the specified Issuer.

```yaml
apiVersion: cert-manager.io/v1
kind: Certificate
metadata:
  name: example-com
  namespace: sandbox
spec:
  secretName: example-com-tls
  issuerRef:
    name: ca-issuer
    kind: Issuer
    # At least one of a DNS Name, URI, or IP address is required.
    dnsNames:
        - example.com
        - www.example.com
```

### Issuer

Issuers (and ClusterIssuers) is the cert-manager way to define a Signing Authority in Kubernetes.

A simple example of Issuer is the CA type, you can found below an example taken from the official documentation [[1](https://cert-manager.io/docs/concepts/issuer/)]

```yaml
apiVersion: cert-manager.io/v1
kind: Issuer
metadata:
  name: ca-issuer
  namespace: mesh-system
spec:
  ca:
    secretName: ca-key-pair
```
In this example, the Issuer uses a key-pair to generate encrypted certificates.

For more detailed configuration options you can go to the cert-manager documentation [[2](https://cert-manager.io/docs)].

## Use cert-manager on the PaaS

The first step to use a custom DNS, is to register it creating a *CNAME* record that points to your project's endpoint.
You can find the project endpoint in the "Project Overview" area, under *Runtime Environments*.

After registering the DNS, there are two methods to start generating your certificate:
- Define your Issuer and Certificates
- Use Mia-platform ClusterIssuer to generate your certificate

### Defining Issuer and Certificates

If you want to create an authority that can sign your certificates, you need an Issuer (ClusterIssuers are not supported on the PaaS). After creating the Issuer, you can reference it in the Certificate specifications.

Issuers can be of various types (CA, self-signed, Vault..) depending on which signing authority you want to leverage to generate the Certificates. Below we explore an example of certificate of the ACME[[3]](https://cert-manager.io/docs/configuration/acme/http01/) type, with an HTTP01 solver.

```yaml
apiVersion: cert-manager.io/v1
kind: Issuer
metadata:
  name: example-issuer
  labels:
    app.kubernetes.io/managed-by: mia-platform
spec:
  acme:
    server: https://acme-staging-v02.api.letsencrypt.org/directory
    privateKeySecretRef:
      name: example-issuer-account-key
    solvers:
    - http01:
        ingress:
          class: nginx
```

Once creating an Issuer, you can start generating Certificates referencing it.

```yaml
apiVersion: cert-manager.io/v1
kind: Certificate
metadata:
  labels:
    app.kubernetes.io/managed-by: mia-platform
  name: example-name
  namespace: example-ns
spec:
  commonName: '*.example.io'
  dnsNames:
  - '*.example.io'
  issuerRef:
    kind: Issuer
    name: example-issuer
  secretName: example-cert
```

### Leveraging the cluster certificate

Thanks to the preconfigured ClusterIssuer on the Mia Platform PaaS, you can generate production-ready certificates without having to think about your Issuer.

The ClusterIssuer present in the PaaS leverages LetsEncrypt to generate certificates through a challenge http01.

You can issue a Certificate referencing the ClusterIssuer present in the PaaS. Below an example.

```yaml
apiVersion: cert-manager.io/v1
kind: Certificate
metadata:
  labels:
    app.kubernetes.io/managed-by: mia-platform
  name: example-name
  namespace: example-ns
spec:
  commonName: example.com
  dnsNames:
  - example.com
  - example2.com
  issuerRef:
    kind: ClusterIssuer
    name: cert-manager-issuer
  secretName: example-cert
```

## Deploying resources

When deploying cert-manager resources, you can decide if you want to have them in a specific environment or in every one of them. This is accomplished creating the resources in the right project folders.

### Deploy in every Environment

'deploying in every Environment' means that the resources that you have created to manage Cert-manager will be deployed singularly in every Environment/Namespace of your project.
To achieve this result, you need to identify if your project template uses default Kubernetes resource or Kustomize structure, and then save the resources in the correct path.
- **Base project:** The resources need to be saved in the path `configuration/<resource.yaml>`
- **Kustomize project:** The resources need to be saved in the path `configuration/<resource.yaml>`

### Deploy in a specific Environment

Depending which template you are using:
- **Base project:** The resources need to be saved in the path `configuration/<environmentId>/<resource.yaml>` 
- **Kustomize project:** The resources need to be saved in the path `overlays/<environmentId>/<resource.yaml>`

Where *environmentId* is a variable identified with the parameter *envId* configured on the console. 

