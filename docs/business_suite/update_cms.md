# How to update the CMS

Here you will find all the steps to update the CMS.

## 1. How to understand your version of the CMS

To understand the current version of your CMS, open the CMS page. Scroll down the **left side menu** to the end: at the end of all the collections, you will find the wording **"My API CMS vxxxx"** with an indication of the version (eg v.7.0.10) .
At this [link](https://docs.mia-platform.eu/release_notes/apiconsole_releasenotes/) you will find a list of the released versions of the CMS and the respective supported features.


## 2. How to update the CMS version

To update the CMS version the steps are two:

### First step

Change the **CMS configuration**. The path to access the configuration file on git is:

`>projectname/Webapp/custom CMS/.gitlab-ci.yml`

In the "variables" section you can find **"CMS_VERSION"**, which must be updated with the latest available or desired version of the CMS. At this point, the CMS in test is saved and displayed.


### Second step

Proceed with the **configuration for Gitlab CI** . To do this the path on git is:

`>projectname/config/.gitlab-ci.yml`

In the file you can find the configuration of all environments (development, preprod and cloud).

For each environments, in the "variables" section you can update the CMS version to the **"CMS_IMAGE_NAME"** field.

!!! warning
    You should **save** and **deploy** the project from the API Console in each environments. Only after the deploy it will be possible to see the updated CMS version in each environments.
