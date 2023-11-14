---
id: api_overview
title: APIs Overview
sidebar_label: API Overview
---
In this section, the capabilities of the DICOM Service will be described. However, **for more in-depth documentation on individual APIs, please refer to the documentation exposed by the service via swagger**.

## Worklist management
The DICOM Service allows the **management of a worklist and the related workitems**, leveraging on the [UPS-RS webDICOM interface](https://www.dicomstandard.org/using/dicomweb/workflow-ups-rs).

### Workitem creation
The creation of a new workitem can be performed through the `POST /workitems` endpoint. The payload of the workitem must be provided in the body of the request. Such a payload must be provided in JSON format, and it must contain the following fields:
* `PatientID`
* `PatientName`
* `ScheduledStationAETitle`
* `ScheduledProcedureStepDescription`
* `ScheduledProcedureStepStartDate`
* `ScheduledProcedureStepStartTime`
* `Modality`
* `AccessionNumber`

:::warning
Please note that the `StudyInstanceUID` is created automatically by the service when a new workitem is created.
:::

In addiction, further fields can be provided in the payload:
* `ScheduledStationAETitle`
* `ScheduledPerformingPhysiciansName`
* `ScheduledProcedureStepID`
* `RequestedProcedureDescription`
* `RequestedProcedureID`
* `RequestingPhysician`
* `ReferringPhysicianName`
* `AdmissionID`
* `CurrentPatientLocation`
* `PatientBirthDate`
* `PatientSex`
* `ConfidentialityConstraintOnPatientDataDescription`
* `PatientState`
* `PregnancyStatus`
* `MedicalAlerts`
* `PlacerOrderNumberImagingServiceRequest`
* `ServiceEpisodeID`
* `ScheduledStationName`

The possible returned status codes are:
|   Status code   |    Meaning    |
|:---------------:|:-------------:|
| 200 OK | The workitem has been created successfully |
| 400 Bad Request | The request is invalid or empty |
| 401 Unauthorized | The request has failed the authentication to the PACS |
| 409 Conflict | The request is trying to insert an already existing workitem (by `studyInstanceUID`) |
| 500 Internal Server Error | The request has failed due to unknown error |

<details>
<summary>Example of workitem creation request</summary>

<b>Request</b>

```bash
curl --request POST \
  --url https://your-dicom-service/workitems \
  --header 'accept: application/json' \
  --header 'content-type: application/json' \
  --data '{
    "StudyInstanceUID": "1.2.752.24.5.2584605181.20150129083013.816906",
    "PatientID": "SDJ38WMD1MS01",
    "PatientName": "MARIO^ROSSI",
    "ScheduledStationAETitle": "NGV",
    "ScheduledProcedureStepStartDate": "20000101",
    "ScheduledProcedureStepStartTime": "120000",
    "ScheduledProcedureStepDescription": "Tac",
    "Modality": "CT",
    "AccessionNumber": "NDS83JF784N209D2"
  }'
```

</details>

### Workitems retrieval
The retrieval of the workitems can be performed through the `GET /workitems` endpoint. The endpoint accepts the following query parameters:
* `patientID`

In case of successful request, the response is an array containing the workitems for a specific user.

The possible returned status codes are:
|   Status code   |    Meaning    |
|:---------------:|:-------------:|
| 200 OK | The request has been successful and it returns the list of workitems |
| 500 Internal Server Error | The request has failed due to unknown error |

<details>
<summary>Example of workitem retrival request</summary>

<b>Request</b>
```bash
curl --request GET \
  --url https://your-dicom-service/workitems?patientID=123456789
```

<b>Response</b>

```json
[
  {
    "00080005": {
      "vr": "CS",
      "Value": [
        "ISO-IR 192"
      ]
    },
    "00080050": {
      "vr": "SH",
      "Value": [
        "NDS83JF784N209D2"
      ]
    },
    "00080090": {
      "vr": "PN"
    },
    "00100010": {
      "vr": "PN",
      "Value": [
        {
          "Alphabetic": "MARIO^ROSSI"
        }
      ]
    },
    "00100020": {
      "vr": "LO",
      "Value": [
        "SDJ38WMD1MS01"
      ]
    },
    "00100030": {
      "vr": "DA"
    },
    "00100040": {
      "vr": "CS"
    },
    "00102000": {
      "vr": "LO"
    },
    "001021C0": {
      "vr": "US"
    },
    "0020000D": {
      "vr": "UI",
      "Value": [
        "1.2.752.24.5.2584605181.20150129083013.816908"
      ]
    },
    "00321032": {
      "vr": "PN"
    },
    "00321060": {
      "vr": "LO"
    },
    "00380010": {
      "vr": "LO"
    },
    "00380300": {
      "vr": "LO"
    },
    "00380500": {
      "vr": "LO"
    },
    "00400100": {
      "vr": "SQ",
      "Value": [
        {
          "00080060": {
            "vr": "CS",
            "Value": [
              "CT"
            ]
          },
          "00400001": {
            "vr": "AE",
            "Value": [
              "NGV"
            ]
          },
          "00400002": {
            "vr": "DA",
            "Value": [
              "20000101"
            ]
          },
          "00400003": {
            "vr": "TM",
            "Value": [
              "120000"
            ]
          },
          "00400006": {
            "vr": "PN"
          },
          "00400007": {
            "vr": "LO",
            "Value": [
              "Tac"
            ]
          },
          "00400009": {
            "vr": "SH"
          },
          "00400010": {
            "vr": "SH"
          }
        }
      ]
    },
    "00401001": {
      "vr": "SH"
    },
    "00402016": {
      "vr": "LO"
    },
    "00403001": {
      "vr": "LO"
    }
  }
]
```

</details>

### Workitems deletion

The deletion of a workitem can be performed through the `DELETE /workitems/:studyInstanceUID` endpoint. The endpoint accepts the `studyInstanceUID` as path parameter and it is mandatory.

In case of successful request, the response has status code `204 No Content` with empty body.

The possible returned status codes are:
|   Status code   |    Meaning    |
|:---------------:|:-------------:|
| 204 No Content | The request has been successful and the workitem has been removed |
| 500 Internal Server Error | The request has failed due to unknown error |

<details>
<summary>Example of workitem deletion request</summary>

<b>Request</b>
```bash
curl --request DELETE \
  --url https://your-dicom-service/workitems/1.123.45.6789.123456789
```
</details>

## Exams management
The DICOM Service allows:
* the **creation and upload of the exams**, leveraging on the [STOW-RS webDICOM interface](https://www.dicomstandard.org/using/dicomweb/store-stow-rs);
* the **retrieval of the exams**, leveraging on the [QIDO webDICOM interface](https://www.dicomstandard.org/using/dicomweb/query-qido-rs);
* the **retrieval of the detail of an exam**, leveraging on the [WADO webDICOM interface](https://www.dicomstandard.org/using/dicomweb/retrieve-wado-rs-and-wado-uri).

:::note
In this context, the term "exam" is used as a synonym for "DICOM file". An exam is nothing more than a DICOM object.
:::

### Exams upload

The upload of an exam can be performed through the `POST /exams` endpoint, that accepts as input a **valid** DICOM object within a multipart formatted request.

In case of successful request, the response has status code `200 OK` containing the metadata of the uploaded exam.

The possible returned status codes are:
|   Status code   |    Meaning    |
|:---------------:|:-------------:|
| 200 OK | The request has been successful and the exam has been uploaded |
| 422 Unprocessable Entity | The request is trying to insert a non-DICOM file |
| 500 Internal Server Error | The request has failed due to unknown error |

<details>
<summary>Example of exam upload request</summary>

<b>Request</b>
```bash
curl --request POST \
  --url https://your-dicom-service/exams
  --header 'Content-Type: multipart/form-data; boundary=---boundary' \
  --form file=@/path/to/dicom/file.dcm
```

<b>Response</b>

```json
[
  {
    "00081199": {
      "vr": "SQ",
      "Value": [
        {
          "00081150": {
            "vr": "UI",
            "Value": [
              "<sopClassUID>"
            ]
          },
          "00081155": {
            "vr": "UI",
            "Value": [
              "<objectUID>"
            ]
          },
          "00081190": {
            "vr": "UR",
            "Value": [
              "http://pacs.ris.development.zeeromed.cloud/o3-dpacs-wado/wado?requestType=WADO&studyUID=STUDY_UID&seriesUID=SERIES_UID&objectUID={objectUID}&contentType=application/dicom"
            ]
          }
        }
      ]
    }
  }
]
```

</details>

### Exams retrieval
This endpoints allows to search for studies, series and instances by patient ID leveraging on the `QIDO` structure.

#### Studies retrieval
The `GET /exams/studies` endpoint allows to retrieve all the studies for a specific patient.  

This endpoint accept the following query parameter: 
* `PatientId`

#### Series retrieval
The `GET /exams/studies/:studyUID/series` endpoint allows to retrieve all the series belonging to a specific patient's study.

This endpoint accept the following path parameter:
* `studyUID`: UID of the desired study

This endpoint accept the following query parameter:
* `PatientId`

#### Instances retrieval
The `GET /exams/studies/:studyUID/series/:seriesUID/instances` endpoint allows to retrieve all the instances belonging to a specific patient's series.

This endpoint accept the following path parameter:
* `studyUID`: UID of the desired study
* `seriesUID`: UID of the desired series

This endpoint accept the following query parameter:
* `PatientId`

:::warning
The `patientId` query parameter is **mandatory** for all the endpoints.
:::

In case of successful request, the response is an array containing the desired resources for a specific user.

The possible returned status codes are:
|   Status code   |    Meaning    |
|:---------------:|:-------------:|
| 200 OK | The request has been successful and it returns the list of objects |
| 500 Internal Server Error | The request has failed due to unknown error |

<details>
<summary>Example of exam retrieval request</summary>

<b>Request</b>

```bash
curl --request GET \
  --url https://your-dicom-service/exams/studies?patientID=123456789
```

<b>Response</b>

```json
[
  {
    "00080005": {
      "vr": "CS",
      "Value": [
        "ISO_IR 192"
      ]
    },
    ...
  },
  ...
]
```

</details>

### Exam retrieval
The retrieval of a single exam can be performed through the `GET '/exams/studies/:studyUID/series/:seriesUID/instance/:instanceUID'` endpoint.
The following path parameters are necessary to correctly identify the resource:
* `studyUID`
* `seriesUID`
* `instanceUID`

The endpoint accepts the following query parameter:
* `fileType`: Two different values are allowed:
  - `application/dicom`: returns the exam DICOM file,
  - `image/jpeg`: returns the jpeg exam's thumbnail.

:::warning
The `fileType` query parameter is **mandatory**.
:::

In case of successful request, the response is a DICOM file or JPEG image, depending on the query parameter.

The possible returned status codes are:
|   Status code   |    Meaning    |
|:---------------:|:-------------:|
| 200 OK | The request has been successful and it returns the thumbnail in JPEG format |
| 500 Internal Server Error | The request has failed due to unknown error |

<details>
<summary>Example of exam JPEG thumbnail retrieval request</summary>

<b>Request</b>
```bash
curl --request GET \
  --url https://your-dicom-service/exams/studies/STUDY_UID/series/SERIES_UID/instance/INSTANCE_UID?fileType=image%2Fjpeg
```

</details>

## Callbacks
The DICOM Service exposes a callback that the PACS can use to notify the upload of a new exam. This is useful when an exam is uploaded directly from a device or a system outside your application. The method saves the incoming event from the PACS in a dedicated CRUD collection and, optionally, it can proxy the event to custom endpoints specified in the environment variable `CALLBACK_URLS` (see the [Configuration page](./30_configuration.md) for further details).

The callback endpoint is `POST /new-exam-callback` and it accepts a JSON containing the following fields:
* `SourceID`
* `StudyInstanceUID`
* `AccessionNumber`
* `PatientID`
* `NumberOfStudyRelatedSeries`
* `NumberOfStudyRelatedInstances`
* `ModalitiesInStudy`
* `AeTitles`
* `StationNames`
* `EventType`
* `StudyDate`
* `StudyTime`
* `StudyID`
* `ReferringPhysicianName`
* `StudyDescription`
* `PatientName`
* `PatientBirthDate`
* `PatientSex`

In case of successful request, the response is a `204 No Content` with empty body.

The possible returned status codes are:
|   Status code   |    Meaning    |
|:---------------:|:-------------:|
| 204 No Content | The request has been successful and it returns a `204 No Content` response |
| 500 Internal Server Error | The request has failed due to unknown error |

<details>
<summary>Example of callback request from PACS</summary>

<b>Request</b>

```bash
curl -- request POST \
  --url https://your-dicom-service/new-exam-callback
  --data '{
    "SourceID":"O3PROD",
    "StudyInstanceUID":"1.3.76.13.90696.2.20130926082332.5279531.1",
    "AccessionNumber":"62476609-1",
    "PatientID":"46803338",
    "NumberOfStudyRelatedSeries":1,
    "NumberOfStudyRelatedInstances":239,
    "ModalitiesInStudy": [
      "CT"
    ],
    "AeTitles": [
      "O3-PACS-57"
    ],
    "StationNames": [
      "Station ALFA",
      "Station BETA"
    ],
    "EventType":"COMPLETED",
    "StudyDate":"20130926",
    "StudyTime":"082329",
    "StudyID":null,
    "ReferringPhysicianName":"NO_DOC_NAME^NO_DOC_SURNAME",
    "StudyDescription":"DENTALSCAN SUP",
    "PatientName":"NO_SURNAME^NO_NAME",
    "PatientBirthDate":"19600101",
    "PatientSex":"F"
  }'
```

</details>

## Viewer Token
The DICOM Service exposes an endpoint that is used by the **DICOM Viewer** service for the visualization of a specific token. The endpoint accepts the following query parameters (some of them are mandatory):
* `studyUID` (**mandatory**)
* `patientID`
* `user`
* `role`

:::note
The role query parameter identifies which kind of viewer must be provided. The options are: `patient`, for a read-only view, or `diagnostic`, for a doctor view with all the tools needed for DICOM file manipulation. By default, `role` is set to `patient`.
:::

:::info
For further details, please refer to the **DICOM Viewer documentation**.
:::

<details>
<summary>Example of token viewer retrival request</summary>

<b>Request</b>

```bash
curl -- request GET \
  --url https://your-dicom-service/token?patientID={patientID}&studyUID=STUDY_UID&role=patient
```

<b>Response</b>

```json
{
  "token": "d3092u94r8d238fj29dd38d329d3287d3j29d"
}
```

</details>

## Unique Identifier (UID) generation
The DICOM Service allows you to generate a unique identifier (UID), based on the root UID of the organization. The generation of a UID can be performed through the `GET /uid` endpoint.

:::info
The uniqueness of the uid is mathematically guaranteed due to large space of possibilities.
:::

In case of successful request, the response is a JSON object, containing the UID in the `uid` field.

The possible returned status codes are:
|   Status code   |    Meaning    |
|:---------------:|:-------------:|
| 200 OK | The request has been successful and it returns a valid UID |
| 500 Internal Server Error | The request has failed due to unknown error |

<details>
<summary>Example of uid generation request</summary>

<b>Request</b>

```bash
curl --request GET \
  --url https://your-dicom-service/uid
```

<b>Response</b>

```json
{
  "uid": "1.234.56.789.0123456789"
}
```

</details>
