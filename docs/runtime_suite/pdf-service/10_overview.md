---
id: overview
title: PDF Service
sidebar_label: Overview
---
This plugin provide a simple way for generating PDF files from a starting HTML template. The template can contain placeholders that will be interpolated at each request. This service relies on the [Puppeteer](https://github.com/puppeteer/puppeteer) library.
## Overview  
For each incoming request, the PDF Service:
- retrieves, from a CRUD collection, the HTML template specified in the request 
- interpolates the placeholders of the template with the data specified in the request body
- generates the PDF file and returns the byte stream to the client
