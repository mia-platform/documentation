const createRedirects = require("./createRedirects");
const createEditUrl = require("./createEditUrl");

async function createConfig() {
  const mdxMermaid = await import('mdx-mermaid')

  return {
    title: "Mia-Platform Documentation",
    tagline: "Learn how Mia-Platform can help you to develop your business",
    url: "https://docs.mia-platform.eu",
    baseUrl: "/",
    onBrokenLinks: "throw",
    onBrokenMarkdownLinks: 'throw',
    favicon: "img/favicon.ico",
    organizationName: "Mia-Platform", // Usually your GitHub org/user name.
    projectName: "Mia-Platform", // Usually your repo name.
    themeConfig: {
      prism: {
        additionalLanguages: ['rego', 'java', 'csharp', 'kotlin'],
      },
      image: "img/documentation-link-preview.png",
      algolia: {
        placeholder: "Search for terms, features and more...",
        apiKey: "602a752c6342891e2488bea38b0d9292",
        appId: "58NJDUVYVW",
        indexName: "mia-platform-docs",
        contextualSearch: true,
      },
      colorMode: {
        // "light" | "dark"
        defaultMode: "light",
      },
      navbar: {
        hideOnScroll: false,
        title: "Mia-Platform Docs",
        logo: {alt: "Mia_Platform logo", src: "img/logo.png"},
        items: [{
          type: 'doc',
          docId: "getting-started/mia-platform-overview",
          label: "Getting Started",
          position: "left",
          activeBaseRegex: "(docs|docs/\\d.x)/(getting_started/monitoring-dashboard|getting_started/performance-test|getting_started|overview|guidelines|tutorial)"
        },
        {
          label: "Products",
          position: "left",
          activeBaseRegex: "(docs|docs/\\d.x)/(development_suite|marketplace|libraries|tools|runtime_suite|microfrontend-composer|fast_data|dev_portal)",
          type: "dropdown",
          items: [{
            type: 'doc',
            docId: "development_suite/overview-dev-suite",
            label: "Console",
            activeBaseRegex: "(docs|docs/\\d.x)/development_suite"
          },
          {
            type: 'doc',
            docId: "fast_data/what_is_fast_data",
            label: "Fast Data",
            activeBaseRegex: "(docs|docs/\\d.x)/fast_data"
          },
          {
            type: 'doc',
            docId: "microfrontend-composer/what-is",
            label: "Microfrontend Composer",
            activeBaseRegex: "(docs|docs/\\d.x)/microfrontend-composer"
          },
          {
            type: 'doc',
            docId: "marketplace/overview_marketplace",
            label: "Marketplace",
            activeBaseRegex: "(docs|docs/\\d.x)/(marketplace|runtime_suite/|development_suite/api-console/api-design/custom_microservice_get_started|tools|runtime_suite_tools|libraries)"
          }
          ]
        },
        {
          label: "Infrastructure",
          position: "left",
          activeBaseRegex: "(docs|docs/\\d.x)/(development_suite|marketplace|libraries|tools|runtime_suite|business_suite|fast_data|dev_portal|infrastructure/infrastructure_overview)",
          type: "doc",
          docId: "infrastructure/infrastructure_overview"
        },
        {
          type: 'doc',
          docId: "release-notes/versions",
          label: "Release Notes",
          position: "left",
          activeBaseRegex: "(docs|docs/\\d.x)/(release-notes|info/(version_policy|bug_policy|support-policy))"
        },
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
        {
          type: "docsVersionDropdown",
          position: "right",
          dropdownItemsBefore: [],
          dropdownItemsAfter: []
        }
        ],
      },
      footer: {
        style: "dark",
        links: [{
          title: "Mia-Platform",
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
            href: "https://mia-platform.eu",
          },
          {
            label: "About",
            href: "https://mia-platform.eu/company/about-us/",
          },
          {
            label: "Mission & Vision",
            href: "https://mia-platform.eu/mission-vision/",
          },
          {
            label: "Blog",
            href: "https://blog.mia-platform.eu/en",
          },
          {
            label: "Events",
            href: "https://mia-platform.eu/resources/events/",
          },
          {
            label: "Privacy Policy",
            href: "https://mia-platform.eu/img/Privacy_Policy_Website_EN.pdf",
          },
          ],
        },
        {
          title: "Core Platform",
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
            label: "Release Notes",
            to: "/docs/release-notes/versions",
          },
          ],
        },
        {
          title: "Developer Resources",
          items: [{
            label: "Status Page",
            href: "https://status.console.cloud.mia-platform.eu"
          },
          {
            label: "Guidelines",
            to: "/docs/getting-started/guidelines/",
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
          title: "Education & Support",
          items: [{
            label: 'Support',
            href: 'https://makeitapp.atlassian.net/servicedesk/customer/portal/21'
          },
          {
            label: "Community",
            to: "https://github.com/mia-platform/community/discussions",
          },
          {
            label: 'FAQ',
            to: '/docs/getting-started/faqs'
          },
          {
            label: "Getting Started",
            to: "/docs/getting-started/mia-platform-overview",
          },
          ],
        },
        ],
        copyright: `Copyright © ${new Date().getFullYear()} Mia srl. All rights reserved. Built with Docusaurus.`,
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
            lastVersion: "11.x.x",
            versions: {
              current: {
                label: "12.x (Preview)",
                path: "preview",
                banner: "none"
              },
              "11.x.x": {
                label: "11.7.1",
                path: "",
              },
              "10.x.x": {
                label: "10.9.x",
                path: "10.x",
              },
              "9.x.x": {
                label: "9.5.x",
                path: "9.x",
              },
            },
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
