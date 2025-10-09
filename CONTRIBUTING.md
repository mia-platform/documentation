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
The check is performed to each file in the /docs/ folder.

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
- `release-notes/` Contains the release notes of all versions. Pages are not intendend to be versioned.
- `info` Contains the pages under `/info` url. Pages are not intendend to be versioned.
- `versioned_docs/`
  Contains versioned documentation pages.
    - `versioned_docs/version-5.x.x`
      Contains the files related to v5
- `versioned_sidebars/`
  Contains versioned sidebars config.

## Documentation releases management

The `docs` folder contains **only** the version of the documentation corresponding to the development environment. Other documentations are availablein `versioned_docs` folder.

### Release notes

Release notes are inside `release-notes` folder and are excluded from the documentation versioning. First folder children are the current major releases release notes related files while older major releases related files are inside the corresponding major folder, like `v12` or `v13`. 

To create a new release note, add a new file with the name of the new version, i.e. `v14.5.8`, in the `release-notes/` folder.

## Create a new documentation version

In order to bump a new documentation version you have to follow through this checklist of activities:

1. freeze previous version
1. bump newer version
1. remove the versioned docs that reached EOL
1. clear the previous version overview page to create space for the newer one
1. remove all the previous release notes pages and prepare a single release page for the new version
1. update homepage banner
1. update hompage quick links targeting information relevant to the previous version
1. update version policy page to include the new release support period

### Tag a new version

Each tagged version has a dedicated folder: `versioned_docs/version-<number version>`. To create a new one and freeze the **previous** version run the following command:

```bash
yarn run docusaurus docs:version <x.x.x>
```

> [!IMPORTANT]
> Do not include the `v` in the target version!
> e.g.: if you need to create the docs for v100 you will have to freeze v99, therefore run
>
> ```bash
> $ yarn run docusaurus docs:version 99.x.x
> ```

### Bump new version

There is no need to **tag the new version**, however you have update the `docusaurus.config.js` file in order to support the newer version. The property to edit is `presets."@docusaurus/preset-classic".versions`:

<details>
<summary>docusaurus.config.js example</summary>

```js
  presets: [
    [
      "@docusaurus/preset-classic",
      {
        docs: {
          ...
          lastVersion: "current",
          versions: {
            current: {
              label: "100.x (Current)",
              path: "",
              banner: "none"
            },
            "99.x.x": {
              label: "99.9.x",
              path: "99.x",
            },
            "98.x.x": {
              label: "98.8.x",
              path: "98.x",
            },
          },
        }
      }
    ]
  ]
```

</details>

<br>

> [!TIP]
> Check out the [docusaurus official doc](https://v2.docusaurus.io/docs/versioning/) for more information.

## Documentations pages

>[!WARNING]
> If you want to edit o create documentation for **marketplace plugins you have to write documentation directly in the plugin repository**.  
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


## Accordion component

To create or update an accordion section, you will always follow these three steps:

1.  **✍️ Write the Content**: You will create a special text file (called a JSON file) where you'll enter all the titles, descriptions, and other information.
2.  **🖼️ Upload Images**: If your section needs images, you will upload them to a specific folder.
3.  **📍 Add to the Page**: You will insert a short snippet of code into your `.mdx` page to tell the system to display the content you've prepared.

---

### 1. Where to Put Your Files

Before you begin, it's important to know where to save the files you'll create.

* **Content Files (.json)**
  * Save them here: `/src/config/`
  * *Example: `/src/config/release_notes_september_2025.json`*

* **Image Files (.png, .jpg, etc.)**
  * Save them here: `/static/img/accordions/`
  * *Example: `/static/img/accordions/new_dashboard.png`*

---

### 2. Writing the Content (The JSON File)

The content of each accordion is defined in a `.json` file. You can think of this file as a form to fill out. There are two types of "forms" you can use, depending on what you want to display.

#### #### Type 1: Release Notes

Use this format to announce what's new in a software release. The content will be automatically grouped into "New Features," "Improvements," and "Bug Fixes."

**➡️ Copy and paste this template into a new file (e.g., `v3-1-0.json`) and edit it:**

```json
[
  {
    "title": "Version 3.1.0 - New Dashboard",
    "icon": "console",
    "defaultOpen": true,
    "type": "versions",
    "items": {
      "newFeatures": [
        {
          "title": "Interactive Analytics Dashboard",
          "description": [
            "We have released a brand new dashboard that allows for real-time data analysis.",
            "To learn more, read our [complete guide](https://example.com)."
          ],
          "images": [
            "/img/accordions/new_dashboard.png"
          ]
        }
      ],
      "improvements": [
        {
          "title": "50% faster loading speeds",
          "description": [
            "The time it takes to access the platform has been drastically reduced."
          ]
        }
      ],
      "bugFixes": [
        "Fixed a menu display issue on Firefox.",
        "Corrected a rare bug that prevented saving."
      ]
    }
  }
]
```

**Field Descriptions:**

| Key             | Description                                                                                          |
| :-------------- | :--------------------------------------------------------------------------------------------------- |
| `title`         | The main title of the section (e.g., "Version 3.1.0").                                               |
| `icon`          | The name of the icon to display. You can find the full list at the end of this guide.                |
| `defaultOpen`   | Write `true` if you want the section to be open on page load, otherwise `false`.                     |
| `type`          | Always leave this as `"versions"` for this type of content.                                          |
| `newFeatures`   | Enter your new features here. You can add as many as you need.                                       |
| `improvements`  | Enter your improvements here.                                                                        |
| `bugFixes`      | Enter your bug fixes here (as simple lines of text).                                                 |

---

#### #### Type 2: Product Roadmap

Use this format to show upcoming features. Each feature will appear as a separate card.

**➡️ Copy and paste this template into a new file (e.g., `roadmap_2026.json`) and edit it:**

```json
[
  {
    "title": "2026 Roadmap: Artificial Intelligence",
    "icon": "fast-data",
    "defaultOpen": false,
    "type": "roadmap",
    "items": {
      "newFeatures": [
        {
          "title": "AI Writing Assistant",
          "quarter": "Q1 2026",
          "description": [
            "An intelligent assistant will help you write better content by suggesting phrases and correcting errors."
          ],
          "tags": ["AI", "Beta", "Productivity"]
        },
        {
          "title": "Smart Search",
          "quarter": "Q2 2026",
          "description": [
            "You will be able to search for documents using natural language, as if you were asking a person a question."
          ],
          "tags": ["AI", "Search"]
        }
      ],
      "improvements": [],
      "bugFixes": []
    }
  }
]
```

**Field Descriptions:**

| Key             | Description                                                                                          |
| :-------------- | :--------------------------------------------------------------------------------------------------- |
| `title`, `icon`, `defaultOpen` | These work the same as in the previous template.                                       |
| `type`          | Always leave this as `"roadmap"` for this type of content.                                           |
| `items`         | Inside `items`, you can add cards to `newFeatures`, `improvements`, or `bugFixes`.                   |
| `title`         | The title of the individual card/feature.                                                            |
| `quarter`       | (Optional) A label to indicate the time frame (e.g., "Q1 2026").                                     |
| `description`   | The description of the feature.                                                                      |
| `tags`          | (Optional) Colored labels to categorize the feature.                                                 |

---

### ### 3. Adding the Accordion to the Page

Once your `.json` file is ready and saved in `/src/config/`, go to the `.mdx` page where you want the accordion to appear.

1.  **At the top of the page**, add a line to "import" your content file.
2.  **In the exact spot where you want the accordion**, insert the `<Accordion />` tag, telling it which file to use.

**Complete example of a page `my-roadmap.mdx`:**

```mdx
---
id: roadmap
title: Our Roadmap
sidebar_label: Roadmap
---

import Accordion from '@site/src/components/Accordion';
import roadmap2026 from '@site/src/config/roadmap_2026.json';

# What the future holds

Here is a look at the incredible features we are developing for you.

<Accordion data={roadmap2026} />

```

### Useful References

* **Creating a Link**: In any `description` or `bugFixes` field, you can create a link using the syntax `[Link Text](https://website.com), for internal link use /docs/path/to/the/file/file_id (please note, start with /docs and end with the file's id!`.
* **Making Text Bold**: In any  `description` or `bugFixes` field, you can make text bold using the syntax **Your Text**.
* **Highlighting with Italic**: In any  `description` or `bugFixes` field, you can italicize text using the syntax _Your Text_.
* **Formatting as Code**: In any  `description` or `bugFixes` field, you can format text as inline code using the syntax `Your Text`.
* **New Paragraphs**: To create a new paragraph in a `description`, simply add a new line of text in quotes. Example: `"description": ["First paragraph.", "Second paragraph."]`
* **Available Icons**: You can use any of the following names in the `"icon"` field:
  * `console`
  * `fast-data`
  * `data-catalog`
  * `microfrontend-composer`
  * `runtime-components`
  * `software-catalog`

## Gantt component

To create or update a chart, the process is very simple:

1.  **✍️ Write the Content**: You will enter all dates and tasks into a configuration file (JSON).
2.  **📍 Add to the Page**: You will insert a short snippet of code into your `.mdx` page to display the chart or table.

---

### ### 1. Where to Put Your Content File

The configuration file that contains all your chart data must be saved in a specific location.

* **Content Files (.json)**
  * Save them here: `/src/config/`
  * *Example: `/src/config/version_roadmap.json`*

---

### ### 2. Writing the Content (The JSON File)

The JSON file is the "brain" of your chart. It is divided into two main sections: `timeline` (the time axis) and `tasks` (the bars on the chart).

#### #### The `timeline`

This section defines the entire time scale that will be visible in the chart. You must specify every quarter you want to display.

* `year`: The year.
* `quarter`: The name of the quarter (e.g., "Q4").
* `months`: The abbreviated names of the months in that quarter.

```json
{
  "timeline": [
    {
      "year": 2024,
      "quarter": "Q4",
      "months": ["Oct", "Nov", "Dec"]
    },
    {
      "year": 2025,
      "quarter": "Q1",
      "months": ["Jan", "Feb", "Mar"]
    },
    {
      "year": 2025,
      "quarter": "Q2",
      "months": ["Apr", "May", "Jun"]
    }
  ]
}

```

> **Important**: Make sure the `timeline` covers the entire period of your tasks. If a task has a date that falls outside the timeline, it will not be displayed correctly.

#### #### The `tasks`

This section defines the bars that will appear on the chart. Each object represents a single task or version.

* `name`: The name that will appear on the bar (e.g., "v13.1.x").
* `start`: The start date, in **YYYY-MM-DD** format.
* `end`: The end date, in **YYYY-MM-DD** format.

```json
{
  "tasks": [
    {"name": "v13.1.x", "start": "2024-10-24", "end": "2025-01-16"},
    {"name": "v13.3.x", "start": "2025-01-16", "end": "2025-04-17"}
  ]
}
```

> **Warning**: The date format `YYYY-MM-DD` (e.g., `2025-04-17`) is **mandatory** and must be followed exactly.

#### Complete Example to Copy

Here is a full template you can copy, save into a new file in `/src/config/`, and modify with your own data.

```json
{
  "timeline": [
    {"year": 2024, "quarter": "Q4", "months": ["Oct", "Nov", "Dec"]},
    {"year": 2025, "quarter": "Q1", "months": ["Jan", "Feb", "Mar"]},
    {"year": 2025, "quarter": "Q2", "months": ["Apr", "May", "Jun"]},
    {"year": 2025, "quarter": "Q3", "months": ["Jul", "Aug", "Sep"]},
    {"year": 2025, "quarter": "Q4", "months": ["Oct", "Nov", "Dec"]}
  ],
  "tasks": [
    {"name": "v13.1.x", "start": "2024-10-24", "end": "2025-01-16"},
    {"name": "v13.3.x", "start": "2025-01-16", "end": "2025-04-17"},
    {"name": "v13.7.x", "start": "2025-04-17", "end": "2025-07-17"},
    {"name": "v14.0.x", "start": "2025-07-17", "end": "2025-10-23"}
  ]
}
```

### ### 3. Adding the Gantt to the Page

Once your JSON file is created, you can display it on your `.mdx` page. The component is flexible and can display the same data in two different ways: as a **chart** or as a **table**.

#### #### Option 1: Display the Gantt Chart (Default)

This is the main view with colored bars. The color changes automatically: past tasks, the current one, and future tasks will all have different colors.

To use it, import your configuration file and add the component tag.

```mdx
import GanttChart from '@site/src/components/GanttChart';
import ganttData from '@site/src/config/version_roadmap.json';

## Version Roadmap

<GanttChart config={ganttData} />
```

#### #### Option 2: Display a Table

If you prefer a simpler, text-based view, you can show the same data in a sorted table. The dates will be automatically formatted for better readability.

To do this, add the `renderAs="table"` option to the component.

```mdx
import GanttChart from '@site/src/components/GanttChart';
import ganttData from '@site/src/config/version_roadmap.json';

## Version Table

<GanttChart config={ganttData} renderAs="table" />
```

## Changelog component

The `Changelog` component creates a styled timeline from standard Markdown. It's a "wrapper" component—you write your content normally and simply wrap it with the `<Changelog />` tags to apply the special formatting.

The component automatically handles the timeline, icons, date placement, and adds each release to the page's table of contents.

---

### Complete Example

Here is a full example of a `release-notes.mdx` page. You can copy this entire block and modify the content inside the `<Changelog>` tags.

The structure for each entry is a Level 2 Heading (`##`) for the title, followed by the date in italics (`*...*`), and then any content you need. Use a horizontal rule (`---`) to separate entries.

```mdx
---
id: versions
title: Mia-Platform release notes
sidebar_label: Mia-Platform release notes
---

import Changelog from '@site/src/components/Changelog';

# Version History

Stay up to date on all the new features and improvements to the platform.

<Changelog>

  ## [v14.2.1](/docs/release-notes/v14.2.1)
  *September 18, 2025*

  This version introduces stability improvements and fixes several important bugs.
  - Fixed a rendering issue in the admin panel.
  - Improved image loading speed by 20%.

  ---

   ## [v14.2.0](/docs/release-notes/v14.2.0)
  *September 4, 2025*

  Introducing a new analytics dashboard with real-time interactive charts.
  ![New Dashboard](/img/accordions/new_dashboard.png)

</Changelog>
```
