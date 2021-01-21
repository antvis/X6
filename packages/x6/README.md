<p align="center"><img src="/flow.svg"></p>

<p align="center"><strong>基于 SVG 和 HTML 渲染的 JavaScript 图表库</strong></p>

<p align="center">
<a href="/LICENSE"><img src="https://img.shields.io/badge/license-MIT_License-green.svg?style=flat-square" alt="MIT License"></a>
<a href="https://www.typescriptlang.org"><img alt="Language" src="https://img.shields.io/badge/language-TypeScript-blue.svg?style=flat-square"></a>
<a href="https://github.com/antvis/x6/pulls"><img alt="PRs Welcome" src="https://img.shields.io/badge/PRs-Welcome-brightgreen.svg?style=flat-square"></a>
<a href="https://x6.antv.vision"><img alt="website" src="https://img.shields.io/static/v1?label=&labelColor=505050&message=website&color=0076D6&style=flat-square&logo=google-chrome&logoColor=0076D6"></a>
<a href="https://travis-ci.org/antvis/x6"><img alt="build" src="https://img.shields.io/travis/antvis/x6.svg?style=flat-square"></a>
<a href="https://coveralls.io/github/antvis/x6"><img alt="coverage" src="https://img.shields.io/coveralls/antvis/x6/master.svg?style=flat-square"></a>
<a href="https://lgtm.com/projects/g/antvis/x6/context:javascript"><img alt="Language grade: JavaScript" src="https://img.shields.io/lgtm/grade/javascript/g/antvis/x6.svg?logo=lgtm&style=flat-square"></a>
</p>

<p align="center">
<a href="https://www.npmjs.com/package/@antv/x6"><img alt="NPM Package" src="https://img.shields.io/npm/v/@antv/x6.svg?style=flat-square"></a>
<a href="https://www.npmjs.com/package/@antv/x6"><img alt="NPM Downloads" src="http://img.shields.io/npm/dm/@antv/x6.svg?style=flat-square"></a>
<a href="https://david-dm.org/antvis/x6"><img alt="NPM Dependencies" src="https://david-dm.org/antvis/x6.svg?style=flat-square"></a>
<a href="https://david-dm.org/antvis/x6?path=packages/x6"><img alt="Dependency Status" src="https://david-dm.org/antvis/x6.svg?style=flat-square&path=packages/x6"></a>
<a href="https://david-dm.org/antvis/x6?type=dev&path=packages/x6"><img alt="devDependencies Status" src="https://david-dm.org/antvis/x6/dev-status.svg?style=flat-square&path=packages/x6" ></a>
</p>

简体中文 | [English](./README.en-us.md)

## 特性

- 🌱　极易定制：提供基于低学习成本的 SVG/HTML/React/Vue 的节点定制能力；
- 🚀　开箱即用：内置 10+ 图编辑场景的配套扩展，如框选、对齐线、小地图等；
- 🧲　数据驱动：基于 MVC 架构模式，用户更加专注于数据逻辑和业务逻辑；
- 💯　事件驱动：您可以监听图表内发生的任何事件；

## 安装

### NPM/Yarn

```shell
# npm
$ npm install @antv/x6 --save

# yarn
$ yarn add @antv/x6
```

### CDNs

为了学习的目的，您可以使用下面任意一个最新版本的 CDN:

- https://unpkg.com/@antv/x6/dist/x6.js
- https://cdn.jsdelivr.net/npm/@antv/x6/dist/x6.js
- https://cdnjs.cloudflare.com/ajax/libs/antv-x6/1.3.20/x6.js

```html
<script src="https://unpkg.com/@antv/x6/dist/x6.js"></script>
```

在生产环境中，我们建议使用特定版本号的链接，以避免版本更新带来的意外破坏：

- https://unpkg.com/@antv/x6@1.1.1/dist/x6.js
- https://cdn.jsdelivr.net/npm/@antv/x6@1.1.1/dist/x6.js
- https://cdnjs.cloudflare.com/ajax/libs/antv-x6/1.1.1/x6.js

```html
<script src="https://unpkg.com/@antv/x6@1.1.1/dist/x6.js"></script>
```

## 用法

**Step 1**: 指定渲染图表的容器。

```html
<div id="container" style="width: 600px; height: 400px"></div>
```

**Step 2**: 渲染节点和边。

```ts
// import from node_modules
import { Graph } from '@antv/x6'
// or use the global variable `X6` exported from CDN links
// const { Graph } = X6

// Create an instance of Graph.
const graph = new Graph({
  container: document.getElementById('container'),
  grid: true
})

// Render source node.
const source = graph.addNode({
  x: 300,
  y: 40,
  width: 80,
  height: 40,
  label: 'Hello',
})

// Render target node.
const target = graph.addNode({
  x: 420,
  y: 180,
  width: 80,
  height: 40,
  label: 'World',
})

// Render edge from source to target.
graph.addEdge({
  source,
  target,
})
```

<img src="https://gw.alipayobjects.com/mdn/rms_43231b/afts/img/A*o4W3RLZicagAAAAAAAAAAAAAARQnAQ" alt="HelloWorld" />

## 文档

- [简介](https://x6.antv.vision/zh/docs/tutorial/about)
- [快速上手](https://x6.antv.vision/zh/docs/tutorial/getting-started)
- [基础教程](https://x6.antv.vision/zh/docs/tutorial/basic/graph)
- [进阶实践](https://x6.antv.vision/zh/docs/tutorial/intermediate/serialization)
- [高级指引](https://x6.antv.vision/zh/docs/tutorial/advanced/animation)

## 基于 X6 的应用

### 流程图

[流程图](https://en.wikipedia.org/wiki/Flowchart)是表示算法、工作流或流程的一种框图表示。

- 在线示例: [https://x6.antv.vision/apps/draw](https://x6.antv.vision/apps/draw)
- 源码: [https://github.com/antvis/x6/tree/master/examples/x6-app-draw](https://github.com/antvis/x6/tree/master/examples/x6-app-draw)

<a href="https://x6.antv.vision/apps/draw" target="_blank" rel="noopener noreferrer">
  <img src="https://gw.alipayobjects.com/mdn/rms_43231b/afts/img/A*vFqjSZ-dXKkAAAAAAAAAAAAAARQnAQ" alt="draw" />
</a>

### DAG 图

DAG是[有向无环图](https://en.wikipedia.org/wiki/Directed_acyclic_graph)的缩写，它是一个[有向](https://en.wikipedia.org/wiki/Directed_graph)，没有[环](https://en.wikipedia.org/wiki/Cycle_graph#Directed_cycle_graph)的图形。它最初是计算机领域中一种常见的数据结构。由于其独特的拓扑结构所带来的优良特性，常被用于处理动态规划、导航中寻找最短路径、数据压缩等算法。

- 在线示例: [https://x6.antv.vision/apps/dag](https://x6.antv.vision/apps/dag)
- 源码: [https://github.com/antvis/x6/tree/master/examples/x6-app-dag](https://github.com/antvis/x6/tree/master/examples/x6-app-dag)

<a href="https://x6.antv.vision/apps/dag" target="_blank" rel="noopener noreferrer">
  <img src="https://gw.alipayobjects.com/mdn/rms_43231b/afts/img/A*pJmUSoDLVWEAAAAAAAAAAAAAARQnAQ" alt="dag" />
</a>

### ERD 图

实体关系图 (ERD) 显示了存储在数据库中的实体集之间的关系。实体集是类似实体的集合，这些实体可以定义其属性，通过定义实体、它们的属性并显示它们之间的关系。ER 图经常用来说明了数据库的逻辑结构。

- 在线示例: [https://x6.antv.vision/apps/er](https://x6.antv.vision/apps/er)
- 源码: [https://github.com/antvis/x6/tree/master/examples/x6-app-er](https://github.com/antvis/x6/tree/master/examples/x6-app-er)

<a href="https://x6.antv.vision/apps/er" target="_blank" rel="noopener noreferrer">
  <img src="https://gw.alipayobjects.com/mdn/rms_43231b/afts/img/A*pwvaToTpiEwAAAAAAAAAAAAAARQnAQ" alt="er" />
</a>

## 社区

欢迎加入**X6交流小组**(扫描二维码加入)，欢迎给我们提 github [issues](https://github.com/antvis/x6/issues)。

<a href="https://qr.dingtalk.com/action/joingroup?code=v1,k1,rOHuvgq5s0EHDktyyQJffDE3ZAmHnbB2e6iwn/w4BKs=&_dt_no_comment=1&origin=11" target="_blank" rel="noopener noreferrer">
  <img src="https://gw.alipayobjects.com/mdn/rms_43231b/afts/img/A*tFvBSaPCiHsAAAAAAAAAAAAAARQnAQ" alt="X6 图可视化交流群" width="375" />
</a>

## 开发

```shell
# install yarn and lerna
$ npm install yarn -g
$ npm install lerna -g

# install deps and build
$ yarn bootstrap

# run tests
$ yarn test

# build
$ yarn build
```

## 贡献

在获得帮助之前，务必首先查看相关 [issues](https://github.com/antvis/x6/issues)。

要成为贡献者，请遵循我们的[贡献指南](/CONTRIBUTING.md)。

<a href="https://github.com/antvis/x6/graphs/contributors">
  <img src="/CONTRIBUTORS.svg" alt="Contributors" width="740" />
</a>

## 开源协议

该项目下的代码和文档是在 [MIT License](/LICENSE) 下发布。
