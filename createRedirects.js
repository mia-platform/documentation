// This map from url (new page) --> to Url (old page)
const redirectPaths = {
  "/docs/business_suite/guide_cms" : "/user_guide_and_tools/cms/guide_cms",
  "/docs/runtime_suite/swagger-aggregator/overview": "/docs/development_suite/api-portal/swagger_conf",
  "/docs/getting_started/monitoring-dashboard/dev_ops_guide/log": "/docs/development_suite/monitoring-dashboard/dev_ops_guide/log",
  "/docs/development_suite/api-console/api-design/endpoints": "/development_suite/api-console/api-design/esponi_api",
  "/docs/runtime_suite/ses-mail-notification-service/configuration": "/docs/runtime_suite/mail-notification",
  "/docs/guidelines/git_vademecum": "/dev_ops_guide/git_vademecum/",
  "/docs/development_suite/api-console/api-design/services": "/docs/guidelines/communication_between_services_mp4"
};

const createRedirects = (path) => {
  const redirectPath = redirectPaths[path];

  if (redirectPath) return [redirectPath];
  
  // Redirects all url without docs to docs/../..  
  return [path.replace(/^\/docs/g, "")];
};

module.exports = createRedirects;
