# Mia-Platform documentation

The documentation site is built using [Docusaurus 2](https://v2.docusaurus.io/), a modern static website generator.

> :memo: To contribute check out the [Docusaurus v2 Official documentation](https://v2.docusaurus.io/docs/)

## Local Development

To develop locally you need:

- Node 12+

To setup node, please if possible try to use [nvm][nvm], so you can manage
multiple versions easily. Once you have installed nvm, you can go inside
the directory of the project and simply run `nvm install`, the `.nvmrc` file
will install and select the correct version if you don’t already have it.

```shell
npm ci
```

This command will install the dependencies.

```shell
npm start
```

This command rapidly launch the site on <http://localhost:3000> and open up a browser window.
After this command every time you save, **the site will be automatically live updated.**

> :warning: **In this mode the searching won't work**: see the following instruction to know how to launch the site with all features activated

To test searching you have to build the project and runs it on a local server. This is a plugin limit, [Docusaurus-lun-search](https://github.com/lelouch77/docusaurus-lunr-search#how-to-use-) doesn't yet support local development. Enter these commands:

```shell
yarn build
yarn serve
```

This command starts a local development server, the site will be reachable on <http://localhost:8080> window. To see changes you have to restart the server.

### How to contribute

Docusaurus use **Markdown**, check out the [official docs](https://v2.docusaurus.io/docs/) for further detail, for example how to add a new item to the left sidebar, etc.

To contribute to the Mia-Platform docs:

1. Clone git@git.tools.mia-platform.eu:platform/documentations.git;
2. Create a branch named according to these rules:
     `prefix-name`
     - **prefix** can be:
      `edit` if you are changing a page.
      `new` if you are working on a new section related to features already gone to production.
      `prj` if you are writing docs about a yet not approved project.

     - **name**: name of the page, change or project.

     > :warning: **It's strictly important follow branch name conventions**

3. Run locally docs site to test changes before submitting a Merge Request: `npm start`
4. Submit a merge request, then post the MR URL in the "my documentation" stanza. Optionally add notes about the importance of changes, according to internal / customer needs. Notify POs of affected products.

### Repository structure

- `src`
   Contains the custom code.
     - `src/components`
     Contains the React custom components
     - `src/pages`
     Contains off-documentations pages, like the homepage. **These pages aren't versioned.**
     - `src/theme`
     Contains Docusaurus components customized.
- `docs/`
   Contains markdown documentation page.
- `versioned_docs/`
   Contains versioned documentation pages.
     - `versioned_docs/version-5.x.x`
          Contains the files related to v5

### Create a new version

You can tag a new version run the following command:

```bash
yarn run docusaurus docs:version <x.x.x>
```

In general each tagged version has a dedicated folder:
- `versioned_docs/version-<number version>`

Check out the [docusaurus official doc](https://v2.docusaurus.io/docs/versioning/) for more information.

### What files I have to edit?

As seen previously, the documentation is versioned, so exist N doc root folders in addition to the root folder.

* If the changes have to affect only *x.x.x* version, you have to edit the files in related Folder `versioned_docs\version-<version>`

* If the changes are valid for all version you have to copy changes on all versions pages, including `doc\..`.

> :warning: **It's strictly important keep updated the  `doc\` folder**. The next version will be tagged starts from the content of the this folder.

#### Doc pages

As seen previously, the documentation is versioned, so exist N doc root folders in addition to the root folder.

* If the changes have to affect only *x.x.x* version, you have to edit the files in related Folder `versioned_docs\version-<version>`

* If the changes are valid for all version you have to copy changes on all versions pages, including `doc\..`.

> :warning: **It's strictly important keep updated the  `doc\` folder**. The next version will be tagged starts from the content of the this folder.

### Docusaurus configuration

`docusaurus.config.js` it's the unique configuration file. It's used to set plugins, and other basic and advanced settings.

#### Repository deploy rules

All changes pushed to the branch `master` trigger a pipeline that will deploy the docs site on [https://next.docs.mia-platform.eu/](https://next.docs.mia-platform.eu/). So you can see the changes before carrying over to the main site.

To carry over the changes on the main site [https://docs.mia-platform.eu/](https://docs.mia-platform.eu/), you have to tag a new version here on GitLab.

### Resources
- (https://v2.docusaurus.io/docs/)

[nvm]: https://github.com/creationix/nvm
