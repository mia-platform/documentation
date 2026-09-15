---
id: overview
title: ACL Service
sidebar_label: Overview
---



:::danger
The ACL service is deprecated, and no active development, new versions, or bug fixes are planned. It will reach end of life with the v14.0.0 of the console.
:::

The ACL microservice is a [PRE Decorator](/products/console/api-console/api-design/decorators.md) whose purpose is to apply ACL rules for each request to indicate to the CRUD Service which rows or columns to filter.
These ACL rules are based on the current user and his membership groups.

Currently two types of ACL are provided by the service:

- *ACL by rows*: prepares a query that will filter documents based on the current user (for example, to show only documents created by the user).
- *ACL for read columns*: allows to limit the fields that the user can see in the answer on the basis of his group membership and the type of customer.

This service acts by reading and writing http headers. In fact, the user and group information are retrieved from the header, and the result of the application of the rules is the writing of ACL headers that the CRUD Service is able to interpret to actually perform the filters.
