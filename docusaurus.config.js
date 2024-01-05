const createRedirects = require("./createRedirects");
const createEditUrl = require("./createEditUrl");

async function createConfig() {
  const mdxMermaid = await import('mdx-mermaid')

  return {
    title: "Mia-Care Documentation",
    tagline: "Learn how Mia-Care can help you to develop SaMD",
    url: "https://mia-care.github.io",
    baseUrl: "/documentation",
    onBrokenLinks: "throw",
    onBrokenMarkdownLinks: 'throw',
    favicon: "img/favicon.ico",
    organizationName: "Mia-Care", // Usually your GitHub org/user name.
    projectName: "Mia-Care", // Usually your repo name.
    themeConfig: {
      prism: {
        additionalLanguages: ['rego', 'java', 'csharp', 'kotlin'],
      },
      image: "img/documentation-link-preview.png",
      algolia: {
        placeholder: "Search for terms, features and more...",
        apiKey: "...",
        appId: "...",
        indexName: "mia-care-docs",
        contextualSearch: true,
      },
      colorMode: {
        // "light" | "dark"
        defaultMode: "light",
        disableSwitch: true,
      },
      navbar: {
        hideOnScroll: false,
        title: "Mia-Care Docs",
        logo: {
          alt: "Mia-Care logo",
          src: "img/logo.png",
          width: 120,
          height: 32,
          style: {padding: '2px 5px' }
        },
        items: [{
          type: 'doc',
          docId: "intro/getting_started",
          label: "Getting Started",
          position: "left",
          activeBaseRegex: "(docs|docs/\\d.x)/(getting_started/monitoring-dashboard|getting_started/performance-test|getting_started|overview|guidelines|tutorial)"
        },
        // {
        //   label: "Products",
        //   position: "left",
        //   activeBaseRegex: "(docs|docs/\\d.x)/(development_suite|marketplace|libraries|tools|runtime_suite|microfrontend-composer|fast_data|dev_portal)",
        //   type: "dropdown",
        //   items: [{
        //     type: 'doc',
        //     docId: "development_suite/overview-dev-suite",
        //     label: "Console",
        //     activeBaseRegex: "(docs|docs/\\d.x)/development_suite"
        //   },
        //   {
        //     type: 'doc',
        //     docId: "fast_data/what_is_fast_data",
        //     label: "Fast Data",
        //     activeBaseRegex: "(docs|docs/\\d.x)/fast_data"
        //   },
        //   {
        //     type: 'doc',
        //     docId: "microfrontend-composer/what-is",
        //     label: "Microfrontend Composer",
        //     activeBaseRegex: "(docs|docs/\\d.x)/microfrontend-composer"
        //   },
        //   {
        //     type: 'doc',
        //     docId: "marketplace/overview_marketplace",
        //     label: "Marketplace",
        //     activeBaseRegex: "(docs|docs/\\d.x)/(marketplace|runtime_suite/|development_suite/api-console/api-design/custom_microservice_get_started|tools|runtime_suite_tools|libraries)"
        //   }
        //   ]
        // },
        // {
        //   label: "Infrastructure",
        //   position: "left",
        //   activeBaseRegex: "(docs|docs/\\d.x)/(development_suite|marketplace|libraries|tools|runtime_suite|business_suite|fast_data|dev_portal|infrastructure/infrastructure_overview)",
        //   type: "doc",
        //   docId: "infrastructure/infrastructure_overview"
        // },
        // {
        //   type: 'doc',
        //   docId: "release-notes/versions",
        //   label: "Release Notes",
        //   position: "left",
        //   activeBaseRegex: "(docs|docs/\\d.x)/(release-notes|info/(version_policy|bug_policy|support-policy))"
        // },
        {
          href: "https://makeitapp.atlassian.net/servicedesk/customer/portal/21",
          position: "left",
          label: "Support"
        },
        {
          href: "https://github.com/mia-platform/community/discussions",
          position: "left",
          label: "Community"
        },
        // {
        //   type: "docsVersionDropdown",
        //   position: "right",
        //   dropdownItemsBefore: [],
        //   dropdownItemsAfter: []
        // }
        ],
      },
      footer: {
        style: "dark",
        links: [{
          title: "Mia-Care P4SaMD",
          items: [{
            label: "How to install",
            to: "/docs/info/how_to_install",
          },
          {
            label: "Bug Policy",
            to: "/docs/info/bug_policy",
          },
          {
            label: "Supported browsers",
            to: "/docs/info/supported_browser",
          },
          {
            label: "Open Source Software",
            to: "/docs/info/oss",
          },
          {
            label: "Subprocessor",
            to: "/docs/info/subprocessor",
          },
          {
            label: "Service Level Agreement",
            to: "/docs/info/mia_service_level_agreement",
          },
          {
            label: "Audit Process",
            to: "/docs/info/audit_process",
          },
          ],
        },
        {
          title: "Company",
          items: [{
            label: "Website",
            href: "https://mia-care.io",
          },
          {
            label: "About",
            href: "https://mia-care.io/about-us/",
          },
          {
            label: "Blog",
            href: "https://mia-care.io/blog/",
          },
          {
            label: "Newsroom",
            href: "https://mia-care.io/newsroom/",
          },
          {
            label: "Privacy Policy",
            href: "https://mia-care.io/wp-content/uploads/2021/07/Mia-Care_Privacy_Policy_EN.pdf",
          },
          ],
        },
        {
          title: "Mia-Platform",
          items: [{
            label: "Mia-Platform Console",
            href: "https://mia-platform.eu/platform/console/",
          },
          {
            label: "Mia-Platform Marketplace",
            href: "https://mia-platform.eu/platform/mia-platform-marketplace/",
          },
          {
            label: "Mia-Platform Fast Data",
            href: "https://mia-platform.eu/platform/console/fast-data",
          },
          {
            label: "Mia-Platform Release Notes",
            to: "https://docs.mia-platform.eu/docs/release-notes/versions",
          },
          ],
        },
        {
          title: "Developer Resources",
          items: [{
            label: "Mia-Platform Status Page",
            href: "https://status.console.cloud.mia-platform.eu"
          },
          {
            label: "Library",
            href: "https://resources.mia-platform.eu/en/library",
          },
          {
            label: "GitHub",
            href: "https://github.com/mia-care",
          },
          {
            label: "GitHub Marketplace",
            href: "https://github.com/mia-platform-marketplace",
          },
          ],
        },
        {
          title: "Education & Support",
          items: [{
            label: 'Support',
            href: 'https://makeitapp.atlassian.net/servicedesk/customer/portal/21'
          },
          {
            label: "Community",
            to: "https://github.com/mia-platform/community/discussions",
          },
          ],
        },
        ],
        copyright: `Copyright © ${new Date().getFullYear()} Mia-Care srl. All rights reserved. Built with Docusaurus.`,
      }
    },
    presets: [
      [
        "@docusaurus/preset-classic",
        {
          docs: {
            remarkPlugins: [mdxMermaid.default, {
              theme: {
                light: 'default',
                dark: 'dark'
              }
            }],
            editUrl: createEditUrl,
            sidebarPath: require.resolve("./sidebars.js"),
            lastVersion: "current",
            async sidebarItemsGenerator({
              isCategoryIndex: defaultCategoryIndexMatcher,
              defaultSidebarItemsGenerator,
              ...args
            }) {
              return defaultSidebarItemsGenerator({
                ...args,
                isCategoryIndex(params) {
                  const {
                    fileName
                  } = params
                  return defaultCategoryIndexMatcher(params) || ['overview', '10_overview'].includes(fileName.toLowerCase())
                },
              });
            },
          },
          theme: {
            customCss: require.resolve("./src/css/custom.css"),
          },
          sitemap: {
            changefreq: "weekly",
            priority: 0.5,
          }
        },
      ],
    ],
    plugins: [
      [
        "@docusaurus/plugin-client-redirects",
        {
          fromExtensions: ["html"],
          createRedirects,
        },
      ],
      [
        "./src/plugins/gtm",
        {
          trackingID: 'GTM-PKKZ6XT',
        },
      ],
      "./src/plugins/image-zoom"
    ],
    webpack: {
      jsLoader: (isServer) => ({
        loader: require.resolve('swc-loader'),
        options: {
          jsc: {
            parser: {
              syntax: 'typescript',
              tsx: true,
            },
            target: 'es2017',
          },
          module: {
            type: isServer ? 'commonjs' : 'es6',
          },
        },
      }),
    },
  }
}

module.exports = createConfig;
