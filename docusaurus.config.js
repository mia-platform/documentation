const createRedirects = require("./createRedirects");

const config = {
  title: "Mia-Platform Documentation",
  tagline: "Learn how Mia-Platform can help you to develop your business",
  url: "https://docs.mia-platform.eu",
  baseUrl: "/",
  onBrokenLinks: "throw",
  favicon: "img/favicon.ico",
  organizationName: "Mia-Platform", // Usually your GitHub org/user name.
  projectName: "Mia-Platform", // Usually your repo name.
  themeConfig: {
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
          activeBaseRegex: "(docs|docs/\\d.x)/(getting_started/monitoring-dashboard|getting_started/performance-test|getting_started|overview|guidelines|tutorial)"
        },
        {
          label: "Products",
          position: "left",
          activeBaseRegex: "(docs|docs/\\d.x)/(development_suite|marketplace|libraries|tools|runtime_suite|business_suite|fast_data|dev_portal)",
          to: "docs/development_suite/overview-dev-suite",
          items: [
            {
              label: "Console",
              to: "docs/development_suite/overview-dev-suite",
              activeBaseRegex: "(docs|docs/\\d.x)/development_suite"
            },
            {
              to: "docs/marketplace/overview_marketplace",
              label: "Marketplace",
              activeBaseRegex: "(docs|docs/\\d.x)/(marketplace|runtime_suite|development_suite/api-console/api-design/custom_microservice_get_started)"
            },
            {
              to: "docs/fast_data/overview",
              label: "Fast Data",
              activeBaseRegex: "(docs|docs/\\d.x)/fast_data"
            },
            {
              to: "docs/business_suite/overview-business-suite",
              label: "CMS & Analytics",
              activeBaseRegex: "(docs|docs/\\d.x)/business_suite"
            },
            {
              to: "docs/dev_portal/overview",
              label: "Dev Portal",
              activeBaseRegex: "(docs|docs/\\d.x)/dev_portal"
            },
            {
              to: "docs/libraries/overview_service_libraries",
              label: "Libraries"
            },
            {
              to: "docs/tools/overview_service_tools",
              label: "Tools"
            },
          ]
        },
        {
          label: "Release notes",
          position: "left",
          to: "docs/release_notes/release_notes",
          activeBaseRegex: "(docs|docs/\\d.x)/(release_notes|info/(version_policy|migrate_from_v4_to_v5|support-policy))"
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
  customFields: {
    versionPathRegex: "docs\\/\\d+\\.x",
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
              label: "8.x (Current)",
              path: "",
            },
            "7.x.x": {
              label: "7.9.x",
              path: "7.x",
            },
            "6.x.x": {
              label: "6.5.x",
              path: "6.x",
            },
            "5.x.x": {
              label: "5.10.x",
              path: "5.x",
            },
          },
        },
        theme: {
          customCss: require.resolve("./src/css/custom.css"),
        },
        sitemap: {
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
        createRedirects,
      },
    ],
  ],
};

module.exports = config;
