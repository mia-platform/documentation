### Files Manager Service ###

This microservice offers the functionality of uploading and downloading files using third-party services (eg S3 or MongoDB). The http interface of the microservice is independent of the specific storage service used, which is configured at startup. The uploaded files are also recorded in a collection managed by the CRUD.
S3 and MongoDB are currently supported as storage services.
