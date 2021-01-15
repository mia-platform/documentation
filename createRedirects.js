// This map from url (new page) --> to Url (old page)
const redirectPaths = {
  "/docs/business_suite/guide_cms" : "/user_guide_and_tools/cms/guide_cms",
  "/docs/runtime_suite/swagger-aggregator": "/docs/development_suite/api-portal/swagger_conf",
  "/docs/getting_started/monitoring-dashboard/dev_ops_guide/log": "/docs/development-suite/monitoring-dashboard/dev_ops_guide/log"
};

const createRedirects = (path) => {
  const redirectPath = redirectPaths[path];

  if (redirectPath) return [redirectPath];
  
  // Redirects all url without docs to docs/../..  
  return [path.replace(/^\/docs/g, "")];
};

module.exports = createRedirects;
