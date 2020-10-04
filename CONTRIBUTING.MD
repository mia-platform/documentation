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
   Contains markdown documentation page for current version.
- `versioned_docs/`
   Contains  versioned documentation pages.
  - `versioned_docs/version-5.x.x`
     Contains the files related to v5

## Create a new Docusaurus version

You can tag a new Docusaurus version run the following command:

```bash
yarn run docusaurus docs:version <x.x.x>
```

In general each tagged version has a dedicated folder:

- `versioned_docs/version-<number version>`

Then you have to insert new version in the `docusaurus.config.js`. The property to edit is `presets."@docusaurus/preset-classic".versions`:

Eg.

```json
  presets: [
    [
      "@docusaurus/preset-classic",
      {
        docs: {
          sidebarPath: require.resolve("./sidebars.js"),
          lastVersion: 'current',
          versions: {
            current: {
              label: '6.x (Current)',
              path: '',
            },
            '5.x.x': {
              label: '5.10.x',
              path: '5.x',
            },
          },
        },
        theme: {
          customCss: require.resolve("./src/css/custom.css"),
        },
        sitemap: {
          cacheTime: 600 * 1000, // 600 sec - cache purge period
          changefreq: "weekly",
          priority: 0.5,
        },
      },
    ],
  ],
```

Check out the [docusaurus official doc](https://v2.docusaurus.io/docs/versioning/) for more information.

## Documentations pages

Each .md file have to include the following preamble:

```
---
id: <id>
title:  <Title displayed in the page>
sidebar_label: <Title displayed in the sidebar>
---
```

The complete ID of the page is:

 `<path>+id`

## What files I have to edit

### To changes documentaton pages

As seen previously, the documentation is versioned, so exist N doc root folders in addition to the root folder.

* Usually, you should modify only the files in docs folder. Other folder are read-only.

* If the changes are valid for a previous version, you have to copy changes on the version pages.

> :warning: **It's strictly important keep updated the  `doc\` folder**. The next version will be tagged starts from the content of the this folder.

### To change main and side menu

`docusaurus.config.js` it's the unique configuration file. It's used to set plugins, and other basic and advanced settings.

This file define the main top menu:

```js
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
     ...
    }
```

Each link has to be the *final id* of a documentation page.

> Eg. the link `docs/business_suite/overview-business-suite` refers to the .md file placed in `docs/business_suite` having as id `overview-business-suite`. The name of the file doesn't matter, but it's advisable to keep align with the id.

The links defined in the `a` properties link the main item menu to a single **sidebar menu**. In other words, the user will be redirected to the page and see the sidebar menu where the linked page is contained.

`sidebars.js` define the side menu that contains the side menu of documentations

#### Repository deploy rules

All changes pushed to the branch `master` trigger a pipeline that will deploy the docs site on [https://next.docs.mia-platform.eu/](https://next.docs.mia-platform.eu/). So you can see the changes before carrying over to the main site.

To carry over the changes on the main site [https://docs.mia-platform.eu/](https://docs.mia-platform.eu/), you have to tag a new version here on GitLab.

### Resources

- (<https://v2.docusaurus.io/docs/>)

[nvm]: https://github.com/creationix/nvm
