---
id: configuration
title: PDF Invoice Service Configuration
sidebar_label: Configuration
---
In order to use the plugin the first step is to create a microservice from the marketplace and selecting the mentioned plugin.

## Environment variables
You must provide the following environment variable:
- `COMPANY_DATA_PATH`: Required. The path in which this service will find the company data that issues the invoice like logo, company name, address, telephone number. This path is the path to the json file that you will create in the configMaps section.

## ConfigMaps
In the configMaps section you will have to create a json file following this schema: 
```json
{
    "companyName": "Name of the company that issues the invoice",
    "address": "Address of the company",
    "telephoneNumber": "Telephone number of the company ex: 'Tel. +39 12345678890' ",
    "logo": "base64 of the logo of the company",
  }
```
