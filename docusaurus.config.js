const createRedirects = require("./createRedirects");

const config = {
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
      additionalLanguages: ['rego'],
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
      logo: {
        alt: "Mia_Platform logo",
        src: "img/logo.png"
      },
      items: [
        {
          type: 'doc',
          docId: "overview/mia_platform_overview",
          label: "Getting Started",
          position: "left",
          activeBaseRegex: "(docs|docs/\\d.x)/(getting_started/monitoring-dashboard|getting_started/performance-test|getting_started|overview|guidelines|tutorial)"
        },
        {
          label: "Products",
          position: "left",
          activeBaseRegex: "(docs|docs/\\d.x)/(development_suite|marketplace|libraries|tools|runtime_suite|business_suite|fast_data|dev_portal)",
          type: "dropdown",
          items: [
            {
              type: 'doc',
              docId: "development_suite/overview-dev-suite",
              label: "Console",
              activeBaseRegex: "(docs|docs/\\d.x)/development_suite"
            },
            {
              type: 'doc',
              docId: "marketplace/overview_marketplace",
              label: "Marketplace",
              activeBaseRegex: "(docs|docs/\\d.x)/(marketplace|runtime_suite/|development_suite/api-console/api-design/custom_microservice_get_started)"
            },
            {
              type: 'doc',
              docId: "fast_data/what_is_fast_data",
              label: "Fast Data",
              activeBaseRegex: "(docs|docs/\\d.x)/fast_data"
            },
            {
              type: 'doc',
              docId: "business_suite/backoffice/overview",
              label: "Backoffice",
              activeBaseRegex: "(docs|docs/\\d.x)/business_suite"
            },
            {
              type: 'doc',
              docId: "dev_portal/overview",
              label: "Dev Portal",
              activeBaseRegex: "(docs|docs/\\d.x)/dev_portal"
            },
            {
              type: 'doc',
              docId: "libraries/overview_service_libraries",
              label: "Libraries"
            },
            {
              type: 'doc',
              docId: "tools/overview_service_tools",
              label: "Tools",
              activeBaseRegex: "(docs|docs/\\d.x)/(tools|runtime_suite_tools)"
            },
          ]
        },
        {
          type: 'doc',
          docId: "paas/overview",
          label: "PaaS",
          position: "left",
          activeBaseRegex: "(docs|docs/\\d.x)/(monitoring|paas)"
        },
        {
          type: 'doc',
          docId: "release_notes/RN_v10-0/v10.0.0",
          label: "Release notes",
          position: "left",
          activeBaseRegex: "(docs|docs/\\d.x)/(release_notes|info/(version_policy|bug_policy|support-policy))"
        },
        {
          href: "https://makeitapp.atlassian.net/servicedesk/customer/portal/21",
          position: "left",
          label: "Support"
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
      links: [
        {
          title: "Mia-Platform",
          items: [
            {
              label: "How to install",
              to: "/docs/info/how_to_install",
            },
            {
              label: "Bug Policy",
              to: "/docs/info/bug_policy",
            },
            {
              label: "Supported browser",
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
            {
              label: "Privacy Policy",
              href:
                "https://www.mia-platform.eu/img/Privacy_Policy_Website_EN.pdf",
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
              label: "Status Page",
              href: "https://status.console.cloud.mia-platform.eu"
            },
            {
              label: "Guidelines",
              to: "/docs/guidelines/git_vademecum",
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
          items: [
            {
              label: 'Support',
              href: 'https://makeitapp.atlassian.net/servicedesk/customer/portal/21'
            },
            {
              label: 'FAQ',
              to: '/docs/getting_started/faqs'
            },
            {
              label: "Getting Started",
              to: "/docs/overview/mia_platform_overview",
            },
          ],
        },
      ],
      copyright: `Copyright © ${new Date().getFullYear()} Mia srl. All rights reserved. Built with Docusaurus.`,
    },
  },
  presets: [
    [
      "@docusaurus/preset-classic",
      {
        docs: {
          sidebarPath: require.resolve("./sidebars.js"),
          lastVersion: "current",
          versions: {
            current: {
              label: "10.x (Current)",
              path: "",
            },
            "9.x.x": {
              label: "9.5.x",
              path: "9.x",
            },
            "8.x.x": {
              label: "8.9.x",
              path: "8.x",
            },
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
};

module.exports = config;
