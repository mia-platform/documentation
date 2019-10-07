# How to configure the CMS with Mia-Platform 3

The collections shown in the CMS are configured in two different .json files:

* 1) `cms_config.json` where the developer can configure general page settings in the CMS


* 2) `properties.json` where the developer can configure every single property as it can be viewed and managed.

Both files are located inside the specific folder within the collection that you want to configure.

## cms_config.json

Let's assume we are within the **heroes** collection and want to configure our cms heroes page.

Open the `cms_config.json` file and we will build the following file:


key | example value | Comment
------- | ------- | -------
`label` | Heroes | label is the label that allows you to choose the name of your collection in the CMS menu. in our case we will write Heroes
`LayoutType` | table | you can decide the layout you want to give to your collection. **Table** is the most classic table view mode. **TableUser** is the display mode for users. It has in fact a special Reset Password field at the beginning of the table. **TablePush** instead is the perfect table for push notification or to send notifications to customers. Next to the table you will always find a push button to inject the content to your customers. If you select **Card** each item will be represented similar to a card. **Gallery** is instead the perfect representation for images
`DefaultStatus` | draft | it can instead be either **draft** or **publish**. If you write draft once you upload an item it will not be published automatically on your applications, but you will have to give it the public command later. If you write publish instead whenever you edit or load an item it will be published automatically. In our case we will put draft.
`DefDelete` | false, | if it is **true** the elements once deleted by trash will be permanently deleted. if it is **false** you can retrieve them from Mongo, but they will not appear on the CMS
`Category` | | here you can configure the menu category in which to display your collection.
`category.name` | General | this is the name of the category that will appear in the CMS
`Category.order` | 10 | this is the order of the category in the menu. We advise you to always put the order in the tens. In fact, you will want to insert other collections or categories in the future. If before, for example, we would already have a category in order 3 to place this we would have to change all the others in cascade. With the tens, however, just put an intermediate number.
`hidden` | false, | bringing this field to **true** you can choose not to show the collection in the CMS
`Blocked` | false | bringing this field to **true** you can choose to block the collection. No one will be able to create new fields.
`icon` | book | in this [link](https://fontawesome.com/icons) you will be able to see all the available icons to display in your menu
`order` | 10 | indicates the order of a collection within a category. With 10 will be the first to appear. It is advisable to follow the tens rule here too.
`baseQuery` | "" | base query allows you to apply a general filter of visibility - It must follow the rules of logical expressions. An example would be: to hide the Acli Circle property from associations and services. it will be written like this: {"idAssocServ": {"$ ne": "CIRCOLO ACLI"}}
`highlight` | "" | in this string you can enter the name of a collection property (boolean only) that when it is true will be highlighted in the CMS.
`confirmBeforeEdit` | "" | if true, enable double check before save
  So the final .json file will be:

```
  {

  "label": "heroes",

  "layoutType": "table",

  "cardType": "",

  "defaultStatus": "draft",

  "defDelete": false,

  "category": {

    "name": "General",

    "order": 0

  },

  "hidden": false,

  "blocked": false,

  "icon": "book",

  "order": 0,
  
  "confirmBeforeEdit": true,

}
```


## properties.json

The properties.json file is the file that contains all the fields in the collection. Each field has a similar structure.

By default there will be the fields: id, creatorId, createdAt, uptaterId, updatedAt, STATE,

see in detail the specifications of a single property: es property **name**

key | example value | Comment
------- | ------- | -------
`Id` | name | property id
`type` | "string", | the types can be: string, number, boolean, geopoint, date, object, array
`Required` | false, | **true** if you want the data to be mandatory
`Label` | Name | it's the label you want to give to your property
`cmsVisibility` | | cmsVisibility allows you to decide at what level you want to show a property. The four levels can be: **0** and is not visible; **1** and is visible in the main table; **2** and is visible when you click in the table, in the right area of your CMS; **3** and is visible in the modal section that appears large in the center of the page when you click on "expand". At the **3** level, explanations of information appearing on the other levels. At level **2** we tend to put non-priority information, but which bring value, insights. In our case we will put **1** in when the information is a priority. The visibility property can also be configured to be visible only in some cases, via **"New"** and **"Edit"**. Both are objects that contain a query, so they allow you to set complex conditions. **"New"** allows you to make visible the property being created, **"Edit"** allows you to make visible the property being edited.
`CmsVisibilty.level` | 1 | The four levels can be: **0** and is not visible; ** 1 ** and is visible in the main table; **2** and is visible when you click in the table, in the right area of your CMS; **3** and is visible in the modal section that appears large in the center of the page when you click on "expand". At the **3** level, explanations of information appearing on the other levels. At level **2** we tend to put non-priority information, but which bring value, insights. In our case we will put **1** in when the information is a priority.
`CmsOrder` | 10 | it is the order that you want to give it within the collection. in our case it will be the first, so we will write 10
`CmsEditable` | true | **true** if you want it to be editable by CMS
`Hidden` | false | if you want the property to be invisible
`Description` | "" | if you want to add a description
`CmsCardPosition` | 0 | indicates the location of the property in the Card layout
`interfaceType` | string | the properties can be of different types: **string** if it is a classic text string; **number** if it is a number; **date** if it is a date with dd / mm / yyyy; **datetime** is instead a complete date with hours, minutes and seconds; **boolean** if it can only be true or false; **text** if we want the content to be read as html; **textArea** if it is a text field, then for example a description; **Lookup** are used to select some values ​​or between a range of values chosen by me or between a range of values taken from another collection. **Multilookup** if you want to select multiple values; **Array** if you want to save it as an ordered set of properties; **Object** is an unordered property set; **Geopoint** if you want me to save a specific place; **Files** if it is a file such as an image or a pdf. In our case we will choose string simply wanting to write the name of the title.

the final json in our property **name** which is the name of the heroes will therefore be:

```
"nome": {
   "id": "nome",
   "type": "string",
   "required": false,
   "label": "Nome",
   "cmsVisibility": {
            "level": 1,
             "edit": {
            "query": {
              "name": {
                "$exists": true,
                "$ne": ""
              }
            }
          },
          "new": {
            "query": {
              "name": {
                "$exists": true,
                "$ne": ""
              }
            }
          }
        },
    "cmsOrder": 10,
    "readonly": false,
    "cmsEditable": true,
    "hidden": false,
    "description": "",
     "cmsCardPosition":0,
     "interfaceType": "string"
}
```


## CMS Config-extension in the API Console

All previous configurations are automatically managed by the API.
However, there are some extensions that can not yet be configured from the front end but are managed by a component: the config-extension.

the 5 most important extensions are:

1. le **card**
2. the **notifications** in the side menu
3. the **highlight**, or the possibility to highlight lines in the tables
4. the **conditional visibility** of a property.
5. the **access control on groups** (ACL on groups).


## Set up GIT to have the cms config-extensions

1) when you open the GIT project make sure there is a **config-extension** folder. The **cms-backend** folder must be inside the folder.

If it is not present you can create it.

2) once you open the folder you will need to create or make sure that the following files have already been created:

* **analyticsConfig.json** (if you create it for the first time you will need to insert an empty object)

* **cmsProperties.json** (if you create it for the first time you will need to insert an empty object)

* **dashboardConfig.json** (if you create it for the first time you will need to insert an empty array)

At this point you are ready to configure your extensions.

### 1. Configure the Card

Cards allow you to view your data no longer in the table, but in the form of Card.

!!! warning
    Although cards are an extension, remember that the CMS page you want to display as a card must have the **display type set to card** in its general settings.

The cards are composed of two sections:


1. **cardHeader** which represents the high structure of the card and is composed of 3 elements:


* the image


* the title


* the subtitle


!!! Note
    The 3 fields are mandatory in configuration but can be left empty.
    If no image is associated with the image, the card will be colored with the side menu color

```
"cardHeader": {
"titleProperty": "laboratory",
"subTitleProperty": "productId",
"imageProperty": ""
```


2. **cardContentRows** instead is entirely customizable. Within a card there are 4 types of widgets that can be inserted:


* **textArea** - is a high text field in which a description, a note or a property that requires high space can be entered


* **text** - is a small text field, it can generally be used to show simple properties
* **button** - allows you to configure buttons within your cardType. The endpoint to which you want to connect must be specified in the "routes" key.


* **link** - allows you to configure buttons that refer to a URL, in order to automatically open an application. In the configuration of the link buttons, it is necessary to specify in the "linksType" key the link to be obtained by pressing the button. Furthermore, in this type of widget it is possible to insert icons to be displayed on the button.

!!! Note
    At the moment there are already three link buttons that can be used:

* **Send Mail**, which allows you to send an email. To configure this button it is necessary to insert **"email"** in the configuration of the card in the "linksType" field.

* **Call Skype**, which allows you to start a Skype call. To configure this button it is necessary to insert **"skypeCall"** in the card configuration in the "linksType" field.

* **Skype Chat**, which allows you to automatically log in to Skype chat. To configure this button it is necessary to insert **"skypeChat"** in the card configuration in the "linksType" field.

Each widget can consist of multiple properties of the same type. For example. If I choose a text widget within it I can display more properties of type text. The cars based on the number of elements present divide the card space.

!!! example
    Here is an example of card content rows - With this view you will see below the header a field notes, two properties, two buttons and two links.


```

"cardContentRows": [{
     "type": "textarea",
     "properties": ["note"]
   },
   {
     "type": "text",
     "properties": ["newExpirationDate", "newItemNumber"]
   },
   {
     "labels": ["Accetta", "Rifiuta"],
     "type": "button",
     "routes": ["/api/change-request/accept", "/api/change-request/refuse"],
     "ids": ["accetta", "rifiuta"],
     "icons": ["check", "archive"]
   },
   {
     "type": "link",
     "labels": ["Mail", "Skype"],
     "icons": ["at", "skype"],
     "linksType": ["email", "skypeCall"],
     "properties": ["mail", "skypeId"]
   }
   ]

```

 To insert the card into a collection, write the name of the collection exactly and then insert the card into cmsProperties:

!!! example
    Here is an example of a final card within the change-requests collection

```

"change-requests": {
   "cmsProperties": {
     "cardHeader": {
       "titleProperty": "laboratory",
       "subTitleProperty": "productId",
       "imageProperty": ""
     },
     "cardContentRows": [{
       "type": "textarea",
       "properties": ["note"]
     },
     {
       "type": "text",
       "properties": ["newExpirationDate", "newItemNumber"]
     },
     {
       "labels": ["Accetta", "Rifiuta"],
       "type": "button",
       "routes": ["/api/change-request/accept", "/api/change-request/refuse"],
       "ids": ["accetta", "rifiuta"],
       "icons": ["check", "archive"]
     },
     {
       "type": "link",
       "labels": ["Mail", "Skype"],
       "icons": ["at", "skype"],
       "linksType": ["email", "skypeCall"],
       "properties": ["mail", "skypeId"]
     }
     ],
    "notification": {
     "query":
     {"responseReceived": "false", "trash": 0}
   }
  }
 },
 "fasonisti-properties": {
   "cmsProperties": {
     "cardHeader": {
       "titleProperty": "name",
       "subTitleProperty": "",
       "imageProperty": "image"
     },
     "cardContentRows": [{
         "type": "textarea",
       "properties": ["description"]
      },
      {
       "type": "link",
       "labels": ["Mail", "Skype"],
       "icons": ["at", "skype"],
       "linksType": ["email", "skypeCall"],
       "properties": ["mail", "skypeId"]
     }
    ]
   }
 }

```
Here are some examples of realized cards

![](img/card1.JPG) ![](img/card2.JPG)

In the example we have therefore:

* two buttons - accepts and refuses;

* two links - mail and skype, which allow you to automatically open the e-mail and skype applications.

### 2. Configure notifications

The notifications in the side menu allow you to display the number of elements that satisfy a condition in the notification form.
Notifications are objects composed of only one element: a **query**. Within the query you must specify the condition for which the single data is counted.

!!! example
    Here is an example of notification


         "notification": {

              "query":

                 {"isLate": true, "state": "working", "trash": 0}

             }


   The display will be as follows:

   ![](img/notifiche.PNG)

   In the example, the notification shows the number of delayed elements in the current state.

### 3. Configure the highlights

The highlights allow you to highlight rows in the tables. A highlight is an object composed of three parameters:

* **query**, ie the condition to be satisfied for the table row to be highlighted;

* **color**, text type parameter that configures the text color;

* **backgroundColor**, which configures the background color in hexadecimal ([Link for hexadecimal colors] (https://www.web-link.it/colori-html.html)).

!!! example
    Here is an example of a highlight


        "highlight": {

             "query":

                {"isLate": true, "state": "working", "trash": 0},

              "color": "white",

              "backgroundColor": "#d55d5f"

           }


The display will be as follows:
![](img/highlight.png)


In the example, on a red background written in white, the rows of the table that are delayed to the "in process" state are highlighted.


### 4. Set conditional visibility to a property

Conditional visibility allows you to view a property only under a certain condition. From CMS the user has the possibility to view a property of a collection in two moments:

* in the creation phase, when the user creates a new item in a collection using the "add new" button;

* when editing, when the user modifies an existing element from the right side menu.

Conditional visibility can be set to a property at either time, or only in one of the two, depending on the need.

To set the conditional visibility on a property open Git and follow the following path:

`projectname>configurations>configuration>config-extention>cms-backend> cmsProperties.json`

The configuration of cms extensions is written in this file. To set the conditional visibility, write the name of the collection you want to act on and in "properties" specify the name of the property you want to condition.

Here is an example of a complete configuration:

```
"eroibuoni": {
    "aclExpression":"groups.admin",
    "analytics": [{
      "id": "votazioni",
      "order": 10,
      "width": 12
      }],
      "properties": {
        "forza": {
            "cmsVisibility": {
                "visibility" :0,
                "edit": {
                    "query": {
                    "nome":"Thor"
                    }
                },
                "new": {
                    "query": {
                    "nome":"Thor"
                    }
                }
            }
        }
    }
```

In **"properties"** the properties to be conditioned are listed (in the example, only "force"). The only configuration of conditioned visibility is as follows:

```
"cmsVisibility": {
    "visibility" :0,
    "edit": {
        "query": {
        "nome":"Thor"
        }
    },
    "new": {
        "query": {
        "nome":"Thor"
        }
    }
}
```

The **"visibility"** field is used to define the level at which the property is to be viewed. The possibilities of the values are:

* 0, to hide the property;

* 1, to display the property on the main page of the collection;

![](img/level_1.png)

* 2, to display the property in the right side menu when clicking on the item;

![](img/level_2.png)

* 3, to display the property in the modal section that appears large in the center of the page when you click on "expand".

![](img/level_3.png)

**"Edit"** is used to set the conditioned visibility on the property when editing an element, the **"new"** field is used to set it when creating the element. In the example, conditional visibility is set in both phases.

After "edit" or "new" you insert a **"query"** to specify the condition that determines the visibility of the property. In the example the condition is simply that the name is Thor. The query is a mongoquery: you can have support to write the mongoquery to the following [link](https://docs.mongodb.com/manual/tutorial/query-documents/).


### 5. Access control on groups (ACL on groups)

This extension allows you to **control access to CMS collections**, depending on the group. In fact it is possible that various groups of users access the same CMS, but that not all information is visible to everyone.

To configure these properties, the path is as follows:

`projectname>configurations>configuration>config-extention>cms-backend> cmsProperties.json`

When in json, the ACL on groups fits into all the collections that want to be controlled. **In the ACL property you enter the name of the groups that can see that collection.** The syntax is as follows:

```
"nomecollection": {
"AclExpression": "groups.nomegruppo"
}
```

In the rest of the json, all the other properties of the collection are configured. The group to which access is reserved is expressed with "groups.nomegruppo". If the property is not configured, the default collection is visible to everyone.


!!! example
    Here is a complete example of configuration.

       ```
       "eroibuoni": {
           "aclExpression":"groups.admin",
           "analytics": [{
           "id": "votazioni",
           "order": 10,
           "width": 12
            }],
           "properties": {
              "forza": {
                 "cmsVisibility": {
                     "visibility" :0,
                     "edit": {
                         "query": {
                         "nome":"Thor"
                         }
                     },
                     "new": {
                         "query": {
                         "nome":"Thor"
                         }
                     }
                 }
             }
         }
        ```

In this case the Heroes Good collection is visible only to administrators.
