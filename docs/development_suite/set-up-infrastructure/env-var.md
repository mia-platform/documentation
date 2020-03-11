#Manage environment variables

Thanks to our console
An environment variable is a variable whose value
is set outside the program, typically through
functionality built into the operating system or microservice.
An environment variable is made up of a name/value pair, and any
number may be created and available for reference at a point in time.

they externalize all environment specific aspects of your app and keep your app encapsulated. Now you can run your app anywhere by modifying the environment variables
without changing your code and without rebuilding it!

some specific examples of common scenarios when you should consider using environment variables.
Which HTTP port to listen on
What path and folder your files are located in, that you want to serve
Pointing to a development, staging, test, or production database

## variabili d'ambeinte predefinite da mia

## Configure your Variables

## Priorità delle variabili

Variables of different types can take precedence over other
variables, depending on where they are defined.
The order of precedence for variables is (from highest to lowest):


Trigger variables or scheduled pipeline variables.
Project-level variables or protected variables.
Group-level variables or protected variables.
YAML-defined job-level variables.
YAML-defined global variables.

Deployment variables.

Predefined environment variables.

For example, if you define:


API_TOKEN=secure as a project variable.

API_TOKEN=yaml in your .gitlab-ci.yml.

API_TOKEN will take the value secure as the project
variables take precedence over those defined in .gitlab-ci.yml.
