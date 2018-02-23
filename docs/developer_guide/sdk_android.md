# SDK Android

Mia-Platform provides an SDK that works as intermediator to permit the interactions between the application and the platform. This guide has the aim to explain the structure, the settings and the functioning of Mia-Platform SDK.

## General information and requisites

* Android Studio or other Gradle build system IDEs
* Android project **minSDKVersion 14**

##Setting up the project

Before starting you need to add the SDK repository and dependencies in your application. Open the **build.gradle** file of your application and add the maven in **repositories**:
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

In the initialization constructure can be set also the SDK extensions needed by the application (they can be *null* as in the example above).
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

##Push Module

###Basics

This module is responsible of managing the push notification coming from the BaaS, also this module requires the core module for working properly.

####Requisites

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

TODO: explain how create the push receiver

## Analytics module

Coming soon.
