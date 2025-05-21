---
id: getting_started
title: Getting Started
sidebar_label: Getting Started
---

Mia-Care P4SaMD is a robust solution integrated with **Mia-Platform IDP** at the company level. This integration ensures seamless alignment of development and operational workflows for Software as a Medical Device (SaMD) products.

## Understanding the "Company" in Mia-Platform IDP

In the context of Mia-Platform IDP, a **Company** represents the organizational entity responsible for a specific product or group of products. When working with Mia-Care P4SaMD:
- Each **Company** in Mia-Platform IDP corresponds to a single SaMD product.
- A **single instance of P4SaMD** can be connected to one Company in Mia-Platform IDP, ensuring a dedicated setup for each SaMD.

For additional details about the concept of a "Company" and other functionalities, refer to the **[Mia-Platform IDP Official Documentation](https://docs.mia-platform.eu)**.

## ALM Tool Integration with P4SaMD

Mia-Care P4SaMD is designed to integrate seamlessly with an Application Lifecycle Management (ALM) tool to manage and synchronize critical elements of the SaMD development lifecycle.

### Entities Managed by P4SaMD
Mia-Care P4SaMD tracks and manages the following entities as part of its integration with the ALM tool:
1. **Requirements**  
2. **Software Items**  
3. **Tests**  
4. **Test Executions**  
5. **Risks**  
6. **Changes**  
7. **Versions**

### Data Synchronization with the ALM Tool
- All entities except **Software Items** are traced in the ALM tool.  
- Changes made to these entities in the ALM tool are automatically synchronized with Mia-Care P4SaMD in real-time, ensuring up-to-date and consistent information across both platforms.

### Management of Software Items and Test Executions
- **Software Items** are managed exclusively within Mia-Care P4SaMD. Their implementation and configuration are validated against Mia-Platform IDP, ensuring compliance with the overall setup.  
- **Test Executions** are also handled directly by Mia-Care P4SaMD. The platform automates the management of test executions, offering streamlined workflows and reducing manual effort.

This integration enables comprehensive tracking and management of all essential SaMD development elements, leveraging the strengths of the ALM tool and Mia-Care P4SaMD for a cohesive and efficient workflow.

## Exploring Functionality through Mia-Platform Documentation

Since Mia-Care P4SaMD operates in conjunction with Mia-Platform IDP, many core functionalities and configurations are shared across the two platforms. These include infrastructure management, development pipelines, and security protocols. For comprehensive guidance, consult the **[Mia-Platform Official Documentation](https://docs.mia-platform.eu)**.

## Next Steps
1. **Familiarize Yourself with Mia-Platform IDP:** Ensure your company and its workflows are properly configured in Mia-Platform IDP.
2. **Understand Your JIRA Project:** Map the relevant JIRA fields to the P4SaMD data model for effective synchronization.
3. **Leverage P4SaMD Capabilities:** Use the platform to efficiently manage your SaMD lifecycle within the integrated ecosystem.
