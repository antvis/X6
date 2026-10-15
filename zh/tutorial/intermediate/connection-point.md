---
title: "连接点"
description: "连接点"
language: "zh"
canonical: "https://x6.antv.antgroup.com/zh/tutorial/intermediate/connection-point/"
version: "3.x"
---

[资料索引](/llms.txt)

> **在本章节中主要介绍连接点相关的知识，通过阅读，你可以了解到**

- 锚点和连接点的概念
- 如何使用锚点和连接点定制特殊连线


先看一个例子：



```ts
import './index.less'
import { createRoot } from 'react-dom/client'
import React from 'react'
import { Graph } from '@antv/x6'

Graph.registerNode(
  'custom-node',
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
      shape: 'custom-node',
      x: 40,
      y: 200,
      label: 'hello',
    })

    const target = graph.addNode({
      shape: 'custom-node',
      x: 300,
      y: 80,
      label: 'world',
    })

    graph.addEdge({
      source: {
        cell: source,
        anchor: {
          name: 'right',
          args: {
            dy: -10,
          },
        },
        connectionPoint: 'anchor',
      },
      target: {
        cell: target,
        anchor: {
          name: 'left',
          args: {
            dy: -10,
          },
        },
        connectionPoint: 'anchor',
      },
      attrs: {
        line: {
          stroke: '#8f8f8f',
          strokeWidth: 1,
        },
      },
    })

    graph.addEdge({
      source: {
        cell: source,
        anchor: {
          name: 'right',
        },
        connectionPoint: 'anchor',
      },
      target: {
        cell: target,
        anchor: {
          name: 'left',
        },
        connectionPoint: 'anchor',
      },
      attrs: {
        line: {
          stroke: '#8f8f8f',
          strokeWidth: 1,
        },
      },
    })

    graph.addEdge({
      source: {
        cell: source,
        anchor: {
          name: 'right',
          args: {
            dy: 10,
          },
        },
        connectionPoint: 'anchor',
      },
      target: {
        cell: target,
        anchor: {
          name: 'left',
          args: {
            dy: 10,
          },
        },
        connectionPoint: 'anchor',
      },
      attrs: {
        line: {
          stroke: '#8f8f8f',
          strokeWidth: 1,
        },
      },
    })

    graph.centerContent()
  }

  refContainer = (container: HTMLDivElement) => {
    this.container = container
  }

  render() {
    return (
      <div className="multi-app">
        <div className="app-content" ref={this.refContainer} />
      </div>
    )
  }
}

const root = createRoot(document.getElementById('container')!)
root.render(<Example />)
window.addEventListener('pagehide', () => root.unmount(), { once: true })
```



当我们移动上面的节点时，会发现边与节点的连接位置保持不变，且多条边之间存在间隔。这与之前示例的现象完全不同。这是怎么实现的？下面通过一张图理解 `锚点` 和 `连接点`。

## 介绍

默认情况下，锚点为 `center`（元素中心）。连接点用于计算交点，默认值为 `boundary`（与元素边框的交点）。因此，边会以起点元素的锚点到终点元素的锚点连一条参考线；参考线与元素的交点由 `connectionPoint` 指定的计算方法得到，该交点即为边的起点/终点。

<img src="https://gw.alipayobjects.com/mdn/rms_43231b/afts/img/A*RhX1SYh1K-QAAAAAAAAAAAAAARQnAQ" alt="连接点" width="500" />

## 使用方式

锚点 `anchor` 和连接点 `connectionPoint` 都有两种使用方式，第一种是在 `connecting` 中配置，全局生效。第二种是在创建边时在 `source`、`target` 中指定。

```ts
// 在 connecting 中配置
const graph = new Graph({
  connecting: {
    sourceAnchor: {
      name: 'right', // 锚点会在节点右侧中心向上偏移 10px
      args: {
        dy: -10,
      },
    },
    targetAnchor: {
      name: 'right', // 锚点会在节点右侧中心向上偏移 10px
      args: {
        dy: -10,
      },
    },
    connectionPoint: 'anchor',
  },
})

// 也可以在创建连线时配置，且其优先级更高
graph.addEdge({
  source: {
    cell: source,
    anchor: {
      name: 'right',
      args: {
        dy: -10,
      },
    },
    connectionPoint: 'anchor',
  },
  target: {
    cell: target,
    anchor: {
      name: 'left',
      args: {
        dy: -10,
      },
    },
    connectionPoint: 'anchor',
  },
})
```

当然，X6 还支持丰富的锚点和连接点类型，如需定制特殊连线，可参考 [NodeAnchor](/zh/api/registry/node-anchor) 和 [ConnectionPoint](/zh/api/registry/connection-point)。
### docs/demos/tutorial/intermediate/connection-point/multi/index.less

```less
.multi-app {
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
