---
id: usage
title: PDF Service Usage
sidebar_label: Usage
---
The service exposes only the `\` in `POST`. The request must contain a body with the following properties:

```javascript
{
    "data": "object", // an object, possibly nested, containing the data to use for text interpolation in the html template
    "templateId": "string", // the name given to the template to identify it within the CRUD.
}
```

An example of the body could be he following:

```json
{
    "data": {
        "name": "John",
        "address": {
            "city": "Milan",
            "streetName": "Via Calatafimi, 10",
        },
    },
    "templateId": "valid-id",
}
```

The PDF Service will get from the CRUD service the template row having ad `templateId` the value `valid-id`.
Then it will perform an interpolation of the `htmlTemplate`, `htmlHeader`, `htmlFooter` using the object passed in the `data` field.

For example, for the following template:

```html
<div align="center">
    My name is {{name}} and I live in {{address.city}}.
</div>
```

The resulting interpolation will be:

```html
<div align="center">
    My name is John and I live in Milan.
</div>
```
