# Contribution Guidelines

First off, thank you for considering contributing to this project.

Please follow these guidelines for helping us to better address your issue, assessing changes, and helping you finalize your pull requests.
In order to contribute you can submitting bug reports or suggest some correction or content improvements and it's also possible to open a new pull request. 

## Code of Conduct

This project adheres to the [Contributor Covenant Code of Conduct](CODE_OF_CONDUCT.md), please read it and follow it
before contributing. If you find someone that is not respecting it please report its behaviour.

## How Can I Contribute

### Reporting Bugs

Before reporting a bug please search if there isn’t already a similar issue already open. If you find a similar issue
that is already closed, open a new one and include a link to it inside the body of the new one.

### Suggesting improvements

Open an issue to report some typo or suggests some changes that might make the documentation clearer.

### Opening pull requests

After open an issue to suggest your improvement idea, you could implements it directly following the guide lines explained below and finally open a pull request.

## Pull request rules

Docusaurus use **Markdown**, check out the [official docs](https://v2.docusaurus.io/docs/) for further detail, for example how to add a new item to the left sidebar, etc.

To contribute to the Mia-Platform docs:

1. Read the contributing guidelines [here](#contributing-guidelines).

2. Clone `git@github.com:mia-platform/documentation.git`;

3. Create a branch named according to these rules: `activity/task-topic`
    - **activity** can be:
      - `edit` if you are changing one or more pages.  
      - `new` if you are working on a new page or section related to features already in production.  
      - `project` if you are writing the documentation of a project before or during the development.  
      - `remove` if you are deleting information.  

    - **task (optional)**: the ID of the task you are working on, if existing.

    - **topic**: a short description of what you are documenting.

    Example: `new/MD-333-authentication-section`

    Additionally, branches named `release-note/vX.Y.Z` are dedicated to the documentation of the `Mia-Platform` incoming updates.

    > :warning: **It's strictly important to follow branch name conventions**

4. Share your knowledge following the [style guidelines](./styleguide.md)!

5. Run locally docs site to test changes before submitting a Merge Request: `yarn start`

6. Run locally the tests of lint, cspell and check-content as explained [here](#content-checks)

7. Submit a pull request (name it according to the rule: `Activity (task): topic`) and add information about the importance of changes, according to internal / customer needs. Notify POs of affected products.

## Contributing guidelines

### Internal Links

Linking a resource to another one inside the documentation is done using the following rules:

- Each link must be relative to the /docs/ of the project (including subfolders).
  - e.g. if you want to link to the page `/docs/getting_started/faq.md` you have to write `[FAQ](/getting_started/faq.md)`.
- The extension it's mandatory and must be `.md` or `.mdx`.
- The link can include an anchor to a specific section of the page.
  - e.g. if you want to link to the section `#how-to-contribute` of the page `/docs/getting_started/faq.md` you have to write `[How to contribute](/docs/getting_started/faq.md#how-to-contribute)`.
  - e.g. if you want to link an anchor inside the same page you have to write `[How to contribute](#how-to-contribute)`.
- Linking internal resources using https://docs.mia-platform.eu/ **is NOT allowed**.  

An automatic check is performed on each push to verify that the links are correct.
The check is performed to each file in the /docs/ folder excluding the folder managed by the **doc aggregator**:

- docs/runtime_suite
- docs/runtime_suite_examples
- docs/runtime_suite_templates
- docs/runtime_suite_libraries
- docs/runtime_suite_tools
- docs/business_suite

### Deleting a page

If, for any reason, you intend to delete a page from the documentation, you are required to create a redirect url, since links to the deleted resource may be also outside the doc and it's preferable to avoid showing 404 errors to users.

Add an entry to the file [301redirects.json](./301redirects.json) with the following format:

```json
"/docs/path/to/page/you/deleted": {
  "destination": "/docs/path/to/an/existing/page",
  "addedOn": "yyyy-mm-dd"
}
```

Depending on the situation, the choice of the destination URL can be the page that replaced the one you deleted, a similar page, the home of the section where the deleted page was or the home of the documentation site.

#### Content checks

The repo provides a series of content test that must be passed:

- Lint: `yarn lint`
- Spell check: `yarn spellcheck`
- Content check: `yarn check-content`

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
   Contains versioned documentation pages.
  - `versioned_docs/version-5.x.x`
     Contains the files related to v5
- `versioned_sidebars/`
   Contains versioned sidebars config.

## Create a new Docusaurus version

When you want to create a new version, you can tag the **previous** the following command:

```bash
yarn run docusaurus docs:version <x.x.x>
```

Each tagged version has a dedicated folder:

- `versioned_docs/version-<number version>`

**The current version must not be tagged**, however you have to do insert the new version in the `docusaurus.config.js`. The property to edit is `presets."@docusaurus/preset-classic".versions`:

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
            '10.x.x': {
              label: '10.x.x',
              path: '10.x',
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

- [GFM markdown syntax](https://guides.github.com/features/mastering-markdown/), the same syntax used in GitHub
- The [Docusaurus admonitions](https://v2.docusaurus.io/docs/markdown-features/#calloutsadmonitions) (using these instead of *N.B, Info: , eg.*)

For more details see the [Docusaurus documentation](https://docusaurus.io/docs/en/doc-markdown).

## What files I have to edit

### To change documentation pages

As seen previously, the documentation is versioned, so exist N-1 doc root folders in addition to the root folder.

Usually, you should modify only the current version ( `/docs` folder).If the changes are related to bugs or are important for a previous version, you have to copy changes on the version pages.

### How to change main and side menu

`docusaurus.config.js` it's the unique configuration file. It's used to set plugins, and other basic and advanced settings.

This file defines the main top menu:

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

- To add an item linked to  page  you have to add an object with `"type": "doc"` and the property `"id"` valued with the final id of the page.

- To create a sub-element that contains other elements you have to add an object with `"type": "category"` and the property `"label"` valued with the label of the item.

#### Repository deploy rules

All changes pushed to the branch `main` trigger a pipeline that will deploy the docs site on [https://next.docs.mia-platform.eu/](https://next.docs.mia-platform.eu/). So you can see the changes before carrying over to the main site.

To carry over the changes on the main site [https://docs.mia-platform.eu/](https://docs.mia-platform.eu/), you have to tag a new version here on GitHub.

## Fork

If you want to fork our project, you could make it and keep in sync with our template.
All contribution which could improve the existent code base are welcome!

To keep a fork up to date, you can follow this [GitHub guide](https://docs.github.com/en/github/collaborating-with-issues-and-pull-requests/syncing-a-fork).
For all the information about forks, [see this link](https://docs.github.com/en/github/collaborating-with-issues-and-pull-requests/working-with-forks).
