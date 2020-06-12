const { repository, version } = require('./package.json');

module.exports = {
  plugins: [
    {
      resolve: '@antv/gatsby-theme-antv',
      options: {
        GATrackingId: '',
      },
    },
  ],
  siteMetadata: {
    title: 'X6',
    description: 'JavaScript diagramming library',
    siteUrl: 'https://x6.antv.vision',
    githubUrl: repository.url,
    versions: {
      [version]: 'https://x6.antv.vision/',
    },
    navs: [
      {
        slug: 'examples',
        title: {
          zh: '图表示例',
          en: 'Examples',
        },
        order: 0,
      },
      {
        slug: 'docs/manual',
        title: {
          zh: '教程',
          en: 'Tutorials',
        },
        order: 1,
      },
      {
        slug: 'docs/api',
        title: {
          zh: 'API 文档',
          en: 'API',
        },
        order: 2,
      },
    ],
    docsearchOptions: {
      apiKey: '',
      indexName: 'antv_x6',
    },
  },
};
