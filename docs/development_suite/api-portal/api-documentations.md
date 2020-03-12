##API Portal

Documentation is a vital part of any Restful API in order to drive consistency and discipline across your API development workflow. 

In the **Documentation Sections**, you can find automatically generated and kept in sync documentation, that semantically describes the API in a readable structure text format. 
The documentation let you know exactly how your API will work and behave, before integrating it into your code. It lists all the available REST-ends points and provides all detailed information: description, parameters, and schema.  

You can share API documentation within your company, externally to partners and suppliers. 

In order to test the APIs, you can access your tags on the right side of the screen, where the APIs are grouped according to their tags: by clicking on one tag, you will visualize all the APIs that belong to that tag - in our case, we will select the Tag “Ingredient”.  

![](img/list-API.png)

This section below will show you examples and information per request type: GET, POST, PATCH and DELETE.

GET
If you want to test the "GET the list of ingredients" end-point, you need to click the row that will open it up. Now you have the ability to test the API request by pushing **Try it** - if the APIs are protected, you need to authenticate yourself by filling the Secret in.
Once the single API is selected, in this area you can see the structure of the API and the data that are exposed. 

![](img/secret.png)

Here's a picture of a successfull requesto to our runing API, we can see 200 results and in the black box on the right, you can see the request, that can be seen as a cURL,in Node, in Javascript, and in Java. 

In the second box, you can see the response of the body with the list of the ingredients. 

![](img/esempio-get.png)


POST
If you want to test the "POST Add a new item to the ingredient collection" end-point, you need to click the row that will open it up. Now you have the ability to test the API request by pushing **Try it** - if the APIs are protected, you need to authenticate yourself by filling the Secret in .
Once the single API is selected, in this area you can see the structure of the API and the data that are exposed. 
