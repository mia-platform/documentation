---
id: gdpr
title: General Data Protection Regulations
sidebar_label: Protect Data
---
## How can you protect data using the console?

The design section ensures sensitive data are organised, protected, and securely stored through two functionalities:

* **Sensitivity**
* **Client side Encryption**

These two features allow you to specify the level of confidentiality you want to attribute to personal data and the way these data are encrypted when stored. 

To manage data protection, Mia-Platform's Console offers two dedicated fields in every collection of your project.

![gdpr](img/gdpr.png)

In this section, you will understand how to configure collections in order to set a sensitivity level and an encryption strategy. 

## Sensitivity

Setting a sensitivity level is an effective way to **classify your data**. Data can be classified in many different ways, and classification entails organizing data into fixed categories with specific attributes. 

:::note
Classifying data helps you understand the value of your data, determine whether data are at risk, and implement controls to mitigate those risks.
:::

The following are the categories in which data can be classified according to sensitivity levels:

![sensitivity](img/sensitivity.png)

* **Public**: information intended for public use. This type of data are not protected by intellectual property laws such as copyright, trademark, or patent laws. *(e.g. public website content or marketing materials)*

* **Confidential**: information intended for internal use only. If destroyed or compromised, this type of data can have a limited impact on your organization or its individuals. *(e.g. emails, media, and documents with no sensitive data)*

* **Secret**: information intended for restricted use, i.e. only certain members of your organization should be able to access and modify this type of data. If destroyed or compromised, this type of data can have a medium impact on your organization or its individuals. *(e.g. internal correspondence including confidential data, Supplier contracts, IT service management information, employee records)*

* **Top Secret**: information intended for mission-critical use, such as supporting strategic business processes. If destroyed or compromised, this type of data can have a catastrophic impact on your organization or its individuals. *(e.g. privileged credentials, customer personal data, credit card numbers or other financial account numbers, FISMA or health protected information, social security numbers, intellectual property)*

### Select a sensitivity level

You can set a sensitivity level from every collection table in the design section. 

**Each collection field** can be associated with a different sensitivity level. Open the drawer by clicking the edit icon and select the desired sensitivity level.

![add sensitivity](img/add-sensitivity.gif)

### Add a description

Displaying a sensitivity label leads to a compact and visually appealing representation of the data security level. 

However, for certain types of information, it might be useful to specify a more detailed set of characteristics or additional security policies that should be applied to that information.


Open the drawer by clicking the edit icon and move to the GDPR description field. Here you will be able to describe more accurately security-related information regarding your data.

![gdpr description](img/gdpr-description.gif)

## Client side Encryption

