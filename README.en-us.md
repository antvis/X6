<img src="https://gw.alipayobjects.com/zos/antfincdn/R8sN%24GNdh6/language.svg" width="18"> [中文](./README.md) | English

<h1 align="center">
  <b>X6: Graph Editing and Visualization Engine</b>
</h1>

<p align="center"><img alt="x6 flow" src="./flow.svg"></p>

<p align="center">
  <a href="https://www.npmjs.com/package/@antv/x6"><img alt="NPM Package" src="https://img.shields.io/npm/v/@antv/x6.svg?logo=npm&style=for-the-badge"></a>
  <a href="https://github.com/antvis/X6/actions/workflows/build.yml"><img alt="build" src="https://img.shields.io/github/actions/workflow/status/antvis/x6/build.yml?branch=master&style=for-the-badge&logo=github"></a>
  <a href="https://app.codecov.io/gh/antvis/X6"><img alt="coverage" src="https://img.shields.io/codecov/c/gh/antvis/x6?logo=codecov&style=for-the-badge&token=15CO54WYUV"></a>
  <img alt="Package size" src="https://img.badgesize.io/https://unpkg.com/@antv/x6?compression=gzip&style=for-the-badge" />
  <a href="https://www.npmjs.com/package/@antv/x6"><img alt="NPM Downloads" src="https://img.shields.io/npm/dm/@antv/x6?logo=npm&style=for-the-badge"></a>
  <img src="https://img.shields.io/github/license/antvis/x6?style=for-the-badge" alt="MIT License">
  <a href="https://www.typescriptlang.org"><img alt="Language" src="https://img.shields.io/badge/language-TypeScript-blue.svg?style=for-the-badge"></a>
  <a href="https://github.com/antvis/x6/pulls"><img alt="PRs Welcome" src="https://img.shields.io/badge/PRs-Welcome-brightgreen.svg?style=for-the-badge"></a>
  <a href="https://x6.antv.antgroup.com"><img alt="website" src="https://img.shields.io/static/v1?label=&labelColor=505050&message=website&color=0076D6&style=for-the-badge&logo=google-chrome&logoColor=f5f5f5"></a>
</p>

<p align="center">
  <a href="http://x6.antv.antgroup.com/tutorial/about">Official Documentation</a> •
  <a href="https://x6.antv.antgroup.com/tutorial/getting-started">Quick Start</a> •
  <a href="http://x6.antv.antgroup.com/examples">Graph Examples</a> •
  <a href="https://www.yuque.com/antv/x6/tox1ukbz5cw57qfy">FAQ</a> •
  <a href="https://codesandbox.io/s/mo-ban-55i8dp">Demo Template</a> •
  <a href="https://github.com/lloydzhou/awesome-x6">Awesome X6</a>
</p>

AntV `X6` is a graph editing engine based on HTML and SVG, providing low-cost customization capabilities and out-of-the-box built-in extensions that make it easy to quickly build applications such as DAG diagrams, ER diagrams, flowcharts, lineage graphs, and more. We hope developers can use X6 to rapidly build various graph editing applications they need, making process relationship data controllable, interactive, and visualized.

## ✨ Features

As a professional graph editing and visualization engine, X6 has the following features:

- 🌱 _Highly Customizable_: Supports customizing node styles and interactions using SVG / HTML / React / Vue / Angular, with a comprehensive `event system` that allows listening to any events occurring within the chart.
- 🚀 _Out-of-the-Box_: Built-in `10+` graph editing extensions, such as lasso selection, alignment lines, minimap, etc.
- 🧲 _Data-Driven_: Based on the `MVC` architecture, allowing users to focus more on data logic and business logic.
- 💯 _Server-Side Rendering_: Supports server-side rendering with good browser compatibility.

## 🔨 Getting Started

You can install via package managers like NPM or Yarn.

```bash
# npm
$ npm install @antv/x6 --save

# yarn
$ yarn add @antv/x6
```

After successful installation, you can import the `Graph` object using import.

```html
<div id="container" style="width: 600px; height: 400px"></div>
```

```ts
import { Graph } from '@antv/x6'

const graph = new Graph({
  container: document.getElementById('container'),
  grid: true,
})

const source = graph.addNode({
  x: 300,
  y: 40,
  width: 80,
  height: 40,
  label: 'Hello',
});

const target = graph.addNode({
  x: 420,
  y: 180,
  width: 80,
  height: 40,
  label: 'World',
});

graph.addEdge({
  source,
  target,
});
```

If everything goes smoothly, you will get a simple flowchart canvas as shown below.

<img src="https://mdn.alipayobjects.com/huamei_qa8qxu/afts/img/A*3rpsRLQl7dgAAAAAQyAAAAgAemJ7AQ/fmt.avif" height="300" />

## 🧑🏻‍💻 Local Development

```shell
# Install project dependencies and initialize build
$ pnpm install

# Start examples to view results
pnpm run start:examples
```

## 📮 Contribution

Thank you to everyone who has contributed to this project and all supporters! 🙏

<a href="https://openomy.app/github/antvis/X6" target="_blank" style="display: block; width: 100%;" align="center">
  <img src="https://openomy.app/svg?repo=antvis/X6&chart=bubble&latestMonth=12" target="_blank" alt="Contribution Leaderboard" style="display: block; height: 400px" />
</a>

- **Issue Feedback**: If you encounter any issues with X6 during use, feel free to submit an Issue along with minimal reproducible code.
- **Contribution Guide**: How to participate in the [development and contribution](./CONTRIBUTING.md) of X6.
- **Discussion Ideas**: Discuss on GitHub Discussion or DingTalk group.

## 📄 License

[MIT](./LICENSE).
