# Release Release Platform
## v.4.15.0 (Jan 16, 2019)
Announcements:

* We have re-established the service area with **the introduction of the possibility to add custom templates**

* We **resitiate the deployment area** and **the header** of the application

* We have enabled the ability to write **complex queries** to filter the individual **properties in the CMS**


## v4.14.0 (Dec 18, 2018)
* Evolutions in the CMS configuration area:
* you can **highlight fields in the table by setting a query**, background color and text color. This will allow the user of the CMS to highlight the most significant data.
* we have also released the possibility of **configuring notifications in the cms menu**. Just activate the notifications and choose the query on the data you want to view. In this way a badge will appear next to the page where you have activated the notifications that will count the elements present in that collection based on your query.

* We have set **cancellation** of the deductions also as regards the cancellation of the decorators within the **Pre and Post Hook** areas.

* We have restyled the site's header to allow the user a better awareness of the project and of the branch in which he is working.

* you can start **creating a project from the home page**. Thanks to this new feature, a project will be created on empty GitLab and will be added to the API API DB.

**Evolution in the import of CMS. - v7.0.16**

From today, if a file with existing ids is imported, the data are not duplicated but updated.
If the id does not exist, a new data is created instead.

!!! warning
If a wrong id is passed, the entire import fails.

## v4.13.0 (Nov 14, 2018)
### Breaking change api-console-configuration v0.3.0

We have released the following updates:

* **new version of api-console-configuration** that has changed from v0.2.0 to v0.3.0.
In this new configuration the following new features have been added:
* we support the **latest version of CRUD** with the addition of two new routes: PATCH / and POST / upsert-one;
* we have made it possible **to edit the name of the category and the page in the CMS**.

* we have also enabled the **cancellation of the analytics** and made a fix on the filters.

## v.4.12.0 (Oct 31, 2018)

With version 0.14 we have released two updates:

* **the conflict between two people working on the same branch has been resolved**. If two people work on the same branch, the second person trying to commit is now blocked. In fact, he receives an error message to commit. The developer can however in the save page change the branch to be released and create a branch from his commit. In this way he can view his configurations on a new branch.

* Two new interface types ** were created to support objects and arrays in the CMS section:
* rawobject
* rawarray
With these interfaces you can directly edit the object and the array in json format.

**CMS - v.7.0.14**

We have released the following features:

* management of **new rawObject and rawArray interfaces**
* **change of labels** in Public and Delete actions
* fix to the management of the **icons**
* **ACL on groups** that can access the CMS. To this [link](https://docs.mia-platform.eu/configurator/conf_cms/#5-controllo-accessi-sui-gruppi-acl-sui-groups) is how to configure this extension of the CMS.

## v.4.11.0 (Oct 23, 2018)

In this version we have released the **update to the session manager** and the new acl expression syntax and we have made fixes on the configuration of the analytics.

## v. 4.10.0 (Oct 10, 2018)
### Analytical configuration

With version 0.12.0 it will be possible **to configure the analytics from API Console**.
To this [link](https://docs.mia-platform.eu/configurator/api_console_configanalytics/) the documentation on how you can configure them.

The possibility of setting up an acl for groups accessing the pages of the CMS has also been released. In this way, some pages can only be viewed by some user groups.

**CMS - v.7.0.11**

In this version of the CMS you can select the **icons from font-awesome up to version v.5.3.1**, which is the latest version supported (here is the [link] (https://fontawesome.com / icons? d = gallery) for the icons).

!!! warning
If you choose icons that were already used in the previous version, you will continue to display the old icons in the CMS. This is because priority is given to backward compatibility.

## v.4.7.0 (Sept 30, 2018)

**CMS v7.0.4**

In this version new CMS customizations have been released.

It will be possible to define the following css variables:

* color brand gradient 1 = allows you to customize the color of the **text in the menu sidebar**
* color badge - bg notification = allows you to customize **color background of notifications badges**
* color badge - text notification = allows you to customize the color of the **notification badge text**

Also from this version the CMS font will be in **Proxima-new**


**CMS v7.0.0 - Breaking Change (for Cards)**
With version 7, 3 important features have been released:

1) **new card structure** with the possibility of configuring different types of widgets and having a fully customizable structure. You can read the Documentation on how to configure the new cards [here] (https://docs.mia-platform.eu/configurator/conf_cms/#1-configurare-le-card).

2) the **highlight** function has evolved. With this version it is possible to highlight the CMS lines by writing a query and the user can also configure the colors to highlight the line (text and background color). To this [link](https://docs.mia-platform.eu/configurator/conf_cms/#3-configurare-gli-highlight) an example of a highlight.

3) the possibility of having **notifications** in the menu has been added. Read to this [link](https://docs.mia-platform.eu/configurator/conf_cms/#2-configurare-le-notifiche) the documentation to see an example.


**CMS v6.1.0**

With version 6.1.0 we have released new features in the CMS export area.
In fact, from this version it will be possible:

1. **Choose whether to export the label or id**: when you export a file you will see a case of your properties with the id in another with the label. This feature allows you to have more readable files if the ids are not clear.
2. **Choose the delimiter**: you can choose whether to export a file with delimiter la, or il; . This feature allows those who use excel to have an immediate conversion from .csv to excel
