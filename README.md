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
npm run build
npx http-server ./build
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

     > :warning: **It's important strictly follow branch name conventions**

3. Run locally docs site to test changes before submitting a Merge Request: `npm start`
4. Submit a merge request, then post the MR URL in the "my documentation" stanza. Optionally add notes about the importance of changes, according to internal / customer needs. Notify POs of affected products.

[nvm]: https://github.com/creationix/nvm
