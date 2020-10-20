<h1 align="center">X6 - JavaScript diagramming library that uses SVG and HTML for rendering.</h1>

[![MIT License](https://img.shields.io/badge/license-MIT_License-green.svg?style=flat-square)](https://github.com/antvis/x6/blob/master/LICENSE)
[![Language](https://img.shields.io/badge/language-TypeScript-blue.svg?style=flat-square)](https://www.typescriptlang.org)
[![PRs Welcome](https://img.shields.io/badge/PRs-Welcome-brightgreen.svg?style=flat-square)](https://github.com/antvis/x6/pulls)
[![website](https://img.shields.io/static/v1?label=&labelColor=505050&message=website&color=0076D6&style=flat-square&logo=google-chrome&logoColor=0076D6)](https://x6.antv.vision)
[![build](https://img.shields.io/travis/antvis/x6.svg?style=flat-square)](https://travis-ci.org/antvis/x6)
[![coverage](https://img.shields.io/coveralls/antvis/x6/master.svg?style=flat-square)](https://coveralls.io/github/antvis/x6)
[![Language grade: JavaScript](https://img.shields.io/lgtm/grade/javascript/g/antvis/x6.svg?logo=lgtm&style=flat-square)](https://lgtm.com/projects/g/antvis/x6/context:javascript)

[![NPM Package](https://img.shields.io/npm/v/@antv/x6.svg?style=flat-square)](https://www.npmjs.com/package/@antv/x6)
[![NPM Downloads](http://img.shields.io/npm/dm/@antv/x6.svg?style=flat-square)](https://www.npmjs.com/package/@antv/x6)
[![NPM Dependencies](https://img.shields.io/david/antvis/x6?style=flat-square)](https://david-dm.org/antvis/x6)
[![Dependency Status](https://david-dm.org/antvis/x6.svg?style=flat-square&path=packages/x6)](https://david-dm.org/antvis/x6?path=packages/x6)
[![devDependencies Status](https://david-dm.org/antvis/x6/dev-status.svg?style=flat-square&path=packages/x6)](https://david-dm.org/antvis/x6?type=dev&path=packages/x6)

## Features

- 🌱　easy-to-customize: based on well known SVG/HTML/CSS or React to custom nodes and edges
- 🚀　out-of-the-box: built-in 10+ plugins of diagram, such as selection, dnd, redo/undo, snapline, minimap, etc.
- 🧲　data-driven: base on MVC architecture, you can focus more on data logic and business logic
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
})

// Render source node.
const source = graph.addNode({
  x: 60,
  y: 60,
  width: 80,
  height: 40,
  label: 'Hello',
})

// Render target node.
const target = graph.addNode({
  x: 240,
  y: 240,
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

## Documentation

- [About](https://x6.antv.vision/zh/docs/tutorial/about)
- [Getting started](https://x6.antv.vision/zh/docs/tutorial/getting-started)
- [Basic usage](https://x6.antv.vision/zh/docs/tutorial/basic/graph)
- [Advanced practice](https://x6.antv.vision/zh/docs/tutorial/intermediate/serialization)
- [Senior guidance](https://x6.antv.vision/zh/docs/tutorial/advanced/animation)

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

## Experience Improvement Program Description

In order to serve the users better, x6 will send the URL and version information back to the AntV server:

https://kcart.alipay.com/web/bi.do

Except for URL and x6 version information, no other information will be collected. You can also turn it off with the following code:

```ts
import { Config } from '@antv/x6'

Config.track(false)
```

## Contributing

Please let us know how can we help. Do check out [issues](https://github.com/antvis/x6/issues) for bug reports or suggestions first.

To become a contributor, please follow our [contributing guide](https://github.com/antvis/x6/blob/master/CONTRIBUTING.md).
