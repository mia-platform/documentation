---
id: configuration
title: Configuration
sidebar_label: Configuration
---

After the installation of Mia-Care P4SaMD, the configuration activities are carried out by **Mia-Care qualified personnel** to adapt the system to the customer’s specific requirements. This ensures seamless integration and functionality within the customer’s environment.

### **Configuration Activities** 

1. **JIRA Integration (Mandatory)**: The integration with JIRA is a critical configuration step to enable data synchronization between JIRA and Mia-Care P4SaMD. This includes:
    - **Mapping JIRA Issue Fields:** Aligning the JIRA issue fields with the P4SaMD data model to reflect the customer’s unique configuration.
    - **Setup of JIRA Webhooks:** Configuring webhooks on JIRA projects to facilitate the automatic transmission of relevant data to P4SaMD in real time.

2. **Console extension with Single Sign-On**: P4SaMD is designed to run as a [Console extension with SSO][console-extension-sso] for seamless integration with Mia-Platform Console authentication and authorization flow, to avoid additional logins and manage security policies directly through the Console. More information about Console roles and permissions are available on the [official documentation][console-roles-permissions].

3. **Test Framework Setup (Optional)**: If required, Mia-Care can configure the testing framework to support automated integration and system testing. This includes:
    - Setting up and enabling automated test tools to streamline quality assurance processes.
    - Configuring test cases and workflows to validate system functionality and performance.
    
:::note
Customers may also choose to perform this configuration independently at a later stage using the provided documentation.
:::

### Configuration Completion
Upon completing the requested configurations, Mia-Care provides a detailed summary of the activities performed. This documentation ensures the customer has full visibility into the configured settings and their alignment with the operational requirements.

For any additional customization needs or further support, customers are encouraged to contact Mia-Care’s support team.


[console-extension-sso]: https://docs.mia-platform.eu/docs/console/console-extensibility/extension-sso
[console-roles-permissions]: https://docs.mia-platform.eu/docs/development_suite/identity-and-access-management/console-levels-and-permission-management