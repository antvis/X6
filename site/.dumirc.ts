import { defineConfig } from 'dumi'
import { repository, version } from './package.json'

export default defineConfig({
  ...(process.env.NODE_ENV === 'production'
    ? { ssr: { builder: 'webpack' }, mako: false }
    : { ssr: false, mako: {} }),
  locales: [
    { id: 'zh', name: '中文' },
    { id: 'en', name: 'English' },
  ],
  themeConfig: {
    title: 'X6',
    description: 'JavaScript diagramming library',
    metas: {
      title: {
        zh: 'X6 图编辑引擎',
        en: 'X6',
      },
      description: {
        zh: 'JavaScript 图编辑引擎',
        en: 'JavaScript diagramming library',
      },
    },
    /** 站点地图配置 */
    sitemap: {}, // 开启并采用默认配置
    /** 死链检查配置  */
    deadLinkChecker: {}, // 开启并采用默认配置
    defaultLanguage: 'zh',
    siteUrl: 'https://x6.antv.antgroup.com',
    isAntVSite: false,
    footerTheme: 'light', // 白色 底部主题
    feedback: true, // 是否开启用户反馈
    sitePackagePath: 'site', // 文档项目相对于项目根目录的相对路径
    githubUrl: repository, // GitHub 地址
    showSearch: true, // 是否显示搜索框
    showGithubCorner: true, // 是否显示头部的 GitHub icon
    showGithubStars: true, // 是否显示 GitHub star 数量
    showAntVProductsCard: true, // 是否显示 AntV 产品汇总的卡片
    showLanguageSwitcher: true, // 是否显示官网语言切换
    showWxQrcode: true, // 是否显示头部菜单的微信公众号
    showChartResize: true, // 是否在 demo 页展示图表视图切换
    showAPIDoc: false, // 是否在 demo 页展示API文档
    versions: {
      '3.x': 'https://x6.antv.antgroup.com',
      '2.x': 'https://x6-v2.antv.vision',
      '1.x': 'https://x6.antv.vision',
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
        title: {
          zh: '常见问题',
          en: 'Q&A',
        },
        order: 3,
        dropdownItems: [
          {
            url: 'https://www.yuque.com/sxd_panda/antv/x6',
            name: {
              zh: '社区 FAQ',
              en: 'Community FAQ',
            },
          },
          {
            url: 'https://www.yuque.com/antv/x6/tox1ukbz5cw57qfy',
            name: {
              zh: '官方 FAQ',
              en: 'Official FAQ',
            },
          },
        ],
      },
      {
        slug: 'https://www.yuque.com/antv/x6/bbfu6r',
        title: {
          zh: '更新日志',
          en: 'Change Log',
        },
        order: 4,
      },
      {
        slug: 'docs/xflow/guide/introduction',
        title: {
          zh: 'XFlow',
          en: 'XFlow',
        },
        order: 5,
      },
    ],
    detail: {
      engine: {
        zh: 'X6',
        en: 'X6',
      },
      title: {
        zh: 'X6·图编辑引擎',
        en: 'X6·图编辑引擎',
      },
      description: {
        zh: 'X6 是基于 HTML 和 SVG 的图编辑引擎，提供低成本的定制能力和开箱即用的内置扩展，方便我们快速搭建 DAG 图、ER 图、流程图、血缘图等应用。',
        en: 'X6 是基于 HTML 和 SVG 的图编辑引擎，提供低成本的定制能力和开箱即用的内置扩展，方便我们快速搭建 DAG 图、ER 图、流程图、血缘图等应用。',
      },
      image:
        'https://mdn.alipayobjects.com/huamei_qa8qxu/afts/img/A*5qQsTo0dkOcAAAAAAAAAAAAADmJ7AQ/original',
      imageStyle: {
        transform: 'scale(0.7)',
        marginTop: '70px',
        marginLeft: '100px',
      },
      buttons: [
        {
          text: {
            zh: '开始使用',
            en: 'Getting Started',
          },
          link: `/tutorial/getting-started`,
        },
        {
          text: {
            zh: '图表示例',
            en: 'Examples',
          },
          link: `/examples`,
          type: 'primary',
        },
      ],
    },
    features: [
      {
        icon: 'https://gw.alipayobjects.com/mdn/rms_43231b/afts/img/A*aiSwSLVyR14AAAAAAAAAAAAAARQnAQ',
        title: {
          zh: '快速上手，极易定制',
          en: '快速上手，极易定制',
        },
        description: {
          zh: '提供基于低学习成本的 SVG/HTML/CSS 的节点定制能力',
          en: '提供基于低学习成本的 SVG/HTML/CSS 的节点定制能力',
        },
      },
      {
        icon: 'https://gw.alipayobjects.com/mdn/rms_43231b/afts/img/A*zNTESJL7HJgAAAAAAAAAAAAAARQnAQ',
        title: {
          zh: '组件完备，开箱即用',
          en: '组件完备，开箱即用',
        },
        description: {
          zh: '内置 10+ 图编辑场景的配套扩展，如框选、对齐线、小地图等',
          en: '内置 10+ 图编辑场景的配套扩展，如框选、对齐线、小地图等',
        },
      },
      {
        icon: 'https://gw.alipayobjects.com/mdn/rms_43231b/afts/img/A*vQNVQoydZIIAAAAAAAAAAAAAARQnAQ',
        title: {
          zh: '灵活，可扩展',
          en: '灵活，可扩展',
        },
        description: {
          zh: '画布、节点、边、属性、工具等均可以通过注册机制自由、灵活扩展',
          en: '画布、节点、边、属性、工具等均可以通过注册机制自由、灵活扩展',
        },
      },
    ],
    cases: [
      {
        logo: 'https://mdn.alipayobjects.com/huamei_f4t1bn/afts/img/A*DALaSKBxyEcAAAAAAAAAAAAADtOHAQ/original',
        title: {
          zh: '流程编排',
          en: '流程编排',
        },
        description: {
          zh: '可视化编排可以用简单的方式将复杂的流程呈现出来，让用户更容易理解工作流',
          en: '可视化编排可以用简单的方式将复杂的流程呈现出来，让用户更容易理解工作流',
        },
        image:
          'https://mdn.alipayobjects.com/huamei_f4t1bn/afts/img/A*QsT0TpxA8-AAAAAAAAAAAAAADtOHAQ/original',
        isAppLogo: true,
      },
    ],
    companies: [
      {
        name: '阿里云',
        img: 'https://gw.alipayobjects.com/mdn/rms_2274c3/afts/img/A*V_xMRIvw2iwAAAAAAAAAAABkARQnAQ',
      },
      {
        name: '支付宝',
        img: 'https://gw.alipayobjects.com/mdn/rms_2274c3/afts/img/A*lYDrRZvcvD4AAAAAAAAAAABkARQnAQ',
      },
      {
        name: '天猫',
        img: 'https://gw.alipayobjects.com/mdn/rms_2274c3/afts/img/A*BQrxRK6oemMAAAAAAAAAAABkARQnAQ',
      },
      {
        name: '淘宝网',
        img: 'https://gw.alipayobjects.com/mdn/rms_2274c3/afts/img/A*1l8-TqUr7UcAAAAAAAAAAABkARQnAQ',
      },
      {
        name: '网上银行',
        img: 'https://gw.alipayobjects.com/mdn/rms_2274c3/afts/img/A*ZAKFQJ5Bz4MAAAAAAAAAAABkARQnAQ',
      },
      {
        name: '京东',
        img: 'https://gw.alipayobjects.com/mdn/rms_2274c3/afts/img/A*yh-HRr3hCpgAAAAAAAAAAABkARQnAQ',
      },
      {
        name: 'yunos',
        img: 'https://gw.alipayobjects.com/mdn/rms_2274c3/afts/img/A*_js7SaNosUwAAAAAAAAAAABkARQnAQ',
      },
      {
        name: '菜鸟',
        img: 'https://gw.alipayobjects.com/mdn/rms_2274c3/afts/img/A*TgV-RZDODJIAAAAAAAAAAABkARQnAQ',
      },
    ],
    docs: [
      {
        slug: 'tutorial/basic',
        title: {
          zh: '基础',
          en: 'Basic',
        },
        order: 2,
      },
      {
        slug: 'tutorial/intermediate',
        title: {
          zh: '进阶',
          en: 'Intermediate',
        },
        order: 3,
      },
      {
        slug: 'tutorial/plugins',
        title: {
          zh: '插件',
          en: 'Plugin',
        },
        order: 4,
      },
      {
        slug: 'api/graph',
        title: {
          zh: '画布',
          en: 'Graph',
        },
        order: 1,
      },
      {
        slug: 'api/model',
        title: {
          zh: '元素',
          en: 'Element',
        },
        order: 2,
      },
      {
        slug: 'api/mvc',
        title: {
          zh: 'MVC',
          en: 'MVC',
        },
        order: 3,
      },
      {
        slug: 'api/registry',
        title: {
          zh: '扩展',
          en: 'Extension',
        },
        order: 4,
      },
      {
        slug: 'xflow/guide',
        title: {
          zh: '开始',
          en: 'start',
        },
        order: 1,
      },
      {
        slug: 'xflow/components',
        title: {
          zh: '组件',
          en: 'component',
        },
        order: 2,
      },
      {
        slug: 'xflow/hooks',
        title: {
          zh: 'Hook',
          en: 'Hook',
        },
        order: 3,
      },
    ],
    examples: [
      {
        slug: 'showcase',
        icon: 'case',
        title: {
          zh: '场景案例',
          en: 'Case',
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
        slug: 'layout',
        icon: 'tree',
        title: {
          zh: '布局',
          en: 'Layout',
        },
      },
    ],
    docsearchOptions: {
      appId: 'XFVM2O0U6B',
      apiKey: 'bfcb6154d9e7ee9c70baee42fd37bebb',
      indexName: 'x6-antv-antgroup',
      versionV3: true,
    },
    playground: {
      extraLib: '',
      container:
        '<div id="container" style="min-width: 400px; min-height: 600px;"></div>',
      devDependencies: {
        typescript: 'latest',
      },
    },
    announcement: {
      zh: '',
      en: '',
    },
  },
  mfsu: false,
  alias: {
    '@': __dirname,
  },
  links: [],
  scripts: [],
})
