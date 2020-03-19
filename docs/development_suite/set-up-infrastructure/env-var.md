# Environment Variables

An environment variable is a variable whose value is set outside the program, typically through functionality built into the operating system or microservice.
An environment variable is made up of a name/value pair, and any number may be created and available for reference at a point in time.

Environment variables are excellent for decoupling application configurations. Typically, our applications require many variables to be set in order for them to work. By relying on external configurations, your app can easily be deployed on different environments. These changes are independent of code changes, so they do not require your application to be rebuilt to change.

They externalize all environment specific aspects of your app and keep your app encapsulated. Now you can run your app anywhere by modifying the environment variables without changing your code and without rebuilding it!

Some specific examples of common scenarios when you should consider using environment variables.
* Which HTTP port to listen on  
* What path and folder your files are located in, that you want to serve  
* Pointing to a development, staging, test, or production database  

# Manage your Variables

Thanks to our Console in the SetUp Infrastructure area it's possibile to manage your Environment Variables

## How to differentiate your variable from one environment to another



## Create a Variable

When you start with a new project you will find variables already configured.
to add a new variable press the button at the bottom of the table: create a new variable and fill in the form:
* the **key** is mandatory and identifies your variable.
* the **value** is the value you want to attribute to your variable, the one that will be interpolated.


## Edit a Variable


## Delete a Variable


