---
title: "Quickstart"
description: "Quickstart"
language: "en"
canonical: "https://x6.antv.antgroup.com/en/tutorial/getting-started/"
version: "3.x"
---

[Resource index](/llms.txt)

## Installation

X6 is published on npm as @antv/x6.

```shell
# npm
$ npm install @antv/x6 --save

# yarn
$ yarn add @antv/x6

# pnpm
$ pnpm add @antv/x6
```

If using the UMD package, you can use any of the following CDN URLs.

- [https://unpkg.com/@antv/x6/dist/index.js](https://unpkg.com/@antv/x6/dist/index.js)
- [https://cdn.jsdelivr.net/npm/@antv/x6/dist/index.js](https://cdn.jsdelivr.net/npm/@antv/x6/dist/index.js)
- [https://cdnjs.cloudflare.com/ajax/libs/antv-x6/2.0.0/index.js](https://cdnjs.cloudflare.com/ajax/libs/antv-x6/2.0.0/index.js)

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



```ts
import './index.less'
import { createRoot } from 'react-dom/client'
import React from 'react'
import { Graph } from '@antv/x6'

const data = {
  nodes: [
    {
      id: 'node1',
      shape: 'rect',
      x: 40,
      y: 40,
      width: 100,
      height: 40,
      label: 'hello',
      attrs: {
        // body 是选择器名称，选中的是 rect 元素
        body: {
          stroke: '#8f8f8f',
          strokeWidth: 1,
          fill: '#fff',
          rx: 6,
          ry: 6,
        },
      },
    },
    {
      id: 'node2',
      shape: 'rect',
      x: 160,
      y: 180,
      width: 100,
      height: 40,
      label: 'world',
      attrs: {
        body: {
          stroke: '#8f8f8f',
          strokeWidth: 1,
          fill: '#fff',
          rx: 6,
          ry: 6,
        },
      },
    },
  ],
  edges: [
    {
      shape: 'edge',
      source: 'node1',
      target: 'node2',
      label: 'x6',
      attrs: {
        // line 是选择器名称，选中的边的 path 元素
        line: {
          stroke: '#8f8f8f',
          strokeWidth: 1,
        },
      },
    },
  ],
}

export default class Example extends React.Component {
  private container: HTMLDivElement

  componentDidMount() {
    const graph = new Graph({
      container: this.container,
      // 设置画布背景颜色
      background: {
        color: '#F2F7FA',
      },
    })

    graph.fromJSON(data) // 渲染元素
    graph.centerContent() // 居中显示
  }

  refContainer = (container: HTMLDivElement) => {
    this.container = container
  }

  render() {
    return (
      <div className="helloworld-app">
        <div className="app-content" ref={this.refContainer} />
      </div>
    )
  }
}

const root = createRoot(document.getElementById('container')!)
root.render(<Example />)
window.addEventListener('pagehide', () => root.unmount(), { once: true })
```



### 3. Using the React Node

X6 supports using `SVG` and `HTML` to render node content. On this basis, we can also use `React` and `Vue` components to render nodes, which will be very convenient in the development process.

For example, we have a new requirement: add a right-click menu to the node. It would be more complicated to implement using `SVG`, We can easily implement it with a React node. You can use the React render package `@antv/x6-react-shape` provided by the X6 ecosystem.



```ts
import './index.less'
import { createRoot } from 'react-dom/client'
import React from 'react'
import { Graph, Node } from '@antv/x6'
import { register } from '@antv/x6-react-shape'
import { Dropdown } from 'antd'

const CustomComponent = ({ node }: { node: Node }) => {
  const label = node.prop('label')
  return (
    <Dropdown
      menu={{
        items: [
          {
            key: 'copy',
            label: '复制',
          },
          {
            key: 'paste',
            label: '粘贴',
          },
          {
            key: 'delete',
            label: '删除',
          },
        ],
      }}
      trigger={['contextMenu']}
    >
      <div className="custom-react-node">{label}</div>
    </Dropdown>
  )
}

register({
  shape: 'custom-react-node',
  width: 100,
  height: 40,
  component: CustomComponent,
})

const data = {
  nodes: [
    {
      id: 'node1',
      shape: 'custom-react-node',
      x: 40,
      y: 40,
      label: 'hello',
    },
    {
      id: 'node2',
      shape: 'custom-react-node',
      x: 160,
      y: 180,
      label: 'world',
    },
  ],
  edges: [
    {
      shape: 'edge',
      source: 'node1',
      target: 'node2',
      label: 'x6',
      attrs: {
        line: {
          stroke: '#8f8f8f',
          strokeWidth: 1,
        },
      },
    },
  ],
}

export default class Example extends React.Component {
  private container: HTMLDivElement

  componentDidMount() {
    const graph = new Graph({
      container: this.container,
      background: {
        color: '#F2F7FA',
      },
    })

    graph.fromJSON(data)
    graph.centerContent()
  }

  refContainer = (container: HTMLDivElement) => {
    this.container = container
  }

  render() {
    return (
      <div className="react-shape-app">
        <div className="app-content" ref={this.refContainer} />
      </div>
    )
  }
}

const root = createRoot(document.getElementById('container')!)
root.render(<Example />)
window.addEventListener('pagehide', () => root.unmount(), { once: true })
```



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



```ts
import './index.less'
import { createRoot } from 'react-dom/client'
import React from 'react'
import { Graph, Node, Snapline } from '@antv/x6'
import { register } from '@antv/x6-react-shape'
import { Dropdown } from 'antd'

const CustomComponent = ({ node }: { node: Node }) => {
  const label = node.prop('label')
  return (
    <Dropdown
      menu={{
        items: [
          {
            key: 'copy',
            label: '复制',
          },
          {
            key: 'paste',
            label: '粘贴',
          },
          {
            key: 'delete',
            label: '删除',
          },
        ],
      }}
      trigger={['contextMenu']}
    >
      <div className="custom-react-node">{label}</div>
    </Dropdown>
  )
}

register({
  shape: 'custom-react-node',
  width: 100,
  height: 40,
  component: CustomComponent,
})

const data = {
  nodes: [
    {
      id: 'node1',
      shape: 'custom-react-node',
      x: 40,
      y: 40,
      label: 'hello',
    },
    {
      id: 'node2',
      shape: 'custom-react-node',
      x: 160,
      y: 180,
      label: 'world',
    },
  ],
  edges: [
    {
      shape: 'edge',
      source: 'node1',
      target: 'node2',
      label: 'x6',
      attrs: {
        line: {
          stroke: '#8f8f8f',
          strokeWidth: 1,
        },
      },
    },
  ],
}

export default class Example extends React.Component {
  private container: HTMLDivElement

  componentDidMount() {
    const graph = new Graph({
      container: this.container,
      background: {
        color: '#F2F7FA',
      },
    })

    graph.use(
      new Snapline({
        enabled: true,
      }),
    )
    graph.fromJSON(data)
    graph.centerContent()
  }

  refContainer = (container: HTMLDivElement) => {
    this.container = container
  }

  render() {
    return (
      <div className="use-plugin-app">
        <div className="app-content" ref={this.refContainer} />
      </div>
    )
  }
}

const root = createRoot(document.getElementById('container')!)
root.render(<Example />)
window.addEventListener('pagehide', () => root.unmount(), { once: true })
```



### 5. Export the Data

In addition to using `fromJSON` to render JSON data to the graph, of course, there is also support for exporting the data from the graph with `toJSON`, so that we can serialize the graph data and store it to the server.

```ts
graph.toJSON()
```

That's the end of our demo. If you want to continue learning about some capabilities of X6, you can start reading from the [Basic Tutorial](/en/tutorial/basic/graph).
### docs/demos/tutorial/getting-started/helloworld/index.less

```less
.helloworld-app {
  display: flex;
  width: 100%;
  border: 1px solid #f0f0f0;
  padding: 16px 8px;
  font-family: sans-serif;

  .app-content {
    flex: 1;
    height: 280px;
    margin-right: 8px;
    margin-left: 8px;
    border-radius: 5px;
    box-shadow: 0 12px 5px -10px rgb(0 0 0 / 10%), 0 0 4px 0 rgb(0 0 0 / 10%);
  }
}
```
### docs/demos/tutorial/getting-started/react-shape/index.less

```less
.react-shape-app {
  display: flex;
  width: 100%;
  border: 1px solid #f0f0f0;
  padding: 16px 8px;
  font-family: sans-serif;

  .app-content {
    flex: 1;
    height: 280px;
    margin-right: 8px;
    margin-left: 8px;
    border-radius: 5px;
    box-shadow: 0 12px 5px -10px rgb(0 0 0 / 10%), 0 0 4px 0 rgb(0 0 0 / 10%);
  }

  .custom-react-node {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 100%;
    height: 100%;
    background-color: #fff;
    border: 1px solid #8f8f8f;
    border-radius: 6px;
  }

  .custom-react-node span {
    display: inline-block;
    width: 100%;
    height: 100%;
  }
}
```
### docs/demos/tutorial/getting-started/use-plugin/index.less

```less
.use-plugin-app {
  display: flex;
  width: 100%;
  border: 1px solid #f0f0f0;
  padding: 16px 8px;
  font-family: sans-serif;

  .app-content {
    flex: 1;
    height: 280px;
    margin-right: 8px;
    margin-left: 8px;
    border-radius: 5px;
    box-shadow: 0 12px 5px -10px rgb(0 0 0 / 10%), 0 0 4px 0 rgb(0 0 0 / 10%);
  }

  .custom-react-node {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 100%;
    height: 100%;
    background-color: #fff;
    border: 1px solid #8f8f8f;
    border-radius: 6px;
  }
}
```
