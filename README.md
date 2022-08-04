简体中文 | [English](/README.en-us.md)

<p align="center"><img src="/flow.svg"></p>

<p align="center"><strong>X6 是 AntV 旗下的图编辑引擎</strong></p>
<p align="center"><strong>提供简单易用的节点定制能力和开箱即用的交互组件，方便我们快速搭建流程图、DAG 图、ER 图等图应用</strong></p>
<p align="center"><a href="https://x6.antv.vision/zh/docs/tutorial/about">教程</a> • <a href="https://x6.antv.vision/zh/examples/gallery">示例</a> • <a href="https://x6.antv.vision/zh/docs/api/graph">API</a></p>

<p align="center">
<a href="https://github.com/antvis/X6/actions/workflows/ci.yml"><img alt="build" src="https://img.shields.io/github/workflow/status/antvis/x6/%F0%9F%91%B7%E3%80%80CI/master?logo=github&style=flat-square"></a>
<a href="https://app.codecov.io/gh/antvis/X6"><img alt="coverage" src="https://img.shields.io/codecov/c/gh/antvis/x6?logo=codecov&style=flat-square&token=15CO54WYUV"></a>
<a href="https://lgtm.com/projects/g/antvis/x6/context:javascript"><img alt="Language grade: JavaScript" src="https://img.shields.io/lgtm/grade/javascript/g/antvis/x6.svg?logo=lgtm&style=flat-square"></a>
<a href="https://www.npmjs.com/package/@antv/x6"><img alt="NPM Package" src="https://img.shields.io/npm/v/@antv/x6.svg?style=flat-square"></a>
<a href="https://www.npmjs.com/package/@antv/x6"><img alt="NPM Downloads" src="https://img.shields.io/npm/dm/@antv/x6?logo=npm&style=flat-square"></a>
</p>

<p align="center">
<a href="/LICENSE"><img src="https://img.shields.io/github/license/antvis/x6?style=flat-square" alt="MIT License"></a>
<a href="https://www.typescriptlang.org"><img alt="Language" src="https://img.shields.io/badge/language-TypeScript-blue.svg?style=flat-square"></a>
<a href="https://github.com/antvis/x6/pulls"><img alt="PRs Welcome" src="https://img.shields.io/badge/PRs-Welcome-brightgreen.svg?style=flat-square"></a>
<a href="https://x6.antv.vision"><img alt="website" src="https://img.shields.io/static/v1?label=&labelColor=505050&message=website&color=0076D6&style=flat-square&logo=google-chrome&logoColor=0076D6"></a>
</p>


## 特性

- 🌱　极易定制：支持使用 SVG/HTML/React/Vue 定制节点样式和交互
- 🚀　开箱即用：内置 10+ 图编辑配套扩展，如框选、对齐线、小地图等
- 🧲　数据驱动：基于 MVC 架构，用户更加专注于数据逻辑和业务逻辑
- 💯　事件驱动：完备的事件系统，可以监听图表内发生的任何事件

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
// 从 CDN 引入时，我们暴露了 X6 这个全局变量
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

<center>
  <a href="https://x6.antv.vision/zh/examples/showcase/practices#flowchart" target="_blank" rel="noopener noreferrer">
    <img width="400" height="250" style="margin-bottom: 20px" src="https://gw.alipayobjects.com/mdn/rms_43231b/afts/img/A*JSr-RbwCgmcAAAAAAAAAAAAAARQnAQ" alt="Flow"/>
  </a>
  <a href="https://x6.antv.vision/zh/examples/showcase/practices#dag" target="_blank" rel="noopener noreferrer">
    <img width="400" height="250" style="margin-bottom: 20px" src="https://gw.alipayobjects.com/mdn/rms_43231b/afts/img/A*RPiGRaSus3UAAAAAAAAAAAAAARQnAQ" alt="Dag"/>
  </a>
  <a href="https://x6.antv.vision/zh/examples/showcase/practices#mindmap" target="_blank" rel="noopener noreferrer">
    <img width="400" height="200" style="margin-bottom: 20px" src="https://gw.alipayobjects.com/mdn/rms_43231b/afts/img/A*GsEGSaBkc84AAAAAAAAAAAAAARQnAQ" alt="MindMap"/>
  </a>
  <a href="https://x6.antv.vision/zh/examples/showcase/practices#bpmn" target="_blank" rel="noopener noreferrer">
    <img width="400" height="200" style="margin-bottom: 20px" src="https://gw.alipayobjects.com/mdn/rms_43231b/afts/img/A*aPSySa8oz4sAAAAAAAAAAAAAARQnAQ" alt="BPMN"/>
  </a>
  <a href="https://x6.antv.vision/zh/examples/showcase/practices#class" target="_blank" rel="noopener noreferrer">
    <img width="400" height="250" style="margin-bottom: 20px" src="https://gw.alipayobjects.com/mdn/rms_43231b/afts/img/A*OaCpR7t_mVoAAAAAAAAAAAAAARQnAQ" alt="Class"/>
  </a>
  <a href="https://x6.antv.vision/zh/examples/showcase/practices#org" target="_blank" rel="noopener noreferrer">
    <img width="400" height="250" style="margin-bottom: 20px" src="https://gw.alipayobjects.com/mdn/rms_43231b/afts/img/A*FWx5SYDzLw4AAAAAAAAAAAAAARQnAQ" alt="ORG"/>
  </a>
  <a href="https://x6.antv.vision/zh/examples/showcase/practices#er" target="_blank" rel="noopener noreferrer">
    <img width="400" height="250" style="margin-bottom: 20px" src="https://gw.alipayobjects.com/mdn/rms_43231b/afts/img/A*7yVJQoM6-9AAAAAAAAAAAAAAARQnAQ" alt="ER"/>
  </a>
  <a href="https://x6.antv.vision/zh/examples/showcase/practices#swimlane" target="_blank" rel="noopener noreferrer">
    <img width="400" height="250" style="margin-bottom: 20px" src="https://gw.alipayobjects.com/mdn/rms_43231b/afts/img/A*mUVrSJMkP1UAAAAAAAAAAAAAARQnAQ" alt="SwimLane"/>
  </a>
  <a href="https://x6.antv.vision/zh/examples/showcase/practices#tree" target="_blank" rel="noopener noreferrer">
    <img width="400" height="250" style="margin-bottom: 20px" src="https://gw.alipayobjects.com/mdn/rms_43231b/afts/img/A*XDnNRqnj4WkAAAAAAAAAAAAAARQnAQ" alt="Tree"/>
  </a>
  <a href="https://x6.antv.vision/zh/examples/showcase/practices#elk" target="_blank" rel="noopener noreferrer">
    <img width="400" height="250" style="margin-bottom: 20px" src="https://gw.alipayobjects.com/mdn/rms_43231b/afts/img/A*Z3ebTKy0w9cAAAAAAAAAAAAAARQnAQ" alt="ELK"/>
  </a>
</center>

## 如何交流

如果你在使用的过程中碰到问题，可以先通过 [issues](https://github.com/antvis/x6/issues) 看看有没有类似的 bug 或者建议。欢迎提 [issues](https://github.com/antvis/x6/issues/new) 交流，也可以使用[钉钉](https://m.dingtalk.com/)扫描下面二维码加入**X6 交流群**。

需要注意的是，提问题时请配上 [CodeSandbox](https://codesandbox.io/s/pensive-sound-f4nhc) 的复现代码，方便快速定位和解决问题。

<a href="https://qr.dingtalk.com/action/joingroup?code=v1,k1,rOHuvgq5s0EHDktyyQJffDE3ZAmHnbB2e6iwn/w4BKs=&_dt_no_comment=1&origin=11" target="_blank" rel="noopener noreferrer">
  <img src="https://gw.alipayobjects.com/mdn/rms_43231b/afts/img/A*Up-4S4v8H-0AAAAAAAAAAAAAARQnAQ" alt="X6 图可视化交流群1" width="260" />
  <img src="https://gw.alipayobjects.com/mdn/rms_43231b/afts/img/A*4Y_5S7i26LAAAAAAAAAAAAAAARQnAQ" alt="X6 图可视化交流群2" width="260" />
  <img src="https://gw.alipayobjects.com/mdn/rms_43231b/afts/img/A*KHB4QJAsW4QAAAAAAAAAAAAAARQnAQ" alt="X6 图可视化交流群3" width="260" />
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
