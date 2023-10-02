---
id: auth-architecture
title: Auth Architecture
sidebar_label: Auth Architecture
---

This tutorial aims to explore all the possible auth architectures in a Digital Platform built with Mia-Platform.  
We will explore different scenarios from small to big:

- Simplest auth for m2m (but less secure)? API keys!
- Introduce Identity Provider (IDP)
- Single project: Ingress, API Gateway, Authorization Service, Authentication Service (eventually custom), ID Provider (two scenarios: I already have IDP, I don't have it)
- Second project: Replicate the above
-> Problems
 - auth services are replicated
 - inter-project communication: user resolution would be repeated at runtime; (projects need to know API Keys of other projects)
 - maybe you want to centralize Ingress management and API Keys management in a Single project
 - I want to test my APIs without exposing on the internet
- Use edge gateway(s) to centralize user resolution, API Keys, Ingresses (differentiate Ingresses exposed on the internet vs internal)
- What if I have multiple IDPs but still want to centralize -> exploit edge gateways


