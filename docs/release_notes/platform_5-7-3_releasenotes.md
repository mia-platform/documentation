# v5.7.3 (May 27,2020)

## New features

* **Templates**       
         New template interpolation strings `mia_template_image_name_placeholder`, `mia_template_project_id_placeholder`, `mia_template_service_name_placeholder` for custom plugins have been added in order to allow templates to have their own CI. You can learn more about templates configuration at this [page](https://docs.mia-platform.eu/development_suite/api-console/api-design/templates_conf/) of Mia Platform Docs.

!!! info

    Old interpolation strings `CUSTOM_PLUGIN_PROJECT_ID`, `CUSTOM_PLUGIN_SERVICE_NAME` and `CUSTOM_PLUGIN_IMAGE_NAME` are now deprecated.

## Improvements

* **Configmaps**       
    The size of the configmaps generated for core services **has been reduced**.
    
## How to update your DevOps Console?

In case of on-premise Console, to use these features, you have to update:

* Console Backend @1.22.0 (`nexus.mia-platform.eu/api-console/backend:1.22.0`)