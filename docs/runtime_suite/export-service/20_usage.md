---
id: usage
title: Usage
sidebar_label: Usage
---
The service exports data following the configuration that is provided in the body of the POST Request.

The body parameters are:
* **url** [required]: the url of the input data source. This must respond with a `jsonl` response.
* **proxyHeaders** [optional] : list of headers you want to proxy to the external data source.
* **exportType** [required]: the output format.
The supported values are: `json`, `csv`, `html` and `xlsx`.
* **contentType** [required]: the content type wanted as response. This depends by the exportType field:
  * `application/json` for JSON
  * `text/csv` for CSV
  * `text/html` for HTML
  * `application/octet-stream` for XLSX
* **columns** [required]: list of columns you want to export. If specified a column not present in the input data source the result will have the corresponding column as empty.
* **options** [optional]: field that permits to specify the following options:
  * `booleanConfig`: specify the label wanted for either the true and false values. Can be set as any type of value.
  * `csvSeparator`: define the separator for CSV. It can be `COMMA` or `SEMICOLON`; the default value is `COMMA`.

Following an example of body:
```javascript
{
   "url":"http://localhost:5000/Input",
   "proxyHeaders":[
      "secret"
   ],
   "exportType":"csv",
   "contentType":"text/csv",
   "columns":[
      "field1",
      "field2",
      "field3"
   ],
   "options":{
      "booleanConfig":{
         "trueLabel":1,
         "falseLabel":false
      },
      "csvSeparator":"SEMICOLON"
   }
}
```
