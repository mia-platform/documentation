/**  list of resources that does not need to be edited */
const UNEDITABLE_RESOURCES = [ 
  'release-notes',
  'runtime_suite', 
  'business_suite/backoffice',
  'runtime_suite_applications'
];

const isDocVersioned = (versionDocDirPath) => /versioned_docs/.test(versionDocDirPath)

const isResourceEditable = (resource) => !UNEDITABLE_RESOURCES.some(uneditableResource => new RegExp(`^${uneditableResource}$`).test(resource))
/**
 * https://docusaurus.io/docs/api/plugins/@docusaurus/plugin-content-docs#ex-config
 * @param {{versionDocsDirPath: string, docPath: string}} param 
 * @returns {string?}
 */
module.exports = ({versionDocsDirPath, docPath}) => {
   
    if(!isDocVersioned(versionDocsDirPath)) {
        const resource = docPath.split('/').slice(0,-1).join('/');
        if(isResourceEditable(resource)) {
          return `https://github.com/mia-platform/documentation/edit/main/${versionDocsDirPath}/${docPath}`;
        }
    }
    
}