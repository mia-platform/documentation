##API Portal

Documentation is a vital part of any Restful API in order to drive consistency and discipline across your API development workflow. 

In the **Documentation Sections**, you can find automatically generated and kept in sync documentation, that semantically describes the API in a readable structure text format. 
The documentation let you know exactly how your API will work and behave, before integrating it into your code. It lists all the available REST-ends points and provides all detailed information: description, parameters, and schema.  

You can share API documentation within your company, externally to partners and suppliers. 

In order to test the APIs, you can access your tags on the right side of the screen, where the APIs are grouped according to their tags: by clicking on one tag, you will visualize all the APIs that belong to that tag - in our case, we will select the Tag “Plates”.  

![](img/listPlates.png)

This section below will show you examples and information per request type: GET, POST, PATCH and DELETE.

**GET request: how to "Get a list of plates"**

If you want to test the GET end-point, you need to click the row that will open it up. Now you have the ability to test the API request by pushing **Try it** - if the APIs are protected, you need to authenticate yourself by filling the Secret in, as shown below.

![](img/secret.png)

Once the single API is selected, in this area you can see the structure of the API and the data that are exposed. 

Below you can see the screenshot of a successfull request to our running API, we can see 200 as OK success status response code and in the black box on the right, you can see the request, that can be seen as a cURL,in Node, in Javascript, and in Java. 
In the second box, you can see the response of the body with the list of the plates. 

![](img/GET.png)

You can see all the Paramters Type: query, path, header, and body. In addition, all the query params are listed and you can filter them. You can also edit it in JASON as shown below. 

![](img/editJASON.png)

**POST request: how to "Add a new item to the plates collection"**

If you want to test the POST end-point, you need to click the row that will open it up. Now you have the ability to test the API request by entering the information that you need. 
In our case we added a plate of "onion rings" with its description and its price. 
Then push **Try it** - if the APIs are protected, you need to authenticate yourself by filling the Secret in.

Below you can see the screenshot of a successfull request to our running API, we can see 200 as OK success status response code, a new ID was created and in the black box on the right, you can see the request, that can be seen as a cURL,in Node, in Javascript, and in Java. 


![](img/PostOnion.png)


**DELETE request: how to "Delete a plate from the plates collection"**

If you want to test the DELETE end-point, you need to click the row that will open it up. Now you have the ability to test the API request by putting the ID of the plate that you want to delete and then pushing **Try it** - if the APIs are protected, you need to authenticate yourself by filling the Secret in.

Below you can see the screenshot of a successfull request to our running API. You can see 204 as No content status response code and in the black box on the right, you can see the request, that can be seen as a cURL,in Node, in Javascript, and in Java. 

![](img/deleteOnion.png)

Always remember the status of you object, whether it is private, public, trash or deleted. 

**PATCH request: how to "Update a plate of the collection by ID"**

If you want to test the DELETE end-point, you need to click the row that will open it up. Now you have the ability to test the API request by pushing **Try it** - if the APIs are protected, you need to authenticate yourself by filling the Secret in.
Once the single API is selected, in this area you can see the structure of the API and the data that are exposed.

Below you can see the screenshot of a successfull request to our running API, we can see 200 as OK success status response code and in the black box on the right, you can see the request, that can be seen as a cURL,in Node, in Javascript, and in Java. 



 
