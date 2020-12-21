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
- `versioned_sidebars/`
   Contains  versioned sidebars config.

## Create a new Docusaurus version

When you want to create a new version, you can tag the **previous** the following command:

```bash
yarn run docusaurus docs:version <x.x.x>
```

Each tagged version has a dedicated folder:

- `versioned_docs/version-<number version>`

**The current  version mustn't be tagged**, you have to do though insert all versions in the `docusaurus.config.js`. The property to edit is `presets."@docusaurus/preset-classic".versions`:

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
              label: '<Current version' (Current)',
              path: '',
            },
            '5.x.x': {
              label: '5.10.x',
              path: '5.x',
            },
          },
        },
        ...
```

Check out the [docusaurus official doc](https://v2.docusaurus.io/docs/versioning/) for more information.

## Documentations pages

> :warning: If you want to edit o create documentation for **marketplace plugins you have to write documentation directly in the plugin repository**.  
Check out the following [guide](https://makeitapp.atlassian.net/wiki/spaces/MIAP/pages/2373877834/Docs+Aggregator)

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

You can write the pages using:

* [GFM markdown syntax](https://guides.github.com/features/mastering-markdown/), the same syntax used in GitHub
* The [Docusaurus admonitions](https://v2.docusaurus.io/docs/markdown-features/#calloutsadmonitions) (using these instead of *N.B, Info: , eg.*)

For more details see the [Docusaurus documentation](https://docusaurus.io/docs/en/doc-markdown).

## What files I have to edit

### To changes documentaton pages

As seen previously, the documentation is versioned, so exist N-1 doc root folders in addition to the root folder.

Usually, you should modify only the current version ( `/docs` folder).If the changes are related to bugs or are important for a previous version, you have to copy changes on the version pages.

### How to change main and side menu

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
                label: "Console",
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

`sidebars.json` define the side menu of current version:

```json
   {
    "learn":[
      {
        "collapsed":false,
        "type":"category",
        "label":"Create Services",
        "items":[
          {
            "type":"doc",
            "id":"development_suite/api-console/api-design/plugin_baas_4"
          }
        ]
      },
      {
        "collapsed":false,
        "type":"category",
        "label":"Guidelines",
        "items":[
          {"type":"doc","id":"guidelines/git_vademecum"},
          {"type":"doc","id":"guidelines/rest_api_vademecum"},
          {"type":"doc","id":"guidelines/microservice_vademecum"},
          {"type":"doc","id":"guidelines/communication_between_services_mp4"},
          {"type":"doc","id":"guidelines/docker_vademecum"},
          {
            "type":"doc",
            "id":"getting_started/monitoring-dashboard/dev_ops_guide/business_continuity"
          },
          {
            "type":"doc",
            "id":"getting_started/monitoring-dashboard/dev_ops_guide/disaster_recovery"
          },
        ]
      }
    ]
   }
```

* To add an item linked to  page  you have to add an object with `"type": "doc"` and the property `"id"` valued with the final id of the page.

* To create a sub-element that contains other elements you have to add an object with `"type": "category"` and the property `"label"` valued with the label of the item.

#### Repository deploy rules

All changes pushed to the branch `master` trigger a pipeline that will deploy the docs site on [https://next.docs.mia-platform.eu/](https://next.docs.mia-platform.eu/). So you can see the changes before carrying over to the main site.

To carry over the changes on the main site [https://docs.mia-platform.eu/](https://docs.mia-platform.eu/), you have to tag a new version here on GitLab.

### Resources

- (<https://v2.docusaurus.io/docs/>)

[nvm]: https://github.com/creationix/nvm
