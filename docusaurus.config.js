const createEditUrl = require("./scripts/createEditUrl");
const createRedirects = require("./scripts/createRedirects");
const versionsList = require('./versions.json');

const prodVersion = versionsList[1]

/** @type {import('@docusaurus/types').Config} */
const config = {
    title: "Mia-Platform Documentation",
    tagline: "Learn how Mia-Platform can help you to develop your business",
    favicon: "img/favicon.ico",
    url: "https://docs.mia-platform.eu",
    baseUrl: "/",
    organizationName: "Mia-Platform",
    projectName: "Mia-Platform",
    onBrokenAnchors: 'ignore',
    themes: ["docusaurus-json-schema-plugin", "@docusaurus/theme-mermaid"],
    markdown: {
        mermaid: true,
        hooks: {
          onBrokenMarkdownLinks: "throw",
          onBrokenMarkdownImages: "throw"
        }
    },
    themeConfig: {
        prism: {
            additionalLanguages: ['rego', 'java', 'csharp', 'kotlin', 'nginx', 'docker', 'ini'],
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
            items: [
                {
                    type: 'doc',
                    docId: "getting-started/mia-platform-overview",
                    label: "Getting Started",
                    position: "left",
                    activeBaseRegex: "(docs|docs/\\d.x)/getting-started"
                },
                {
                    label: "Products",
                    position: "left",
                    activeBaseRegex: "(docs|docs/\\d.x)/products",
                    type: "dropdown",
                    items: [
                        {
                            type: 'doc',
                            docId: "products/console/overview-dev-suite",
                            label: "Console",
                            activeBaseRegex: "(docs|docs/\\d.x)/products/console"
                        },
                        {
                            type: 'doc',
                            docId: "products/fast_data/what_is_fast_data",
                            label: "Fast Data",
                            activeBaseRegex: "(docs|docs/\\d.x)/products/fast_data"
                        },
                        {
                            type: 'doc',
                            docId: "products/data_catalog/overview_data_catalog",
                            label: "Data Catalog",
                            activeBaseRegex: "(docs|docs/\\d.x)/products/data_catalog"
                        },
                        {
                            type: 'doc',
                            docId: "products/microfrontend-composer/what-is",
                            label: "Microfrontend Composer",
                            activeBaseRegex: "(docs|docs/\\d.x)/products/microfrontend-composer"
                        },
                        {
                            type: 'doc',
                            docId: "products/software-catalog/overview",
                            label: "Software Catalog",
                            activeBaseRegex: "(docs|docs/\\d.x)/products/software-catalog"
                        },
                        {
                            type: 'doc',
                            docId: "runtime-components/overview_marketplace",
                            label: "Runtime components",
                            activeBaseRegex: "(docs|docs/\\d.x)/runtime-components"
                        }
                    ]
                },
                {
                    label: "Solutions",
                    position: "left",
                    activeBaseRegex: "(docs|docs/\\d.x)/solutions",
                    type: "dropdown",
                    items: [
                        {
                            type: 'doc',
                            docId: "solutions/application-development/application-development-overview",
                            label: "Application Development",
                            activeBaseRegex: "(docs|docs/\\d.x)/solutions/application-development"
                        },
                        {
                            type: 'doc',
                            docId: "solutions/platform-engineering/platform-engineering-overview",
                            label: "Platform Engineering",
                            activeBaseRegex: "(docs|docs/\\d.x)/solutions/platform-engineering"
                        },
                        {
                            type: 'doc',
                            docId: "solutions/ai-agent-lifecycle/ai-agent-lifecycle-overview",
                            label: "AI Agent Lifecycle",
                            activeBaseRegex: "(docs|docs/\\d.x)/solutions/ai-agent-lifecycle"
                        },
                        {
                            type: 'doc',
                            docId: "solutions/cloud-operations/cloud-operations-overview",
                            label: "Cloud Operations",
                            activeBaseRegex: "(docs|docs/\\d.x)/solutions/cloud-operations"
                        },
                        {
                            type: 'doc',
                            docId: "solutions/data-integration/data-integration-overview",
                            label: "Data Integration",
                            activeBaseRegex: "(docs|docs/\\d.x)/solutions/data-integration"
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
                    label: "Release Notes",
                    position: "left",
                    type: "doc",
                    docId: "versions",
                    docsPluginId: "release-notes-doc",
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
                  type: 'custom-CustomArchivedItem',
                  position: 'right',
                  dropdownItemsAfter: [
                      {
                          type: 'html',
                          value: '<hr style="margin: 4px 0;">',
                      },
                      {
                          type: 'html',
                          value: '<b style="margin-left: 8px; font-size: 14px;">Archived versions</b>',
                      },
                    ],
                  archivedVersions: versionsList.filter(v => !prodVersion.includes(v.split('.')[0]))
                }
            ],
        },
        footer: {
            style: "dark",
            links: [{
                title: "Mia-Platform",
                items: [
                    {
                    label: "How to install",
                    to: "/info/how_to_install",
                    },
                    {
                        label: "Bug Policy",
                        to: "/release-notes/info/bug_policy",
                    },
                    {
                        label: "Supported browsers",
                        to: "/info/supported_browser",
                    },
                    {
                        label: "Open Source Software",
                        to: "/info/oss",
                    },
                    {
                        label: "Subprocessor",
                        to: "/info/subprocessor",
                    },
                    {
                        label: "Service Level Agreement",
                        to: "/docs/info/mia_service_level_agreement",
                    },
                    {
                        label: "Audit Process",
                        to: "/info/audit_process",
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
                            href: "https://mia-platform.eu/blog/",
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
                            href: "https://mia-platform.eu/platform/fast-data/",
                        },
                        {
                            label: "Release Notes",
                            to: "/release-notes/versions",
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
                            label: "Library",
                            href: "https://mia-platform.eu/library/",
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
    future: {
        v4: true,
        experimental_faster: true,
    },
    i18n: {
        defaultLocale: 'en',
        locales: ['en'],
    },
    presets: [
        [
            '@docusaurus/preset-classic',
            {
                docs: {
                    sidebarPath: './sidebars.js',
                    editUrl: createEditUrl,
                    lastVersion: prodVersion,
                    versions: {
                        current: {
                          label: "Canary"
                        }
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
                                return defaultCategoryIndexMatcher(params) || ['overview', '10_overview', '10-overview'].includes(fileName.toLowerCase())
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
                    ignorePatterns: ['/docs/12.x/**', '/docs/13.x/**'],
                    filename: 'sitemap.xml',
                }
            }
        ],
    ],
    plugins: [
        [
            '@docusaurus/plugin-content-docs',
            {
                id: 'release-notes-doc',
                path: 'release-notes',
                routeBasePath: 'release-notes',
                sidebarPath: './sidebarsReleaseNotes.js',
            },
        ],
        [
            '@docusaurus/plugin-content-docs',
            {
                id: 'info-doc',
                path: 'info',
                routeBasePath: 'info',
            },
        ],
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

export default config;
