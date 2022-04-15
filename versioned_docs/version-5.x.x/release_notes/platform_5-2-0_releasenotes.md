---
id: platform_5-2-0_releasenotes
title:  Platform v5.2
sidebar_label: v5.2
---
## v5.2.0 (February 18, 2020)

### Zero Downtime

With zero downtime the platform remains up during the deployment time without downtimes.
This functionality is currently implemented only on some core services. Templates have been updated with this new feature.

**[Internal Rewrite URL](https://docs.mia-platform.eu/development_suite/api-console/api-design/esponi_api/#internal-rewrite-url)**

The developer can decide which basepath is associated to an endpoint by applying an internal rewrite url.

### Improvements

* **Deploy - History**: refresh button added for update the list of your deploy

* **Design - CRUD**: restyling of crud section with new card layout

* **Session Manager (v4.5.0)**: expose `GET /sessions/me` for retrieving session info

### Fixes

* **Deploy - History**: fix to the filters in the deployment history page

* **Deploy - History**: fix wrong data order

* Fix 401/403 HTML response body on JSON request

* Fix XSS vulnerability on error

* **Log & Monitoring**: fix loading pod list
