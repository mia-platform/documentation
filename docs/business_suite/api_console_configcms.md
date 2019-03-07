# How to Configure the CMS from the API Console

From the API Console you can easily configure and manage your CMS.

!!! Note
Remember that before you can configure the CMS you must have already created your collections in the Collections area and displayed the related Endpoints.

## Categories and Pages

The CMS consists of categories and pages. Pages and categories form the basis of the CMS information architecture.

The **Categories** are useful for grouping similar pages within them. The categories appear only in the CMS menu and represent a different section of the menu.

To give an example: in our cms of the heroes we will create the collection ** Characters ** and inside we will place the different pages of heroes: good heroes, bad heroes, helpers etc ...

The **Pages** instead are used to represent the data of a collection. Within the pages you can manage your collections and the data in it.

!!! tip
Before creating pages or categories try to build the information architecture of your CMS. It will be much simpler at that point to know what to create.

## How to create a category

![](img/crea-categoria.JPG)

To create a category, simply enter the ** Name ** of the category you want to display on the CMS and the display order.

!!! tip
We advise you to always order by following the tens order. If we want our category to be the first in the CMS, then we will write 10. This will facilitate the change of order of the categories.

In our case, of the CMS of the heroes, then we will write: Name = Characters and Order = 10

## How to create a page

The creation of a page consists of two steps:

1. Configure the menu area
2. Configure the general settings

### Configure the menu area
![](img/area-menu.jpg)

In this section you can choose how to represent the page in the CMS side menu. Let's take the example of the Good Heroes page

**Name**: You will need to enter the name to be displayed in the menu to represent your page. In our case: Heroes Good

**Endpoint**: You will have to choose which endpoint to hook your page to. In our case: / eroibuoni

**Category**: You will have to choose your page in which category will be inserted. In our case we will hook the Characters category

**Icon**: You can choose whether to give your page an icon that represents it in the CMS. To give an example: if yours is the book page, you can choose the book icon to represent it.
At this [link] (https://fontawesome.com/v3.2.1/icons/) you will be able to view and select all the available icons.

**Order**: With Order you can choose what order to give to your page within a category. We advise you to give the pages a number belonging to the tens order (ex: page 1 will have the order 10)

### Configure the General Settings
![](img/impostazioni-generali.JPG)

In this section you can choose the general configurations of your page.

**Layout**: you can decide the layout you want to give to your collection. The possible layouts are:
* *Table* is the most classic table view mode.

* *TableUser* is the display mode for users. It has in fact a special Reset Password field at the beginning of the table.

* *TablePush* instead is the perfect table for push notification or to send notifications to customers. Next to the table you will always find a push button to inject the content to your customers.

* *Card* each item will be represented similar to a card. To be able to view the card it will be necessary to configure it, to this [link] (https://docs.mia-platform.eu/configurator/conf_cms/#1-configurare- le-card) find how to do it.

* *Gallery* is instead the perfect representation for images.

**Highlight a** field: this select shows you the properties that are boolean in your page. You can in fact choose to highlight a boolean property in the CMS. If the property is true you will see it highlighted in bold.

**Permanently Delete**: activating this check choose to permanently delete an element from the database. Appears when you want to delete an item in Trash.

**Block**: activating this check choose to permanently block a page. In this way CMS will not be able to create new elements.

**Hide**: by activating this check, choose to hide a page.

**Apply a filter**: in this field you can apply a visibility filter to your page.
To write a query we recommend two links: 1) the different types of [query] (https://docs.mongodb.com/manual/tutorial/query-documents/) 2) all types of [operators] (https: //docs.mongodb.com/manual/reference/operator/query/#query-selectors) that you can use.

Let's take an example: in my collection I have a property that is the same as state (indicates the state). In this page I want to see only the data that have how state = a working. In this page I want to see only the data that have how state = a working.
The query will be: {"state": "working"}
An example of a more complex query in which, for example, I want to say that the state property must be equal to those stored or rejected can be written as follows: {"$ or": [{"state": "archived"}, { "state": "refused"}]}

## Customizing properties

To make your CMS perfectly compatible with your needs, the last section on which you will be working is your property.

The properties section allows you to customize every single property.
We can divide this complex area into several parts:

1. the general settings of a company
2. visibility filters
3. the area of the lookups

### 1. The general settings of a property

For each property you can configure different fields that allow you to improve the user experience in the CMS:

![](img/property-generali.JPG)

* ** Interface Type **: Depending on the type of property defined in the collection, you can choose whether to improve the visibility of that property. Interface types can be of different types:

* *string* if it is a classic text string;
* *number* if it is a number;
* *datetime* is instead a complete date with hours, minutes and seconds;
* *boolean* if it can only be true or false; * text * if we want the content to be read as html;
* *textArea* if it is a text field, for example a description;
* *Lookup* are used to select some values or between a range of values chosen by me or between a range of values taken from another collection. If you are interested in the theme of the Lookups below you will find a dedicated section;
* *Multilookup* if you want to select multiple values;
* *Array* if you want to save it as an ordered set of properties;
* *Object* is a set of properties not ordered;
* *Geopoint* if you want me to save a specific place;
* *Files* if it is a file such as an image or a pdf. In our case we will choose string simply wanting to write the name of the title.

* **Label**: is the name you want to be displayed in the CMS.

* **Description**: you can enter the description of your property.

* **Order**: indicates the order of the property in the CMS display. Remember to use the tens meter (the first is the number 10), this will make it easier for you to manage the subsequent changes.

* **Location on the card**: if you have chosen the Card display mode you can choose in which position of the card to display your property. For more information follow this [link] (https://docs.mia-platform.eu/user_guide_and_tools/api_console/guida_api_console/#card-position)

* **Editable**: if you activate this check the property can be modified by anyone, otherwise it will not be editable by CMS

* **Visibility**: indicates at what level of the CMS you want to show a property. Layers can be: * Hidden * and is not visible; * All * and is visible in the main table; * Detail and Modal * and it is visible when you click in the table, in the right area of ​​your CMS, at this level you tend to put non-priority information, but which bring value, eg: in-depth information. Last is only in modal: * Modal * that is when I click Expand from the Side edit area.

### 2. The visibility filters

In this section you can control the visibility of a property.
You can either refuse to make your property appear only under certain conditions.

Visibility can be controlled in two stages:

1. in the process of creating a new element in the CMS
2. when editing an item

#### Control being created

To control visibility during creation, you must choose which other property affects its visibility.

What should I do?

1. choose the **property**, I have a select that shows me all my properties.
2. choose the **comparator**.
3. choose the **value**.

!!! tip "Comparators"
The supported comparators are the following:

value | comment
------- | ---------
`<` | lower
`<=` | less or equal
`>` | greater
`> =` | greater or equal
`==` | equal
`! =` | different
`===` | strictly equal
`! ==` | strictly different



#### Control when editing an element

To control the visibility when editing an item, you must follow the same steps for checking when creating.
However, your property will only appear this time when you want to change an item from CMS.

You will always have to:

1. choose the **property**.
2. choose the **comparator**.
3. choose the **value**.

!!! example
To give an example: I have a CMS that manages the warehouse of a supermarket, I am in the property * expiry date *,
I want this property to appear only when the perishable * property is equal to true.

1. choose the **property**, I choose perishable.
2. choose the **comparator**, in our case **==**
3. choose the **value**, in our case **true**

## 3. The Lookups

Lookups let you show in a property or preset values you choose, or show data from another collection.

In fact, there are two types of Lookup:
* **Look a collection**: which allows you to show data from another collection
* **Inline Source**: which allows you to set values to show.

At this point the options diverge.

### Look a collection

When you select Look a collection you will have to fill in two values:

1. Collection ID: you will see a select and you will have to choose the collection whose data you want to show
2. Value to save: you will see a select and you will have to choose which property of the collection to save. It is generally advisable to save the id.

### Inline Source

When you select Inline Source you will need to fill in two values:

* **The data you want to view**: in this field you will need to insert an array of objects you want to view. Remember to differentiate the value to be saved in the database with what you want to show your end user.

!!! example
Let's take an example: I have a property that has been and I want from the CMS to be able to select only specific states such as Pending, In Processing etc.
Here's how I'll have to build the array of objects:
**[{"name": "In Processing", "value": "working"}, {"name": "Pending", "value": "pending"}, {"name": "Archived", " value ":" archived "}]**

* ** Value to be saved **: you will have to choose which value to save in the DB, in this case we advise you to save the value.

### How to view the data of a Lookup
From a Look up you can also configure additional features that allow you to meet any viewing need

* **Visible properties**: Here you can choose which properties of your collection or the inline source created to show. The properties you want to show should be entered as if it were an array of strings.
So if for example we wanted to show only the name, the array will be: ["name"]. If we want to show the name and surname it will instead be: ["name", "surname"].

* **Delimiter**: the delimiters are used when I have chosen to show more than one property and I want to insert a delimiter between the two properties. Ex: if before I chose to
show the name and surname properties and I want that between the two there is a hyphen I will have to write the hyphen in an array of strighe. The delimiter will then be: ["-"]

* **Filter**: I can also choose to set a filter to visibility. To write a query we suggest two links: 1) the different types of queries 2) all types of operators that you can use.
Let's take an example: in this lookup I want to see only the data that have state = a working.
The query will be: {"state": "working"}

** ** ** Limit: I can set a maximum number of items to display in my Lookup

* **Automatic Reset**: if we want to reset, that is after having compiled the cell if we want to empty it

* **Automatic Selection**: if we want you to select the first value automatically

* **Live search**: if we want that while we are writing we will see the results (ex: I write A and they appear under the publishing houses that begin with A)
    
    !!! example "An example of Lookup on the weapons collection"
![An example of Lookup on the weapons collection](img/lookup-armi.JPG)

## 4. Create a button

From Api Console you can also choose to configure buttons. The buttons are actions that you want to do on a data or a set of data.

![section I create button](img/creo-bottone.JPG)

The buttons are displayed in the central area of the CMS near the publish, draft and trash buttons

To create a button, go to the Bottni section and configure the following fields:

* **ID**: represents the field that uniquely identifies the action. it is an unmodifiable field
* **Label**: represents the name you want to appear in the CMS
* **Broken**: in this field you will have to enter the route to which your action should point
* **Icon**: for each button you can also set an icon

In the API, you will then be able to conveniently view the buttons created on the card

!!! example "Example of a button"
Let's take an example of a button on our Heroes Good page. The button will serve to contact a hero.
Sara:

* id: contact-hero
* label: Contact Hero
* route: / action
* icon: phone

here is how our button will appear:
![bottone in cms](img/bottone-in-cms.JPG)
