# x6

> JavaScript diagramming library

[![MIT License](https://img.shields.io/badge/license-MIT_License-green.svg?style=flat-square)](https://github.com/antvis/x6/blob/master/LICENSE)
[![Language](https://img.shields.io/badge/language-typescript-blue.svg?style=flat-square)](https://www.typescriptlang.org)

[![build:?](https://img.shields.io/travis/antvis/x6.svg?style=flat-square)](https://travis-ci.org/antvis/x6)
[![coverage:?](https://img.shields.io/coveralls/antvis/x6/master.svg?style=flat-square)](https://coveralls.io/github/antvis/x6)
[![Language grade: JavaScript](https://img.shields.io/lgtm/grade/javascript/g/antvis/x6.svg?logo=lgtm&style=flat-square)](https://lgtm.com/projects/g/antvis/x6/context:javascript)

[![NPM Package](https://img.shields.io/npm/v/@antv/x6.svg?style=flat-square)](https://www.npmjs.com/package/@antv/x6)
[![NPM Downloads](http://img.shields.io/npm/dm/@antv/x6.svg?style=flat-square)](https://www.npmjs.com/package/@antv/x6)
[![NPM Dependencies](https://img.shields.io/david/antvis/x6?path=packages%2Fx6&style=flat-square)](https://www.npmjs.com/package/@antv/x6)

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
import { x6 } from '@antv/x6'

const container = document.getElementById('container')
const graph = x6.render(container, {
  nodes: [
    {
      id: 'node-0',
      x: 60,
      y: 60,
      width: 80,
      height: 30,
      label: 'Hello',
    },
    {
      id: 'node-1',
      x: 240,
      y: 240,
      width: 80,
      height: 30,
      label: 'World',
    },
  ],
  edges: [
    {
      id: 'edge-0',
      source: 'node-0',
      target: 'node-1',
      label: 'Edge Label',
    },
  ],
})
```

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
x6.track(false)
```

## Contributing

Please let us know how can we help. Do check out [issues](https://github.com/antvis/x6/issues) for bug reports or suggestions first.

To become a contributor, please follow our [contributing guide](https://github.com/antvis/x6/blob/master/CONTRIBUTING.md)
