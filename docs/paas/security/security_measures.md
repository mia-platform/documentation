---
id: security_measures
title: Security Measures
sidebar_label: Security measures
---

## Authentication and Authorization

Authentication and Authorization are two utterly distinct crucial processes used in conjunction with each other to protect the access to a resource. They are the first line of defense to prevent confidential data from falling into the wrong hands, thus they are a critical part of Mia-Platform organization’s overall security strategy.

Authentication and Authorization can clearly be explained with a real-world scenario that is the airport security check: you *authenticate* your identity by showing your ID, while they *authorize* you to board your flight only when you present your boarding pass to the flight attendant.

## Authentication

Authentication basically determines whether users are who they claim to be, thus it focuses on the question *"who are you?"*. Usually, authentication is done before authorization, and it transmits info through an ID Token.

While user identity has historically been validated using the combination of a username and password, today’s best authentication methods rely on the concept of *passwordless authentication*, with the aim of improving both the security and the user experience. In fact, requiring employees to maintain different login credentials for each different application used in their day-to-day work is not only annoying, it is also inefficient. Therefore, a centralized login system has become a necessity.

### Single sign-on (SSO)

Single sign-on (SSO) process allows users or clients to log in to one domain, and thereby be provided automatic authentication to another domain without further interaction. SSO works based upon a trust relationship (based upon a certificate) set up between an application, known as the *service provider*, and an *identity provider* (the system that stores the digital identities). In this way, the identity provider (IdP) passes an assertion (often via an identity standard/protocol such as SAML) to authenticate the user for the Service Provider (SP).

The main benefit of using SSO is that users can move quickly, yet still securely, between applications and services. SSO has many other benefits, including increased productivity, improved security, and enhanced customer experience.

Mia-Platform is currently using Okta Single Sign-On enabled through different protocols and standard such as SAML, LDAP, and OIDC.

### Authorization

Authorization determines what users can and cannot access, thus it focuses on the question *"can you do that?"*. Usually it is done after successful authentication, and it transmits info through an Access Token. The process of gaining authorization is called *access control*. There are two main methods for managing access control for your systems:

- Role-Based Access Control (RBAC);
- Attribute-Based Access Control (ABAC).

The key difference between RBAC and ABAC is RBAC provides access to resources or information based on user **roles and privileges**, while ABAC provides access rights based on user, environment, or resource **attributes**.

Mia-Platform uses RBAC in its authorization flow, providing its employees with varying levels of access based on their roles and responsibilities. This protects sensitive data and ensures they can only access information they need.

Thus, for instance, some users may be assigned to a role where they can write and edit specific files, whereas other users may be in a role restricted to reading but not editing files. This method is effective because the policies don’t need to be changed every time a person leaves or joins Mia-Platform, so it reduces administrative work and improves compliance.

For more details, visit our page about [Mia-Platform authorization flow](/console/project-configuration/authorization-flow.md).

##  TLS Encryption

Mia-Platform network traffic is protected by Transport Layer Security (TLS). All the traffic to our Kubernetes clusters is managed by Traefik Ingress Controller, and it is configured to handle HTTPS requests. By default, TLS 1.2 is the recommended minimum TLS version with a minimum key length of 128 bits.

The following ciphersuites are supported by default:  

- TLS_AES_128_GCM_SHA256
- TLS_AES_256_GCM_SHA384
- TLS_CHACHA20_POLY1305_SHA256
- TLS_ECDHE_ECDSA_WITH_AES_128_GCM_SHA256
- TLS_ECDHE_RSA_WITH_AES_128_GCM_SHA256
- TLS_ECDHE_ECDSA_WITH_AES_256_GCM_SHA384
- TLS_ECDHE_RSA_WITH_AES_256_GCM_SHA384
- TLS_ECDHE_ECDSA_WITH_CHACHA20_POLY1305
- TLS_ECDHE_RSA_WITH_CHACHA20_POLY1305
- TLS_ECDHE_RSA_WITH_AES_128_CBC_SHA
  
TLS certificates are automatically generated using Let's Encrypt. Traefik is configured to use Let's Encrypt to automatically generate and renew the certificates for Mia-Platform domains. By default, Traefik manages 90 days certificates, and starts to renew certificates 30 days before they expire.

For more information about Let's Encrypt certificates compatibility, visit [Let's Encrypt documentation](https://letsencrypt.org/docs/certificate-compatibility/).

## Internal Testing

Mia-Platform performs regular risk assessments internally, which involve identifying and analyzing technical vulnerabilities and examining business risks and concerns.

## External Testing

We account on external professional companies to perform rigorous penetration testing practices on the Console.
Tests are performed at least twice per calendar year.

Customers adopting our product might undergo supplementary external penetration tests performed by external companies. The deliverables resulting from such activities might be shared with Mia Platform when vulnerabilities concerning our product are discovered and need treatment.

Application-level security tests follow a standard application assessment methodology (e.g. OWASP with scores leveraging the CVSS framework).

## Vulnerability Management

Mia-Platform implements a central ticketing system that tracks all security issues until remediation. Our implementation consists of patches to the OS and the applications on a regular schedule and on need-to-update basis, in accordance with the CVSS (Common Vulnerability Scoring System).

We define development tasks, bug fixes, and new features as issues for specific target releases, deploying them to production only after completing requisite checkpoints such as quality assurance testing, staged deployment, and review.
