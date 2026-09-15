---
id: configuration
title: Atlas Dashboard Authenticator
sidebar_label: Configuration
---
This plugin takes care of the authentication of Atlas Charts when embedded in a backoffice tab. 

The login route make it possible to display an authenticated dashboard by returning a signed JWT.

NOTE: works only with `bk-atlas-dashboard` component from `back-kit`.

## Architecture

The microservice contains a configurable login REST Api which returns a signed JWT based on the secret specified in the configuration. The call to be performed to that route has to be a GET.

## Configuration

### Environment Variables

* AUTH_SECRET (required): the secret needed to sign the returned JWT
* LOGIN_ENDPOINT (optional): the route for the authentication (default value `/login`)
