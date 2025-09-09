---
id: security
title: Security
sidebar_label: Security
---



Audit logs may contain sensitive information that are not encrypted until they are stored into MongoDB, so you must ensure that:

1. Data in transit is always encrypted, by using secure connections between [Kafka][kafka], [Kafka2Rest][kafka2rest], the [CRUD Service][crud-service] and [MongoDB][mongodb]
2. Only these services can access the audit trail, by using dedicated credentials with exclusive access to the [Kafka][kafka] topic and the [MongoDB][mongodb] collection
3. The audit trail cannot be altered, deleted or tampered with after being stored into [MongoDB][mongodb]

The following sections illustrate the technical measures you should implement to satisfy these requirements.

## Security checklist

- [ ] Ensure the log level of your microservice is lower or equal than the `AUDIT_TRAIL_LOG_LEVEL`, otherwise the audit logs will be suppressed by the logger.
- [ ] Ensure your microservice does not log any personal or sensitive information or encrypt them client-side; for a detailed list of the data you should not include in your logs, please take a look at the [OWASP Logging Cheat Sheet][owasp-logging-cheat-sheet-data-to-exclude].
- [ ] Configure monitoring and automatic alerting mechanisms on Kafka or MongoDB to promptly notify your team about relevant events, like potential incidents or suspicious activities (see also the [monitoring and alerting overview][overview-monitoring-alerting]).
- [ ] Restrict access to audit logs to prevent altering or tampering and regularly review access policies
- [ ] Use dedicated MongoDB credentials with exclusive access to the audit logs collection and limited permissions, to prevent update or delete operations on the records or the collection itself
- [ ] Consider using a separate MongoDB instance dedicated exclusively to store audit logs, especially if they contain sensitive information
- [ ] Define audit logs retention policies for Kafka, Grafana and MongoDB

For more detailed security guidelines, we recommend reading the [OWASP Logging Cheat Sheet][owasp-logging-cheat-sheet] and [OWASP Top 10][owasp-top-10-logging-monitoring-failures].

The remaining sections delves into the security of the architecture components.

## Logs redundancy and retention policies

To ensure redundancy and protect the availability and integrity of the audit trail, we recommend sending a copy of the audit logs, together with the other application logs, to Grafana. This is the default behavior if you configure the Audit Trail in the PaaS.

This measure provides an additional layer of security against any technical issues and malicious attempts of altering or tampering with the audit logs, since, depending on the various retention policies, you are going to have up to three different read-only copies of the audit logs on Kafka, Grafana and MongoDB respectively.

The following table provides a starting point to figure out the best retention policies for your specific use case, giving enough room to find an adequate balance of security and resource usage.

| Component | Retention                   |
|-----------|-----------------------------|
| Grafana   | 30-60 days (45 in the PaaS) |
| Kafka     | 1-5 days                    |
| MongoDB   | Forever                     |

## Encryption of data in transit

The sidecar and [Kafka2Rest][kafka2rest] should authenticate with Kafka using [SASL/SCRAM][kafka-sasl-scram] with Transport Layer Security (TLS) and use dedicated credentials, granting exclusive access to the topic and ensuring no other system can write in the Kafka topic.

For additional information on how to configure a Kafka cluster to encrypt data in transit, please take a look at Confluent [official documentation][kafka-encryption] and [security course][kafka-security-course].

All HTTP services should communicate with each other only using HTTPS connection with Transport Layer Security (TLS), unless internal endpoints are used.

## Encryption of data at rest

Kafka does not natively support data encryption at rest, so you may need to perform client-side encryption on sensitive information before including them in the log.

To ensure audit logs cannot be altered, deleted and tampered with once they have been stored inside a MongoDB collection, you should:

- Use a dedicated MongoDB database, where only audit logs are stored
- Create a user with [custom roles][mongodb-user-roles], allowing only insert or read operations (update or delete operations must be forbidden)
- Review roles and permissions of default users to prevent them from accessing, updating or deleting audit logs or altering or deleting the collection
- Enable [Client-side field level encryption (CSFLE)][mongodb-csfle] on the fields which may contain sensitive information

## Client-side encryption

The [CRUD Service][crud-service] should use [client-side encryption][crud-service-csfle] on all fields that may contain sensitive or personal information and use [Google Key Management Service][crud-service-google-kms] to safely store the master encryption key.

:::note

Client-side encryption requires an enterprise version of MongoDB supporting [Client-side field level encryption (CSFLE)][mongodb-csfle] (v4.2 or later).

:::


[kafka]: https://kafka.apache.org/
[kafka-encryption]: https://docs.confluent.io/platform/current/kafka/encryption.html
[kafka-sasl-scram]: https://docs.confluent.io/platform/current/kafka/authentication_sasl/authentication_sasl_scram.html
[kafka-security-course]: https://developer.confluent.io/courses/security/intro/
[mongodb]: https://www.mongodb.com
[mongodb-csfle]: https://www.mongodb.com/docs/v7.0/core/csfle/
[mongodb-user-roles]: https://www.mongodb.com/docs/manual/core/security-user-defined-roles/
[owasp-logging-cheat-sheet]: https://cheatsheetseries.owasp.org/cheatsheets/Logging_Cheat_Sheet.html
[owasp-logging-cheat-sheet-data-to-exclude]: https://cheatsheetseries.owasp.org/cheatsheets/Logging_Cheat_Sheet.html#data-to-exclude
[owasp-top-10-logging-monitoring-failures]: https://owasp.org/Top10/A09_2021-Security_Logging_and_Monitoring_Failures/

[crud-service]: /runtime_suite/crud-service/10_overview_and_usage.md
[crud-service-csfle]: /development_suite/api-console/api-design/gdpr.md#client-side-encryption
[crud-service-google-kms]: /runtime_suite/crud-service/30_encryption_configuration.md#configure-csfle-with-the-google-cloud-platform-gcp
[kafka2rest]: /runtime_suite/crud-service/10_overview_and_usage.md

[overview-monitoring-alerting]: /runtime_suite_sidecars/audit-trail/10_overview.md#monitoring-and-alerting
