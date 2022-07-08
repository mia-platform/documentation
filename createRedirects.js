// This map from url (new page) --> to Url (old page)
const redirectPaths = {
  "/docs/business_suite/guide_cms" : "/user_guide_and_tools/cms/guide_cms",
  "/docs/runtime_suite/swagger-aggregator/overview": "/docs/development_suite/api-portal/swagger_conf",
  "/docs/getting_started/monitoring-dashboard/dev_ops_guide/log": "/docs/development_suite/monitoring-dashboard/dev_ops_guide/log",
  "/docs/development_suite/api-console/api-design/endpoints": "/development_suite/api-console/api-design/esponi_api",
  "/docs/runtime_suite/ses-mail-notification-service/configuration": "/docs/runtime_suite/mail-notification",
  "/docs/guidelines/git_vademecum": "/dev_ops_guide/git_vademecum/",
  "/docs/development_suite/api-console/api-design/services": "/docs/guidelines/communication_between_services_mp4",
  "/docs/runtime_suite_tools/miactl/overview": "/docs/development_suite/miactl/overview",
  "/docs/runtime_suite/push-notification-manager/configuration": "/docs/runtime_suite/notifications-manager",
  "/docs/runtime_suite/push-notification-sender/overview": "/docs/runtime_suite/push_notifications_platform_4",
  "/docs/runtime_suite/envoy-api-gateway/filters": "/docs/runtime_suite/api-gateway-envoy/filters",
  "/docs/runtime_suite/envoy-api-gateway/overview": "/docs/runtime_suite/api-gateway-envoy/overview",
  "/docs/fast_data/overview": "/docs/runtime_suite/event-source-management",
  "/docs/runtime_suite/pdf-service/overview": "/docs/runtime_suite/pdf-service",
  "/docs/info/version_policy/": "/info/version-policy/",
  "/docs/marketplace/add_to_marketplace/contributing_overview/": "/docs/development_suite/api-console/api-design/templates_conf" 
};

const createRedirects = (path) => {
  const redirectPath = redirectPaths[path];

  if (redirectPath) return [redirectPath];

  // Redirects all url without docs to docs/../..
  return [path.replace(/^\/docs/g, "")];
};

module.exports = createRedirects;
