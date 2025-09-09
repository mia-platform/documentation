---
id: how_to_use
title: CRUD Endpoints
sidebar_label: How to use
---



APIs configured with Mia-Platform can be consumed with any technology that supports HTTP protocol. For tests during development we recommend one of the following tools:

- [curl](https://curl.haxx.se/)
- [insomnia](https://insomnia.rest/)
- [postman](https://www.getpostman.com/)

In the examples, we will use curl for brevity. Following are the typical operations that can be done with an API Restful CRUD SQL service.

Let's see how to perform C-R-U-D operations.

## Create

It's possible to insert single records in a table.

The JSON payload sent to CRUD is validated against the JSON schema defined for the table in the service configuration.

### Insert a single record

To create a record, use *POST* request. As the body of the request, provide the JSON representation of the new record.

For example, if you want to insert a new record in the exposed table `books`, you need to create a JSON like this one:

```json
{
  "id": 1,
  "title": "Foundation",
  "author": "Isaac Asimov"
}
```

Then you have to insert it in the table using a POST request, like the following one:

```shell
curl --request POST \
  --url https://your-url/books/ \
  --header 'accept: application/json' \
  --header 'content-type: application/json' \
  --header 'client-key: client-key' \
  --data '{"id": 1,"title":"Foundation","author":"Isaac Asimov"}'
```

In response, you will get a JSON object like the one below, where **_id** is the unique identifier of the new record inserted:

```json
{
  "_id":"MTk1MQ=="
}
```
:::note
The _id returned by the API is a "virtual" representation of the primary key of the record. This value is not stored on the DB, meaning that it does not need a dedicated column on the table.
:::

:::note
If the table is configured with `manageIdColumn: "true"`, the payload cannot contain the primary key of the record. It is assumed to be handled by the BD.
:::

## Read

In this section you will learn how to query a database table.

### Get a list of records

To list the records from a table, simply call the endpoint with a **GET**.

```shell
curl -X GET https://your-url/books/ \
-H  "accept: application/json"  \
-H  "content-type: application/json" \
-H  "client-key: client-key"
```

In response of this request, you will get a JSON array that contains all the records of the table.

```json
[
  {
    "_id": "MTkxOTUxNTE=",
    "id": 19195151,
    "title": "Foundation",
    "author": "Isaac Asimov",
    "language": "en",
    "published": true,
    "createdAt": "2019-12-16T13:49:06.759Z",
    "creatorId": "5c4fd1d2-c6d8-4c65-8885-0b74f0309d0f",
    "updatedAt": "2020-04-13T15:26:19.819Z",
    "updaterId": "5c4fd1d2-c6d8-4c65-8885-0b74f0309d0f"
  },
  {
    "_id": "MTkxOTUyNTI=",
    "id": 19195252,
    "title": "Foundation and Empire",
    "author": "Isaac Asimov",
    "language": "en",
    "published": true,
    "createdAt": "2019-12-17T10:37:42.551Z",
    "creatorId": "5c4fd1d2-c6d8-4c65-8885-0b74f0309d0f",
    "updatedAt": "2020-03-30T14:29:31.791Z",
    "updaterId": "5c4fd1d2-c6d8-4c65-8885-0b74f0309d0f"
  }
]
```

:::note
The "_id" is returned along with the records. 
:::

### Sort

It is possible to sort the list of records returned by a GET passing to the query string the **_s** parameter. The value of the parameter is the following:

```shell
[-|empty]<property name>
```

By default, the sorting is ascending; use `-` for descending. The following call sorts books by title in alphabetical order.

```shell
curl --request GET \
  --url 'https://your-url/books/?_s=title' \
  --header 'accept: application/json' \
  --header 'client-key: client-key'
```

Sorting for multiple values is made possible by passing a comma separated list of values to the **_s**, as done in the example below.

```shell
curl --request GET \
  --url 'https://your-url/books/?_s=title,author' \
  --header 'accept: application/json' \
  --header 'client-key: client-key'
```

### Paginate

Pagination accepts filters and sorts parameters.

To paginate, use the following query parameters:

- **_l**: limits the number of records returned. Minimum value 1.
- **_sk**: skip the specified number of records. Minimum value 0. Maximum value is `bigint`.

This is an example of a request that gets *two records per page*, and you want to ask for the *third page* (skip 4 records).

```shell
curl --request GET \
  --url 'https://your-url/books/?_l=2&_sk=4' \
  --header 'accept: application/json' \
  --header 'client-key: client-key'
```

Combining `_l` and `_sk`, you can paginate the request. If you want to visualize the number of pages in your UI, you need also count with a request the number of records.

### Return a subset of columns

You can return just some record columns (SQL select) using `_p` parameter. You can select multiple columns listing them as a comma separated list.

```shell
curl --request GET \
  --url 'https://your-url/books/?_p=id,title,author' \
  --header 'accept: application/json' \
  --header 'client-key: client-key'
```

Returns an array of records with only the columns requested.

```json
[
  {
    "_id": "MTkxOTUxNTE=",
    "id": 19195151,
    "title": "Foundation",
    "author": "Isaac Asimov"
  },
  {
    "_id": "MTkxOTUyNTI=",
    "id": 19195252,
    "title": "Foundation and Empire",
    "author": "Isaac Asimov"
  }
]
```

:::note
The *_id* property is always returned along with the primary key regardless the SELECT statement.
:::

### Combine all together

You can combine all together. For example to get the first 2 books, sorted by author with just title and author, do the following request.

```shell
curl --request GET \
  --url 'https://your-url/books/?_s=author&_l=2&_sk=0&_p=title,author' \
  --header 'accept: application/json' \
  --header 'client-key: client-key'
```

### Filters with Query

Records can be filtered in `and` listing the conditions.

For example, we can look for books that have a title that begins with t, that have been published.

```json
{
  "$and": [
    {
      "published": {
        "eq": true
      }
    },
    {
      "title": {
        "$regex": "^t",
        "$options": "i"
      }
    }
  ]
}
```

The above example corresponds to the following statement:
```shell
SELECT * FROM books WHERE published = true AND title LIKE 't%'
```

The query must be URL encoded and passed to `_q` parameter:

```shell
curl --request GET \
  --url 'https://your-url/books/?_q=%7B%22%24and%22%3A%5B%7B%22published%22%3A%7B%22%24eq%22%3Atrue%7D%7D%2C%7B%22title%22%3A%7B%22%24regex%22%3A%22%5Et%22%2C%22%24options%22%3A%22i%22%7D%7D%5D%7D' \
  --header 'accept: application/json' \
  --header 'client-key: client-key'
```

You can use more filters in query **_q**. Here is the complete list with the corresponding SQL operator.

| Filter  |  SQL operator  |
|:--------|:--------------:|
| $eq     |       =        |
| $ne     |     `<\>`      |
| $regex  |      LIKE      |
| $lt     |      `<`       |
| $lte    |      `<=`      |
| $gt     |      `\>`      |
| $gte    |      `>=`      |

:::note
`$regex` is mapped to the operator `LIKE` replacing `.*`, `^` and `$` with `%`
:::

### Count

It may be helpful to know how many records contains a table. For this purpose it is sufficient to invoke a GET on the `/count` of the resource:

```shell
curl -X GET https://your-url/books/count -H  "accept: application/json" -H  "content-type: application/json" -H  "client-key: client-key"
```

This will return:

```json
2
```

:::note
Filters can be applied to the count.
:::

The result will be the total number of records in the table.

## Update

You can update one record in the table. The operations of the update are made by using a **PATCH** request:

In the body of the request you can use the following operators:

- `$set`
  This operator replaces the value of the field with specified value:  
  `{ $set: { <field1>: <value1>, ... } }`

- `$unset`
  This operator unset a particular item value:  
  `{ $unset: { <field1>: true, ... } }`

### Update a single record

To update a single record, use `PATCH` passing the *_id* of the record as path parameter.  
In the body, you have to pass a JSON with the desired operators set.

The route to call is the following:

`PATCH` `https://your-url/<CRUD table endpoint>/{id}`

Below you can see an example:

```shell
curl --location --request PATCH 'your-url.mia-platform.eu/books/MTkxOTU0NTQ=' \
--header 'Content-Type: application/json' \
--data-raw '{
    "$set": {
        "title": "The Caves of Steel",
        "author: "Isaac Asimov"
    },
}'
```

## Delete

You can delete one or more records from a table.

### Delete a single record

To delete a single record use a **DELETE** request, passing the *_id* of the record as path parameter.

The route to call is the following:

`DELETE` `https://your-url/<CRUD table endpoint>/{id}`

Below you can see an example:

```shell
curl --location --request DELETE 'url.mia-platform.eu/books/MTkxOTU0NTQ='
```

In case the record exists, the endpoint answers with a `204 No Content`, if not, it responds with a `404 Not Found`.

### Delete multiple records

To delete multiple records you have to use a `DELETE` request, filtering by query parameters the records you want to delete. See the section [Filters with Query](#filters-with-query) for more information.

The route to call is the following:

`DELETE` `https://your-url/<CRUD table endpoint>/`

Below you can see an example:

```shell
curl --location --request DELETE 'url.mia-platform.eu/books/?category=sci-fi&_st=DRAFT'
```

The endpoint always responds `200 OK`, with an integer number in the body representing the count of deleted records.
The response is 200 also when no records are found, in that case the count will be 0.

:::warning
The only supported query parameter is the *_q* which allows you to select the records to be deleted.

If the *_q* is not specified, the API deletes all the records from the table.
:::

## Import

You can import records into a table from csv files.

To import all the elements of a file you have to use the `POST` method.

The route to call is the following:

`POST` `https://your-url/<CRUD table endpoint>/import`

The request body is a multipart with a file part and optionally the following attributes:
- delimiter: single character used as csv delimiter while parsing the file (default: `,`)
- escape: single character used as csv escape while parsing the file (default: `\\`)

Below you can see an example:

```shell
curl --location http://url.mia-platform.eu/books/import \
  -H 'Content-Type: multipart/form-data;boundary=XXXXX' \
  -F "file=@/path/to/file.csv" \
  -F 'delimiter=;' \
  -F 'escape="\"'
```

Check out what the [import file](#import-file-example) should look like

When successful the endpoint responds `200`, with the following information in the response payload:
- number of successfully imported records
- number of records which raised an error and thus that have not been imported
- the list of errors occurred while processing the file

For example, you receive the following response if the file contains 3 rows and one of them lead to an error:

```json
{
  "ok": 2,
  "ko": 1,
  "errors": [
    {
      "record": {
        "id": 143522,
        "title": null,
        "author": "Isaac Asimov",
        "language": "en"
      },
      "cause": "Property \"title\" does not match schema. Instance type null is invalid. Expected string"
    }
  ]
}
```

*errors* contains a list of object with the following properties:
- record: object representing the csv record which raised an error
- cause: error message

#### Import file example

```csv title="books.csv"
id,title,author,language
143522,null,Isaac Asimov,en
143532,Do Androids Dream of Electric Sheep?,Philip K. Dick,en
143535,Dune,Frank Herbert,en
```

:::note
The csv parsing is done with the following settings:
- "null" string is mapped to NULL
- empty lines are skipped
- delimiter (default): `,`
- escape (default): '\\'
- record separator: `\r\n`
:::

## Response codes of CRUD

Below is a list of return codes typical of an API request:

### 2xx (Success category)

| Code    | Message    | Description                                                                                                                                                        |
| ------- | ---------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| **200** | Ok         | The standard HTTP response representing success for GET, PUT or POST.                                                                                              |
| **201** | Created    | This status code should be returned whenever the new instance is created. E.g on creating a new instance, using POST method, should always return 201 status code. |
| **204** | No Content | The request is successfully processed, but has not returned any content.                                                                                           |

### 4xx (Client Error Category)

These status codes represent that the client has raised a faulty request.

| Code    | Message      | Description                                                                                                                                                                                                                                 |
| ------- | ------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **400** | Bad Request  | Indicates that the request by the client was not processed, as the server could not understand what the client is asking for.                                                                                                               |
| **401** | Unauthorized | Indicates that the client is not allowed to access records, and should re-request with the required credentials.                                                                                                                          |
| **403** | Forbidden    | Indicates that the request is valid and the client is authenticated, but the client is not allowed to access the page or resource for any reason. E.g sometimes the authorized client is not allowed to access the directory on the server. |
| **404** | Not Found    | Indicates that the requested resource is not available now.                                                                                                                                                                                 |

### 5xx (Server Error Category)

| Code    | Message               | Description                                                                                                                          |
| ------- | --------------------- | ------------------------------------------------------------------------------------------------------------------------------------ |
| **500** | Internal Server Error | Indicates that the request is valid, but the server is totally confused and the server is asked to serve some unexpected condition.  |
| **503** | Service Unavailable   | Indicates that the server is down or unavailable to receive and process the request. Mostly if the server is undergoing maintenance. |
