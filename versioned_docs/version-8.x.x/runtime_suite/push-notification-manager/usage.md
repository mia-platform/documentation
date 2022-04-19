---
id: usage
title: Mail Notifications Manager Usage
sidebar_label: Usage
---
The APIs exposed by the service are the following:

* `GET /notifications/` : return the list of notifications destinated to the requesting user  

* `PATCH /notifications/:id` : add or remove the requesting user from the readBy array of the specified notification  

* `PATCH /notifications` : add or remove the requesting user from the readBy array of all his notifications
