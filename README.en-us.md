[简体中文](/README.md) | English

<p align="center"><img src="/flow.svg"></p>

<p align="center"><strong>Graph Editing Engine Of AntV</strong></p>
<p align="center"><strong>JavaScript diagramming library that uses SVG and HTML for rendering</strong></p>

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
<a href="https://x6.antv.antgroup.com/"><img alt="website" src="https://img.shields.io/static/v1?label=&labelColor=505050&message=website&color=0076D6&style=flat-square&logo=google-chrome&logoColor=0076D6"></a>
</p>

## Features

- 🌱　Easy-to-customize: based on well known SVG/HTML/CSS or React/Vue/Angular to custom nodes and edges
- 🚀　Out-of-the-box: built-in 10+ plugins, such as selection, dnd, redo/undo, snapline, minimap, etc.
- 🧲　Data-driven: base on MVC architecture, you can focus on data logic and business logic
- 💯　Highly-event-driven: you can react on any event that happens inside the graph

## Environment Support

- Modern browsers and Internet Explorer 11 (with polyfills)
- Server-side Rendering

| [<img src="https://raw.githubusercontent.com/alrra/browser-logos/master/src/edge/edge_48x48.png" alt="IE / Edge" width="24px" height="24px" />](http://godban.github.io/browsers-support-badges/)<br>IE / Edge | [<img src="https://raw.githubusercontent.com/alrra/browser-logos/master/src/firefox/firefox_48x48.png" alt="Firefox" width="24px" height="24px" />](http://godban.github.io/browsers-support-badges/)<br>Firefox | [<img src="https://raw.githubusercontent.com/alrra/browser-logos/master/src/chrome/chrome_48x48.png" alt="Chrome" width="24px" height="24px" />](http://godban.github.io/browsers-support-badges/)<br>Chrome | [<img src="https://raw.githubusercontent.com/alrra/browser-logos/master/src/safari/safari_48x48.png" alt="Safari" width="24px" height="24px" />](http://godban.github.io/browsers-support-badges/)<br>Safari |
|----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| IE11, Edge                                                                                                                                                                                                     | last 2 versions                                                                                                                                                                                                  | last 2 versions                                                                                                                                                                                              | last 2 versions                                                                                                                                                                                              |

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

const graph = new Graph({
  container: document.getElementById('container'),
  grid: true
})

const source = graph.addNode({
  x: 300,
  y: 40,
  width: 80,
  height: 40,
  label: 'Hello',
})

const target = graph.addNode({
  x: 420,
  y: 180,
  width: 80,
  height: 40,
  label: 'World',
})

graph.addEdge({
  source,
  target,
})
```

## Links

- [Documents](https://x6.antv.antgroup.com/tutorial/about)
- [Samples](https://x6.antv.antgroup.com/examples)
- [Blog](https://www.yuque.com/antv/x6/gcinvi)
- [Versioning Release Note](https://www.yuque.com/antv/x6/bbfu6r)
- [FAQ](https://www.yuque.com/antv/x6/be9pfx)
- [CodeSanbox Template](https://codesandbox.io/s/qosj0?file=/src/app.tsx)

## Development

```shell
# install deps and build
$ pnpm install

# enter the specified project development and debugging
cd packages/x6
pnpm run build:watch

# start example to see the effect
cd examples/x6-example-features
pnpm run start
```

## Contributing

To become a contributor, please follow our [contributing guide](/CONTRIBUTING.md). If you are an active contributor, you can apply to be a outside collaborator.

<a href="https://github.com/antvis/x6/graphs/contributors">
  <img src="/CONTRIBUTORS.svg" alt="Contributors" width="740" />
</a>

## License

The scripts and documentation in this project are released under the [MIT License](/LICENSE).
