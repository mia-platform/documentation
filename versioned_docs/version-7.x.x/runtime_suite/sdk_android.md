---
id: sdk_android
title: Android SDK
sidebar_label: Android SDK
---
:::caution deprecation
This library is deprecated
:::

Mia-Platform provides an SDK that works as an intermediator to permit the interactions between the application and the platform. This guide has the aim to explain the structure, the settings and the functioning of Mia-Platform SDK.

## General information and requisites

* Android Studio or other Gradle build system IDEs
* Android project **minSDKVersion 14**

## Setting up the project

Before starting, you need to add the SDK repository and dependencies in your application. Open the **build.gradle** file of your application and add the maven in **repositories**:

```
repositories {
    maven { url "https://nexus.mia-platform.eu/repository/maven-releases/"
        credentials {
            username "USERNAME"
            password "PASSWORD"
        }}
    ...
}
```

Now you need to add the dependencies needed:

```
dependencies {
    implementation 'eu.mia-platform.sdk:core:1.10.5'
    implementation 'eu.mia-platform.sdk:user:1.10.5'
    implementation 'eu.mia-platform.sdk:database:1.10.5'
    implementation 'eu.mia-platform.sdk:push:1.10.5'
    implementation 'eu.mia-platform.sdk:analytics:1.10.5' //coming soon

    ...
}
```

**Note**: you don't need to implement all the modules but only the ones that the application requires.

## SDK Modules

The SDK project is divided in modules:

* android-baas-sdk-core
* android-baas-sdk-database
* android-baas-sdk-push
* android-baas-sdk-user
* analytics //coming soon

Not all the modules are dependent by the others, some of them can be used alone. **Android-baas-sdk-core** allows basic operations, **android-baas-sdk-database** is the module responsible of the data storage, **android-baas-sdk-push** is the module that manages the push notification, **android-baas-sdk-user** is the module to manage the user sessions and **Analytics** is the module to capture information about the usage of the application.

The following paragraph will describe in detail the usage of each module.  

## Core module

### Basics

The core module is the basic module of the SDK, it allows basic operations such as SDK initialization, BaaS collection CRUD and it is required by the other modules except the module **analytics**.

#### SDK initialization

To initialize the SDK you need to add in your **Application** class or in your **Main** activity class add the code:

```
MKAppInstance.sharedInstance().init(this, "YOUR_SECRET", "BAAS_URL");
```

In the initialization constructor can be set also the SDK extensions needed by the application (they can be *null* as in the example above).

```
MKAppInstance.sharedInstance().init(this, "YOUR_SECRET", "BAAS_URL", new MKAnalyticsExtension(), ...);
```

You can also initialize the SDK and the modules in two different moments. To do so, you must before initialize the SDK and then initialize the single module:

```
MKAppInstance.sharedInstance().init(this, "YOUR_SECRET", "BAAS_URL");
...
MKAppInstance.sharedInstance().initModule(new MKAnalyticsExtension());
```

#### Manage logs

The level of logs in both SDK message and HTTP requests can be defined as follow:

**HTTP requests**:

```
MKAppInstance.sharedInstance().setHttpLogLevel(HttpLoggingInterceptor.Level.BODY);
```

or

```
MKAppInstance.sharedInstance().setHttpLogLevel(HttpLoggingInterceptor.Level.NONE);
```

**SDK messages**:

```
MKAppInstance.sharedInstance().setLogLevel(eu.makeitapp.mkbaas.core.Log.MKLogLevel.INFO);
```

or

```
MKAppInstance.sharedInstance().setLogLevel(eu.makeitapp.mkbaas.core.Log.MKLogLevel.NONE);
```

SDK logs will be printed with **MakeItApp SDK** tag, while HTTP request logs with **OkHttp** tag.

### Create Read Update Delete

In this SDK, the CRUD operations can be performed through the usage of MKCollection and MKQuery classes, or also their derived classes.

#### MKCollection

The MKCollection class is responsible for storing the data in the BaaS. Each MKCollection contains key-value pairs of JSON-compatible data. This data is scheme less, which means that you don’t need to specify ahead of time what keys exist on each MKCollection. But, in order to see your data on the Baas dashboard, you have to configure the column name and type (see Baas Dashboard section for more details).
The keys must be alphanumeric strings, instead values can be strings, numbers, booleans, arrays or anything that can be JSON-encoded.
Each MKCollection is identified by a name needed to distinguish different typology of data.

Every collection contains a set of basic properties that will be filled directly by the BaaS:

```
String id;
Date updatedAt;
Date createdAt;
String creatorId;
String updaterId;
```

**Note**: to not create conflicts don't repeat the declaration of this properties in your class.

MKCollection also offers "ready-to-use" getters for the properties presented above:

```
public String getCollectionId()
public Date getUpdatedAt()
public Date getCreatedAt()
public String getCreatorId()
public String getUpdaterId()
```

#### Create and save a new MKCollection

You can create an instance of MKCollection and fulfill with data in the way presented below:

```
MKCollection mkCollection = new MKCollection("MY_COLLECTION_NAME");
mkCollection.put("name", "Sam");
mkCollection.put("age", 30);
mkCollection.put("enabled", false);
```

When the collection is ready, we can save it in the BaaS through the method *save*, that can be execute synchronously or asynchronously as follow:

```
try {
   MKCollection savedCollection = mkCollection.save().doSynchronously();
   //savedCollection now contains valid id, created at, creatorId, updatedAt, updatorId values

   //do something
}
catch (Exception e) {
   //error
   ...
}
```

or

```
mkCollection.save().doAsynchronously(new MKCallback() {
   @Override
   public void onCompleted(Object result, MKError error, Object caller) {
      if (error == null) {
         //error is null, all is fine

         MKCollection savedCollection = (MKCollection) result;
         //savedCollection now contains valid id, created at, creatorId, updatedAt, updatorId values

         //do something
      }
      else {
         //error
      }
   }
});
```

The id, the creation date, the update date, the id of the person who updated the data are automatically added.

#### Get data from MKCollection

Data can be retrieved also from the MKCollection in the following way:

```
MKCollection collection = ...;
String name = collection.getAsString("name");
String collectionId = collection.getCollectionId();

//You can also set a default return value if the key is not present
int age = collection.getAsInt("age", -1);
```

#### Delete and remove collection row

If you want to delete a remote specific row you can perform the *delete* method both synchronously or asynchronously as shown in the code below:

```
try {
   //collectionToDelete MUST have a valid collectionId
   MKCollection collectionToDelete = ...

   MKCollection deletedCollection = collectionToDelete.delete().doSynchronously();
}
catch (Exception e) {
   //error
}
```

or

```
//collectionToDelete MUST have a valid collectionId
MKCollection collectionToDelete = ...

collectionToDelete.delete().doAsynchronously(new MKCallback() {
   @Override
   public void onCompleted(Object result, MKError error, Object caller) {
      if (error == null) {
         MKCollection deletedCollection = (MKCollection) result;
      }
      else {
         //error
      }
   }
});
```

### Advanced Object

Until now we proposed simple collections, but this SDK permits also the construction of advanced objects extracting a new instance from the Data Model class.

When creating a Data Model you need to extend the class with MKObject. Both class and attributes must be annotated to make a reference between the collection properties and the object attributes. The class must be annotated with **MKCollectionAnnotation** where you define the BaaS collection name, the attributes must be annotated with **MKFieldAnnotation** where you define the field name of the BaaS property.

The following code shows an example of an advanced object:

```
@MKCollectionAnnotation(collectionName = "person")  //your BaaS collection name
public class Person extends MKObject {

    @MKFieldAnnotation(fieldName = "person_name")   //BaaS property name
    private String name;

    @MKFieldAnnotation(fieldName = "current_age")   //BaaS property name
    private int age;
}
```

**Note**: MKObject already has the basic attributes and their getters, don't write it again to not create conflicts

```
@MKFieldAnnotation(fieldName = "id")
String id;

@MKFieldAnnotation(fieldName = "createdAt")
long createdAt;

@MKFieldAnnotation(fieldName = "updatedAt")
long updatedAt;

@MKFieldAnnotation(fieldName = "creatorId")
String creatorId;

@MKFieldAnnotation(fieldName = "updaterId")
String updaterId;
```

Now, you can extract an instance of the it from a MKCollection object:

```
MKCollection personCollection = ...
Person person = personCollection.extractMKObject(Person.class);
```

The method *findAll* of MKQuery (described in the next section) returns a *MKCollectionArrayList* object. This object is a simple extension of ArrayList that implements a method to extract a set of objects without the need of doing one by one. Following is represented the usage:

```
MKCollectionArrayList collectionArrayList = ...
ArrayList personArrayList = collectionArrayList.extractAll(Person.class);
```

#### Read remote data

Reading the data can be done using **MKQuery** class in both synchronous or asynchronous way as showed in the following examples:

```
try {
   MKQuery query = new MKQuery("COLLECTION_NAME");
   query.whereKeyEqualTo("gender", "male");
   query.orderDescendingByUpdateDate();
   MKCollectionArrayList mkCollections = query.findAll().doSynchronously();
   for (MKCollection c : mkCollections) {
      //do something
   }
}
catch (Exception e) {
   //error
}
```

or

```
MKQuery query = new MKQuery("COLLECTION_NAME");
query.whereKeyEqualTo("gender", "male");
query.orderDescendingByUpdateDate();
query.findAll().doAsynchronously(new MKCallback() {
   @Override
   public void onCompleted(Object result, MKError error, Object caller) {
      if (error ==  null) {
         MKCollectionArrayList mkCollections = (MKCollectionArrayList) result;
         for (MKCollection c : mkCollections) {
            //do something
         }
      }
      else {
         //error
      }
   }
});
```

MKQuery class contains method in order to provide the main operations that can be done on collections.
The three basic methods supported by MKQuery are:

* **findAll**: return all the collection elements
* **countAll**: count the number of elements in the collection
* **setFilter**: accept a *MKFilter* object (described in next section) to filter the elements of a collection

MKQuery class provides also generic methods such as:

* **getCollectionName**: to obtain the collection name
* **setCollectionName**: takes as input a string and set the collection name
* **addOrderBy**: takes as input a string indicating the field to order and a direction of type sort (ASC, DSC)
* **setLimit**: takes an integer to set the limit
* **setSkip**: takes an integer to set the skip

In addition, MKQuery class provides some methods with the filters already incorporated:

* **orderAscendingByKey**: orders the elements in ascending way according to a given key (string)
* **orderDescendingByKey**: orders the elements in descending way according to a given key (string)
* **orderAscendingByCreationDate**: orders the elements in ascending way according to creation date
* **orderDescendingByCreationDate**: orders the elements in descending way according to creation date
* **orderAscendingByUpdateDate**: orders the elements in ascending way according to the update date
* **orderDescendingByUpdateDate**: orders the elements in descending way according to the update date
* **whereKeyEqualTo**: takes as input a key (string) and an object and returns the elements equal to the given one
* **whereKeyLessThan**: takes as input a key (string) and an object and returns the elements less than the given one
* **whereKeyLessThanOrEqualTo**: takes as input a key (string) and an object and returns the elements less than or equal to the given one
* **whereKeyGreatherThan**: takes as input a key (string) and an object and returns the elements strictly greater than the given one
* **whereKeyGreatherThanOrEqualTo**: takes as input a key (string) and an object and returns the elements greater than or equal the given one
* **whereKeyNotEqualTo**: takes as input a key (string) and an object and returns the elements not equal the given one
* **whereKeyContainedIn**: takes as input a key (string) and objects and returns the elements contained in
* **whereKeyNotContainedIn**: takes as input a key (string) and objects and returns the elements not contained in

#### Filter remote data

For filtering the remote data you can build a filter using the **MKQueryFilter** class. Once created the filter can be added to the MKQuery for making collection requests:

```
MKQuery myQuery = new MKQuery("COLLECTION_NAME");

MKQueryFilter filter = MKQueryFilter.AND(MKQueryFilter.EQUALS("lat", latitude), MKQueryFilter.EQUALS("lng", longitude));
MYQuery.setFilter(filter);
```

The methods exposed by MKQueryFilter are:

* **EQUALS**
* **NOT_EQUALS**
* **GREATER_THAN**
* **GREATER_THAN_OR_EQUALS**
* **LESS_THAN**
* **LESS_THAN_OR_EQUALS**
* **IN**
* **NOT_IN**
* **AND**
* **OR**

### Basic analytics

The core module provides also some basics analytics as the installation and the daily use, more sophisticated analytics will be provided in the analytics module.
To track the installation and the daily use of your application you simply need to add the proper extension, **MKAnalyticsExtension**, in the initialization method:

```
MKAppInstance.sharedInstance().initModule(new MKAnalyticsExtension());
```

The SDK will take care of doing all the rest.

### Advanced Network settings

In the case you cannot use the classes provided by the SDK to make your requests, the SDK provides a rest adapter shared instance. It exposes a retrofit instance that point to the same URL with which the SDK has been initialized and it injects automatically the secret and the sid, if the user id logged.

To use it you need to create your rest interface and then obtain the rest interface created by the SDK, as in this example:

```
MyRestInterface restInterface = MKAppInstance.sharedInstance().getRestAdapter().create(MyRestInterface.class);
```  

Another thing offered by the SDK is the possibility of adding an interceptor (that extends Interceptor class):

```
MKAppInstance.sharedInstance().addInterceptor(new RequestInterceptor());
```

## Users Module

### Basics

This module is responsible of managing the user session: login, logout, restore the session and registration. As said before it needs the core module for working.

#### Requisites

Add in the **Gradle** file the two dependencies needed as follow:

```
dependencies {
    implementation 'eu.mia-platform.sdk:core:1.10.5'
    implementation 'eu.mia-platform.sdk:user:1.10.5'

    ...
}
```

Remember also to add the **MKUserExtension** in the initialization method:

```
MKAppInstance.sharedInstance().initModule(new MKUserExtension());
```

### Login, registration and restore user sessions

Users in Android Account Manager. The SDK will create a "global" account that stores all App-declined user data. In this way, if an account already exists in the device, the SDK can create a user session without reintroducing the credentials.
The SDK also provides a standard UI for the user login and registration.

### The user

The SDK provides a class **MKUser** responsible of managing the user login data, the user registration data and the password recovery. For obtaining a global user inside the application you can extend the class MKUser as follow:

```
public class MyUser extends MKUser {
    private static MyUser user;

    public static MyUser getUser() {
        return user;
    }

    public static void setUser(MyUser loggedUser) {
        user = loggedUser;
    }

    public static boolean isLogged() {
        return user != null;
    }

}
```  

#### Login

The login activity is managed by the SDK that also provide a ready-to-use UI. This activity can be launched calling the static method of the **MKLoginActivity** class, as in this example:

```
MKLoginActivity.startActivityForResult(MIASampleMainActivity.this, true);
```

The MKLoginActivity contains the method **onActivityResult** presented below:

```
@Override
protected void onActivityResult(int requestCode, int resultCode, Intent data) {
   super.onActivityResult(requestCode, resultCode, data);
   MKLoginActivity.onActivityResult(this, requestCode, resultCode, data, true);
}
```

For retrieving the result of this activity you need to override the onActivityResult method of the MKLoginActivity as in the following example:

```
@Override
protected void onActivityResult(int requestCode, int resultCode, Intent data) {
   super.onActivityResult(requestCode, resultCode, data);
   MKLoginActivity.onActivityResult(this, requestCode, resultCode, data, true);

   //This is the logged user
   MKUser user = MKUser.createFromIntent(data);
   if (user != null) {
      //Do things
   }
}
```

For creating your own login activity, you can simply create a login activity and extend it with the MKLoginActivity. To perform the login you can call the *login* method of the superclass passing the user details, while to capture the results you can override the superclass methods. An example of this implementation is shown in the following code:

```
public class CATLoginActivity extends MKLoginActivity{
  ...

  private void myLogin(String email, String password) {
        login(email, password, MyUser.class);
    }

  @Override
  protected void onLoginError(Exception e) {
    super.onLoginError(e);
    runOnUiThread(new Runnable() {
      @Override
      public void run() {
        //do something
      }
    });
  }

  ...
}
```

#### Registration

The registration activity is managed by the SDK that also provide a ready-to-use UI. This activity can be launched calling the static method of the **MKRegistrationActivity** class, as in this example:

```
startActivity(new Intent(context, MKRegistrationActivity.class));
```

As for the login, you can create your own registration activity that extends the *MKRegistrationActivity*.

#### Restore user session

If the user already exist in the device, the session can be restored without the need of performing the login again. This is possible using the **MKUserExtension** class that provides a static method *resoreUserSession* with this purpose that takes as input the *context*, an *MKSessionListener* and a boolean that indicates if the restoring went properly. An example of the usage of this method is the following:

```
MKUserExtension.restoreUserSession(this, new MKSessionListener() {
   @Override
   public void onRestore(MKUser user, MKError error) {
      if (error == null) {
         //No error, do something
      } else {
         //Error, do something
      }
   }
}, true);
```

## Database Module

### Basics

The database module is responsible of managing the data coming from the BaaS that need to be stored in the device local storage. This module gives the possibility of defining the database structure and the synchronization properties, it needs the core module for working.

#### Requisites

Add in the Gradle file the two dependencies needed as follow:

```
dependencies {
    implementation 'eu.mia-platform.sdk:core:1.10.5'
    implementation 'eu.mia-platform.sdk:database:1.10.5'

    ...
}
```

As for the other modules, also this needs to be added in the initialization method with the **MKDatabaseExtension**. It requires the database synchronization options and the database configuration. For creating the synchronization options you can use the standard settings or personalize them according to the class involved.

For personalizing the table synchronization options you need an object of type **MKTableSyncOptions**. A builder is provided to set the options needed, such as:

* **setClassName**: the class to synchronize
* **setFilter**: the filters to be applied to the table (type *MKQueryFilter*)
* **setDropAndSync**: drop and sync the table
* **setLocal**: boolean that indicates if the table is only in the local storage of the device
* **forceUpdate**: boolean to force the table update even if no modifications are detected

The code below shows two examples of personalized tables:

```
MKTableSyncOptions newsSyncOptions = new MKTableSyncOptions.MKTableSyncOptionsBuilder()
                .setDropAndSync(false)
                .setClassName(News.class)
                .setLocal(true)
                .build();

        MKTableSyncOptions budgetSyncOptions = new MKTableSyncOptions.MKTableSyncOptionsBuilder()
                .setDropAndSync(true)
                .setClassName(Budget.class)
                .build();
```

If you don't need any particular synchronization option you can add directly the table in the **MKDatabaseSyncOptions** as presented below:

```
MKDatabaseSyncOptions mkDatabaseSyncOptions = new MKDatabaseSyncOptions.Builder()
                .addTable(Document.class)
                .addTable(Discount.class)
                .addTable(budgetSyncOptions)
                .addTable(newsSyncOptions)
                .build();
```

Once you created the database synchronization options, you can proceed in creating the **MKDatabaseExtension** and initialize the module including the database extension just created.

```
MKDatabaseExtension databaseExtension = new MKDatabaseExtension(mkDatabaseSyncOptions, MKDatabaseConfig.newInstance(), this);
MKAppInstance.sharedInstance().initModule(databaseExtension);
```

For knowing when the database is ready to use you can override the methods *onDatabaseReady* and start synchronize all with **syncAll** method:

```
@Override
    public void onDatabaseReady() {
        MKDatabaseSync.syncAll(this);
    }
```

If you want to synchronize one table at a time you can use **sync** method:

```
@Override
    public void onDatabaseReady() {
        ArrayList<Class<? extends MKObject>> arrayList = new ArrayList<>();
        arrayList.add(MyClass.class);
        MKDatabaseSync.sync(this, arrayList);
    }
```

For knowing when the collections synchronization starts and ends you can override the two methods *onCollectionSyncStarted* and *onCollectionSyncEnded*:

```
@Override
    public void onCollectionSyncStarted() {
        //do something
    }

    @Override
    public void onCollectionSyncEnded(MKError mkError) {
        //do something
    }
```

While for knowing when the synchronization starts and ends you can override the two methods *onSyncStarted* and *onSyncEnded*:

```
@Override
    public void onSyncStarted() {
      //do something
    }

    @Override
    public void onSyncEnded() {
      //do something
    }
```

## Push Module

### Basics

This module is responsible of managing the push notification coming from the BaaS, also this module requires the core module for working properly.

#### Requisites

Add in the **Gradle** file the two dependencies needed as follow:

```
dependencies {
    implementation 'eu.mia-platform.sdk:core:1.10.5'
    implementation 'eu.mia-platform.sdk:push:1.10.5'

    ...
}
```

Remember also to add the **MKPushExtension** in the SDK initialization method with the sender identifier:

```
MKAppInstance.sharedInstance().initModule(new MKPushExtension("sender_id"));
```

Proceed then with creating the push receiver.

## CRUD module

**CRUD** is the module of the SDK that interacts with the BaaS starting from version 4. It offers all the tools to create, read, update, and delete objects from and to the BaaS. It offers also the Sync functionality, that can automatically download and upload data and store them in the local database.

### Initialization

As for the other modules, you need to add the dependency in your **build.gradle** file:

```
dependencies {
    implementation 'eu.mia-platform.sdk:crud:1.10.5'
    ...
}
```

:::note
Differently from the other modules, CRUD module behaves like the core, therefore it can be imported alone and you do not need to add the module in the initialization.
:::

#### Create, Read, Update, Delete

Writing and reading operations from and to the BaaS can be done with the CRUD class, which is the entry point of the module. All the operations can be performed *synchronously* and *asynchronously*, in order to give to the developer more flexibility.

To start working with this module you only need to initialize a CRUD object passing the context of the application, the base path and the secret:

:::note
The base path and the secret will be provided by the App Angel.
:::

```
private val crud = CRUD(this, "http://myBaasUrl", "my_secret")
```

:::tip
Instantiate the CRUD in a class that is always reachable by the other classes of the app. So that you don't have the necessity of instantiating it each time you need to operate with the CRUD.
:::

Through the CRUD instance you can perform the calls: GET, POST, PATCH and DELETE. All the methods require the collection name and some of them accept as parameter also a Mongo query.
For example if we want to perform a GET on a collection named *authors*:

```
crud.get(collection: "author", queryBuilder: null)
```

As said before, there are some methods that accept as parameter a query or a QueryBuilder object, in particular the GET and the DELETE.

The QueryBuilder object permits you to build Mongo queries using the class methods:

* **and**: corresponds to the Mongo *$and*
* **or**: corresponds to the Mongo *$or*
* **nor**: corresponds to the Mongo *$nor*
* **equals**: corresponds to the Mongo *$eq*
* **notEquals**: corresponds to the Mongo *$ne*
* **greater**: corresponds to the Mongo *$gt*
* **greaterThanOrEquals**: corresponds to the Mongo *$gte*
* **less**: corresponds to the Mongo *$lt*
* **lessOrEquals**: corresponds to the Mongo *$lte*
* **inArray**: corresponds to the Mongo *$in*
* **notInArray**: corresponds to the Mongo *$nin*

All these methods accept as input the key and the value to compare. All grades of query complexity are managed.
We also provide the method **build** needed if you want the query as String.

With the same example as before we can perform a GET passing as parameter a Mongo query that corresponds to *{"$or":[{"name":"Giovanni"}, {"name":"Carlo"}]}* as follow:

```
val queryBuilder = QueryBuilder().or(QueryBuilder().equals("name", "Giovanni"), QueryBuilder().equals("name", "Carlo"))
val get = crud.get("authors", queryBuilder)
```

or:

```
val query = QueryBuilder().or(QueryBuilder().equals("name", "Giovanni"), QueryBuilder().equals("name", "Carlo")).build()
val get = crud.get("authors", query)
```

GET, PATCH and DELETE permits to set also the **STATE** parameter that indicates which state take into consideration when we ask for objects. The possible states are: PUBLIC, DRAFT, TRASH and DELETED. Through the **state** method you can set the list of states on which perform the call, it accept an arrayList of **State** object or a single object.

:::note
If not set the STATE is by default on PUBLIC therefore the requests take into consideration only the objects marked as PUBLIC.
:::

```js
val acceptedStates = arrayListOf(State.Pub, State.Draft)
get.state(acceptedStates)
```

The GET object permits also to set other useful parameters through the following methods:

* **limitProperties**: sets the list of all the properties of the collection you want to receive in the answer
* **limitProperty**: sets the single property you want to receive in the answer
* **limit**: limits the number of the results
* **skip**: skips the results you want according to the given number
* **sortBy**: sorts the result according to the property and the order given

```
val properties = arrayListOf("name", "surname")
get.limitProperties(properties)
get.limit(100)
get.skip(50)
get.sortBy("age", true)
```

At this point we are ready to perform the call synchronously or asynchronously. Two ways are possible: not passing any parameter to receive the result as JsonElement or passing the Java class type to receive the result as objects of your class.

```
// Async
get.async(object : SingleObjectCallback<JsonElement> {
            override fun onCompleted(result: JsonElement?, error: CRUDError?) {
                // do something
            }
        })

// Sync
try{
    val result: JsonElement = get.sync()
} catch (e: Exception){
    // do something
}
```

or:

```
// Async
get.async(Author::class.java, object : MultipleObjectsCallback<Author> {
            override fun onCompleted(result: ArrayList<Author>?, error: CRUDError?) {
                // do something
            }
        })

// Sync
try{
    val result: ArrayList<Author> = get.sync(Author::class.java)
} catch (e: Exception){
    // do something
}
```

:::note
For using the automatic conversion from Json to object the class must be Serializable
:::

In the GET is also present a method to get a single object identified by an ID and a method that returns the count of the collection objects.

The POST object permits you to create a new object in the BaaS. It works similar to the GET, takes as input the object to save and the state, if null automatically put to PUBLIC. You can make a single POST or a BULK POST. As before you can pass a JsonElement or an object that will be converted automatically. As result we will have a single id or an array of ids corresponding to the objects posted.  

```
val author = Author("Mario", "Rossi")
val post = crud.post("authors")

// Async
post.async(author, State.Pub, object : SingleObjectCallback<String> {
    override fun onCompleted(result: String?, error: CRUDError?) {
        // do something
    }
})

// Sync
try{
    val result: String? = post.sync(author, State.Pub)
} catch (e: Exception){
    // do something
}
```

The DELETE permits to delete a single object or all the objects that satisfy a Mongo query. Also this can be performed synchronously or asynchronously.

The PATCH permits to update the state of an object already existent. Before executing you need to define which are the fields that have been updated, you can do this through the methods:

* **update**: takes the new object and the corresponding key
* **updateOnInsert**: takes the new object and the property
* **removeObject**: takes the object to be removed
* **increment**: takes the increment value and the property to be incremented
* **multiply**: takes the multiply value and the property to be multiplied
* **setCurrentDate**: takes the property to be put in current date

:::note
None of the default properties (\_id, createdAt, updatedAt, creatorId, updaterId, \__STATE__) of the CRUD can be modified, therefore if you try to do the update will be ignored
:::

```js
val patch = crud.patch(collectionName)
patch.update("Luca", "name")

// Async
patch.async(id, object : SingleObjectCallback<String> {
    override fun onCompleted(result: String?, error: CRUDError?) {
        // do something
    }
})

// Sync
try{
    val result: String = patch.sync(id)
} catch (e: Exception){
    // do something
}
```

:::note
For changing the state you cannot do a patch, you need instead to use the appropriate POST method made appositively.
:::

To change the state you can use the **changeState** method in the object POST, passing the id of the object and the new State like follow:

```
val post = crud.post("authors")

// Async
post.asyncChangeState(id, State.Draft, object : NoObjectCallback {
    override fun onCompleted(error: CRUDError?) {
        // do something
    }
})

// Sync
val error: CRUDError? = post.syncChangeState(id, State.Draft)
```

#### Sync

This module offers the utility of performing the data synchronization: pull data from BaaS, push updates to the BaaS or both.
This operation is available through the **Sync**.

The sync behavior is inspired by git: there are a pull action first and then a push action. Changes from BaaS have greater priority than local changes so, if a conflict is present, changes from BaaS will replace local changes.

In particular values from BaaS that have updatedAt greater than updatedAt of local objects, these local objects will be updated (replaced) or deleted, depends on the status.

To use this functionality you need a database that extends the **SyncDatabase** interface defined in the CRUD module. For the moment we provide ObjectBox database already compatible with the CRUD Sync.

To use the available version of ObjectBox you need to add the dependency in the **build.gradle** file.

To initialize the Sync you need to have an ObjectBoxAdapter instance. At the same time ObjectBoxAdapter needs a **Database** instance in which you define the name of the database in order to obtain the Box Store needed to perform the queries.

The complete process to initialize the sync is reported below:

```
val crud = CRUD(this, "my_url", "my_secret")
val db = Database(this, "db_name")
val objectBoxAdapter = ObjectBoxAdapter(db)
val sync = Sync(crud, objectBoxAdapter)
```

At this point we can call the Sync methods to pull and push new data. Both methods accept as parameters the Java class type of the classes to be synchronized as ArrayList or as arguments.

:::warning
All the classes to be synced need to be extended by the **BaseObject** provided in the ObjectBoxDatabase module of the project.
:::

For pulling we calculate the max updatedAt date stored in the database for that table and we make a request according to that:

```
sync.pull(Author::class.java)
```

The resultant objects are automatically stored in the database and available to use.

Pushing the data is similar to the pulling, but before you call the push method you need to modify the data you want to push. The sync requests to the database the data to be pushed, to be updated and to change state.

For declaring the objects to push you only need to insert the new object in the database through the method exposed by the ObjectBoxAdapter:

```
val newAuthor = Author("Luigi", "Pirandello")
objectBoxAdapter.insert(newAuthor)
```

If instead the object is already present in the database but needs to be updated you can change the object as you prefer and then you pass the modified object to the sync method **toPush** as follow:

```
author.name = "Marco"
sync.toPush(arrayList(author))
```

As for the CRUD, the change state cannot be done like an object update. Therefore we provide different methods in the sync to define which is the future state of the object. If for example the object is PUBLIC and we want to change it to DRAFT:

```
sync.toDraft(arrayList(author))
```

The methods provided corresponds to all the possible change states of an object:

* **toPublic**: changes the state of an object to PUBLIC
* **toDraft**: changes the state of an object to DRAFT
* **toTrash**: changes the state of an object to TRASH
* **toDeleted**: changes the state of an object to DELETED

:::note
Not all the change state are permitted. If you try to change the state in a wrong way the changes will be ignored.
:::

In the moment you want to push your updates, as for the pull, you can simply call the method that will push all the data changes to the BaaS:

```
sync.push(Author::class.java)
```

The combination of the two methods provides you the complete synchronization of all the data present in the BaaS.
