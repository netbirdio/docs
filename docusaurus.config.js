// @ts-check
// Note: type annotations allow type checking and IDEs autocompletion

const lightCodeTheme = require('prism-react-renderer/themes/github');
const darkCodeTheme = require('prism-react-renderer/themes/dracula');

/** @type {import('@docusaurus/types').Config} */
const config = {
    title: 'NetBird Documentation',
    tagline: '',
    url: 'https://netbird.io',
    baseUrl: '/docs/',
    onBrokenLinks: 'throw',
    onBrokenMarkdownLinks: 'warn',
    favicon: '/img/favicon.ico',
    organizationName: 'netbirdio',
    projectName: 'netbird',

    presets: [
        // .. Your other presets' config
        '@docusaurus/preset-classic',
        // Redocusaurus config
        [
            'redocusaurus',
            {
                docs: {
                    sidebarPath: require.resolve('./sidebars.js'),
                    routeBasePath: '/',
                    editUrl: 'https://github.com/netbirdio/docs/tree/main',
                    primaryColor: '#E78945',
                },
                googleAnalytics: {
                    trackingID: 'UA-188381981-2',
                    anonymizeIP: true,
                },
                // Plugin Options for loading OpenAPI files
                specs: [
                    {
                        spec: 'openapi.yml',
                        route: '/api/',
                    },
                ],
                // Theme Options for modifying how redoc renders them
                theme: {
                    // Change with your site colors
                    primaryColor: '#E78945',
                    customCss: require.resolve('./src/css/custom.css'),
                },
            },
        ],
    ],

    themeConfig:
    /** @type {import('@docusaurus/preset-classic').ThemeConfig} */
        ({
            navbar: {
                title: '',
                logo: {
                    alt: 'netbird Logo',
                    src: '/img/logo.svg',
                    srcDark: '/img/logo-dark.svg',
                    href: '/',
                },
                items: [
                    {
                        to: 'https://netbird.io/',
                        label: 'Home',
                        position: 'right',
                        target: '_self'
                    }, // or position: 'right'
                    {
                        type: 'doc',
                        docId: 'introduction',
                        position: 'right',
                        label: 'Docs',
                    },
                    {
                        to: '/api/',
                        position: 'right',
                        label: 'API',
                    },
                    {
                        to: 'https://netbird.io/blog/',
                        label: 'Blog',
                        position: 'right',
                        target: '_self'
                    },
                    {
                        href: 'https://github.com/netbirdio/netbird',
                        label: 'GitHub',
                        position: 'right',
                    },
                ],
            },
            prism: {
                theme: lightCodeTheme,
                darkTheme: darkCodeTheme,
            },
            announcementBar: {
                id: 'announcementBar-docs',
                content:
                    '⭐ If you like NetBird, give it a star on <a target="_blank" rel="noopener noreferrer" href="https://github.com/netbirdio/netbird">GitHub</a></a>',
                backgroundColor: '#e3e3e3',
                textColor: '#091E42',
                isCloseable: true,
            },
            docs: {
                sidebar: {
                    autoCollapseCategories: true
                },
            }
        }),
};

module.exports = config;
