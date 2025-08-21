---
title: Quickstart
order: 1
redirect_from:
  - /en/docs
  - /en/docs/tutorial
---

## Installation

X6 is published on npm as @antv/x6.

```shell
# npm
$ npm install @antv/x6 --save

# yarn
$ yarn add @antv/x6
```

If using the umd package, you can use any of the following CDN.

- https://unpkg.com/@antv/x6/dist/index.js
- https://cdn.jsdelivr.net/npm/@antv/x6/dist/index.js
- https://cdnjs.cloudflare.com/ajax/libs/antv-x6/2.0.0/index.js

## Basic Usage

It's recommended to learn [SVG Basics](https://codepen.io/HunorMarton/full/PoGbgqj) before you begin, and with some basic SVG knowledge in mind, let's start with a simple example to play with X6.

### 1. Init Graph

Creating a graph container on the page and then initializing the graph object, then you can set the graph style through configuration, such as the background color.

```html
<div id="container"></div>
```

```ts
import { Graph } from '@antv/x6'

const graph = new Graph({
  container: document.getElementById('container'),
  width: 800,
  height: 600,
  background: {
    color: '#F2F7FA',
  },
})
```

### 2. Render nodes and edges

X6 supports json data, you can also use the `attrs` attribute to customize the styles of nodes and edges (like `CSS`).

<code id="helloworld" src="@/src/tutorial/getting-started/helloworld/index.tsx"></code>

### 3. Using the React Node

X6 supports using `SVG` and `HTML` to render node content. On this basis, we can also use `React` and `Vue` components to render nodes, which will be very convenient in the development process.

For example, we have a new requirement: add a right-click menu to the node. It would be more complicated to implement using `SVG`, We can easily implement it with react node. We can use the React render package `@antv/x6-react-shape` that comes with X6.

<code id="react-shape" src="@/src/tutorial/getting-started/react-shape/index.tsx"></code>

### 4. Using the Plugins

In addition to the basic element rendering capabilities, X6 also comes with a large number of built-in plugins for graph editing. Using these mature plugins, we can improve the development efficiency. For example, we add a snapline plugin to the graph, when a moving node is aligned with other nodes, the snapline will automatically appear.

```ts
import { Snapline } from '@antv/x6'

graph.use(
  new Snapline({
    enabled: true,
  }),
)
```

<code id="use-plugin" src="@/src/tutorial/getting-started/use-plugin/index.tsx"></code>

### 5. Export the Data

In addition to using `fromJSON` to render JSON data to the graph, of course, there is also support for exporting the data from the graph width `toJSON`, so that we can serialize the graph data and store it to the server.

```ts
graph.toJSON()
```

That's the end of our demo. If you want to continue learning about some capabilities of X6, you can start reading from the [Basic Tutorial](/en/tutorial/basic/graph).
