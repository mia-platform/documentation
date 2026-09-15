---
id: overview_and_usage
title: Email Builder
sidebar_label: Email Builder
---



## Overview

The Email builder is a Mia-Care plugin that allows the user to create html email templates using the no code tool provided by [Waypoint](https://www.usewaypoint.com/).

## Usage

The email builder plugin exposes a React-based front-end at the `/email-builder` path. For the plugin to work correctly 4 query parameters need to present in the URL

- `id`: It must contain the id that identifies the current template that is being edited
- `endpoint`: it must contain the path from which the template needs to loaded. It is also the endpoint used to save the new HTML template 
- `jsonField`: it must contain the name of the property used to save the template in JSON format
- `htmlField`: it must contain the name of the property used to save the template in HTML format

## How it works

The email builder provides a user interface for creating email templates. This tool converts the graphical elements of the template into both a JSON object and an HTML file.

The email builder enables users to save the HTML and JSON versions of the current template in a CRUD. Users can also download the template as a JSON file. Additionally, it supports importing a JSON template for modifying existing templates. Integrated in the plugin are already present some templates to start with.

For the front-end to load correctly, the `id`, `endpoint` and `jsonField` query parameters are required. On opening the request `GET endpoint/id`,  where `endpoint` and `id` are the value of the relative query parameters, is done to fetch the template. From the fetched template, the `jsonField` property is used to access the current JSON version of the template and load it. If the `jsonField` property of the fetched template is undefined an empty template is loaded instead.

By clicking the Save button in the top right is it possible to save the current template remotely. To save the template, the email builder performs a PATCH rest call to the path `endpoint/id`  with the following body:

```
{
  $set: {
    jsonField: 'JSON template',
    htmlField: 'HTML template'
  }
}
```

If the query parameter `htmlField` is not passed in the URL the PATCH will fail automatically.
