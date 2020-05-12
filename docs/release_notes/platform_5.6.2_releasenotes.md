# Platform Release Note

## v5.6.2 (May 12,2020)

**New Features**

**Improvements**

* *Design*       
  **Restyling** of spaces in the Search bar in each section of Design area and the width of the input of each form.

**Fixed**

* *CMS*     
  Now it is possible to **export all the records** from CMS without any limitation of number. 

* *CMS*     
  **CRUD-Service does not go in error** if the new property 'groups' of the CRUD 'cmsmenu' does not exist while you are editing a 'cmsmenu' filter based on groups.
  If you have configured 'cmsmenu' CRUD, the menu items will not be shown in CMS unless you manually add 'groups' property. The bug will be fixed in v5.6.2.

* *CMS*     
  **Logout from CMS is enabled** and returns a feedback in case of error.

**How to update your DevOps Console?**

In case of on-premise Console, to use the previous features, you have to update:  

* Console website @1.19.0

* Console backend @1.19.0

If you have a custom CMS, you have also to update it at v9.8.1.