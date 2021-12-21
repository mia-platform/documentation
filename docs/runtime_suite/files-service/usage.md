---
id: usage
title: Usage
sidebar_label: Usage
---
This service exposes three routes, one for the upload, one for the download and one for the delete
(these can be prefixed by passing the --prefix option at startup):

* **Upload**: `POST /` with a multipart request containing the file to upload. The file will be stored on
the configured backend, and the file's information will be stored on MongoDB.
It returns a JSON response containing:

  * _id: unique MongoDB identifier.
  * name: original file name.
  * file: unique name of the file that should be used to retrieve it using this service.
  * size: size in bytes of the uploaded file.
  * location: the URL that can be used to download the file using the same service that performed the upload.

  Examples of file upload:

  ```bash
  curl -F "image=@/path/to/image" "http://localhost:8080/"
  ```

  ```bash
  curl --request POST \
    --url http://host.com/files-service/ \
    --header 'content-type: multipart/form-data' \
    --form sample.pdf=@/home/usr/Downloads/sample.pdf
  ```

  During the upload, you can specify other properties that will be ignored.
  If you like, using the environment variable `ADDITIONAL_FUNCTION_CASTER_FILE_PATH`.
  you can specify a caster function to add other properties to CRUD.

  :::caution
  In this case, the order of the parameters used for the upload request is important: the param `file` must be the last one or the other CRUD properties will not be valued.
  :::

  :::info
  This API supports only one file per request. If the request contains more files, then only the first will be uploaded.
  :::

* **Download**: `GET /download/:file` to download the file that was previously uploaded. Add the *download=1* query parameter to download the file as an attachment.

* **Delete**: `DELETE /:file` to delete a file that was previously uploaded.
