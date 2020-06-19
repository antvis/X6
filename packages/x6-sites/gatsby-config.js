const { repository, version } = require('./package.json')

module.exports = {
  plugins: [
    {
      resolve: '@antv/gatsby-theme-antv',
      options: {},
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
        slug: 'docs/manual/about',
        title: {
          zh: '文档',
          en: 'Tutorials',
        },
        order: 0,
      },
      // {
      //   slug: 'docs/api',
      //   title: {
      //     zh: 'API',
      //     en: 'API',
      //   },
      //   order: 1,
      // },
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
        slug: 'manual/tutorial',
        title: {
          zh: '基础教程',
          en: 'Tutorial',
        },
        order: 2,
      },
      {
        slug: 'manual/concept',
        title: {
          zh: '核心概念',
          en: 'Concept',
        },
        order: 3,
      },
      {
        slug: 'manual/advanced',
        title: {
          zh: '高级指引',
          en: 'Advanced',
        },
        order: 4,
      },
      {
        slug: 'manual/faq',
        title: {
          zh: '常见问题',
          en: 'FQA',
        },
        order: 5,
      },
    ],
    docsearchOptions: {
      apiKey: '',
      indexName: 'antv_x6',
    },
  },
}
