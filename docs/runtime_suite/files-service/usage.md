## Summary

This microservice offers the functionality of uploading and downloading files using third-party services.

The http interface of the microservice is independent of the specific storage service used, which is configured at startup. The uploaded files are also recorded in a collection managed by the CRUD.

S3, MongoDB and GoogleStorage are currently supported as storage services.

## API

This service exposes two routes, one for the upload and one for the download,
(these can be prefixed by passing the --prefix option at startup):


* **Upload**: POST */* with a multipart request containing the file to upload. The file will be stored on
the configured backend, and the file's informations will be stored on mongoDB.
It returns a json response containing:

    * name: original file name
    * file: unique name of the file that should be used to retrieve it using this service
    * size: size in bytes of the uploaded file
    * location: the URL that can be used to download the file using the same service that performed the upload

  Example of file upload

  ```bash
    curl -F "image=@/path/to/image" "http://localhost:8080/"
  ```

During the upload, you can specify other properties that will be ignored.
If you like, using the environment variable `ADDITIONAL_FUNCTION_CASTER_FILE_PATH`.
you can specify a caster function to add other properties to CRUD.

* **Download**: GET */download/:file* to download the files that were previously uploaded. Add the *download=1* query parameter to download the file as an attachment.

