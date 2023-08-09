---
id: overview
title: PDF Service
sidebar_label: Overview
---
The PDF Services provides various functionalities to programmatically generate and manipulate pdf documents. With this tool, you can effortlessly accomplish the following tasks:

- **Generate a PDF from an HTML template**

  Generate PDF files from HTML templates using the PDF Service. This feature interacts with the CRUD Service to retrieve the HTML template based on a specified `templateId`. Once the template is obtained, the Puppeteer library renders the HTML template and produces the corresponding PDF file. Use the Handlebars library for text interpolation, replacing placeholders with data from the `data` object to customize the content of the PDF.

- **Generate a PDF from a URL**

  Generate PDF files directly from web URLs using the PDF Service. Utilize the Puppeteer library to render the webpage and convert it into a PDF document. Specify the URL of the webpage you want to print as a PDF. For multi-language support, include an `accept-language` header in the request.

- **Merge two or more PDF documents**

  Merge two or more PDF documents into a single PDF file with the PDF Service. This feature combines PDFs based on the order they are provided in the multipart request. Control the sequence of the merged files and optionally specify a filename for the resulting PDF. The service ignores any non-PDF fields in the multipart request, ensuring a smooth merging process.

---

For more information, please refer to the [Configuration](./20_configuration.md), [Usage](./30_usage.md), and [Performance](./40_performance.md) sections. If you need additional functionality that is not listed, you have the option to develop it and submit a pull request (PR) or request its development.
