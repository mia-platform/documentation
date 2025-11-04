/*
WARNING: The redirect map is deprecated!!!
To add a redirect, please add it to the object in the file `301redirects.json` in the root of the project.
The format is as follows:
"/docs/the/old/link/": {
    "destination": "/docs/new/link",
    "addedOn": "2022-10-01"
},
addedOn is optional but recommended, please use the format YYYY-MM-DD, this is used to track when the redirect was added.
*/

const linkFile = require('../301redirects.json');

// Build JS redirect map from JSON file
let redirectPaths = Object.keys(linkFile).reduce((redirects, sourceLink) => {
  const destinationLink = linkFile[sourceLink].destination;
  redirects[destinationLink] = sourceLink;
  return redirects;
}, {});

const createRedirects = (path) => {
  const redirectPath = redirectPaths[path];

  if (redirectPath) return [redirectPath];

  // Redirects all url without docs to docs/..
  if (path.startsWith('/docs')) {
    return [path.replace(/^\/docs/g, "")];
  }

  return undefined
};

module.exports = createRedirects;
