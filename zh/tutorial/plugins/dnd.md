---
title: "Dnd"
description: "Dnd"
language: "zh"
canonical: "https://x6.antv.antgroup.com/zh/tutorial/plugins/dnd/"
version: "3.x"
---

[资料索引](/llms.txt)

> **在本章节中主要介绍拖拽插件相关的知识，通过阅读，你可以了解到**

- 如何通过拖拽交互往画布中添加节点
- 如何自定义拖拽节点与放置节点


## 使用

我们经常需要通过拖拽交互往画布中添加节点，如流程图编排场景，从流程图组件库中拖拽组件到画布中。你可以通过插件 `Dnd` 启用拖拽交互，示例：

```ts
import { Graph, Dnd } from '@antv/x6'

const graph = new Graph({
  background: {
    color: '#F2F7FA',
  },
})

const dnd = new Dnd({
  target: graph,
})
```

当开始拖拽时，需要调用 `dnd.start(node, e)` 方法，在 `React` 中这样使用：

```tsx
export default () => {
  const startDrag = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    // 该 node 为拖拽的节点，默认也是放置到画布上的节点，可以自定义任何属性
    const node = graph.createNode({
      shape: 'rect',
      width: 100,
      height: 40,
    })
    dnd.start(node, e.nativeEvent)
  }

  return (
    <ul>
      <li onMouseDown={startDrag}></li>
    </ul>
  )
}
```

## 演示



```ts
import './index.less'
import { createRoot } from 'react-dom/client'
/* eslint-disable jsx-a11y/no-static-element-interactions */
import React from 'react'
import { Graph, Dnd, Snapline } from '@antv/x6'

export default class Example extends React.Component {
  private graph: Graph
  private container: HTMLDivElement
  private dndContainer: HTMLDivElement
  private dnd: Dnd

  componentDidMount() {
    const graph = new Graph({
      container: this.container,
      background: {
        color: '#F2F7FA',
      },
      mousewheel: {
        enabled: true,
        modifiers: ['ctrl', 'meta'],
      },
    })

    graph.use(
      new Snapline({
        enabled: true,
        sharp: true,
      }),
    )

    const source = graph.addNode({
      x: 130,
      y: 30,
      width: 100,
      height: 40,
      label: 'Hello',
      attrs: {
        body: {
          stroke: '#8f8f8f',
          strokeWidth: 1,
          fill: '#fff',
          rx: 6,
          ry: 6,
        },
      },
    })

    const target = graph.addNode({
      x: 180,
      y: 160,
      width: 100,
      height: 40,
      label: 'World',
      attrs: {
        body: {
          stroke: '#8f8f8f',
          strokeWidth: 1,
          fill: '#fff',
          rx: 6,
          ry: 6,
        },
      },
    })

    graph.addEdge({
      source,
      target,
      attrs: {
        line: {
          stroke: '#8f8f8f',
          strokeWidth: 1,
        },
      },
    })
    graph.centerContent()

    this.dnd = new Dnd({
      target: graph,
      scaled: false,
      dndContainer: this.dndContainer,
    })
    this.graph = graph
  }

  startDrag = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    const target = e.currentTarget
    const type = target.getAttribute('data-type')
    const node =
      type === 'rect'
        ? this.graph.createNode({
            width: 100,
            height: 40,
            label: 'Rect',
            attrs: {
              body: {
                stroke: '#8f8f8f',
                strokeWidth: 1,
                fill: '#fff',
                rx: 6,
                ry: 6,
              },
            },
          })
        : this.graph.createNode({
            width: 60,
            height: 60,
            shape: 'circle',
            label: 'Circle',
            attrs: {
              body: {
                stroke: '#8f8f8f',
                strokeWidth: 1,
                fill: '#fff',
              },
            },
          })

    this.dnd.start(node, e.nativeEvent as any)
  }

  refContainer = (container: HTMLDivElement) => {
    this.container = container
  }

  dndContainerRef = (container: HTMLDivElement) => {
    this.dndContainer = container
  }

  render() {
    return (
      <div className="dnd-app">
        <div className="dnd-wrap" ref={this.dndContainerRef}>
          <div
            data-type="rect"
            className="dnd-rect"
            onMouseDown={this.startDrag}
          >
            Rect
          </div>
          <div
            data-type="circle"
            className="dnd-circle"
            onMouseDown={this.startDrag}
          >
            Circle
          </div>
        </div>

        <div className="app-content" ref={this.refContainer} />
      </div>
    )
  }
}

const root = createRoot(document.getElementById('container')!)
root.render(<Example />)
window.addEventListener('pagehide', () => root.unmount(), { once: true })
```



## 配置

| 选项              | 类型                                                                                | 必选 | 默认值          | 说明                                                                                                  |
|-------------------|-------------------------------------------------------------------------------------|:----:|-----------------|-----------------------------------------------------------------------------------------------------|
| target            | Graph                                                                               |  ✓️  |                 | 目标画布。                                                                                             |
| getDragNode       | (sourceNode: Node, options: GetDragNodeOptions) => Node                             |      |                 | 拖拽开始时，获取被拖拽的节点，默认克隆 `dnd.start` 传入的节点。                                          |
| getDropNode       | (draggingNode: Node, options: GetDropNodeOptions) => Node                           |      |                 | 拖拽结束时，获取放置到目标画布的节点，默认克隆被拖拽的节点。                                             |
| validateNode      | (droppingNode: Node, options: ValidateNodeOptions) => boolean \| Promise\<boolean\> |      |                 | 拖拽结束时，验证节点是否可以放置到目标画布中。                                                          |
| dndContainer      | HTMLElement                                                                         |      |                 | 如果设置 `dndContainer`，在 `dndContainer` 上放开鼠标不会放置节点，常用于 `dnd` 容器处于画布上面的场景。 |
| draggingContainer | HTMLElement                                                                         |      | `document.body` | 自定义拖拽画布容器。                                                                                   |

## 常见问题

1. 为什么拖拽节点到画布后，ID 发生了改变

根据上面的拖拽细节我们会发现整体拖拽流程是：源节点 -> 拖拽节点 -> 放置节点，默认是将源节点克隆一份变为拖拽节点，拖拽节点克隆一份变为放置节点，在克隆的过程中会重置节点 ID，如果想保持原来节点 ID，可以进行以下操作：

```ts
// 这样放置到画布上的节点 ID 和 dnd start 传入的 node ID 一致
const dnd = new Dnd({
  getDragNode: (node) => node.clone({ keepId: true }),
  getDropNode: (node) => node.clone({ keepId: true }),
})
```

2.怎么自定义拖拽节点的样式？

```ts
const dnd = new Dnd({
  getDragNode(node) {
    // 这里返回一个新的节点作为拖拽节点
    return graph.createNode({
      width: 100,
      height: 100,
      shape: 'rect',
      attrs: {
        body: {
          fill: '#ccc',
        },
      },
    })
  },
})
```

3.怎么自定义放置到画布上的节点样式？

```ts
const dnd = new Dnd({
  getDropNode(node) {
    const { width, height } = node.size()
    // 返回一个新的节点作为实际放置到画布上的节点
    return node.clone().size(width * 3, height * 3)
  },
})
```

4.怎么获取放置到画布上节点的位置？

```ts
graph.on('node:added', ({ node }) => {
  const { x, y } = node.position()
})
```

5. 怎么设置放置到画布上节点的 zIndex？

```ts
graph.on('node:added', ({ node }) => {
  node.setZIndex(5)
})
```
### docs/demos/tutorial/plugins/dnd/index.less

```less
.dnd-app {
  display: flex;
  border: 1px solid #f0f0f0;
  padding: 16px 8px;
  font-family: sans-serif;

  .app-content {
    flex: 1;
    height: 240px;
    margin-right: 8px;
    margin-left: 8px;
    box-shadow: 0 0 10px 1px #e9e9e9;
  }

  .dnd-wrap {
    display: flex;
    flex-direction: column;
    align-items: center;
    width: 200px;
    padding: 16px;
    border: 1px solid #f0f0f0;
    user-select: none;

    .dnd-rect {
      width: 100px;
      height: 40px;
      margin: 16px;
      line-height: 40px;
      text-align: center;
      border: 1px solid #8f8f8f;
      border-radius: 6px;
      cursor: move;
    }

    .dnd-circle {
      width: 60px;
      height: 60px;
      margin: 16px;
      line-height: 60px;
      text-align: center;
      border: 1px solid #8f8f8f;
      border-radius: 100%;
      cursor: move;
    }
  }
}
```
