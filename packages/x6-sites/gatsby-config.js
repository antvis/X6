const { repository, version } = require('./package.json')

module.exports = {
  plugins: [
    {
      resolve: '@antv/gatsby-theme-antv',
      options: {},
    },
    {
      resolve: `gatsby-transformer-remark`,
      options: {
        plugins: [
          {
            resolve: `gatsby-remark-autolink-headers`,
            options: {},
          },
          {
            resolve: `gatsby-remark-prismjs`,
            options: {
              inlineCodeMarker: '±',
              languageExtensions: [
                {
                  language: 'sign',
                  extend: 'typescript',
                  definition: {
                    superscript_types: /(SuperType)/,
                  },
                  insertBefore: {
                    function: {
                      superscript_keywords: /(superif|superelse)/,
                    },
                  },
                },
              ],
            },
          },
          {
            resolve: 'gatsby-remark-custom-blocks',
            options: {
              blocks: {
                success: {
                  classes: 'success',
                },
                error: {
                  classes: 'error',
                },
                warning: {
                  classes: 'warning',
                },
                info: {
                  classes: 'info',
                  title: 'optional',
                },
              },
            },
          },
        ],
      },
    },
  ],
  siteMetadata: {
    title: 'X6',
    description: 'JavaScript diagramming library',
    siteUrl: 'https://x6.antv.vision',
    githubUrl: repository,
    showLanguageSwitcher: false,
    versions: {
      [version]: 'https://x6.antv.vision',
    },
    navs: [
      {
        slug: 'docs/tutorial/about',
        title: {
          zh: '文档',
          en: 'Tutorials',
        },
        order: 0,
      },
      {
        slug: 'docs/api/graph',
        title: {
          zh: 'API',
          en: 'API',
        },
        order: 1,
      },
      // {
      //   slug: 'examples',
      //   title: {
      //     zh: '图表示例',
      //     en: 'Examples',
      //   },
      //   order: 2,
      // },
    ],
    docs: [
      {
        slug: 'tutorial/basic',
        title: {
          zh: '基础教程',
          en: 'Basic',
        },
        order: 2,
      },
      {
        slug: 'tutorial/intermediate',
        title: {
          zh: '进阶实践',
          en: 'Intermediate',
        },
        order: 3,
      },
      {
        slug: 'tutorial/advanced',
        title: {
          zh: '高级指引',
          en: 'Advanced',
        },
        order: 4,
      },
      {
        slug: 'tutorial/faq',
        title: {
          zh: '常见问题',
          en: 'FQA',
        },
        order: 5,
      },

      {
        slug: 'api/model',
        title: {
          zh: 'Model',
          en: 'Model',
        },
        order: 3,
      },
      {
        slug: 'api/view',
        title: {
          zh: 'View',
          en: 'View',
        },
        order: 5,
      },
      {
        slug: 'api/registry',
        title: {
          zh: 'Registry',
          en: 'Registry',
        },
        order: 7,
      },
    ],
    docsearchOptions: {
      apiKey: '9d1cd586972bb492b7b41b13a949ef30',
      indexName: 'antv_x6',
    },
  },
}
