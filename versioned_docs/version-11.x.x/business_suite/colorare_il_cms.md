---
id: colorare_il_cms
title:  Color the CMS
sidebar_label: Color the CMS
---
## The files you need


To customize the colors of the CMS you must first have access to the Folder: "Custom CMS" in the Git repository of your project.
If the folder is not present we suggest you:

* Take an example project with the Custom CMS created by git lab.

* Make a git clone

:::warning
Warning! if you clone an existing project, verify in all the files created that the name of your customer is present and not of the customer from which you have cloned the path.
:::

The path to find your folder is: Project Name> Web Apps> Custom CMS

Inside this folder there must be another folder that by convention has the name of the cms, so basically it has the name of the customer.

In this folder there must be two other folders:

* a **custom** that contains the file: *variables.css*

* a **img** that contains the file to customize your CMS image.

Once you have all these files on your GIT project, you can start customizing your CMS!

## Control of project variables

To ensure that your project is successfully deployed, update or verify that the following variables have been updated

* 1. Go to the project's gitlab-ci thread within Custom CMS.

Enter the name of the client project for each path and choose the version of the CMS you want to build

* 2. Go to the gitlab path /clients/:client-name/configuration/gitlab-cli.yaml

Check and see the version of the CMS you want to build

```

     image: nexus.mia-platform.eu/tools/kubectl:1.11.2

     variables:
       GIT_DEPTH: 1
       CMS_IMAGE_NAME: "nexus.mia-platform.eu/gls-ego/cms-site:7.0.4"

     stages:
       - release

     .deploy-job: &deploy_job
       before_script:
         - ./scripts/setup-context.sh "${KUBE_CONTEXT}" "${KUBE_CERT}" "${KUBE_URL}" "${KUBE_TOKEN}"

       script:
         - ./scripts/interpolate.sh
         - ./scripts/deploy.sh

       artifacts:
         paths:
           - interpolated-files/

     development:
       stage: release

       variables:
         KUBE_CONTEXT: "dev"
         KUBE_CERT: "${KUBE_DEV_CERT}"
         KUBE_URL: "${KUBE_DEV_URL}"
         KUBE_TOKEN: "${KUBE_DEV_TOKEN}"
         LOG_LEVEL: "${DEV_LOG_LEVEL}"
         MONGODB_URL: "${PREPROD_MONGODB_URL}"
         REDIS_URL: "${PREPROD_REDIS_URL}"

         MONGODB_LEGACY_URL: "${PREPROD_MONGODB_LEGACY_URL}"
         REDIS_LEGACY_URL: "${PREPROD_REDIS_LEGACY_URL}"

       only:
         variables:
           - $ENVIRONMENT_TO_DEPLOY == "development"

       <<: \*deploy_job

     preprod:
       stage: release

       variables:
         KUBE_CONTEXT: "preprod"
         KUBE_CERT: "${KUBE_PREPROD_CERT}"
         KUBE_URL: "${KUBE_PREPROD_URL}"
         KUBE_TOKEN: "${KUBE_PREPROD_TOKEN}"
         LOG_LEVEL: "${PREPROD_LOG_LEVEL}"
         MONGODB_URL: "${PREPROD_MONGODB_URL}"
         REDIS_URL: "${PREPROD_REDIS_URL}"

         MONGODB_LEGACY_URL: "${PREPROD_MONGODB_LEGACY_URL}"
         REDIS_LEGACY_URL: "${PREPROD_REDIS_LEGACY_URL}"

       only:
         variables:
           - $ENVIRONMENT_TO_DEPLOY == "preproduction"

       <<: \*deploy_job

     cloud:
       stage: release

       variables:
         KUBE_CONTEXT: "cloud"
         KUBE_CERT: "${KUBE_CLOUD_CERT}"
         KUBE_URL: "${KUBE_CLOUD_URL}"
         KUBE_TOKEN: "${KUBE_CLOUD_TOKEN}"
         LOG_LEVEL: "${CLOUD_LOG_LEVEL}"
         MONGODB_URL: "${CLOUD_MONGODB_URL}"
         REDIS_URL: "${CLOUD_REDIS_URL}"

         CMS_IMAGE_NAME: "nexus.mia-platform.eu/gls-ego/cms-site:7.0.0"
         MONGODB_LEGACY_URL: "${CLOUD_MONGODB_LEGACY_URL}"
         REDIS_LEGACY_URL: "${CLOUD_REDIS_LEGACY_URL}"

       <<: \*deploy_job

       only:
         variables:
           - $ENVIRONMENT_TO_DEPLOY == "production"
```

## Variable colors - variables.css

**body-bg**: general background color. It is best to put it on gray # f4f4f4

**color-search**: background color of the search

**color-brand**: background color of the sidebar

**color-text-special**: These are the titles of the sidebar categories, the user's text, and the navigation bar

**color-text-special-2**: how the title of the properties are displayed during editing and creation

**color-text-special-3**: some particular variables such as: when I click on all publish or draft, the placeholders on the pages, the color of the selected row in a table, the color of the page bar that loads

**color-text-negative**: the color of the fields in the table

**color-brand-gradient**: secondary color

**color-brand-gradient-3**: when an item is selected in the left menu and the color of My CMS Bees on the bottom left in the sidebar

**color-brand-gradient-4**: alert

**color-brand-gradient-5**: keys error and warning

**color-search-text**: the color of the text in the search

**color-button**: the color of the buttons

**color-brand-gradient-1**: The color of the title of the pages in the side menu

**color-brand-bg-notification**: if you activate the notifications the background color of the badge

**color-brand-text-notification**: the text color inside the notifications

## Customize the CMS theme at runtime

:::caution
This feature is supported only from the CMS version 9.14.0
:::

It is possible to dynamically change the logo and the colors of the CMS at runtime. To enable this feature you have to
expose the endpoint `/cms-theme`. The endpoint should return a JSON array, the first element of which should be an 
object containing the custom theme to apply. We suggest doing that through a CRUD, as outlined in the 
[Configure the Console](#configure-the-console) section.

:::info
If you do not expose the endpoint, or if the endpoint returns an error or an empty array, the CMS will keep using the 
default theme applied at build time as described in the [dedicated section](#the-files-you-need).
:::

In the custom theme configuration, you can specify a custom value for the logo url and for any of the variables listed
in the [Variable colors](#variable-colors---variablescss) section. It follows an example of a valid configuration:

```json
{
  "logo": "url",
  "body-bg": "#e3eee3",
  "color-search": "#396093",
  "color-text-special": "#396093",
  "color-text-special-2": "#fff",
  "color-text-special-3": "#F3FFF3",
  "color-text-negative": "#00331a",
  "color-brand": "#86c2da",
  "color-brand-gradient": "#73808F",
  "color-brand-gradient-3": "#00a2e2",
  "color-brand-gradient-4": "#D1A565",
  "color-brand-gradient-5": "#d71920",
  "color-search-text": "white",
  "color-button": "#5F5F5F",
  "color-brand-gradient-1": "#fff"
}
```

:::info
None of these fields are mandatory. If you do not specify a custom value for one of the fields, the CMS will keep using
the default value applied at build time.
:::

:::caution
If you specify the url of a custom logo, please keep in mind that it has to be reachable from the same host of your CMS.
We, therefore, recommend uploading the desired image in the [File service](../runtime_suite/files-service/configuration).
:::

### Configure the Console

1. **CRUD - `cmstheme` creation**
   
   The first thing to do is to create a CRUD named `cmstheme` where you can store your custom theme configurations. You
   can follow [these steps](../development_suite/api-console/api-design/crud_advanced) to create your CRUD using the
   following data:
    - **name**: `cmstheme`
    - **properties**: 
         - `logo`: String (Optional)
         - `body-bg`: String (Optional)
         - `color-search`: String (Optional)
         - `color-text-special`: String (Optional)
         - `color-text-special-2`: String (Optional)
         - `color-text-special-3`: String (Optional)
         - `color-text-negative`: String (Optional)
         - `color-brand`: String (Optional)
         - `color-brand-gradient`: String (Optional)
         - `color-brand-gradient-1`: String (Optional)
         - `color-brand-gradient-3`: String (Optional)
         - `color-brand-gradient-4`: String (Optional)
         - `color-brand-gradient-5`: String (Optional)
         - `color-search-text`: String (Optional)
         - `color-button`: String (Optional)

    You can create the fields importing this <a download target="_blank" href="/docs_files_to_download/cmsthemeConfig.json">JSON file</a> and following [this guide](../development_suite/api-console/api-design/crud_advanced#how-to-create-the-fields-of-your-crud-by-importing-a-json).
         

2. **Endpoint - create the `/cms-theme` endpoint**

  Now you can create the new endpoint with base path `/cms-theme` following 
  [this guide](../development_suite/api-console/api-design/endpoints). The type of this endpoint is CRUD as we want it 
  to expose the CRUD we created in the previous step.

  The CMS will call the `GET -/cms-theme/` to receive an array of configurations. If you want to filter the results
  of this call and return to the CMS the desired one, you may attach a
  [PRE decorator](../development_suite/api-console/api-design/decorators) to this endpoint.

  :::note
  If the endpoint returns to the CMS an array with multiple elements, the first one will be applied.
  :::

3. **Optional - expose the CRUD in the CMS**

   Last step you can optionally create another endpoint exposing the same CRUD created and use the endpoint to
   display the CRUD in the CMS following [these steps](./cms_configuration/config_cms.md).

Now you can commit and deploy your project.
