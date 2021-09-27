---
id: gdpr
title: Data Protection
sidebar_label: Protect Sensitive Data
---

The General Data Protection Regulation ([GDPR](https://gdpr-info.eu/)), applicable as of May 25th, 2018 in all European member states, harmonizes data privacy laws across Europe.

GDPR requires organizations to protect the data of their consumers and to guarantee proper security controls. 

## How can you protect data using the console?

The design section ensures sensitive data are organised and protected through two functionalities:

* **Sensitivity**
* **Client-side Encryption**

These two features allow you to specify:
* the level of confidentiality data are associated to 
* the way data are encrypted when stored

### Where do I find these functionalities?

To manage data protection, Mia-Platform's Console offers two dedicated columns for every collection existing in your project.

![gdpr](img/gdpr.png)

In this section, you will understand how to correctly configure collections in order to set a sensitivity level and an encryption strategy. 

## Sensitivity

Setting a sensitivity level is an effective way to **classify your data**. 

Data can be classified in many different ways, organizing information into fixed categories with specific attributes. Data classification can help you stay compliant with the GDPR by allowing you to properly organize your data and implement security controls to detect anomalies.

:::note
Classifying data helps you understand the value of your data, determine whether data are at risk, and implement controls to mitigate those risks.
:::

The following are the categories in which data can be classified according to sensitivity levels:

![sensitivity](img/sensitivity.png)

* **Public**: information intended for public use. This type of data is not protected by intellectual property laws such as copyright, trademark, or patent laws. *(e.g. public website content or marketing materials)*

* **Confidential**: information intended for internal use only. If destroyed or compromised, this type of data can have a limited impact on your organization or its individuals. *(e.g. emails, media, and documents with no sensitive data)*

* **Secret**: information intended for restricted use, i.e. only certain members of your organization should be able to access and modify it. If destroyed or compromised, this type of data can have a medium impact on your organization or its individuals. *(e.g. internal correspondence including confidential data, Supplier contracts, IT service management information, and employee records)*

* **Top Secret**: information intended for mission-critical use, such as supporting strategic business processes. If destroyed or compromised, this type of data can have a catastrophic impact on your organization or its individuals. *(e.g. privileged credentials, customer personal data, credit card, and financial account numbers, FISMA or health protected information, social security numbers, and intellectual property)*

### Select a sensitivity level

You can set a sensitivity level from every collection table in the design section. 

**Each collection field** can be associated with a different sensitivity level. Open the drawer by clicking the edit icon and select the desired sensitivity level.

![add sensitivity](img/add-sensitivity.gif)

### Add a description

Displaying a sensitivity label leads to a compact and visually appealing representation of the security level of your data. 

However, for certain fields, it might be useful to specify a more detailed set of characteristics or additional security policies that should be taken into consideration before modifying that field.


Open the drawer by clicking the edit icon and move to the GDPR description field. Here you will be able to describe more accurately security-related information regarding your data.

![gdpr description](img/gdpr-description.gif)

## Client-side Encryption

