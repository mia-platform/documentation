---
id: usage
title: PDF Service Usage
sidebar_label: Usage
---
This section describes in detail the features provided by the microservice:
- [Generate a PDF from an HTML template](#generate-pdf-from-an-template);
- [Generate a PDF from a URL](#generate-pdf-from-a-url);
- [Merge two PDF documents](#merge-two-pdfs).

## Generate PDF from a template
This endpoint provides a simple way for generating PDF files from an HTML template. It relies on:
- [CRUD Service](../../runtime_suite/crud-service/overview_and_usage);
- [Puppeteer](https://github.com/GoogleChrome/puppeteer) library;
- [Handlebars](https://github.com/wycats/handlebars.js/) library.

This feature requires:
- `templateId` - the name given to the template to identify it within the CRUD;
- `data` - an object, possibly nested, containing the data to use for text interpolation in the HTML template.

### Request
```bash
curl -X 'POST' \
  'http://0.0.0.0:3000/pdf/template' \
  -header 'Content-Type: application/json' \
  -data '{ "templateId": "123", "data": { "key": "value" } }'
```

### Response
The response is a stream containing the generated pdf document.

### HTML template
HTML templates are interpolated using the [Handlebars](https://github.com/wycats/handlebars.js/) library. So, the syntax to perform interpolation is the one of the linked library. Moreover, PDF Service implements [just-handlerbars-helpers](https://github.com/leapfrogtechnology/just-handlebars-helpers) library, which means that the all the helpers offered by the library can be used in the construction of the HTML Template.

:::info
In order to insert an image into the header/footer, you have to insert the img tag containing as value for src the base64 image.
You can use [this link](https://codebeautify.org/image-to-base64-converter) to upload an image and obtain its base64 version.
:::

### Interpolation process example

The PDF Service retrieves the template record with `templateId` value of `123` from the CRUD Service, and proceeds to perform an interpolation on the `htmlTemplate`, `htmlHeader`, and `htmlFooter` using the object passed in the data field.

**Payload**
```json
{
    "templateId": "123",
    "data": {
        "name": "John",
        "address": {
            "city": "Milan",
            "streetName": "Via Carlo Imbonati, 1",
        },
    },
}
```

**`123` template** 
```html
<div align="center">
    My name is {{name}} and I live in {{address.city}}.
</div>
```

**Interpolation result**
```html
<div align="center">
    My name is John and I live in Milan.
</div>
```

## Generate PDF from a url
This endpoint provides a simple way for generating PDF files from a web URL. This feature relies on:
- [Puppeteer](https://github.com/GoogleChrome/puppeteer) library.

The feature requires:
- `url` - url of the page you want to print as a PDF.

You can also print a web page in a specified language passing the following header parameter in the request:
- `accept-language`: 'it-IT,it'

:::info
Version 1.x of this microservice allowed the generation of PDFs from forms constructed via the Form Service [Backend](../../runtime_suite/form-service-backend/overview) and [Frontend](../../runtime_suite/form-service-frontend/configuration).

To reproduce this functionality, use this endpoint passing as URL the reference to the form you want to print.  

Eg: https://`BASE_URL`/form-service/#/visualizer/print-form/`FORM_ID`
:::

### Request
```bash
curl -X 'POST' \
  'http://0.0.0.0:3000/pdf/url' \
  -header 'Content-Type: application/json' \
  -data '{ "url": "https://mia-care.io" }'
```

### Response
The response is a stream containing the generated pdf document.

## Merge two PDFs

This endpoint allows to merge multiple pdf files provided in a multipart. Such files will be merged based on the order they have in the multipart body.
It is possible to specify the filename of the new merged file via the `filename` property inside the multipart. If not provided the name will be random.

:::info
Other fields in the multipart which are not PDF (strings or other types of files) will be ignored.
:::

### Request
```bash
curl --request POST \
  'http://0.0.0.0:3000/pdf/merge' \
  --header 'Content-Type: multipart/form-data' \
  --form first_pdf_file={{first_pdf}} \
  --form second_pdf_file={{second_pdf}} \
  --form third_pdf_file={{third_pdf}} \
  --form another_field=this_will_be_ignored \
  --form non_pdf_file_that_will_be_ignored={{non_pdf_file}}
  --form filename=my_file
```

### Response
The response is a stream containing the merged PDF document.
