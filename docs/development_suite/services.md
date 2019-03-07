##Services
In this section the user can configure his services.

The services can be of two types:

* external services that you want to integrate into the platform
* custom plugin services configured by the user on git.

**External services**: The user has the possibility to call external services such as Google Maps.
In this case the user must enter the service name, select type *external services* and enter the URL of the desired external service. Finally the user can insert an optional description.

![Services](img/Services.PNG)

**Custom services**: There are two type of Custom Services: 

* *Already exist*: the service is already existing and therefore the user will have to call the service indicating the URL from git.
* *Generate*: the user creates his custom service.

In both cases, the user can configure services such as:

* *Advanced*: the user must always insert the git URL and the revision, after which he must make sure that there are two files in the configuration folder: deployment.yml and services.yml. In addition to these optionally there may be the configmap.yml file.
* *Not advanced*: the user must specify the GIT URL and the revision. Then you need to make sure that there is a Docker image file inside the configuration folder that contains the name of the service docker image.
Furthermore, environmental variables can be added.

**Important** The name given to the service on the api console must be the same as the "name" that exists in the deployment.yml file.

In case the service is of type *Generate*, the user must insert the Gitlab group on which he wants to generate the project, the name, the image docker name. Selecting * create * the folder on git is actually created (additional user authorization is required).

Finally, to create the service select **create**.
