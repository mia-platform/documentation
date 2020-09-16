# How to contribute

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

3. Run locally docs site to test changes before submitting a Merge Request: `yarn start`
4. Submit a merge request, then post the MR URL in the "my documentation" room. Optionally add notes about the importance of changes, according to internal / customer needs. Notify POs of affected products.

## Repository structure

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
   Contains  versioned documentation pages.
     - `versioned_docs/version-6.x.x`
          Contains the files **related to v6**. In order to understand, the version that is displayed when clicking `Version 6.0.x` in the right top dropdown list.
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

This file define the main top menu:

```
    navbar: {
        title: "Mia-Platform Docs",
        logo: {
            alt: "Mia_Platform logo",
            src: "img/logo.png",
        },
        items: [
            {
            to: "docs/overview/mia_platform_overview",
            label: "Overview",
            position: "left",
            },
            {
            label: "Docs by product",
            position: "left",
            items: [
                {
                label: "DevOps Console",
                to: "docs/development_suite/overview-dev-suite",
                },
                {
                label: "Microservices Ecosystem",
                to: "docs/runtime_suite/overview-runtime-suite",
                },
                {
                label: "Fast Data",
                to: "docs/fast_data/overview",
                },
                {
                label: "API Management & Headless CMS",
                to: "docs/business_suite/overview-business-suite",
                },
            ]
        ],
     },
    }
```

#### Repository deploy rules

All changes pushed to the branch `master` trigger a pipeline that will deploy the docs site on [https://next.docs.mia-platform.eu/](https://next.docs.mia-platform.eu/). So you can see the changes before carrying over to the main site.

To carry over the changes on the main site [https://docs.mia-platform.eu/](https://docs.mia-platform.eu/), you have to tag a new version here on GitLab.

### Resources
- (https://v2.docusaurus.io/docs/)

[nvm]: https://github.com/creationix/nvm