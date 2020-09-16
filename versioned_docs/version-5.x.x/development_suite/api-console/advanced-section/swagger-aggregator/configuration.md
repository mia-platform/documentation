---
id: configuration
title:   Swagger Aggregator Advanced Configuration
sidebar_label: Swagger Advanced Configuration
---
## Swagger Aggregator Advanced Configuration

In the advanced tab of the DevOps Console Design section is possible to further customize a project configuration.

Regarding the _swagger-aggregator_ service the advanced configuration allows to manage how the swagger API are exposed. Examples of possibile configurations are:

- create further custom routes

- rewrite swagger routes to match different specifications depending on the context

- define sub-swaggers to expose only a subset of the whole API

- collect and combine swaggers from other services to expose them in a single interface as a whole.

## Configuration Files

Below are reported the different files that can be configured and how they can be employed to customize the project _swagger-aggregator_ functionalities.

### `urls.before.conf`

Example of what a `urls.before.conf` configuration file might look likes:

```json
[
    {
        "type": "url",
        "url": "http://<cool-project-name>/documentation/json",
        "prefix": "/"
    },
    {
        "type": "url",
        "url": "http://<even-more-cool-project>/<custom-docs-path>",
        "prefix": "/one/ring/to/route/them/all"
    }
]
```

### `subswaggers.conf`

The `subswagger.conf` configuration defines, as described briefly above, a set of sub-swaggers that represents a limited view on all the API that services expose within a project.

There are many reasons to enable this features, although they are usually exploited to filter routes that should not be published in the documentation, to cluster different endpoints under specific tags or to group routes so that they can be encapsuled into other projects (for more details see `urls.before.conf`).

Below is reported and briefly described the minimal structure that this configuration file should have:

```json
{
    "/<reference-name>.json": {
        "name": "<subswagger-name>",
        "tagName": "<routes-group-name>",
        "expression": "<simple-js-filtering-expression>"
    }
}
```

In particular:

the `<reference-name>.json` can be used as a handle in the urls.before.conf to select which group should be exposed in other projects swaggers

the `name` represents the name associated to the group in the swagger interface

the `tagName` represents the name under which all the routes that matches the expression are grouped

the `expression` is evaluated as simple Javascript code that filters out from the sub-swagger group all the routes whose expression returns false

In order to exploit the expression function depending on different contexts, three JS variables are provided to support the filtering process:

- `method` - it represents which HTTP method can be used to call a specific route

- `path` - it represents the path called for a specific route

- `tags` - it is the list of tags that decorates a specific route

Here is provided an example of what a sub-swagger.conf configuration file might look likes:

```json
{
    "/project-name-cool-tag.json": {
        "name": "My Cool Project - Tags filter",
        "tagName": "My Cool Project 1",
        "expression": "'cool-project' in tags"
    },
    "/project-name-welcome-route.json": {
        "name": "My Cool Project - Path filter",
        "tagName": "My Cool Project 2",
        "expression": "'/cool/project/answers/welcome' === path"
    },
    "/project-name-no-get-routes.json": {
        "name": "My Cool Project 3 - Method filter",
        "tagName": "My Cool Project 3",
        "expression": "'GET' !== method"
    }
}
```
