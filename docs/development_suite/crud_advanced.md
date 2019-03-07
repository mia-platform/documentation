## Create a new CRUD
Let's imagine we have to create a new collection that contains the books of a library and we go to understand what are the steps to be done.

To create a new collection, select **Collections** on the left and select **Add new**.

First you need to enter the name of the collection in camelCase, in our case we will insert "books".

By default there are fields that can not be changed: _id, creatorId, createdAt, updaterId, updatedAt, _STATE_

The user can add a new line by selecting **add line**. Then you must complete the following fields:

![Crea-collezione-riga-titolo](img/Crea-collezione-riga-titolo.PNG)

* **Name**: enter the property name, in camelCase, in our case we will insert "title", "author", "year" etc.

* **Type**: the properties can be of different types: *string* if it is a classic text string (or an image); *number* if it is a number; *date* if it is a date with dd / mm / yyyy; *boolean* if it can only be true or false; *Geopoint* if you want to save a specific place; *Array* if you want to save as an ordered set of properties; *Object* if you want to insert an object.

* If you select **required** the property is mandatory.

* If you select **crypted** the data will be encrypted in the database. We recommend that you adopt this practice for sensitive or confidential data.

* If you select **nullable**, you can give the value *null*.

* In the **description** field you can enter a short optional description.

To create the collection select **create**.

!!! Warning
    the collection **has not yet been saved** it is necessary to carry out the steps described below

![tabella_prop](img/tabella_prop.PNG)

If you want to delete a line select the line and select **delete** (next to "add line").

Once the default line is created, the user is given the option to create another one. Once you have finished creating all the necessary lines, press any other point on the screen to exit the add line section.

To **edit a collection** simply select the desired collection from the list in "collection" and edit the fields in the screen that is displayed.

### Indexes
An index (in the database field) is a data structure designed to **improve search (query) data**. If a table has no indexes, each search forces the system to read all the data in it. Instead, the index allows you to reduce the amount of data to be read to complete the search. However, creating an index reduce the writing performance

To create a new index select **create a new index**.

Once the index name has been entered, the user must choose the type by selecting between: *normal, geo and hash*. Then the user can choose whether to make the index unique by selecting **unique**.

![Indice](img/Indice.PNG)
