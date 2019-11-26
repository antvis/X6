# x6

> JavaScript diagramming library

[![MIT License](https://img.shields.io/badge/license-MIT_License-green.svg?style=flat-square)](https://github.com/antvis/x6/blob/master/LICENSE)
![language](https://img.shields.io/badge/language-typescript-blue.svg?style=flat-square)

[![build:?](https://img.shields.io/travis/antvis/x6.svg?style=flat-square)](https://travis-ci.org/antvis/x6)
[![coverage:?](https://img.shields.io/coveralls/antvis/x6/master.svg?style=flat-square)](https://coveralls.io/github/antvis/x6)
[![issues:?](https://img.shields.io/github/issues/antvis/x6?style=flat-square)](https://github.com/antvis/x6/issues)

[![NPM Package](https://img.shields.io/npm/v/@antv/x6.svg?style=flat-square)](https://www.npmjs.com/package/@antv/x6)
[![NPM Downloads](http://img.shields.io/npm/dm/@antv/x6.svg?style=flat-square)](https://www.npmjs.com/package/@antv/x6)
[![NPM Dependencies](https://img.shields.io/david/antvis/x6?style=flat-square)](https://www.npmjs.com/package/@antv/x6)

## Installation

```shell
# npm
$ npm install @antv/x6 --save

# yarn
$ yarn add @antv/x6
```

## Usage

```html
<div id="container" style="width: 600px; height: 400px"></div>
```

```ts
import { Graph } from '@antv/x6'

const container = document.getElementById('container')
const graph = new Graph(container)
const node1 = graph.addNode({ data: 'Hello', x: 60, y: 60, width: 80, height: 30 })
const node2 = graph.addNode({ data: 'World', x: 240, y: 240, width: 80, height: 30 })
const edge = graph.addEdge({ data: 'x6', source: node1, target: node2 })
```

## Development

```shell
$ yarn

# build
$ yarn build

# run test
$ yarn test

# run examples
$ cd expamples
$ yarn 
$ yarn start
```

## Contributing

Pull requests and stars are highly welcome.

For bugs and feature requests, please [create an issue](https://github.com/antvis/x6/issues/new).
