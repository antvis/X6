---
title: "工具"
description: "工具"
language: "zh"
canonical: "https://x6.antv.antgroup.com/zh/tutorial/intermediate/tools/"
version: "3.x"
---

[资料索引](/llms.txt)

> **在本章节中主要介绍工具相关的知识，通过阅读，你可以了解到**

- 如何为节点或边添加工具
- X6 默认内置哪些常用工具


## 使用工具

创建节点/边时可以通过 [`tools`](/zh/api/model/cell#工具集-tools) 选项来添加工具：

```ts
graph.addNode({
  tools: [
    {
      name: 'button-remove', // 工具名称
      args: {
        // 工具参数
        x: 10,
        y: 10,
      },
    },
  ],
})

// 如果无需参数，可以简写为：
graph.addNode({
  tools: ['button-remove'],
})

graph.addEdge({
  source,
  target,
  vertices: [
    {
      x: 90,
      y: 160,
    },
    {
      x: 210,
      y: 160,
    },
  ],
  tools: ['vertices', 'segments'],
})
```



```ts
import './index.less'
import { createRoot } from 'react-dom/client'
import React from 'react'
import { Graph } from '@antv/x6'

Graph.registerNode(
  'custom-tools-node',
  {
    inherit: 'rect',
    width: 100,
    height: 40,
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
  true,
)
export default class Example extends React.Component {
  private container: HTMLDivElement

  componentDidMount() {
    const graph = new Graph({
      container: this.container,
      background: {
        color: '#F2F7FA',
      },
    })

    const source = graph.addNode({
      shape: 'custom-tools-node',
      x: 40,
      y: 40,
      label: 'Source',
      tools: ['button-remove'],
    })

    const target = graph.addNode({
      shape: 'custom-tools-node',
      x: 160,
      y: 240,
      label: 'Target',
      tools: ['button-remove'],
    })

    graph.addEdge({
      source,
      target,
      vertices: [
        { x: 90, y: 160 },
        { x: 210, y: 160 },
      ],
      tools: ['vertices', 'segments'],
      attrs: {
        line: {
          stroke: '#8f8f8f',
          strokeWidth: 1,
        },
      },
    })
  }

  refContainer = (container: HTMLDivElement) => {
    this.container = container
  }

  render() {
    return (
      <div className="tools-basic-app">
        <div className="app-content" ref={this.refContainer} />
      </div>
    )
  }
}

const root = createRoot(document.getElementById('container')!)
root.render(<Example />)
window.addEventListener('pagehide', () => root.unmount(), { once: true })
```



节点/边创建后可以调用 [hasTool(name)](/zh/api/model/cell#hastool)、[addTools(...)](/zh/api/model/cell#addtools)、[removeTools()](/zh/api/model/cell#removetools) 等方法以添加或移除工具。



```ts
import './index.less'
import { createRoot } from 'react-dom/client'
import React from 'react'
import { Graph } from '@antv/x6'

Graph.registerNode(
  'custom-tools-node',
  {
    inherit: 'rect',
    width: 100,
    height: 40,
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
  true,
)
export default class Example extends React.Component {
  private container: HTMLDivElement

  componentDidMount() {
    const graph = new Graph({
      container: this.container,
      background: {
        color: '#F2F7FA',
      },
    })

    const source = graph.addNode({
      shape: 'custom-tools-node',
      x: 40,
      y: 40,
      label: 'Source',
    })

    const target = graph.addNode({
      shape: 'custom-tools-node',
      x: 160,
      y: 240,
      label: 'Target',
    })

    graph.addEdge({
      source,
      target,
      vertices: [
        { x: 90, y: 160 },
        { x: 210, y: 160 },
      ],
      attrs: {
        line: {
          stroke: '#8f8f8f',
          strokeWidth: 1,
        },
      },
    })

    graph.on('cell:mouseenter', ({ cell }) => {
      if (cell.isNode()) {
        cell.addTools([
          {
            name: 'boundary',
            args: {
              attrs: {
                fill: '#7c68fc',
                stroke: '#333',
                'stroke-width': 1,
                'fill-opacity': 0.2,
              },
            },
          },
          {
            name: 'button-remove',
            args: {
              x: 0,
              y: 0,
              offset: { x: 10, y: 10 },
            },
          },
        ])
      } else {
        cell.addTools(['vertices', 'segments'])
      }
    })

    graph.on('cell:mouseleave', ({ cell }) => {
      cell.removeTools()
    })
  }

  refContainer = (container: HTMLDivElement) => {
    this.container = container
  }

  render() {
    return (
      <div className="tools-onhover-app">
        <div className="app-content" ref={this.refContainer} />
      </div>
    )
  }
}

const root = createRoot(document.getElementById('container')!)
root.render(<Example />)
window.addEventListener('pagehide', () => root.unmount(), { once: true })
```



## 内置工具

工具是渲染在节点/边上的小部件，用于增强交互能力。我们分别为节点和边提供以下内置工具：

### 节点

- [button](/zh/api/registry/node-tool#button) 在指定位置处渲染一个按钮，支持自定义按钮的点击交互。
- [button-remove](/zh/api/registry/node-tool#button-remove) 在指定的位置处，渲染一个删除按钮，点击时删除对应的节点。
- [boundary](/zh/api/registry/node-tool#boundary) 根据节点的包围盒渲染一个包围节点的矩形。注意：该工具仅用于可视化，不带任何交互。

### 边

- [vertices](/zh/api/registry/edge-tool#vertices) 在路径点位置渲染小圆点；拖动小圆点可修改位置，双击可删除；在边上单击可添加路径点。
- [segments](/zh/api/registry/edge-tool#segments) 在线段中心渲染一个工具条；拖动工具条可调整线段两端路径点的位置。
- [boundary](/zh/api/registry/edge-tool#boundary) 根据边的包围盒渲染一个包围边的矩形。注意，该工具仅仅渲染一个矩形，不带任何交互。
- [button](/zh/api/registry/edge-tool#button) 在指定位置处渲染一个按钮，支持自定义按钮的点击交互。
- [button-remove](/zh/api/registry/edge-tool#button-remove) 在指定的位置处，渲染一个删除按钮，点击时删除对应的边。
- [source-arrowhead 和 target-arrowhead](/zh/api/registry/edge-tool#source-arrowhead-和-target-arrowhead) 在边的起点或终点渲染一个图形（默认箭头）；可拖动该图形修改边的起点/终点。
### docs/demos/tutorial/intermediate/tools/basic/index.less

```less
.tools-basic-app {
  display: flex;
  width: 100%;
  border: 1px solid #f0f0f0;
  padding: 16px 8px;
  font-family: sans-serif;

  .app-content {
    flex: 1;
    height: 320px;
    margin-right: 8px;
    margin-left: 8px;
    box-shadow: 0 0 10px 1px #e9e9e9;
  }
}
```
### docs/demos/tutorial/intermediate/tools/onhover/index.less

```less
.tools-onhover-app {
  display: flex;
  border: 1px solid #f0f0f0;
  padding: 16px 8px;
  font-family: sans-serif;

  .app-content {
    flex: 1;
    height: 320px;
    margin-right: 8px;
    margin-left: 8px;
    box-shadow: 0 0 10px 1px #e9e9e9;
  }
}
```
