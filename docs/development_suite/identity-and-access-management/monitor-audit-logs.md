---
id: monitor-audit-logs
title: Monitor Audit Logs
sidebar_label: Monitor Audit Logs
---

Mia-Platform Console provides an Audit Logs feature that enables users with enough administrative permissions to monitor identity actions within a Company and its related resources.
Audit logs represent a crucial aspect in an Internal Developer Platform, especially with respects to governance, security, and compliance with regulatory frameworks.
The goal of this feature is to ensure transparency and accountability in the use of Mia-Platform Console.  

For this reason, the Console offers a dedicated Audit Logs section, allowing to easily track logging activities in a central place.

## How Audit Logs work

The actions are tracked using **Rönd** that intercepts all the API calls, thanks to its policies extracts the useful informations and stores them in log records.
For this reason, the Audit Log system needs that Rond is enabled to work (see
[Enable Rönd](../../console/tutorials/protect-your-endpoints-with-policies.mdx#enable-rönd) for more details)

## Audit Logs section

The **Audit Logs** feature is available at the **Company** level within the **Administration** section of the Console.
It is accessible only to users with the **Company Owner** role and provides a comprehensive overview of recorded identity-related actions for easy monitoring.  

Audit logs are displayed in a structured table format, offering the following details for each entry:  

- **Date and time** of the action  
- **Author** of the action (*User* or *Service Account*)  
- **Operation performed** (*Creation*, *Edit*, or *Deletion*)  
- **Target resource** and its **Scope**  
- **Type** of the target resource  

[audit logs table](/) TO DO

Additionally, you can view the details of a specific log by clicking the button at the end of each table row. This allows you to access more in-depth information about the logs that interest you most.

[audit logs drawer detail](/) TO DO

### Filtering audit logs

The **Audit Logs** section includes advanced filtering capabilities to facilitate data analysis. Currently, logs can be filtered based on:  

- **Date and time** of the action (by setting a start date, end date, or a date range)  
- **Author identity**  
- **Author identity type**  
- **Type of target resource**  

[filtering audit logs image](/) TO DO

## Security Concerns

The logs include information about the identity that performed the action, a time reference of when the action occurred, the type of action, and the resources involved. Access to audit logs data within the Console is restricted to users with the "Company Owner" role, who can view an aggregated overview of logged events. The raw log data is stored in a dedicated MongoDB database and is only accessible to administrators managing the Console installation. This ensures that log information is protected from unauthorized access while still enabling Companies to maintain oversight of key activities.

## Data Retention Period

## Audit Logs for On-Premise Installations
