const createRedirects = require("./createRedirects");
// eslint-disable-next-line no-unused-vars -- kept for the currently-commented-out editUrl option below
const createEditUrl = require("./createEditUrl");

/** @type {import('@docusaurus/types').Config} */
const config = {
  title: "Mia-Care P4SaMD Handbook",
  tagline: "The compliance governance platform for Software as a Medical Device development",
  url: "https://docs.mia-care.io",
  trailingSlash: true,
  baseUrl: "/",
  onBrokenLinks: "throw",
  onBrokenAnchors: 'warn',
  markdown: {
    hooks: {
      onBrokenMarkdownLinks: 'throw',
    },
  },
  favicon: "img/favicon.ico",
  organizationName: "Mia-Care",
  projectName: "p4samd-handbook",
  themeConfig: {
    prism: {
      additionalLanguages: ['rego', 'java', 'csharp', 'kotlin'],
    },
    image: "img/documentation-link-preview.png",
    algolia: {
      placeholder: "Search for terms, features and more...",
      apiKey: "ba554a4401881ad1156c161121c19b5f",
      appId: "GTJ6ERIPDP",
      indexName: "mia-care",
      contextualSearch: true,
    },
    colorMode: {
      defaultMode: "light",
      disableSwitch: false,
    },
    navbar: {
      hideOnScroll: false,
      title: "Mia-Care P4SaMD",
      logo: {
        alt: "Mia-Care logo",
        src: "img/logo.png",
        width: 120,
        height: 32,
        style: {padding: '2px 5px'}
      },
      items: [
        {
          label: "Overview",
          position: "left",
          // See src/theme/NavbarItem/DocSectionNavbarItem.js. activeBaseRegex is honoured only
          // by that component; a plain type:"doc" item ignores it.
          type: "custom-docSection",
          docId: "p4samd/overview",
          // Single page, so the end is anchored too. Without /?$ this would also light up on
          // p4samd/mcp/overview, p4samd/handbook/brownfield/overview and
          // p4samd/installation/installation_overview.
          activeBaseRegex: "^/docs/(?:[^/]+/)?p4samd/overview/?$",
        },
        {
          label: "Handbook",
          position: "left",
          type: "custom-docSection",
          docId: "p4samd/handbook/getting_started",
          activeBaseRegex: "^/docs/(?:[^/]+/)?p4samd/handbook/",
        },
        {
          label: "MCP",
          position: "left",
          type: "custom-docSection",
          docId: "p4samd/mcp/overview",
          activeBaseRegex: "^/docs/(?:[^/]+/)?p4samd/mcp/",
        },
        {
          label: "Release Notes",
          position: "left",
          type: "custom-docSection",
          docId: "p4samd/release-notes/v3.0",
          // Two branches: the release-notes/ directory, plus the archived top-level
          // p4samd/release_notes page (underscore) that also sits in this sidebar category.
          activeBaseRegex: "^/docs/(?:[^/]+/)?p4samd/(?:release-notes/|release_notes/?$)",
        },
        {
          label: "FAQ",
          position: "left",
          type: "custom-docSection",
          docId: "p4samd/faq",
          activeBaseRegex: "^/docs/(?:[^/]+/)?p4samd/faq/?$",
        },
        {
          href: "https://mia-care.io",
          position: "left",
          label: "About us"
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
          title: "Mia-Care P4SaMD",
          items: [],
        },
        {
          title: "Company",
          items: [
            {
              label: "Website",
              href: "https://mia-care.io",
            },
            {
              label: "About",
              href: "https://mia-care.io/about-us",
            },
            {
              label: "Blog",
              href: "https://mia-care.io/resources/blog",
            },
            {
              label: "Newsroom",
              href: "https://mia-care.io/newsroom",
            },
            {
              label: "Privacy Policy",
              href: "https://mia-care.io/privacy-policy",
            },
          ],
        },
        {
          title: "Support",
          items: [
            {
              label: 'Support Portal',
              href: 'https://makeitapp.atlassian.net/servicedesk/customer/portal/21'
            },
            {
              label: "GitHub",
              href: "https://github.com/mia-care",
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
          // editUrl: createEditUrl,
          sidebarPath: require.resolve("./sidebars.js"),
          lastVersion: "current",
          includeCurrentVersion: true,
          versions: {
            current: {
              label: "3.x (Current)",
              path: "",
              banner: "none"
            },
            "2.5.x": {
              label: "2.5.x",
              path: "2.5.x",
              banner: "unmaintained"
            },
            "2.4.x": {
              label: "2.4.x",
              path: "2.4.x",
              banner: "unmaintained"
            },
            "2.3.x": {
              label: "2.3.x",
              path: "2.3.x",
              banner: "unmaintained"
            },
            "2.2.x": {
              label: "2.2.x",
              path: "2.2.x",
              banner: "unmaintained"
            },
            "2.1.x": {
              label: "2.1.x",
              path: "2.1.x",
              banner: "unmaintained"
            },
            "2.0.x": {
              label: "2.0.x",
              path: "2.0.x",
              banner: "unmaintained"
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
                const {fileName} = params;
                return defaultCategoryIndexMatcher(params) || ['overview', '10_overview'].includes(fileName.toLowerCase());
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
};

module.exports = config;
