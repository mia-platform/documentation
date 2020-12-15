module.exports = {
  title: "Mia-Platform Documentation",
  tagline: "Learn how Mia-Platform can help you to develop your business",
  url: "https://docs.mia-platform.eu",
  baseUrl: "/",
  onBrokenLinks: "throw",
  favicon: "img/favicon.ico",
  organizationName: "Mia-Platform", // Usually your GitHub org/user name.
  projectName: "Mia-Platform", // Usually your repo name.
  themeConfig: {
    announcementBar: {
      content:
        '🚀 Mia-Platform v6.0 now Generally Available! GitHub integration, serveless functions support, and other features. <a rel="noopener noreferrer" href="/docs/release_notes/platform_6-0-0_releasenotes">Find out more!</a> 🚀',
      backgroundColor: "#5FA37E",
      textColor: "#FFF",
    },
    algolia: {
      placeholder:'Search for terms, features and more...',
      apiKey: '0907ee3ecd107c2d6e223ce45a6687ab',
      appId:'58NJDUVYVW',
      indexName: 'mia-platform-docs',
      contextualSearch: true,

    },
    colorMode: {
      // "light" | "dark"
      defaultMode: "light",

      switchConfig: {
        darkIcon: "🌙",
        darkIconStyle: {},
        lightIcon: "☀",
        lightIconStyle: {
          color: "#ffd557",
        },
      },
    },
    navbar: {
      title: "Mia-Platform Docs",
      logo: {
        alt: "Mia_Platform logo",
        src: "img/logo.png",
      },
      items: [ 
        {
          to: "docs/overview/mia_platform_overview",
          label: "Getting Started",
          position: "left",
          activeBaseRegex: '(docs|docs/\\d.x)/(getting_started/monitoring-dashboard|getting_started/performance-test|getting_started|overview|guidelines)',
        },
        {
          label: "Core Platform",
          position: "left",
          activeBaseRegex: '(docs|docs/\\d.x)/(development_suite|marketplace|libraries|runtime_suite)',
          to: "docs/development_suite/overview-dev-suite",
          items: [
            {
              label: "Console",
              to: "docs/development_suite/overview-dev-suite",
              activeBaseRegex: '(docs|docs/\\d.x)/development_suite',
            },
            {
              to: "docs/marketplace/overview_marketplace",
              label: "Marketplace",
              activeBaseRegex: '(docs|docs/\\d.x)/(marketplace|runtime_suite|development_suite/api-console/api-design/custom_microservice_get_started)',

            },
            {
              to: "docs/libraries/overview_service_libraries",
              label: "Libraries",
            }
          ],
        },
        {
          to: "docs/fast_data/overview",
          label: "Fast Data",
          position: "left",
          activeBaseRegex: '(docs|docs/\\d.x)/fast_data',

        },
        {
          to: "docs/business_suite/overview-business-suite",
          label: "CMS & Analytics",
          position: "left",
          activeBaseRegex: '(docs|docs/\\d.x)/business_suite',

        },
        {
          label:"Release notes",
          position: "left",
          to: "docs/release_notes/release_notes",
          activeBaseRegex: '(docs|docs/\\d.x)/(release_notes|info/(version_policy|migrate_from_v4_to_v5|support-policy))',
        },
        {
          type: "docsVersionDropdown",
          position: "right",
        },
        {
          href: "https://www.mia-platform.eu/en/",
          label: "Mia-Platform site",
          position: "right",
        },
      ],
    },
    footer: {
      style: "dark",
      links: [
        {
          title: "Mia-Platform",
          items: [
            {
              label: "How to install",
              to:"/docs/info/how_to_install",
            },
            {
              label: "Bug Policy",
              to:"/docs/info/bug_policy",
            },
            {
              label: "Supported browser",
              to:"/docs/info/supported_browser",
            },
            {
              label: "Open Source Software",
              to:"/docs/info/oss",
            },
            {
              label: "Subprocessor",
              to:"/docs/info/subprocessor",
            },
            {
              label: "Service Level Agreement",
              to:"/docs/info/mia_service_level_agreement",
            },
            {
              label: "Audit Process",
              to:"/docs/info/audit_process"
            },
          ],
        },
        {
          title: "Company",
          items: [
            {
              label: "Site",
              href: "https://www.mia-platform.eu/en/",
            },
            {
              label: "About",
              href: "https://www.mia-platform.eu/en/company/about",
            },
            {
              label: "Mission",
              href: "https://www.mia-platform.eu/en/company/mission",
            },
            {
              label: "Blog",
              href: "https://blog.mia-platform.eu/en",
            },
          ],
        },
        {
          title: "Core Platform",
          items: [
            {
              label: "Console",
              href: "https://www.mia-platform.eu/en/products/devops-console",
            },
            {
              label: "Microservice Ecosystem",
              href:
                "https://www.mia-platform.eu/en/products/microservices-ecosystem",
            },
            {
              label: "Fast Data",
              href: "https://www.mia-platform.eu/en/products/fast-data",
            },
            {
              label: "Headless CMS",
              href:
                "https://www.mia-platform.eu/en/products/api-management-and-headless-cms",
            },
            {
              label: "Release Notes",
              to: "/docs/release_notes/release_notes",
            },
          ],
        },
        {
          title: "Developer Resources",
          items: [
            {
              label: "Guidelines",
              to: "/docs/guidelines/git_vademecum",
            },
            {
              label: "Getting Started",
              to:
                "/docs/overview/mia_platform_overview",
            },
            {
              label: "Library",
              href: "https://resources.mia-platform.eu/en/library",
            },
            {
              label: "GitHub",
              href: "https://github.com/mia-platform",
            },
            {
              label: "GitHub Marketplace",
              href: "https://github.com/mia-platform-marketplace",
            },
          ],
        },
        {
          title: "Privacy",
          items: [
            {
              label: "Privacy Policy",
              href:
                "https://www.mia-platform.eu/img/Privacy_Policy_Website_EN.pdf",
            },
          ],
        },
      ],
      copyright: `Copyright © ${new Date().getFullYear()} Mia srl. All rights reserved. Built with Docusaurus.`,
    },
  },
  customFields: {
    versionPathRegex: "docs\\/\\d+\\.x"
  },
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
  plugins: [
    [
      "@docusaurus/plugin-client-redirects",
      {
        fromExtensions: ["html"],
        createRedirects: (path) => {
          //  Redirect old / paths to newer /docs/ paths
          return [path.replace(/^\/docs/g, "")];
        },
      },
    ],
  ],
};
