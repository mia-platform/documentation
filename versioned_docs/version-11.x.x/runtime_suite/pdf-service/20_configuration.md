---
id: configuration
title: PDF Service Configuration
sidebar_label: Configuration
---
This service relies on the existence of:
- [CRUD Service](../../runtime_suite/crud-service/overview_and_usage) connected to a MongoDB collection that will hold the HTML templates.

## Environment variables
You must provide the following environment variables:
- `CRUD_SERVICE` - *Optional. The URL that this service will use to contact the CRUD Service. If not specified `crud-service` will be used by default.
- `DOCKER` - Required. True, if it runs within docker. False otherwise.
- `PDF_TEMPLATE_ENDPOINT` - *Optional. The CRUD collection name used to hold the HTML templates. If not specified `/pdf-template` will be used by default.
- `PDF_CONFIG_PATH` - *Optional. The path to the pdf configurations. If not specified the following default options will be used:

```javascript
{
  format: 'a4',
  displayHeaderFooter: true,
  printBackground: true,
  headerTemplate: '&nbsp;',
  footerTemplate: '&nbsp;',
  margin: {
    top: '100px',
    bottom: '100px',
  },
}
```
Not all of the microservice features require the configuration of the CRUD Service or Form Service. For this reason, they are listed as optional in the previous section. The following table details, by functionality, which variables need to be configured:

|  | Generate PDF from template | Generate PDF from URL | Merge two PDFs |
|---|:---:|:---:|:---:|
| CRUD_SERVICE | ✓ |  |  |
| PDF_TEMPLATE_ENDPOINT | ✓ |  |  |
| DOCKER | ✓ | ✓ | ✓ |


## CRUD Template collection
The Template collection must have the following properties:
 - `templateId` - a string identifying the desired template;
 - `htmlTemplate` - a string containing the HTML template of the document body; this template can contain particular keywords, which allow the user to obtain an interpolation of the text with data passed in the request;
 - `htmlHeader` - the HTML template of the document header; this template can contain particular keywords, which allow the user to obtain an interpolation of the text with data passed in the request;
 - `htmlFooter` - the HTML template of the document footer; this template can contain particular keywords, which allow the user to obtain an interpolation of the text with data passed in the request;
 - `options` - an object containing the available options offered by the puppeteer library. You can find a reference at the [following link](https://pptr.dev/api/puppeteer.pdfoptions#properties). The options specified by this property will override the options specified by the configuration file provided by `PDF_CONFIG_PATH`.

:::info
When no `options` is specified for a template, the options used will be those specified by the configuration provided by `PDF_CONFIG_PATH`. If no `PDF_CONFIG_PATH` is specified, then the default `options` will be used, hence:
```javascript
{
  format: 'a4',
  displayHeaderFooter: true,
  printBackground: true,
  headerTemplate: '&nbsp;',
  footerTemplate: '&nbsp;',
  margin: {
    top: '100px',
    bottom: '100px',
  },
}
```
:::

:::info
**htmlTemplate & footerTemplate colors**
If you try to use css rules to change the colors in the `headerTemplate` or `footerTemplate` they [may not work](https://github.com/puppeteer/puppeteer/issues/2182).
You can achieve the expected result by adding the following rule to your css class that modifies the color (or background color):
```css
.your-class {
  -webkit-print-color-adjust: exact;
}
```
:::
