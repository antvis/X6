const { version } = require('../../packages/x6/package.json')
const { repository } = require('./package.json')

module.exports = {
  plugins: [
    {
      resolve: '@antv/gatsby-theme-antv',
      options: {
        GATrackingId: `UA-148148901-10`,
      },
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
    showGithubStar: true,
    showGithubCorner: false,
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
      {
        slug: 'examples',
        title: {
          zh: '图表示例',
          en: 'Examples',
        },
        order: 2,
      },
      {
        slug: 'https://www.yuque.com/antv/x6/be9pfx',
        title: {
          zh: '常见问题',
          en: 'Q&A',
        },
        order: 3,
      },
      {
        slug: 'https://www.yuque.com/antv/x6/xgb04i',
        title: {
          zh: '更新日志',
          en: 'Change Log',
        },
        order: 4,
      },
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
        slug: 'api/graph',
        title: {
          zh: 'Graph',
          en: 'Graph',
        },
        order: 1,
      },
      {
        slug: 'api/model',
        title: {
          zh: 'Model',
          en: 'Model',
        },
        order: 2,
      },
      {
        slug: 'api/view',
        title: {
          zh: 'View',
          en: 'View',
        },
        order: 3,
      },
      {
        slug: 'api/registry',
        title: {
          zh: 'Registry',
          en: 'Registry',
        },
        order: 4,
      },
      {
        slug: 'api/ui',
        title: {
          zh: 'UI Components',
          en: 'UI Components',
        },
        order: 5,
      },
    ],
    examples: [
      {
        slug: 'showcase',
        icon: 'case',
        title: {
          zh: '场景案例',
          en: 'Component',
        },
      },
      {
        slug: 'node',
        icon: 'shape',
        title: {
          zh: '节点',
          en: 'Node',
        },
      },
      {
        slug: 'edge',
        icon: 'link',
        title: {
          zh: '边',
          en: 'Edge',
        },
      },
      {
        slug: 'graph',
        icon: 'tree',
        title: {
          zh: '画布',
          en: 'Graph',
        },
      },
      {
        slug: 'animation',
        icon: 'scatter',
        title: {
          zh: '动画',
          en: 'Animation',
        },
      },
      {
        slug: 'layout',
        icon: 'tree',
        title: {
          zh: '布局',
          en: 'Layout',
        },
      },
    ],
    docsearchOptions: {
      apiKey: 'fe8bee8366e56a9463229c3c81200866',
      indexName: 'antv_x6',
    },
  },
}
