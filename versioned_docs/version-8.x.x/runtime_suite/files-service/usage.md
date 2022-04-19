---
id: usage
title: Usage
sidebar_label: Usage
---
This service exposes several APIs, useful to upload, delete or download the files, described in details in the next paragraphs.

The routes can be prefixed by passing the --prefix option at startup.

### **Upload**: `POST /` 
With a multipart request containing the file to upload. The file will be stored on the configured backend, and the file information will be stored on MongoDB.

Examples of multipart request to upload a single file:

```bash
POST /many HTTP/1.1
... other headers ...
Content-Type: multipart/form-data; boundary=----WebKitFormBoundaryePkpFF7tjBAqx29L

------WebKitFormBoundaryePkpFF7tjBAqx29L
Content-Disposition: form-data; filename="my-file-1.pdf"
Content-Type: application/pdf

... file content here ...
------WebKitFormBoundaryePkpFF7tjBAqx29L--
Content-Disposition: form-data; name="key-1"
Content-Type: text/plain

value-1
------WebKitFormBoundaryePkpFF7tjBAqx29L--
```

As it is possible to notice: 

- The first part is a `*.pdf` file named `my-file-1.pdf`

- The second part is a plain text part with `name="key-1"`.<br/> `"key-1"` will be the key of a field that will be saved inside the file document in `files` collection. `"value-1"` will be the value of the that field.

Continuing the example above, once the file is stored, the respective document in the `files` collection might be something like this:

```json
{ 
  //Basic file data
  "_id" : "61c32e38e67eb6fc92ed50b9",
  "name" : "my-file-1.pdf",
  "file" : "078b04fa-6935-4686-ac5c-75f6b1ff5401.txt",
  "size" : 768,
  "location" : "/v2/files/download/078b04fa-6935-4686-ac5c-75f6b1ff5401.txt",
  "__STATE__" : "PUBLIC",
  "creatorId" : "public",
  "updaterId" : "public",
  //Specific metadata for the file
  "key-1": "value-1"
}
``` 

During the upload, you can specify other properties but they will be ignored.
If you like, using the environment variable `ADDITIONAL_FUNCTION_CASTER_FILE_PATH`
you can specify a caster function to add other properties to CRUD.

:::caution
At the moment, the file part must be the last one of the multipart. Any other part that follows the file part won't be considered.
:::

:::info
This API supports only one file per request. If the request contains more files, then only the first one will be uploaded. Consider using `POST /bulk` to upload multiple files at once.
:::

#### Response

In case of success, the response is a JSON with the following fields.

* _id: unique MongoDB identifier.
* name: original file name.
* file: unique name of the file that should be used to retrieve it using this service.
* size: size in bytes of the uploaded file.
* location: the URL that can be used to download the file using the same service that performed the upload.

### **Upload many**: `POST /bulk` 
With a `multipart/form-data` request containing all the files to upload and the respective metadata. 
All the files will be stored on the configured backend, and the files information will be stored the configured CRUD.
The order of the files inside the multipart is not important and files can have the same `filename` field. <br/>
The upload of multiple files is handled as an **atomic operation**, meaning that either all files are stored correctly or none of them are.

Consider the following simplified example of a HTTP multipart request:

```
POST /many HTTP/1.1
... other headers ...
Content-Type: multipart/form-data; boundary=----WebKitFormBoundaryePkpFF7tjBAqx29L

------WebKitFormBoundaryePkpFF7tjBAqx29L
Content-Disposition: form-data; filename="my-file-1.pdf"
Content-Type: application/pdf

... file content here ...
------WebKitFormBoundaryePkpFF7tjBAqx29L
Content-Disposition: form-data; filename="my-file-1.pdf"
Content-Type: application/pdf

... file content here ...
------WebKitFormBoundaryePkpFF7tjBAqx29L--

```

As it can be noticed, two files are being uploaded, both having the same `filename` field set to`filename="my-file-1.pdf"`. <br/>

Apart from the multiple files, the multipart request accepts other parts useful to provide additional data to be saved the in the file document stored in the `files` collection; please notice that these parts must have `application/json` content-type.<br/>
In the following we describe with an example how to associate some structured metadata to a file<br/>
Consider the following example of multipart request:

```bash
POST /many HTTP/1.1
... other headers ...
Content-Type: multipart/form-data; boundary=----WebKitFormBoundaryePkpFF7tjBAqx29L

------WebKitFormBoundaryePkpFF7tjBAqx29L
Content-Disposition: form-data; filename="my-file-1.pdf"
Content-Type: application/pdf

... file content here ...
------WebKitFormBoundaryePkpFF7tjBAqx29L--
Content-Disposition: form-data; name="my-file1.pdf"
Content-Type: application/json

{
  "anAdditionalProperty": "a_string_value",
  "anotherAdditionalProperty": 34.12
}
------WebKitFormBoundaryePkpFF7tjBAqx29L--
```

As it is possible to notice:

1. The first part is a file named `my-file-1.pdf`.

2. The second part is a text part of type `application/json` with `name` whose value is the name of the file which will receive the metadata contained in the part.

Continuing the example above, once the file is stored, the respective document in the `files` collection might be something like this:

```json
{
  //Basic file data
  "_id" : "61c32e38e67eb6fc92ed50b9",
  "name" : "my-file-1.pdf",
  "file" : "078b04fa-6935-4686-ac5c-75f6b1ff5401.txt",
  "size" : 768,
  "location" : "/v2/files/download/078b04fa-6935-4686-ac5c-75f6b1ff5401.txt",
  "__STATE__" : "PUBLIC",
  "creatorId" : "public",
  "updaterId" : "public",
  //Specific metadata for the file
  "anAdditionalProperty": "a_string_value",
  "anotherAdditionalProperty": 34.12
}
```

:::caution
Keep in mind the fact that File Service uses a CRUD service to store file documents in the `files` collection, hence you'll need to register all the possible
keys that will be stored at the first level of the file document in the `files` CRUD collection definition.
:::

:::info
File info still pass through the function that the user can specify by means of the `ADDITIONAL_FUNCTION_CASTER_FILE_PATH` environment variable before being passed to the CRUD service.
:::

#### Response
At the moment, as stated earlier, the upload of multiple files at once is handled as an atomic operation, meaning that either all of the files are stored properly or none of them are. <br/>

In the case of success, a list with stored files' data is returned.<br/>
In the event of an error while storing one of the files, the service ensures that none file is stored, and an error is returned to the caller.

Continuing the last example of upload, in the case of success, the service answers with `200` and the following `application/json` response: 

```json
[
  {
    "_id": "61c338e6e67eb6fc92ed50ba",
    "name": "my-file-1.pdf",
    "file": "02aa2106-661d-4fcc-9299-c72884ad0f28.txt",
    "size": 768,
    "location": "/v2/files/download/02aa2106-661d-4fcc-9299-c72884ad0f28.txt",
    "anAdditionalProperty": "a_string_value",
    "anotherAdditionalProperty": 34.12
  } 
]
```

Consider consulting the Open API definition of the service to get more information about the service responses.

### **Download**: `GET /download/:file` 
To download the file that was previously uploaded. Add the *download=1* query parameter to download the file as an attachment.

### **Delete**: `DELETE /:file` 
To delete a file that was previously uploaded.
