import { defineConfig } from '@antv/astro-theme-antv'
import { fileURLToPath } from 'node:url'

const config = defineConfig({
  site: {
    title: 'X6',
    metaTitle: {
      zh: 'X6 图编辑引擎',
      en: 'X6',
    },
    origin: 'https://x6.antv.antgroup.com',
    repository: 'https://github.com/antvis/x6',
    description: {
      zh: 'JavaScript 图编辑引擎',
      en: 'JavaScript diagramming library',
    },
    locales: ['zh', 'en'],
    defaultLocale: 'zh',
    logo: 'https://mdn.alipayobjects.com/huamei_qa8qxu/afts/img/A*A-lcQbVTpjwAAAAAAAAAAAAADmJ7AQ/original',
  },
  content: {
    docs: './docs',
    examples: './examples',
    edit: {
      branch: 'master',
      path: 'site/docs',
    },
    sidebar: {
      'tutorial/basic': {
        zh: '基础',
        en: 'Basic',
        order: 2,
      },
      'tutorial/intermediate': {
        zh: '进阶',
        en: 'Intermediate',
        order: 3,
      },
      'tutorial/plugins': {
        zh: '插件',
        en: 'Plugin',
        order: 4,
      },
      'api/graph': {
        zh: '画布',
        en: 'Graph',
        order: 1,
      },
      'api/model': {
        zh: '元素',
        en: 'Element',
        order: 2,
      },
      'api/mvc': {
        zh: 'MVC',
        en: 'MVC',
        order: 3,
      },
      'api/registry': {
        zh: '扩展',
        en: 'Extension',
        order: 4,
      },
    },
  },
  navigation: [
    {
      text: {
        zh: '文档',
        en: 'Tutorials',
      },
      href: '/tutorial/about/',
    },
    {
      text: {
        zh: 'API',
        en: 'API',
      },
      href: '/api/graph/graph/',
    },
    {
      text: {
        zh: '图表示例',
        en: 'Examples',
      },
      href: '/examples/',
    },
    {
      text: {
        zh: '更新日志',
        en: 'Change Log',
      },
      href: 'https://www.yuque.com/antv/x6/gkniz4iiyxftgv0r',
    },
  ],
  versions: {
    '3.x': 'https://x6.antv.antgroup.com',
    '2.x': 'https://x6-v2.antv.vision',
    '1.x': 'https://x6-v1.antv.vision',
  },
  llms: {
    locales: ['zh', 'en'],
  },
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
  home: {
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
    actions: [
      {
        text: {
          zh: '开始使用',
          en: 'Getting Started',
        },
        href: '/tutorial/getting-started/',
      },
      {
        text: {
          zh: '图表示例',
          en: 'Examples',
        },
        href: '/examples/',
      },
    ],
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
  },
  theme: { tokens: { '--home-background': '#fff' } },
  slots: {
    home: {
      hero: ['./src/components/Home.astro'],
      features: ['./src/components/Home.astro'],
      afterFeatures: ['./src/components/Home.astro'],
    },
  },
  demo: {
    height: 600,
    // Native iframe imports need named ESM exports for React's CommonJS entries.
    dependencies: {
      react: './src/demo/react.ts',
      'react/jsx-runtime': './src/demo/jsx-runtime.ts',
      'react-dom/client': './src/demo/react-dom-client.ts',
    },
  },
})

// Match the core package exactly so React shape and other subpackages stay intact.
config.devToolbar = { enabled: false }
config.vite = {
  resolve: {
    alias: [
      {
        find: /^@antv\/x6$/,
        replacement: fileURLToPath(new URL('../src/index.ts', import.meta.url)),
      },
    ],
    dedupe: ['react', 'react-dom'],
  },
  optimizeDeps: {
    exclude: ['@antv/x6', '@antv/x6-react-shape'],
    // x6-react-shape imports this CommonJS peer from outside Vite's optimizer.
    include: ['react-dom'],
  },
}
export default config
