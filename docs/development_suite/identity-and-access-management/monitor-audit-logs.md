---
id: monitor-audit-logs
title: Monitor Audit Logs
sidebar_label: Monitor Audit Logs
---

Mia-Platform Console provides an Audit Logs feature that enables users with enough administrative permissions to monitor identity actions within a Company and its related resources. Audit logs represent a crucial aspect in an Internal Developer Platform, especially with respects to governance, security, and compliance with regulatory frameworks. The goal of this feature is to ensure transparency and accountability in the use of Mia-Platform Console.  

For this reason, the Console offers a dedicated Audit Logs section, allowing to easily track logging activities in a central place.

## Audit Logs section 

The Audit Logs feature is available at the Company level within the "Administration" section of the Console.  
It is visible and accessible only to users with the "Company Owner" role and provides a comprehensive overview of recorded identities actions, that can be easily monitored.

Audit logs are displayed in a structured table format, providing the following information for each log:

*
*
*

[audit logs table](/) TO DO

Moreover, you can also access the detail of a specific log by simply clicking on the button available at the end of each table row. In this way, you can get more details about the logs you are most interested in.

[audit logs drawer detail](/) TO DO

### Filtering audit logs

To facilitate data analysis, the Audit Logs section includes advanced filtering capabilities. Users can filter logs based on multiple criteria, such as date range, action type, identity type, or resource type, allowing for precise data retrieval.

[filtering audit logs image](/) TO DO

## Security Concerns

The logs include information about the identity that performed the action, a time reference of when the action occurred, the type of action, and the resources involved. Access to audit logs data within the Console is restricted to users with the "Company Owner" role, who can view an aggregated overview of logged events. The raw log data is stored in a dedicated MongoDB database and is only accessible to administrators managing the Console installation. This ensures that log information is protected from unauthorized access while still enabling Companies to maintain oversight of key activities.

## Data Retention Period

## Audit Logs for On-Premise Installations
