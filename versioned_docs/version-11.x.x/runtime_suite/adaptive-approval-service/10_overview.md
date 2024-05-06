---
id: overview
title: Rules Service
sidebar_label: Overview
---
### Overview

The **Rules Service** allows the user to define, manage and verify rules.
Given an input payload the service will checks all the rules defined and return the response related to the first rule matched.

### Endpoints

The service expose the following endpoints to manage rules:
- `POST /rule` Used to create a new rule
- `PATCH /rule/{ruleId}` Used to update a rule based on the `ruleId`
- `DELETE /rule/{ruleId}` Used to delete a rule based on the `ruleId`
- `POST /check` Used to retrieve data related to the first rule matches with the given input payload
