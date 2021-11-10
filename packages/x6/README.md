<p align="center"><img src="/flow.svg"></p>

<p align="center"><strong>X6 是 AntV 旗下的图编辑引擎</strong></p>
<p align="center"><strong>提供了开箱即用的交互组件和简单易用的节点定制能力，方便我们快速搭建流程图、DAG 图、ER 图等图应用。</strong></p>

<p align="center">
<a href="/LICENSE"><img src="https://img.shields.io/github/license/antvis/x6?style=flat-square" alt="MIT License"></a>
<a href="https://www.typescriptlang.org"><img alt="Language" src="https://img.shields.io/badge/language-TypeScript-blue.svg?style=flat-square"></a>
<a href="https://github.com/antvis/x6/pulls"><img alt="PRs Welcome" src="https://img.shields.io/badge/PRs-Welcome-brightgreen.svg?style=flat-square"></a>
<a href="https://x6.antv.vision"><img alt="website" src="https://img.shields.io/static/v1?label=&labelColor=505050&message=website&color=0076D6&style=flat-square&logo=google-chrome&logoColor=0076D6"></a>
<a href="https://github.com/antvis/X6/actions/workflows/ci.yml"><img alt="build" src="https://img.shields.io/github/workflow/status/antvis/x6/%F0%9F%91%B7%E3%80%80CI/master?logo=github&style=flat-square"></a>
<a href="https://coveralls.io/github/antvis/x6"><img alt="coverage" src="https://img.shields.io/coveralls/antvis/x6/master.svg?style=flat-square"></a>
<a href="https://lgtm.com/projects/g/antvis/x6/context:javascript"><img alt="Language grade: JavaScript" src="https://img.shields.io/lgtm/grade/javascript/g/antvis/x6.svg?logo=lgtm&style=flat-square"></a>
</p>

<p align="center">
<a href="https://www.npmjs.com/package/@antv/x6"><img alt="NPM Package" src="https://img.shields.io/npm/v/@antv/x6.svg?style=flat-square"></a>
<a href="https://www.npmjs.com/package/@antv/x6"><img alt="NPM Downloads" src="https://img.shields.io/npm/dm/@antv/x6?logo=npm&style=flat-square"></a>
<a href="https://david-dm.org/antvis/x6"><img alt="NPM Dependencies" src="https://david-dm.org/antvis/x6.svg?style=flat-square"></a>
<a href="https://david-dm.org/antvis/x6?path=packages/x6"><img alt="Dependency Status" src="https://david-dm.org/antvis/x6.svg?style=flat-square&path=packages/x6"></a>
<a href="https://david-dm.org/antvis/x6?type=dev&path=packages/x6"><img alt="devDependencies Status" src="https://david-dm.org/antvis/x6/dev-status.svg?style=flat-square&path=packages/x6" ></a>
</p>

简体中文 | [English](/README.en-us.md)

## 特性

- 🌱　极易定制：支持使用 SVG/HTML/React/Vue 定制节点样式和交互；
- 🚀　开箱即用：内置 10+ 图编辑配套扩展，如框选、对齐线、小地图等；
- 🧲　数据驱动：基于 MVC 架构，用户更加专注于数据逻辑和业务逻辑；
- 💯　事件驱动：可以监听图表内发生的任何事件。

## 安装

### 使用 NPM/Yarn

```shell
# npm
$ npm install @antv/x6 --save

# yarn
$ yarn add @antv/x6
```

### 使用 CDN

可以使用下面任意一个最新版本的 CDN 地址:

- https://unpkg.com/@antv/x6/dist/x6.js
- https://cdn.jsdelivr.net/npm/@antv/x6/dist/x6.js
- https://cdnjs.cloudflare.com/ajax/libs/antv-x6/1.3.20/x6.js

```html
<script src="https://unpkg.com/@antv/x6/dist/x6.js"></script>
```

在生产环境中，建议使用指定版本号的链接，以避免版本更新带来的意外破坏：

- https://unpkg.com/@antv/x6@1.1.1/dist/x6.js
- https://cdn.jsdelivr.net/npm/@antv/x6@1.1.1/dist/x6.js
- https://cdnjs.cloudflare.com/ajax/libs/antv-x6/1.1.1/x6.js

```html
<script src="https://unpkg.com/@antv/x6@1.1.1/dist/x6.js"></script>
```

## 快速使用

**Step 1**: 指定渲染图的容器。

```html
<div id="container" style="width: 600px; height: 400px"></div>
```

**Step 2**: 渲染节点和边。

```ts
// 从 node_modules 引入
import { Graph } from '@antv/x6'
// 从 CND 引入时，我们暴露了 X6 这个全局变量
// const { Graph } = X6

// 创建 Graph 的实例
const graph = new Graph({
  container: document.getElementById('container'),
  grid: true
})

// 渲染源节点
const source = graph.addNode({
  x: 300,
  y: 40,
  width: 80,
  height: 40,
  label: 'Hello',
})

// 渲染目标节点
const target = graph.addNode({
  x: 420,
  y: 180,
  width: 80,
  height: 40,
  label: 'World',
})

// 渲染边
graph.addEdge({
  source,
  target,
})
```

渲染结果如下。

<img src="https://gw.alipayobjects.com/mdn/rms_43231b/afts/img/A*o4W3RLZicagAAAAAAAAAAAAAARQnAQ" alt="HelloWorld" />

## 使用文档

- [简介](https://x6.antv.vision/zh/docs/tutorial/about)
- [快速上手](https://x6.antv.vision/zh/docs/tutorial/getting-started)
- [基础教程](https://x6.antv.vision/zh/docs/tutorial/basic/graph)
- [进阶实践](https://x6.antv.vision/zh/docs/tutorial/intermediate/serialization)
- [高级指引](https://x6.antv.vision/zh/docs/tutorial/advanced/animation)
- [更新日志](https://x6.antv.vision/zh/docs/tutorial/log)

## 应用案例

### 流程图

[流程图](https://en.wikipedia.org/wiki/Flowchart)是常用用于表示业务流程。

- 在线示例：[https://x6.antv.vision/apps/draw](https://x6.antv.vision/apps/draw)
- 源码链接：[https://github.com/antvis/x6/tree/master/examples/x6-app-draw](https://github.com/antvis/x6/tree/master/examples/x6-app-draw)

<a href="https://x6.antv.vision/apps/draw" target="_blank" rel="noopener noreferrer">
  <img src="https://gw.alipayobjects.com/mdn/rms_43231b/afts/img/A*vFqjSZ-dXKkAAAAAAAAAAAAAARQnAQ" alt="draw" />
</a>

### DAG 图

DAG是[有向无环图](https://en.wikipedia.org/wiki/Directed_acyclic_graph)的缩写，它是一个[有向](https://en.wikipedia.org/wiki/Directed_graph)，没有[环](https://en.wikipedia.org/wiki/Cycle_graph#Directed_cycle_graph)的图形。它最初是计算机领域中一种常见的数据结构。由于其独特的拓扑结构所带来的优良特性，常被用于处理动态规划、导航中寻找最短路径、数据压缩等算法。

- 在线示例：[https://x6.antv.vision/apps/dag](https://x6.antv.vision/apps/dag)
- 源码链接：[https://github.com/antvis/x6/tree/master/examples/x6-app-dag](https://github.com/antvis/x6/tree/master/examples/x6-app-dag)

<a href="https://x6.antv.vision/apps/dag" target="_blank" rel="noopener noreferrer">
  <img src="https://gw.alipayobjects.com/mdn/rms_43231b/afts/img/A*pJmUSoDLVWEAAAAAAAAAAAAAARQnAQ" alt="dag" />
</a>

### ERD 图

实体关系图 (ERD) 显示了存储在数据库中的实体集之间的关系。实体集是类似实体的集合，这些实体可以定义其属性，通过定义实体、它们的属性并显示它们之间的关系。ER 图经常用来说明了数据库的逻辑结构。

- 在线示例：[https://x6.antv.vision/apps/er](https://x6.antv.vision/apps/er)
- 源码链接：[https://github.com/antvis/x6/tree/master/examples/x6-app-er](https://github.com/antvis/x6/tree/master/examples/x6-app-er)

<a href="https://x6.antv.vision/apps/er" target="_blank" rel="noopener noreferrer">
  <img src="https://gw.alipayobjects.com/mdn/rms_43231b/afts/img/A*pwvaToTpiEwAAAAAAAAAAAAAARQnAQ" alt="er" />
</a>

## 如何交流

如果你在使用的过程中碰到问题，可以先通过 [issues](https://github.com/antvis/x6/issues) 看看有没有类似的 bug 或者建议。欢迎提 [issues](https://github.com/antvis/x6/issues/new) 交流，也可以使用[钉钉](https://m.dingtalk.com/)扫描下面二维码加入**X6 交流群**。

需要注意的是，提问题时请配上 [CodeSandbox](https://codesandbox.io/s/pensive-sound-f4nhc) 的复现代码，方便快速定位和解决问题。

<a href="https://qr.dingtalk.com/action/joingroup?code=v1,k1,rOHuvgq5s0EHDktyyQJffDE3ZAmHnbB2e6iwn/w4BKs=&_dt_no_comment=1&origin=11" target="_blank" rel="noopener noreferrer">
  <img src="https://gw.alipayobjects.com/mdn/rms_43231b/afts/img/A*Up-4S4v8H-0AAAAAAAAAAAAAARQnAQ" alt="X6 图可视化交流群1" width="375" />
  <img src="https://gw.alipayobjects.com/mdn/rms_43231b/afts/img/A*5FhnSb3ewfQAAAAAAAAAAAAAARQnAQ" alt="X6 图可视化交流群2" width="375" />
</a>

## 如何开发

我们使用了 [lerna](https://github.com/lerna/lerna) 来管理项目，目录结构如下：

```
.
├── examples
│   ├── x6-app-dag            # dag 图示例
│   ├── x6-app-draw           # 流程图示例
│   ├── x6-app-er             # ER 图示例
│   └── x6-example-features   # 特性演示示例
├── packages
│   ├── x6                    # X6
│   ├── x6-react              # X6 的 React 封装（预留）
│   ├── x6-react-components   # 配套 React 组件库
│   ├── x6-react-shape        # 支持使用 React 渲染节点
│   └── x6-vue-shape          # 支持使用 Vue 渲染节点
└── sites
    ├── x6-sites              # 官网和文档
    ├── x6-sites-demos        # 文档中嵌入的 DEMO
    └── x6-sites-demos-helper # 构建文档 DEMO 的工具
```

开始之前需要安装必要的全局依赖和初始化：

```shell
# 全局安装 yarn 和 lerna 工具
$ npm install yarn -g
$ npm install lerna -g

# 安装项目依赖和初始化构建
$ yarn bootstrap
```

然后可以进入到指定项目开发和调试。

如本地启动 `examples/x6-example-features` 示例：

```shell
cd examples/x6-example-features

yarn start
```

修复 X6 的 BUG 时可以开启 watch 模式，配合上面启动的本地 DEMO，实时查看修复效果：

```shell
cd packages/x6

// esm 模式，动态构建 es 产物
yarn build:watch:esm

// commonjs 模式，动态构建 lib 产物
yarn build:watch:cjs
```

## 如何贡献

如果你在使用的过程中碰到问题，可以先通过 [issues](https://github.com/antvis/x6/issues) 看看有没有类似的 bug 或者建议。

如需提交代码，请遵从我们的[贡献指南](/CONTRIBUTING.zh-CN.md)。我们会收集贡献者的 Github 头像到下面贡献者清单中。

<a href="https://github.com/antvis/x6/graphs/contributors">
  <img src="/CONTRIBUTORS.svg" alt="Contributors" width="740" />
</a>

## 开源协议

该项目的代码和文档基于 [MIT License](/LICENSE) 开源协议。
