---
id: files_management
title: File Management
sidebar_label: Files Management
---
The FHIR Adapter allows you to upload and download files to a FHIR Server. The service is able to manage files following the FHIR standard transparently to the user.

:::info
[Here](https://www.hl7.org/fhir/documentreference.html) you can find information to understand how the FHIR standard deals with files.
:::

## APIs

This service exposes several APIs, useful to upload, delete or download the files, described in details in the next paragraphs.

### Upload

To upload a file to the FHIR Server, via FHIR Adapter, you have to perform a `POST` request to a special route called `/DocumentReference` with a **multipart** body, containing the file to upload. In addition to the file, you can specify other properties:

* **name**: the name associated to the file. Please note that this is not the `filename` automatically associated by the file system. It is an additional name that describe the file (for example, inserted by the user).
* **date**: the date associated to the file.
* **subject**: it is the identifier of the subject related to the file. For example, it can be the identifier of a patient.

:::warning
Please note that if you specify a subject to link to the file, this subject must exists in the context of the FHIR Server. In other words, the subject resource have to be previously created.
:::

Here you can find an example request for file upload:

```bash
POST /DocumentReference HTTP/1.1
... other headers ...
Content-Type: multipart/form-data; boundary=----WebKitFormBoundaryePkpFF7tjBAqx29L

------WebKitFormBoundaryePkpFF7tjBAqx29L
Content-Disposition: form-data; filename="my-file-1.pdf"
Content-Type: application/pdf

... file content here ...
------WebKitFormBoundaryePkpFF7tjBAqx29L--
Content-Disposition: form-data; name="name"
Content-Type: text/plain

File name
------WebKitFormBoundaryePkpFF7tjBAqx29L--
Content-Disposition: form-data; name="date"
Content-Type: text/plain

2022-09-26
------WebKitFormBoundaryePkpFF7tjBAqx29L--
Content-Disposition: form-data; name="subject"
Content-Type: text/plain

1234
------WebKitFormBoundaryePkpFF7tjBAqx29L--
```

In case of success, the response is a JSON with the following fields:

* **_id**: unique FHIR identifier
* **name**: original file name
* **file**: the name of the file in the file system
* **size**: size in bytes of the uploaded file
* **location**: the URL that can be used to download the file using the same server that performed the upload

### Download

To download a file that was previously uploaded to the FHIR Server, via FHIR Adapter, you have to perform a `GET` request with the `_id` of the file as path parameter.

**Example**

```bash
curl --request GET \
  --url http://your-url/DocumentReference/:id
  ...
```

### Delete

The deletion of a file from the FHIR Server follows the procedure explained in the [API Endpoints section](overview_and_usage).
