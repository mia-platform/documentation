---
id: generate
title: Generation Configuration
sidebar_label: Generate
---



The `generate` command is used to generate secrets and configmaps from a configuration `.yaml`, interpolating it
with environment variables when necessary and saves the generated files in a specified directory.

The configuration file supports environment variable interpolation following the regular expression `{{[A-Z0-9_]+}}`.
The interpolation works in the same way described in the [interpolate](/runtime_suite_tools/mlp/50_interpolate.md) guide.  
The file has a `secrets` section where the keys `tls`,`docker`, and`data` are mutually exclusive and a
`config-maps` section where the only section supported is `data`.

An configuration file example can be like this:

```yaml
secrets:
- name: tls-secret
  when: once
  tls:
    cert:
      from: literal
      value: value
    key:
      from: file
      file: /path/to/file
      value: value
- name: docker-pull-secret
  when: always
  docker:
    username: username
    password: password
    email: emal@example.com
    server: example.com
- name: secret-name
  when: always
  data:
  - from: file
    file: ./path/to/file
    key: key
config-maps:
- name: config-map-name
  when: always
  data:
  - from: literal
    key: key
    value: value
```

## Details

We will going more in depth on the meaning and possible values of the various sections of the configuration file.

## `secrets` and `config-maps`

These sections are the more obvious ones, and they are used to indicate what type of Kubernetes resource you want to
generate.  
`secrets` will generate one or more `Secret` resource and `config-maps` will generate one or more `ConfigMap`.

## `when`

The `when` option will accept only the value of `once` and `always`. Omitting the key or setting to another value
will fallback on the `always`value.

This key is used during apply time, and if set to `once` will generate a configuration with a particular annotation
that will apply the generated file only if a resources of the same kind, name and namespace is not already present
on the remote Kubernetes cluster.  
This option can be useful for generating resources with placeholder values that will be updated from other tools but
are necessary for the correct rollout of other resources that might depends of them. A tipical application
can be a `Secret` resource of `tls` type that contains a tls that will be handled by an external tools for keeping it
updated before the end of the valid timestamp.

## `data`

The `data` block is the only valid block for a `ConfigMap` resource and one of the valid one for the `Secret`
resource.  
This block is used for setting one or more key in the resource using literal values or files.

The `from` key can be one of `literal` or `file` and is used to select where to find the value used to popolate `key`
in the final resource. If the value is `literal` the `value` key is used and its values is used; in the other case the
`file` key is used as path to find the file to load for the value. The path can be absolute or relative to the folder
where the command will be launched.

## `docker`

The `docker` block is a special block valid only for `secrets` and will generate a Kubernete `Secret` of type
`kubernetes.io/dockerconfigjson` that can be used as an `ImagePullSecret` for setting authorization to one or more
docker registries.  
The four keys `username`, `password`, `email` and `server` are used for generate the json configuration and must
contains a valid authorized user for the given `server` url of a remote repository.

## `tls`

The `tls` block is the last supported type of `secrets` and will generate a Kubernetes `Secret` of type
`kubernetes.io/tls`. This secret is usually used to set a certificate/private key pair for a TLS connection like
exposing an HTTPS connection for an `Ingress` the keys of the object are always `tls.crt` for the certificate and
`tls.key` for the private key.

The values can be passed by file or directly in the configuration, but we highly recommend to use files for avoiding
to accidentally leak sensible data.
