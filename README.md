# Mia-Platform documentation

The documentation site is built using [Docusaurus 2](https://v2.docusaurus.io/), a modern static website generator.

> :memo: To contribute check out the [Docusaurus v2 Official documentation](https://v2.docusaurus.io/docs/)

## Local Development

To develop locally you need:

- Node 12+

To setup node, please if possible try to use [nvm][nvm], so you can manage
multiple versions easily.

This is a React application then we suggest you use [Yarn](https://yarnpkg.com/getting-started/install) as a package manager.  
Once you have installed Yarn, you can go inside
the directory of the project and install all dependencies simply running:

```shell
yarn install
```

This command rapidly launch the site on <http://localhost:3000> and open up a browser window:

```shell
yarn start
```

After this command, every time you save **the site will be automatically live updated.**

To test the site built you have to build the project and runs it on a local server with following commands:

```shell
yarn build
yarn serve
```

This command starts a local development server, the site will be reachable on <http://localhost:3000> window. To see changes you have to restart the server.

> :warning: The Search is configured to **not working locally**.  

## Search

The search is provided by [Algolia](https://www.algolia.com/).

To see search analytics you can login to Algolia with account data stored to *Mia shared* vault of your *1Password* account.

The documentation si linked to Algolia account by the Algolia property define in [docusaurus.config.js](docusaurus.config.js) file. Here are specified the Api Key, the App id and the index to address.

### How to contribute

Read related [contribution guide](/CONTRIBUTING.MD).

### Resources

- (<https://v2.docusaurus.io/docs/>)

[nvm]: https://github.com/creationix/nvm
