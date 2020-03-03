## Create a new CRUD
In order to create a new CRUD, go on the menu on the left where you see CRUD, select **Crea un CRUD**, and name it filling in the blank space with the name of the collection in camelCase. 
Press the button **Crea** on the right and the template of your collection will be created. 

In our case, we name the collection “book”.

If you need, you can upload your fields from file, selecting **Importa campi da File**

As soon as you push **Crea** a new page, "books" in our example, is created and you can enter a short and optional description of your collection: we wrote “Collection of books”.

In the section **Imposta le proprietà**, you can enter the fields of your collection. 
By default, there are fields that can not be changed, such as: id, creatorId, createdAt, updaterId, updatedAt, _STATE.

You can add new lines by selecting **Aggiungi riga** and fill in the blank spaces with the value you need. 

We added, a new line and we wrote “Title” and ticked the necessary fields.


![Crea-collezione-riga-titolo](img/crud-add-line.png)

* **Name**: enter the property name in camelCase; in our case we will insert "Title", "Author", "Year", "New", etc.

* **Type**: the properties can be of different types: *string* if it is a classic text string (or an image); *number* if it is a number; *date* if it is a date with dd / mm / yyyy; *boolean* if it can only be true or false; *Geopoint* if you want to save a specific place; *Array* if you want to save as an ordered set of properties; *Object* if you want to insert an object.

* If you select **required** the property is mandatory.

* If you select **crypted** the data will be encrypted in the database. We recommend that you adopt this practice for sensitive or confidential data.

* If you select **nullable**, you can make the value *null*.

* In the **description** field you can enter a short optional description.

To create the collection select **Crea**.

!!! Warning

    the collection **has not yet been saved** it is necessary to continue the process described below

![tabella_prop](img/tabella_prop.PNG)

If you want to delete a line, select red trash symbol on the right of the the table.

Once the default line is created, you can automatically create another one, ticking the box "crea un altro".

When you have finished creating all the necessary lines, press any other point on the screen to exit the add line section.


### Indexes
In the third section, Indici, you can configure the indexes, a data structure designed to improve search (query) data. If a table has no indexes, each search forces the system to read all the data in it. Instead, the index allows you to reduce the amount of data to be read to complete the search. However, creating an index reduce the writing performance

To create a new index select **crea nuovo**.
Once you named the index you need to choose among: geo, hash or TTL. Then, you can choose whether to make the index unique by ticking "unique".

![Indice](img/Indice.PNG)
