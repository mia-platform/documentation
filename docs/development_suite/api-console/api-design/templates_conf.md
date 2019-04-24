# Template configuration

The Api-console is able to generate new services starting from the Mia custom-plugin, from a git project or from a template of your choice.
To make sure that the Api-console can create new services starting from a template it is necessary to create the template on Gitlab and to register it in the configuration of the API-console.

The templates must be registered in the CRUD, in the `templates` collection, indicating a label that will display the user and the path to the git repository.
Below is an example of a census for a template:

```
curl -d '{"label":"my-template","value":"https://git.tools.mia-platform.eu/api/v4/projects/<your project id>/repository/archive.tar.gz"}' 'https://console.cloud.mia-platform.eu/v2/api/custom-plugin-templates/' -H 'cookie: <your cookie session here>' -H 'secret: <the secret goes here>' -H'content-type: application/json'
```

Replace the placeholders with the correct values.

The `value` field must be a URL to the tar.gz version of the git project.
Below is an example:

```

https://your-host-gitlab/api/v4/projects/:project-id/repository/archive.tar.gz

```

The Api-console will create a repository in which it will copy the template files replacing all occurrences of the following strings between `%`:

`% CUSTOM_PLUGIN_IMAGE_NAME%` -> name of the nexus image entered by the user
`% CUSTOM_PLUGIN_PROJECT_NAME%` -> name (label) of the api-console project
`% CUSTOM_PLUGIN_PROJECT_NAMESPACE%` -> namespace of the api-console project
`% CUSTOM_PLUGIN_SERVICE_NAME%` -> service name chosen by the user
`% CUSTOM_PLUGIN_SERVICE_DESCRIPTION%` -> description of the service chosen by the user
`% CUSTOM_PLUGIN_CREATOR_USERNAME%` -> username of the user who created the service
`% CUSTOM_PLUGIN_PROJECT_FULL_PATH%` -> full Gitlab path
`% GITLAB_PROJECT%` -> name of the Gitlab project entered by the user
`% GITLAB_GROUP%` -> name of the user-entered Gitlab group
`% GITLAB_BASE_URL%` -> URL base of Gitlab
`% NEXUS_HOSTNAME%` -> Nexus hostname
