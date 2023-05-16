---
id: use_cases_bucket_storage_support
title: Bucket Storage Support Use Cases
sidebar_label: Use Cases
---

This page provides some use cases for the Bucket Storage Support services.

## Scope

Bucket Storage Support feature enables storing messages flowing through a message streaming platform into an external storage
system which provides an easy way to access data and retains it for a long time.

### Long-Term Storage

Saving messages into a bucket as a backup enable retaining those records in a cheap and accessible manner. This would
help in situation where it is necessary to store specific piece of information for a long period of time, for example for legal or fiscal reasons.

### BI tools & ML

Since the data stored on a Cloud Storage Bucket is easily accessible and easily retrievable, the Bucket can be used as a sort of Data Lake in which to store a big amount of data that is in some way related between eachother. This is an enabler to let BI applications to easily get the data from the Buckets and use them for their purposes.

Having a Data Lake, with all the data stored could also increase the possibility to use these BI tools together with statistical analysis and even Machine Learning algorithms applied onto this data. It can be done directly through the usage of the BI applications or even independently, using the Buckets as the data sources.

### Free up resources from other systems

Messages streaming platforms help moving data across databases. Storing data both in a bucket and in the database allows to
potentially free up resources on the database when the records get stale or irrelevant. In this way, old data
can be removed from the database, knowing that it can be later retrieved on demand from the bucket.