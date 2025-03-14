---
id: usage
title: Usage
sidebar_label: Usage
---
The service exports data following the configuration that is provided in the body of the POST Request.

The body parameters are:
* **url** [required]: the url of the input data source. The input data source must be compatible with the (https://jsonlines.org/)[JSON Lines] format.
* **proxyHeaders** [optional] : list of headers you want to proxy to the external data source.
* **exportType** [required]: the output format. The supported values are: `json`, `csv`, `xlsx` and `html`. HTML exports produce an HTML document containing a single table with the exported data.
* **columns** [optional]: list of columns you want to export. If a column is not present in the input data source the result will include it as an empty string. If not specified, all columns present in the input source will be exported according to the default JavaScript property order (numbers in ascending order followed by strings in insertion order). If specified, `csv`, `html` and `xlsx` exports will also include a header row specifying the exported column names.
* **options** [optional]:
  * `booleanConfig`: specify the label wanted for either the true and false values. Can be set to any valid JSON value.
  * `csvSeparator`: defines the separator for CSV. It can be `COMMA` or `SEMICOLON`; the default value is `COMMA`.

Here you can find an example body of an export request:
```javascript
{
   "url": "http://example.com/some-jsonl-resource",
   "proxyHeaders": [
      "secret"
   ],
   "exportType": "csv",
   "columns": [
      "field1",
      "field2",
      "field3"
   ],
   "options": {
      "booleanConfig": {
         "trueLabel": 1,
         "falseLabel": false
      },
      "csvSeparator": "SEMICOLON"
   }
}
```
