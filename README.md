<div align="center">

ciao

# Welcome to Mia-Platform documentation

In this repository you can find the official [Mia-Platform][mia-website] Documentation.

[![Documentation](https://img.shields.io/badge/Documentation-%2326A570.svg?style=for-the-badge&logo=readthedocs&logoColor=white)][mia-docs]
[![Join the Community](https://img.shields.io/badge/Join_the_Community-%231DA1F2.svg?style=for-the-badge&logo=readthedocs&logoColor=white)][mia-community]

</div>

## Open Source 💻😎

We believe in the open source community, we think it is important to give back and for this reason we have always supported the [CNCF](https://www.cncf.io/). Check out our open source projects.

* [MongoDB CRUD Service](https://github.com/mia-platform/crud-service): a lightweight application that exposes an HTTP Interface to perform CRUD operations on MongoDB collections;
* [micro-lc](https://github.com/micro-lc): a micro-frontend orchestrator;
* [kube-green](https://github.com/kube-green): a k8s operator that helps you reduce CO2 emissions while saving energy and money;
* [Rönd](https://github.com/rond-authz): an open source RBAC solution to manage authorization on custom applications;
* [Mia-Platform Marketplace](https://github.com/mia-platform-marketplace): our marketplace central registry.


## Find out more 🔥✨

[![Meetup](https://img.shields.io/badge/Meetup-f64363?style=for-the-badge&logo=meetup&logoColor=white)](https://www.meetup.com/it-IT/mia-platform-cultura-innovazione-team/events/)
[![YouTube Music](https://img.shields.io/badge/YouTube-FF0000?style=for-the-badge&logo=youtube-music&logoColor=white)](https://www.youtube.com/c/MiaPlatform)
[![Instagram](https://img.shields.io/badge/Instagram-%23E4405F.svg?style=for-the-badge&logo=Instagram&logoColor=white)](https://www.instagram.com/miaplatform/)
[![LinkedIn](https://img.shields.io/badge/linkedin-%230077B5.svg?style=for-the-badge&logo=linkedin&logoColor=white)](https://www.linkedin.com/company/mia-platform)
[![Twitter](https://img.shields.io/badge/Twitter-%231DA1F2.svg?style=for-the-badge&logo=Twitter&logoColor=white)](https://twitter.com/miaplatform)
[![Technical Blog](https://img.shields.io/badge/Technical_Blog-%23F1883F.svg?style=for-the-badge&logo=readthedocs&logoColor=white)](https://blog.mia-platform.eu/en)



## Local Development

The documentation site is built using [Docusaurus 2](https://v2.docusaurus.io/); to develop locally you need:

- Node 16+

To setup node, please if possible try to use [nvm][nvm], so you can manage
multiple versions easily.

This is a React application and uses [Yarn](https://yarnpkg.com/getting-started/install) as a package manager.  
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

## How to contribute

Read related [contribution guide](/CONTRIBUTING.md#how-can-i-contribute).


[nvm]: https://github.com/creationix/nvm
[mia-website]: http://mia-platform.eu
[mia-docs]: https://docs.mia-platform.eu
[mia-community]: https://github.com/mia-platform/community/discussions
