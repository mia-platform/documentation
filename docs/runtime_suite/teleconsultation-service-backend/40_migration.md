---
id: migration
title: Migration
sidebar_label: Migration
---



## Migration to v2.0.0

Update the [**BANDYER_BASE_URL**][environment-variables] environment variable with the new API base URL:

- Sandbox environment: `https://api.sandbox.eu.bandyer.com`
- Production environment: `https://api.[region].bandyer.com`

If you are using Kaleyra in Europe, the value of the `region` parameter should be `eu`.

You can also find the base URL to use among the details of your API key and SID, just follow the instructions provided in the [official Kaleyra documentation][kaleyra-api-key].

For additional information about environments, please check [official Kaleyra documentation][kaleyra-environments].


[kaleyra-api-key]: https://developers.kaleyra.io/docs/view-api-key-and-sid
[kaleyra-environments]: https://developers.kaleyra.io/reference/video-environments
[environment-variables]: /runtime_suite/teleconsultation-service-backend/20_configuration.md#environment-variables
