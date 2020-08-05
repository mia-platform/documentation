### PDF Service ###

This plugin provides a simple way of generating PDF files from an initial HTML template. This service relies on the [Puppeteer](https://github.com/GoogleChrome/puppeteer) library.

If you are using this service in your machine, it is very important to set the DOCKER environment variable to false.

## Configuration

This service relies on the existence of a CRUD collection with the following properties:

 * `templateId`: a string identifying the desired template.
 * `htmlTemplate`: a string containing the HTML template of the body of the document. This template can contain particular keywords allowing to obtain an interpolation of the text with some data passed in the request.
 * `htmlHeader`: the HTML template of the header of the document. This template can contain particular keywords allowing to obtain an interpolation of the text with some data passed in the request.
 * `HTMLFooter`: the HTML template of the footer of the document. This template can contain particular keywords allowing to obtain an interpolation of the text with some data passed in the request.
 * `options`: an object containing the available options offered by the Puppeter library. You can find a reference at the [following link](https://github.com/GoogleChrome/puppeteer/blob/master/docs/api.md#pagepdfoptions). If the `options` property is missing, then the default `options` will be used:
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

The service requires two environment variables:
* `TEMPLATE_CRUD`: The endpoint to read from the CRUD collection (e.g. http://crud-service/templates).
* `DOCKER`: *True*, if it runs within docker. *False* otherwise.

### HTML template

HTML templates are interpolated using [Handlebars](https://github.com/wycats/handlebars.js/) library. So, the syntax to performing the interpolation is that of the linked library.

An example of useful template is the following:
```html
<div align="center">
My name is {{name}} and I live in {{address.city}}.
</div>
```

In the **Usage** section we will see how to perform the interpolation.

In order to insert an image into the header/footer, you have to insert the img tag containing as value for src the base64 image.
You can use [this link](https://codebeautify.org/image-to-base64-converter) to upload an image and obtain its base64 version.
The following is a working header/footer containing an image:
```
<div style="-webkit-print-color-adjust: exact; font-size: 10px; margin: 0 auto;">
  <img style="height: 2cm" src="data:image/png;base64,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"/>
</div>
```

## Usage

The service exposes only the `\` in `POST`. The request must contain a body with the following properties:
```javascript
{
    "data":  { <data> }, // an object, possibly nested, containing the data to use for text interpolation in the HTML template
    "templateId": "<temlate name>", // the name given to the template to identify it within the CRUD.
}
```

An example of the body could be the following:
```json
{
    "data": {
        "name": "Francesco",
        "address": {
            "city": "Milan",
            "streetName": "Via Carlo Imbonati, 18",
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
    My name is Francesco and I live in Milan.
</div>
```
