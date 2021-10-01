---
id: gdpr
title: Data Protection
sidebar_label: Protect Sensitive Data
---

The General Data Protection Regulation ([GDPR](https://gdpr-info.eu/)), applicable as of May 25th, 2018 in all European member states, harmonizes data privacy laws across Europe.

GDPR requires organizations to protect the data of their consumers and to guarantee proper security controls. 

## How can you protect data using the console?

The design section ensures sensitive data are organized and protected through two functionalities:

* **Sensitivity**
* **Client-side Encryption**

These two features allow you to specify:
* the level of confidentiality data are associated to 
* the way data are encrypted when stored

### Where do I find these functionalities?

To manage data protection, Mia-Platform's Console offers two dedicated columns for every collection populating your project: Sensitivity and Client-side Encryption

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

* **Top Secret**: information intended for mission-critical use, such as supporting strategic business processes. If destroyed or compromised, this type of data can have a catastrophic impact on your organization or its individuals. *(e.g. privileged credentials, customer personal data, credit card, and financial account numbers, health protected information, social security numbers, and intellectual property)*

### Select a sensitivity level

You can set a sensitivity level from every collection table in the design section. 

**Each collection field** can be associated with a different sensitivity level. Open the drawer by clicking the edit icon and select the desired sensitivity level.

![add sensitivity](img/add-sensitivity.gif)

### Add a description

Displaying a sensitivity label leads to a compact and visually appealing representation of the security level of your data. 

However, for certain fields, it might be useful to specify a more detailed set of characteristics or additional security policies that should be taken into consideration before modifying that field.


Open the drawer by clicking the edit icon and move to the GDPR description field. Here you will be able to describe more accurately security-related information regarding your data.

![gdpr description](img/gdpr-description.gif)

<br/>

## Client-side Encryption

By enabling client-side encryption, you can encode a specific portion of your data to become hidden or inaccessible to unauthorized users once stored on your database.

:::note
Encryption helps you protect private information by means of an **encryption key**, an unpredictable and unique string of bits created explicitly for encrypting and decrypting data.
:::

You can have further details regarding different encryption key generation techniques in the [dedicated section](./../../../runtime_suite/crud-service/encryption_configuration#configuration).


There are several ways in which encryption algorithms can be designed to protect your data. Different implementations may provide different levels of protection or other types of capabilities, such as the searchability of encrypted data.

Mia-Platform's Console allows you to choose between two different encryption strategies:

![client-side-encryption](img/client-side-encryption.png)


* **Randomized**: This strategy ensures a given input value always encrypts to a different output value each time the encryption algorithm is executed. It provides the strongest guarantees of data confidentiality, but it also prevents support for any read operations which must operate on the encrypted field to evaluate the query.

* **Deterministic (searchable)** This strategy ensures a given input value always encrypts to the same output value each time the encryption algorithm is executed. It provides greater support for reading operations, however encrypted data with low cardinality are susceptible to frequency analysis recovery.

:::info
For sensitive fields that are not used in reading operations, Randomized Encryption can offer improved protection from frequency analysis recovery.
:::

### Select an encryption strategy

You can set an encryption strategy from every collection table in the design section.

**Each collection field** can be associated with a different encryption strategy, you only have to open the drawer by clicking the edit icon and search for the data protection section:

* Check *Enable client-side encryption* to enable the randomized version of the encryption algorithm

* Check also *Allow search on encrypted data* to enable the deterministic version of the encryption algorithm

![client side encryption](img/client-side-encryption.gif)

For further details regarding client-side encryption, check out the complete [encryption configuration](./../../../runtime_suite/crud-service/encryption_configuration).

:::caution
It's only advisable to encrypt newly created collection fields.

Changes in the encryption configuration **will not modify any existing record** populating your collection.  
If you decide to enable encryption on already populated fields, please verify to have already manually migrated your data correctly.
:::