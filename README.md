<h1 align="center">X6</h1>

<p align="center"><strong>JavaScript diagramming library that uses SVG and HTML for rendering.</strong></p>

<p align="center">
<a href="https://github.com/antvis/x6/blob/master/LICENSE"><img src="https://img.shields.io/badge/license-MIT_License-green.svg?style=flat-square" alt="MIT License"></a>
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

## Features

- 🌱　easy-to-customize: based on well known SVG/HTML/CSS or React to custom nodes and edges
- 🚀　out-of-the-box: built-in 10+ plugins, such as selection, dnd, redo/undo, snapline, minimap, etc.
- 🧲　data-driven: base on MVC architecture, you can focus on data logic and business logic
- 💯　highly-event-driven: you can react on any event that happens inside the graph

## Installation

```shell
# npm
$ npm install @antv/x6 --save

# yarn
$ yarn add @antv/x6
```

## Usage

**Step 1**: specify a container the render the diagram.

```html
<div id="container" style="width: 600px; height: 400px"></div>
```

**Step 2**: render nodes and edges.

```ts
import { Graph } from '@antv/x6'

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

<img src="https://raw.githubusercontent.com/antvis/x6/master/sites/x6-sites/static/assets/images/helloworld.jpg" alt="HelloWorld" />

## Documentation

- [About](https://x6.antv.vision/zh/docs/tutorial/about)
- [Getting started](https://x6.antv.vision/zh/docs/tutorial/getting-started)
- [Basic usage](https://x6.antv.vision/zh/docs/tutorial/basic/graph)
- [Advanced practice](https://x6.antv.vision/zh/docs/tutorial/intermediate/serialization)
- [Senior guidance](https://x6.antv.vision/zh/docs/tutorial/advanced/animation)

## Experience Improvement Program Description

In order to serve the users better, x6 will send the URL and version information back to the AntV server:

https://kcart.alipay.com/web/bi.do

Except for URL and x6 version information, no other information will be collected. You can also turn it off with the following code:

```ts
import { Config } from '@antv/x6'

Config.track(false)
```

## Communication

Welcome to join the **X6 Communication Group** (Scan the QR Code to Join us). We also welcome the github [issues](https://github.com/antvis/x6/issues).

<a href="https://qr.dingtalk.com/action/joingroup?code=v1,k1,rOHuvgq5s0EHDktyyQJffDE3ZAmHnbB2e6iwn/w4BKs=&_dt_no_comment=1&origin=11" target="_blank" rel="noopener noreferrer">
  <img src="https://gw.alipayobjects.com/mdn/rms_43231b/afts/img/A*qKOTRJCxnzMAAAAAAAAAAAAAARQnAQ" alt="X6 图可视化交流群" width="375" />
</a>

## Development

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

## Contributing

Please let us know how can we help. Do check out [issues](https://github.com/antvis/x6/issues) for bug reports or suggestions first.

To become a contributor, please follow our [contributing guide](https://github.com/antvis/x6/blob/master/CONTRIBUTING.md).

## Contributors

<a href="https://github.com/antvis/x6/graphs/contributors">
  <img src="https://raw.githubusercontent.com/antvis/x6/master/CONTRIBUTORS.svg" alt="Contributors" width="740" />
</a>

## License

The scripts and documentation in this project are released under the [MIT License](LICENSE).
