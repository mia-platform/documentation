# Color the CMS

## The files you need

To customize the colors of the CMS you must first have access to the Folder: "Custom CMS" in the GitLab repository of your project.

If the folder is not present we suggest you:

* Take an example project with the Custom CMS created by git lab.

* Make a git clone

!!! warning
    Warning! if you clone an existing project, verify in all the files created that the name of your customer is present and not of the customer from which you have cloned the path.

The path to find your folder is: Project Name> Web Apps> Custom CMS

Inside this folder there must be another folder that by convention has the name of the cms, so basically it has the name of the customer.

In this folder there must be two other folders:

* a **custom** that contains the file: * variables.css *

* a **img** that contains the file to customize your CMS image.

Once you have all these files on your GIT project, you can start customizing your CMS!

## Control of project variables

To ensure that your project is successfully deployed, update or verify that the following variables have been updated

* 1. Go to the project's gitlab-ci thread within Custom CMS.

Enter the name of the client project for each path and choose the version of the CMS you want to build

* 2. Go to the path gilab /clients/:client-name/configuration/gitlab-cli.yaml

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

         CORE_LEGACY_IMAGE_NAME: "nexus.mia-platform.eu/demo/baas-legacy:0.2.0"
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

         CORE_LEGACY_IMAGE_NAME: "nexus.mia-platform.eu/demo/baas-legacy:0.2.0"
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
         CORE_LEGACY_IMAGE_NAME: "nexus.mia-platform.eu/demo/baas-legacy:0.2.0"
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

**color-text-special**: These are the titles of the sidebar categories, the user's text, and the navigaton bar

**color-text-special-2**: how the title of the properties are displayed during editing and creation

**color-text-special-3**: some particular variables such as: when I click on all publish or draft, the placeholders on the pages, the color of the page bar that loads

**color-text-negative**: the color of the fields in the table

**color-brand-gradient**: secondary color

**color-brand-gradient-3**: when an item is selected in the left menu and the color of My CMS Bees on the bottom left in the sidebar

**color-brand-gradient-4**: allert

**color-brand-gradient-5**: keys error and warning

**color-search-text**: the color of the text in the search

**color-button**: the color of the buttons

**color-brand-gradient-1**: The color of the title of the pages in the side menu

**color-brand-bg-notification**: if you activate the notifications the background color of the badge

**color-brand-text-notification**: the text color inside the notifications
