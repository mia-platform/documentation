# Template configuration

The Dev-console is able to generate new services starting from a from a git project or from an existing docker image.

To make sure that the Dev-console can create new services starting from a template it is necessary to create the template on Gitlab and to register it in the configuration of the Dev-console.

The templates must be registered in the CRUD, in the `templates` collection, indicating a label that will display the user and the path to the git repository.

## Template string replaced by dev console during service creation

The Dev-console will create a repository in which it will copy the template files replacing all occurrences of the following strings between `%`:

* `% CUSTOM_PLUGIN_IMAGE_NAME%` -> name of the nexus image entered by the user
* `% CUSTOM_PLUGIN_PROJECT_NAME%` -> name (label) of the dev-console project
* `% CUSTOM_PLUGIN_PROJECT_NAMESPACE%` -> namespace of the dev-console project
* `% CUSTOM_PLUGIN_SERVICE_NAME%` -> service name chosen by the user
* `% CUSTOM_PLUGIN_SERVICE_DESCRIPTION%` -> description of the service chosen by the user
* `% CUSTOM_PLUGIN_CREATOR_USERNAME%` -> username of the user who created the service
* `% CUSTOM_PLUGIN_PROJECT_FULL_PATH%` -> full Gitlab path
* `% GITLAB_PROJECT%` -> name of the Gitlab project entered by the user
* `% GITLAB_GROUP%` -> name of the user-entered Gitlab group
* `% GITLAB_BASE_URL%` -> URL base of Gitlab
* `% NEXUS_HOSTNAME%` -> Nexus hostname

## Example of template upload

Below is an example of the body of a template:

```json
{
	"label": "my-template",
	"value": "https://git.tools.mia-platform.eu/api/v4/projects/<your project id>/repository/archive.tar.gz",
	"description": "my-description",
	"type": "template",
	"imageUrl": "https://my-image",
	"supportedBy": "my-organization"
}
```

and the example curl to create the template:

```bash
curl -d '{"label":"my-template","value":"https://git.tools.mia-platform.eu/api/v4/projects/<your project id>/repository/archive.tar.gz","description":"my-description","type":"template","imageUrl":"https://my-image","supportedBy":"my-organization"}' 'https://console.cloud.mia-platform.eu/v2/api/custom-plugin-templates/' -H 'cookie: <your cookie session here>' -H 'secret: <the secret goes here>' -H'content-type: application/json'
```

The `value` field must be a URL to the tar.gz version of the git project.
Below is an example for project hosted on gitlab:

```

https://your-host-gitlab/api/v4/projects/:project-id/repository/archive.tar.gz

```

## Upload service template image

If you have an image to upload, you should upload to dev console using, for example:

```bash
  curl -F "image=@/path/to/image" "https://console.cloud.mia-platform.eu/v2/files/" -H 'cookie: <your cookie session here>' -H 'secret: <the secret goes here>'
```

Example response for this call:

```json
{
	"_id": "5d8a44205c34c8001240bdaa",
	"name": "magic.gif",
	"file": "65d15696-8724-4103-b672-e29518a55135.gif",
	"size": 1458668,
	"location": "/v2/files/download/65d15696-8724-4103-b672-e29518a55135.gif"
}
```

So, as imageUrl params in template body, you should use: `https://console.cloud.mia-platform.eu/v2/files/download/65d15696-8724-4103-b672-e29518a55135.gif`


### Change a custom template

To change a custom template, you can use the postman collection below to modify the project.

First, fill with your cookie sid to authenticate. Once authenticated, get the template to modify using `Get templates` collection to find the correct id.
With the correct template id, `Change existing template` with the id, remove the unchanged fields and modify the correct one.

### Postman collection

Download this collection and import into postman.

[download](download/template.postman_collection.json)
