---
id: use_cases_bucket_storage_support
title: Bucket Storage Support Use Cases
sidebar_label: Use Cases
---

In this page are provided some use cases that are enabled with the introduction of Bucket Storage Support feature.

## Scope

Bucket Storage Support feature enables storing messages flowing through a message streaming platform into an external storage
system that is more apt for providing an easy manner to access data and retaining them for a very long time.

### Long-Term Storage

Saving messages onto a bucket as a backup enable retaining those records in a cheap and accessible manner. This would
help in situation where it is necessary to store specific data for a long period of time, for example for legal or fiscal reasons.

### BI tools & ML

Since the data stored on a Cloud Storage Bucket are easily accessible and easily retrievable, the Bucket can be used as sort of Data Lakes,
in which to store a big amount of data that are in some way related. This is an enabler to let BI applications to easily get the data
from the Buckets and use them for their purposes.

Having a Data Lake, with all the data stored, could also increase the possibility to use these BI tools together with statistical analysis and even Machine Learning algorithm
applied onto those data. It can be done directly through the usage of the BI applications or even independently, using the Buckets as the data sources.

### Free up resources from other systems

Messages streaming platform can help moving data across databases. Storing data both in a bucket and in the database allows to
potentially free up resources on the database when the records get stales or not relevant anymore. In this manner, old data
can be removed from the database, knowing that they can be later retrieved on demand from the bucket.