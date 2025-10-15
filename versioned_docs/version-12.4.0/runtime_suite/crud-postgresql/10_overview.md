---
id: overview
title: CRUD SQL
sidebar_label: Overview
---



CRUD acronym stays for ***Create-Read-Update-Delete***. The CRUD SQL purpose is to abstract a Data Collections allowing 
developers to expose CRUD APIs over the SQL databases in an easy, scalable, and secure way.

## Use cases
CRUD SQL exposes an HTTP Interface to perform CRUD operations on a RDBMS over tables defined via JSON Schema.

Via APIs it's possible to:

- read a table and filter results;
- count number of elements in a table;
- create a new element in a table;
- update one element of a table;
- delete one or more elements of a collection.
- import elements from a file csv into a table

## Prerequisites
CRUD SQL needs an instance of a sql database to connect to. The database must already be configured and must accept 
connections from outside. All the tables that you want to access through the CRUD SQL must be already present on the DB.
If you want to keep track of the user who create/update a record and the creation/update time, the corresponding columns must be configured on the tables
(see  [metadata fields](/runtime_suite/crud-postgresql/20_configuration.md#metadata-fields) form more information).

## Supported vendors
Three different vendors are currently supported:
- Microsoft SQL Server
- PostgreSQL
- Oracle (supported by the [template](/runtime_suite_templates/crud-sql-template/10_overview.md))
