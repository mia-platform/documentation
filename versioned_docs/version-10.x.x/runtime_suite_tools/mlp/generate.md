---
id: generate
title: generate Command
sidebar_label: Generate
---
The `generate` command is used to generate secrets and configmaps from a configuration `.yaml`, interpolating it with environment variables when necessary and saves the generated files in a specified directory.

Flags:
- `--config-file`: config file that contains all ConfigMaps and Secrets definitions
- `--env-prefix`: prefixes to add when looking for environment variables
- `--out`: output directories where interpolated fileNames are saved

The configuration file supports environment variable interpolation following the regular expression `{{[A-Z0-9_]+}}`. The interpolation works in the same way described in the [interpolate](./interpolate.md) command.
The file has a `secrets` section where `tls`,`docker`,`data` are mutually exclusive and a `config-maps` section where the only section supported is `data`. The file has the following schema:

```yaml
secrets:
  - name: "foo"
    when: "always|once"
    tls:
      cert:
        from: "literal|file"
        file: /path/to/file
        value: value
      key:
        from: "literal|file"
        file: /path/to/file
        value: value
    docker:
      username: user
      password: pass
      email: example@mail.com
      server: example.com
    data:
      - from: "literal|file"
        file: ./path
        key: key
        value: value
config-maps:
  - name: "pippo"
    data:
      - from: "literal|file"
        file: ./path
        key: key
        value: value
```
