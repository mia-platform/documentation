---
id: sdk_ios
title:  iOS SDK
sidebar_label: iOS SDK
---
Mia-Platform provides an SDK that works as intermediator to permit the interactions between the application and the platform. In this document we will guide you to add the Mia-Platform SDK to your project, initialize it and explain the most common actions available to you.

## General information and requisites

* The latest version of **Xcode** - [download](https://itunes.apple.com/it/app/xcode/id497799835?mt=12)
* The latest version of the Mia-Platform SDK - [download](download/Mia-Platform-iOS-SDK.zip)
* The SDK is compatible with **iOS 9** or above

## SDK Modules

The SDK project is divided in modules:

* mkApp - *Core Framework*
* MIASync
* CRUD

The main one, which we will refer as **Core framework**, will give you access to the CRUD functionality of the BaaS backend, the SSO login and the analytics for your projects. This module is compatible up to BaaS 3 version.

The second one is the **MIASync** framework; this module is optional for your project and rely on the **Core framework** to work and will add the sync data between BaaS and local database functionality to your project.

The third module give you access to the CRUD functionality of the BaaS backend and the sync functionality. It will become the new core framework, as it crought the compatibility with the new BaaS version. This module is compatible starting from BaaS version 4. It is independent from the others modules.

The following paragraph will describe in detail the usage of each module.

## Core Framwerork

### Add the Core module to your Xcode project

Extract the content of the SDK from the zip file and drag and drop the **mkApp.framework** file inside your Xcode project. Pay attention that the copy flag is checked!

![iOS sdk xcode](img/ios-sdk-add-xcode.png)

:::warning
The  two options **Copy items if needed** and **Create Groups** must be selected!
:::

Your file project tree must look like this:

![xcode sdk files](img/xcode-sdk-files.png)

Go to the **Build Phases** section of your project, click on the **+** button on the upper-left corner and select **New Run Script Phase**

![run script phase](img/run-script-phase.png)

A new **Run Script** voice should appear in the list. Rename it **Embedded SDK**, then expand it and add the following line of code:

```
./mkApp.framework/embed-sdk 'mkApp.framework'
```

![embedded sdk](img/embedded-sdk.png)

Lastly, go to **Build Settings**, search **Enable Bitcode** and set it to **No**.

Now you can safely import the mkApp framework in all the files where you want to use its functionality with the familiar statement:

```
Objective-C

#import <mkApp/mkApp.h>
```

```
Swift

import mkApp
```

### Initialization

In order to use the SDK, you have to initialize it. This operation must be done as soon as the application start (for example in the **AppDelegate**). In order to initialize it, write the following line of code:

```
Objective-C

MKAppInstance *appInstance = [MKAppInstance sharedInstance];

// Ask your App Angel to have your Project Name and Secret
appInstance.projectAPIname = @"<YourProjectName>";
appInstance.APISecret = @"<YourAPISecret>";
```

```
Swift

let appInstance = MKAppInstance.sharedInstance

// Ask your App Angel to have your Project Name and Secret
appInstance.projectAPIname = "<YourProjectName>"
appInstance.APISecret = "<YourAPISecret>"
```

The project API name and the API secret will be handed over by your App Angel when the team’s BaaS will be created.

### Create Read Update Delete

In this SDK, the CRUD operations can be performed through the usage of MKCollection and MIAQuery classes, or also their derived classes.

#### MKCollection

Storing data on the remote database is built around the **MKCollection** class. Each **MKCollection** contains key-value pairs of JSON-compatible data. This data is schemaless, which means that you don’t need to specify ahead of time what keys exist on each **MKCollection**. But in order to see your data on the BaaS dashboard you have to configure the column’s name and type (see the BaaS Dashboard section for more details).

For example, let’s say you’re tracking data of a picture taken by a user :

```
userName : "mario"
pictureName : "image51.jpg"
pictureDate : "2014-03-22 17:05:40.351"
flashMode : NO
```

Keys must be alphanumeric strings. Values can be strings, numbers, booleans, dates or arrays – anything that can be JSON-encoded. Each **MKCollection** has a class name that you can use to distinguish different sorts of data.

For example, we could call the Picture Data Object **PictureData**. The code below is an example of how to create and populate the **PictureData object**, then save it:

```
Objective-C

MKCollection* picData = [MKCollection collectionWithName:@"picturedata"];
[picData setObject:@"mario" forKey:@"username"];
[picData setObject:@"image51.jpg" forKey:@"picturename"];
[picData setObject:[NSDate date] forKey:@"picturedate"];
[picData setObject:[NSNumber numberWithBool:NO] forKey:@"plashmode"];
NSError *error = nil;
[picData save:&error];
```

```
Swift

var picData = MKCollection(name: "picturedata")
picData.setObject("mario", forKey:"username")
picData.setObject("image51.jpg", forKey:"picturename")
picData.setObject(NSDate(), forKey:"picturedate")
picData.setObject(NSNumber(value: false), forKey:"plashmode")

do {
    try collection.save()
} catch (error) {
    print(error)
}
```

The **save** method run on the Main Thread and perform a network request. For this reason, if it is executed on the Main Thread, it blocks the application. You have two possibilities: run this method on another thread or use **saveInBackgroundWithBlock**, which also provide additional logic which will run after the save is completed.

Every collection contains a set of basic properties that will be filled directly by the BaaS:

* **Id** is a unique identifier for each saved collection
* **createdAt** and **updatedAt** represent the time that each collection was created and last modified in the database
* **creatorId** and **updaterId**, similarly, represent the **Id** (yes the id related of the User Collection) of the user that has performed the last operation on this data

Each of these fields is filled in by the BaaS automatically, so they don’t exist on a MKCollection instance until a save operation has been completed.

If you need to refresh a collection you already have with the latest data from the remote database, you can use the **refresh**, **refreshInBackground** or **refreshInBackgroundWithBlock** methods.

Updating a collection is simple: enter some new data into a collection and use one of the save functions.

Deleting is even simpler:

```
Objective-C

NSError *error = nil;
[picData delete:&error];
```

```
Swift

do {
    try collection.delete()
} catch (error) {
    print(error)
}
```

or

```
Objective-C

[picData deleteInBackgroundWithBlock:^(MKCollection *collection, NSError *error) {
  //Perform some actions
}];
```

```
Swift

collection.deleteInBackground({ (mkCollection: MKCollection?, error: Error*) in
  //Perform some actions
  })
```

:::warning
Check the ACL configuration of your Collection in your Baas console. It could be necessary to login with MKUser’s methods before any CRUD operation on the data of your Collection!
:::

#### MIAQuery

Reading the data from the BaaS can be done using **MIAQuery** class in both synchronous or asynchronous way. For example, if you want to retrieve an MKCollection with a specific If, you can proceed as follow:

```
Objective-C

MIAQuery *query = [MIAQuery queryWithCollectionName:@"picturedata"];
[query getObjectWithId: @"004b44b9182c19e2" withCompletionBlock:^(id  _Nullable object, NSError * _Nullable error) {
  // Do something with the returned object (the object could be nil if there is an error. Always check the error variable)
  if (error == nil && [object isKindOfClass:[MKCollection class]]) {
    MKCollection *picData = (MKCollection *)object;
    NSString *name = [picData objectForKey:@"username"];
    NSString *fileName = [picData objectForKey:@"picturename"];
    NSDate *pictureDate = [picData objectForKey:@"picturedate"];
  }
  }];
```

```
Swift

let query = MIAQuery(collectionName: "picturedata")
query.getObjectWithID("004b44b9182c19e2") { (object: Any?, error: Error?) in
  // Do something with the returned object (the object could be nil if there is an error. Always check the error variable)
  guard error == nil, let picData = object as? MKCollection else {
      return
    }
    let name = picData.object(forKey: "username")
    let fileName = picData.object(forKey: "picturename")
    let pictureDate = picData.object(forKey: "picturedate")
}
```

There are many other ways to retrieve data with **MIAQuery**. The general pattern is to create a **MIAQuery** instance, put conditions on it and then retrieve a Array of matching MKCollection using either **findObjects** or **findObjectsWithCompletionBlock**. The method **findObjectsWithCompletionBlock** assures the network request is done without blocking, and run the block/callback in the main thread. The **findObjects** method instead blocks the calling thread – use it only if you are already running it in a background thread.

For example:

```
Objective-C

MIAQuery *query = [MIAQuery queryWithCollectionName:@"picturedata"];
query.limit = 10;
[query addFilterForKey:@"updatedAt" relatedBy:MIAQueryRelationGreaterThan toObject:dateLastDownload]; //dateLastDownload is an instance of NSDate
[query addSortKey:@"picturename" ascending:YES];
[query findObjectsWithCompletionBlock:^(NSArray * _Nullable objects, NSError * _Nullable error) {
    if (!error && objects) {
        // The find succeeded.
        NSLog(@"Successfully retrieved %@ pictures.", objects.count);
        // Do something with the found collections
        for (MKCollection *collection in objects) {
            NSLog(@"%@", collection.collectionId);
        }
    } else {
        // Log details of the failure
        NSLog(@"Error: %@ %@", error, [error userInfo]);
    }
}];
```

```
Swift

let query = MIAQuery(collectionName: "picturedata")
query.limit = 10
query.addFilter(forKey: "updatedAt", relatedBy: .greaterThan, to: dateLastDownload) //dateLastDownload is an instance of Date
query.addSortKey("picturename", ascending: true)
query.findObjects { (objects:[Any]?, error: Error?) in
    guard error == nil, let mkcollections = objects as? [MKCollection] else {
        return
    }
    for collection in mkcollections {
        print(collection.collectionId)
    }
}
```

There are several ways to put constraints on the collections found by a **MIAQuery**:

```
Objective-C

[query addFilterForKey:@"updatedAt" relatedBy:MIAQueryRelationGreaterThan toObject:dateLastDownload];
[query addFilterForKey:@"updatedAt" relatedBy:MIAQueryRelationGreaterThanOrEqual toObject:dateLastDownload];
[query addFilterForKey:@"updatedAt" relatedBy:MIAQueryRelationLessThan toObject:dateLastDownload];
[query addFilterForKey:@"updatedAt" relatedBy:MIAQueryRelationLessThanOrEqual toObject:dateLastDownload];
[query addFilterForKey:@"updatedAt" relatedBy:MIAQueryRelationEqual toObject:dateLastDownload];
[query addFilterForKey:@"updatedAt" relatedBy:MIAQueryRelationNotEqual toObject:dateLastDownload];

//more than one (the field key could also be an array)
[query addFilterForKey:@"picturename" containedInArray:@[@"image51.png",@"image52.png"]];
[query addFilterForKey:@"picturename" notContainedInArray:@[@"image51.png",@"image52.png"]];
[query addFilterForKey:@"picturename" containsAllObjectsInArray:@[@"image51.png",@"image52.png"]]; // the field key must be an array

//queries on strings
[query addFilterForKey:@"username" whereHasPrefix:@"mar"];
[query addFilterForKey:@"username" whereHasSuffix:@"mar"];

//You can give multiple constraints, and collections will only be in the results
//if they match all of the constraints.
//In other words, it's like an AND of constraints.

//You can limit the number of results by setting limit. The maximum is 500.
query.limit = 100; // only the first hundred collections will be returned

//You can skip the first results by setting skip. This can be useful for pagination
query.skip = 100; // only return collections over the first hundred

//For sortable types like numbers, strings and dates,
//you can control the order in which results are returned
[query addSortKey:@"picturename" ascending:YES];
[query addSortKey:@"picturename" ascending:NO];

//You can restrict the fields returned by calling
[query includeKeysInResults:@[@"picturename",@"username"]]; // only specified keys are returned
[query excludeKeysFromResults:@[@"picturename",@"username"]]; // all keys are returned exept the specified ones
```

```
Swift

query.addFilter(forKey: "updatedAt", relatedBy: .greaterThan, to: dateLastDownload)
query.addFilter(forKey: "updatedAt", relatedBy: .greaterThanOrEqual, to: dateLastDownload)
query.addFilter(forKey: "updatedAt", relatedBy: .lessThan, to: dateLastDownload)
query.addFilter(forKey: "updatedAt", relatedBy: .lessThanOrEqual, to: dateLastDownload)
query.addFilter(forKey: "updatedAt", relatedBy: .equal, to: dateLastDownload)
query.addFilter(forKey: "updatedAt", relatedBy: .notEqual, to: dateLastDownload)

//more than one (the field key could also be an array)
query.addFilter(forKey: "picturename", containedIn: ["image51.png","image52.png"])
query.addFilter(forKey: "picturename", notContainedIn: ["image51.png","image52.png"])
query.addFilter(forKey: "picturename", containsAllObjectsIn: ["image51.png","image52.png"]) // the field key must be an array

//queries on strings
query.addFilter(forKey: "username", whereHasPrefix: "mar")
query.addFilter(forKey: "username", whereHasSuffix: "mar")

//You can give multiple constraints, and collections will only be in the results
//if they match all of the constraints.
//In other words, it's like an AND of constraints.

//You can limit the number of results by setting limit. The maximum is 500.
query.limit = 100 // only the first hundred collections will be returned

//You can skip the first results by setting skip. This can be useful for pagination
query.skip = 100 // only return collections over the first hundred

//For sortable types like numbers, strings and dates,
//you can control the order in which results are returned
query.addSortKey("picturename", ascending: true)
query.addSortKey("picturename", ascending: false)

//You can restrict the fields returned by calling
query.includeKeys(inResults: ["picturename","username"]) // only specified keys are returned
query.excludeKeys(fromResults: ["picturename","username"]) // all keys are returned exept the specified ones
```

:::warning
Check the ACL configuration of your Collection in your Baas console. It could be necessary to login with MKUser’s methods before quering data of your Collection!
:::

#### mkCollectionFile

**MKCollectionFile** lets you store application files in the cloud that would otherwise be too large or cumbersome to fit into a regular **MKCollection**. The most common use is storing images but you can also use it for documents, videos, music, and any other binary data.
Getting started with MKCollectionFile is easy. First, you’ll need to have the data in **NSData** form and then create a MKCollectionFile with it.

```
Objective-C

//get picture in NSData format starting from a UImage
NSData *myData = UIImagePNGRepresentation(image);
MKCollectionFile *file = [MKCollectionFile fileWithName:@"picture.png" data:myData];
```

```
Swift

//get picture in NSData format starting from a UImage
let myData = UIImagePNGRepresentation(image)
let file = MKCollectionFile(name: "picture.png", data: myData)
```

Notice in this example that we give the file a name of **picture.png**. There are two things to note here:

* You don’t need to worry about filename collisions. Each upload gets a unique identifier so there is no problem with uploading multiple files named picture.png.
* It’s important that you give a name to the file that has a file extension. This lets **BaaS** figure out the file type and handle it accordingly. So, if you’re storing PNG images, make sure your filename ends with .png.

Next you’ll want to save the file to the cloud. As with MKCollection, there are different versions of the save method you can use.

```
Objective-C

NSError *err = nil;
[file save:&err];
```

```
Swift

do {
    try file.save()
} catch {
    print(error)
}
```

:::note
You might want to use **saveInBackgroundWithBlock** to provide additional logic which will run after the save completes and to prevent lock of UI in the Main Thread.
:::

Finally, after the save is completed, you can associate a **MKCollectionFile** id onto a **MKCollection** just like any other piece of data:

```Objective-C
Objective-C

MKCollection *post = ... //a collection
[post setObject:file.collectionId forKey:@"postImage"];
```

```
Swift

var post = MKCollection(name: "a collection")
post?.setObject(file.collectionId, forKey: "postImage")
```

#### Advanced Network settings

In the case you cannot use the classes provided by the SDK to make your network requests, the SDK provides more tools. It exposes a **NSURLSessionTask** instance that point to the same URL with which the SDK has been initialized and it injects automatically the secret and the sid, if the user is logged.

For example, you can create a **NSURLSessionDataTask** to perform **GET** requests as follow:

```
Objective-C

NSURLSessionDataTask *dataTask = [MKAppInstance.sharedInstance.network getDataTaskWithRelativePath:@"geocoding/geo" queryParameters:queryParameters error:&networkError completionHandler:^(NSData * _Nullable data, NSURLResponse * _Nullable response, NSError * _Nullable error) {
        // perform actions
    }];
```

```
Swift

let dataTask = MKAppInstance.shared().network.getDataTask(relativePath:"geocoding/geo", queryParameters:queryParameters, completionHandler:^(data: Data?, response: NSURLResponse?, error: Error?) {
        // perform actions
    })
```

where **queryParameters** is a dictionary which contains the query parameters for the request. The key of the dictionary corresponds to the name of the parameter, the value of the dictionary corresponds to the value of the parameter.

It is possible also to create a **NSURLSessionDataTask** to perform **GET** requests which automatically returns in the completion block the data as a **Dictionary** (if a JSON file is expected) or as a **MKCollection** array. The core module also exposes methods to create NSURLSessionTask for **POST** and **DELETE** actions.

### Basic analytics

The core framework provides also some basics analytics as the installation and the daily use. More sophisticated analytics are provided in the analytics module. The track of the installation and the daily use of your application is done automatically by the core module. No action is requested by the developer.

### Login, registration and restore user sessions

The SDK provides the **MKUser** class responsible of managing the user login data, the user registration data and the password recovery

#### Login

The login activity is managed by the SDK through the **MKUser** class. To perform this action it is possible to call the following static method with email and password of the user to login:

```
Objective-C

[MKUser logInWithEmailInBackground:"email" password:"password" storeUserLocaly:YES block:^(MKUser *user, NSError *error) {
        // perform some actions
    }];
```

```
Swift

MKUser.logInWithEmail(inBackground: "email", password: "password", storeUserLocaly: true) { (user: MKUser?, error: Error?) in
            // perform some actions
        }
```

The MKUser instance of the callback is the user that has been logged.

:::note
If **storeUserLocally** is true, the user will be saved locally on keychain for future login.
:::

#### Registration

In order to perform the registration of a new user, it is necessary to create a new **MKUser** instance and fill the required parameters, which are the email an the password, then perform a save on the user. A complete example is proposed below.

```
Objective-C

MKUser *user = [MKUser user];

[user setObject:@"my username" forKey:@"username"];
[user setObject:@"my name" forKey:@"user_name"];
[user setObject:@"my surname" forKey:@"user_surname"];
[user setObject:@"my email" forKey:@"email"];
[user setObject:@"my password" forKey:@"password"];

[user saveInBackgroundWithBlock:^(MKCollection *collection, NSError *error) {
      // perform some actions
    }];
```

```
Swift

var user = MKUser()

user?.setObject("my username", forKey: "username")
user?.setObject("my name", forKey: "user_name")
user?.setObject("my surname", forKey: "user_surname")
user?.setObject("my email", forKey: "email")
user?.setObject("my password", forKey: "password")

user?.saveInBackground({ (user: MKCollection?, error: Error?) in
    // perform some actions
})
```

#### Restore user session

If the user already exist in the device, the session can be restored without the need of performing the login again.

```
Objective-C

[MKUser loginWithLocalStoredUser:^(MKUser *user, NSError *error, BOOL localCredential) {
  // perform some actions
  }];
```

```
Swift

MKUser.login { (user: MKUser?, error: Error?, localCredential: Bool) in
            // perform some actions
        }
```

In the completion block are returned three parameters:

* an istance on MKUser, that can be null if there aren't logged users or if there was an error
* an instance of NSError, that can be null if there aren't errors
* a boolean that is true if for some reasons it was not possible to check online if the session of the user is still valid, it is false if the server has checked the session of the returned user

## MIASync Framwerork

MIASyncro is a class for syncing  data from BaaS into the local database and viceversa. The local database is represented and referenced by a NSManagedObjectContext.

The sync behaviour is inspired by git: there are a pull action first and then a push action. Changes from BaaS have greater priority than local changes so, if a conflict is present, changes from BaaS will replace local changes.

In particular values from BaaS that have updatedAt greater than updatedAt of local objects, these local objects will be updated (replaced) or deleted, depends on the status.

### Add the Core module to your Xcode project

Extract the content of the SDK from the zip file and drag and drop the **MIASync.framework** file inside your Xcode project. Pay attention that the copy flag is checked!

![iOS sdk xcode](img/ios-sdk-add-xcode.png)

:::warning
The two options **Copy items if needed** and **Create Groups** must be selected!
:::

:::note
This framework doesn't work if the core framework hasn't been added to your project.
:::

Go to the **Build Phases** section of your project and add the following line of code to the click on the **Embedded SDK** script:

```
./mkApp.framework/embed-sdk 'MIASync.framework'
```

You should see something like this:

![embedded sdk](img/embedded-sdk-miasync.png)

Lastly, check in **Build Settings** if **Enable Bitcode** is setted to **No**.

Now you can safely import the MIASync framework in all the files where you want to use its functionality with the familiar statement:

```
Objective-C

#import "MIASync.h"
```

```
Swift

import MIASync
```

### Initialization

In order to use the MIASync framework, you have to initialize it. This operation must be done as soon as the application start (for example in the **AppDelegate**). In order to initialize it, write the following line of code after the MKApp initialization:

```
Objective-C

MKAppInstance *appInstance = [MKAppInstance sharedInstance];

// Ask your App Angel to have your Project Name and Secret
appInstance.projectAPIname = @"<YourProjectName>";
appInstance.APISecret = @"<YourAPISecret>";

NSURL *pathString = [[NSBundle bundleForClass:[self class]] URLForResource:@"TestModel" withExtension:@"momd"];
NSManagedObjectModel *managedObjectModel = [[NSManagedObjectModel alloc] initWithContentsOfURL:modelURL];
MIASyncro *miaSyncro = [[MIASyncro alloc] initWithManagedObjectModel:managedObjectModel];

[miaSyncro sync:@[News.class,Author.class]];
```

```
Swift

let appInstance = MKAppInstance.sharedInstance

// Ask your App Angel to have your Project Name and Secret
appInstance.projectAPIname = "<YourProjectName>"
appInstance.APISecret = "<YourAPISecret>"

guard
    let pathString = Bundle.main.path(forResource: "TestModel", ofType: "momd"),
    let managedObjectModel = NSManagedObjectModel.init(contentsOf: URL(fileURLWithPath: pathString)),
    let miaSyncro = MIASyncro(managedObjectModel: managedObjectModel) else {
      fatalError("Unable to init NSManagedObjectModel")
}

miaSyncro.sync([News.self, Author.self])
```

In order to be instantiated, MIASync need to have a managed object model where to save the collection to sync. MIASync will create a default managedObjectContext using this mode. It is also possible to create by yourself a managed object context and initialize the MIASync with it. After that an instance of MIASync has been created, it is necessary to declare which collections must be synced.

It is possible to do it by assigning an array of classes to the **sync** variable. Each class must have the same name and the same variables of the collection that must be synced from the BaaS. For example, if on the BaaS there is a collection called **News** with **title** and **text** fields, to sync it we must create a class called **News** in the project with two properties **title** and **text**.

## CRUD Framework

**CRUD** is the module of the SDK that interacts with the BaaS starting from version 4. It offers all the tools to create, read, update, and delete objects from and to the BaaS. It offers also the Sync functionality, a **MIASyncro** revisiting that is compatible with the BaaS 4 CRUD.

### Add the CRUD module to your Xcode project

Extract the content of the SDK from the zip file and drag and drop the **CRUD.framework** file inside your Xcode project. Pay attention that the copy flag is checked!

![iOS sdk xcode](img/ios-sdk-add-xcode.png)

:::note
The two options **Copy items if needed** and **Create Groups** must be selected!
:::

Go to the **Build Phases** section of your project and add the following line of code to the click on the **Embedded SDK** script:

```
./mkApp.framework/embed-sdk 'CRUD.framework'
```

You should see something like this:

![embedded sdk](img/ios-add-crud-sdk-script.png)

Lastly, check in **Build Settings** if **Enable Bitcode** is setted to **No**.

Now you can safely import the CRUD framework in all the files where you want to use its functionality with the familiar statement:

```
import CRUD
```

#### Create, Read, Update, Delete

Writing and reading operations from and to the BaaS can be done with the CRUD class, which is the main module of the Framework. All the operations are *synchronous* and *asynchronous*, in order to give to the developer more flexibility.

To use the CRUD, it is necessary to instantiate it with the base path of the BaaS and the API secret key.

:::note
The base path and the API secret will be handed over by your App Angel when the team’s BaaS will be created.
:::

```
let crud = CRUD(basePath: "<YourProjectBasePath>", secret: "<YourProjectSecret>")
```

:::tip
Instantiate the CRUD in a class that is always reachable by the other classes of the app. So there isn't the necessity to instantiate it each time you need to operate with the CRUD.
:::

Through the crud instance is possible to access all the CRUD methods (GET,POST,PATCH and DELETE). For example, to perform a GET request to a collection called "**Author**", it is possible to proceed as follow:

```
crud.get(collection: "author", queryBuilder: nil)
```

The *get* method accept a query parameter. It is useful to perform mongo queries on the objects of the collection. The query can be passed in two ways:

* through a string: in this case it is necessary to write manually the mongo query;
* using the **QueryBuilder**: it is an object that permits to create complex mongo query using a comfortable interface.

```
let query = QueryBuilder().or(queryBuilders: QueryBuilder().equals(key: "name", value: "Giovanni"), QueryBuilder().equals(key: "name", value: "Carlo"))
let get = crud.get(collection: "author", queryBuilder: query)
```

Others useful parameters are configurable using the **GET** object. For example it is possible to limit the number of returned objects, skip the first **n** elements, filter the properties and so on.

```
get.limit(200)
get.skip(500)
get.limitProperties(["name","surname","age"])
get.sortBy(property: "age", descending: true)
```

When you are ready, you can perform the query in a synchronous or asynchronous way.

```
let data: Data = try get.sync()
let result = try JSONSerialization.jsonObject(with: data, options: .allowFragments)
```

or

```
get.async { (data: Data?, error: Error?) in
            if let data = data, error == nil {
                let result = try? JSONSerialization.jsonObject(with: data, options: .allowFragments)
            }
        }
```

:::tip
Alle the CRUD methods support Apple **Codable** protocol. It means that you can create a model class of the collection object and implements the Codable protocol (you can refer to the [Apple Documentation](https://developer.apple.com/documentation/swift/codable) for more informations about this protocol). Then, passing the object type class, the returned object of the CRUD operation is not a generic **Data** object but an object of the passed type. The SDK performs automatically the mapping between the returned object and the Codable class.
:::

    ```
    let authors: [Author] = try get.sync(object: Author.self)
    ```

Usually, to access the BaaS collections it is necessary to be logged. You can set the **Session Identifier** (**SID**) using the dedicated method of the CRUD.

```
crud.setSessionID(sessionID: "<YourSID>")
```

It is possible also remove the SID (for example when the user logout).

```
crud.resetSessionID()
```

:::note
In order to obtain the session ID, you need to perform the login using the **mkApp Framework**.
:::

To create a new object on the BaaS it is possible to use the **POST** method of the CRUD.

```
let post = crud.post(collection: "author")
```

The framework offers different possibilities to create new objects. For example, the developer can create a dictionary where the keys are the property name and the values are the the value of the properties object. If you have a **Data** representation of the new object, you can use it. Also, you can use an object that implements the **Encodable** protocol. In this case you can instantiate the object, assign the property values and then pass the instance of the Encodable object to the post object. It automatically serialize the object and create a new instance of it on the BaaS.

```
let author = Author()
author.name = "Alessandro"
author.surname = "Manzoni"

// object is the Encodable object instance to create, state is the state of the object: PUBLIC,DRAFT,DELETED,TRASH
let id: String = try post.sync(object: author, state: .pub)
```

The result of the POST operation is the id that has been assigned to the object.

The PATCH operation permits to update some properties of an object and remove the value of others properties.

```
let patch = crud.patch(collection: "author")
patch.update(object: 88, for: "age")
let id = try patch.sync(id: "<ObjectId>")
```

The PATCH operation cannot update the state of the object. To perform this action, it is necessary to use the dedicated method.

```
let post = crud.post(collection: "author")
try post.syncChangeState(id: "<ObjectId>", newState: .draft)
```

#### Sync

The **CRUD Framework** offers an utility class that permits to automatically synchronize some collections between an app and the BaaS. This class is called **Sync**. It is a class for syncing data from BaaS into the local database and viceversa. The local database is represented and referenced by a NSManagedObjectContext.

The sync behaviour is inspired by git: there are a pull action first and then a push action. Changes from BaaS have greater priority than local changes so, if a conflict is present, changes from BaaS will replace local changes.

In particular values from BaaS that have updatedAt greater than updatedAt of local objects, these local objects will be updated (replaced) or deleted, depends on the status.

In order to use the Sync class, you have to initialize it. This operation must be done as soon as the application start (for example in the **AppDelegate**). In order to initialize it, write the following line of code:

```
let crud = CRUD(basePath: "<YourProjectBasePath>", secret: "<YourProjectSecret>")
let sync = Sync(crud: crud, context: managedObjectContext)
```

In order to be instantiated, Sync needs to have a managed object model where to save the collection to sync. Sync will create a default managedObjectContext using this mode. It is also possible to create by yourself a managed object context and initialize the Sync with it. It is also necessary to pass an instance of the CRUD class. After that an instance of Sync has been created, it is necessary to declare which collections must be synced.

```
sync.sync(types: [Author.self,Book.self])
```

It is possible to do it by assigning an array of classes to the **sync** variable. Each class must have the same name and the same variables of the collection that must be synced from the BaaS. For example, if on the BaaS there is a collection called **Book** with **title** and **author** fields, to sync it we must create a class called **Author** in the project with two properties **title** and **author**.

Each time that some changes have been done to the local objects, it is necessary to mark them as *to sync*. This operation can be done using the dedicated methods:

```
sync.toPush(entities: [entity1,entity2])
sync.toPublic(entities: [entity3])
sync.toDelete(entities: [entity4,entity5,entity6])
sync.toTrash(entities: [entity7])
sync.toDraft(entities: [entity8,entity9])
```

Each method accepts an array of **NSManagedObject**, which are the instance of the objects that must be synced.

* toPush: entities that must be synced without changing the state
* toPublic: entities that must be synced changing the state to **PUBLIC**
* toDelete: entities that must be synced changing the state to **DELETED**
* toTrash: entities that must be synced changing the state to **TRASH**
* toDraft: entities that must be synced changing the state to **DRAFT**

After that the entities have been marked, it is necessary to call the method **sync** to start the sync phase.

```
sync.sync(types: [Author.self,Book.self])
```

It will start pulling all the modifications from the BaaS, then will start the push phase, where all the local modifications will be pushed to the BaaS. The sync phase can be monitored observing a notification. In particular it is possible to register to the sync notification using this method:

```
NotificationCenter.default.addObserverForSyncStatus(observer: self, selector: #selector(syncState:), object: nil)
```

The **userInfo** of the notification contains an instance of the object **SyncStatus**. It offers a view to the sync state. For example, it is possible to see which class is syncing, the progress and, eventually, the errors of the operation.

```
func syncState(_ sender: Notification) {
    guard let status = sender.userInfo?[kMIASyncroNotificationKeyStatus] as? SyncStatus else {
        return
    }

    let lastSyncedEntity = status.lastSyncedEntity
    let syncingEntity = status.syncingEntity
    let error = status.error
    let progress = status.progress
}
```
