---
id: configuration
title: PDF Service Configuration
sidebar_label: Configuration
---
This service relies on the existence of a [CRUD service](http://git.makeitapp.eu/mia-platform-core/crud-service) connected to a MongoDB collection that will hold the HTML templates.

## Environment variables
You must provide the following environment variables:
- `TEMPLATE_CRUD`: Required. The url that this service will call for getting the HTML template.
- `DOCKER`: Required. True, if it runs within docker. False otherwise.
- `TRUSTED_PROXIES`: the string containing the trusted proxies values.
## CRUD Collection
The CRUD collection must have the following properties:
 - `templateId`: a string identifying the desired template
 - `htmlTemplate`: a string containing the html template of the body of the document. This template can contain particular keywords allowing to obtain an interpolation of the text with some data passed in the request.
 - `htmlHeader`: the html template of the header of the document. This template can contain particular keywords allowing to obtain an interpolation of the text with some data passed in the request.
 - `htmlFooter`: the html template of the footer of the document. This template can contain particular keywords allowing to obtain an interpolation of the text with some data passed in the request.
 - `options`: an object containing the available options offered by the puppeter library. You can find a reference at the [following link](https://github.com/GoogleChrome/puppeteer/blob/master/docs/api.md#pagepdfoptions).

When you insert a document in a crud, if you no specify any `options`, The default `options` are the following:
```javascript
{
    format: 'A4',
    displayHeaderFooter: true,
    printBackground: true,
    headerTemplate: '&nbsp;',
    footerTemplate: '&nbsp;',
    margin: {
      left: '0',
      right: '0',
      top: '0',
      bottom: '0',
    },
  }
```

## HTML template
HTML templates are interpolated using [Handlebars](https://github.com/wycats/handlebars.js/) library. So, the syntax to perform interpolation is the one of the linked library.

An example of useful template is the following:
```html
<div align="center">
My name is {{name}} and I live in {{address.city}}.
</div>
```

In the **Usage** section we will see how to perform the interpolation.

In order to insert an image into the header/footer, you have to insert the img tag containing as value for src the base64 image.
You can use [this link](https://codebeautify.org/image-to-base64-converter) to upload an image and obtain its base64 version.
