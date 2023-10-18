/**  list of resources that does not need to be edited */
const UNEDITABLE_RESOURCES = [
  'runtime_suite_examples/.*',
  'runtime_suite_templates/.*',
  'runtime_suite_libraries/.*',
  'runtime_suite_tools/.*',
  'business_suite/.*', 
  'runtime_suite/.*', 
  'business_suite/backoffice',
  'runtime_suite_applications/.*'
];

const isDocVersioned = (versionDocDirPath) => /versioned_docs/.test(versionDocDirPath)

const removeMarkDownFromPath = (docPath) => docPath.split('/').slice(0,-1).join('/')

const isResourceEditable = (resource) => !UNEDITABLE_RESOURCES.some(uneditableResource => new RegExp(`^${uneditableResource}$`).test(resource))
/**
 * https://docusaurus.io/docs/api/plugins/@docusaurus/plugin-content-docs#ex-config
 * @param {{versionDocsDirPath: string, docPath: string}} param 
 * @returns {string?}
 */
module.exports = ({versionDocsDirPath, docPath}) => {
   
    if(!isDocVersioned(versionDocsDirPath)) {
        const resource = removeMarkDownFromPath(docPath);
        if(isResourceEditable(resource)) {
          return `https://github.com/mia-platform/documentation/edit/main/${versionDocsDirPath}/${docPath}`;
        }
    }
    
}