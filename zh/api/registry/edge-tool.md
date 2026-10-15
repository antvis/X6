---
title: "边上工具"
description: "边上工具"
language: "zh"
canonical: "https://x6.antv.antgroup.com/zh/api/registry/edge-tool/"
version: "3.x"
---

[资料索引](/llms.txt)

由于边通常是一个具有较小宽度的折线/曲线，就不太方便与边进行交互。为了解决这个问题，我们一方面在渲染边的同时还渲染了一个与边同形状的 `<path>` 路径，但宽度更宽且透明的边，来方便用户与边进行交互；另外，我们也可以为边添加一些小工具来增强边的交互能力，如路径点小工具使路径点可以被移动、线段小工具使边中的线段可以被移动等。

场景一：添加指定的小工具。

```ts
// 创建边时添加小工具
graph.addEdge({
  source,
  target,
  tools: [
    { name: 'vertices' },
    {
      name: 'button-remove',
      args: { distance: 20 },
    },
  ],
})

// 创建边后添加小工具
edge.addTools([
  { name: 'vertices' },
  {
    name: 'button-remove',
    args: { distance: 20 },
  },
])
```

场景二：鼠标动态添加/删除小工具。

```ts
graph.on('edge:mouseenter', ({ cell }) => {
  cell.addTools([
    { name: 'vertices' },
    {
      name: 'button-remove',
      args: { distance: 20 },
    },
  ])
})

graph.on('edge:mouseleave', ({ cell }) => {
  if (cell.hasTool('button-remove')) {
    cell.removeTool('button-remove')
  }
})
```

在 X6 中默认提供了以下几个用于边的小工具：

- [vertices](#vertices) 路径点工具，在路径点位置渲染一个小圆点，拖动小圆点修改路径点位置，双击小圆点删除路径点，在边上单击添加路径点。
- [segments](#segments) 线段工具。在边的每条线段的中心渲染一个工具条，可以拖动工具条调整线段两端的路径点的位置。
- [boundary](#boundary) 根据边的包围盒渲染一个包围边的矩形。注意，该工具仅仅渲染一个矩形，不带任何交互。
- [button](#button) 在指定位置处渲染一个按钮，支持自定义按钮的点击交互。
- [button-remove](#button-remove) 在指定的位置处，渲染一个删除按钮，点击时删除对应的边。
- [source-arrowhead-和-target-arrowhead](#source-arrowhead-和-target-arrowhead) 在边的起点或终点渲染一个图形(默认是箭头)，拖动该图形来修改边的起点或终点。
- [edge-editor](#edge-editor) 提供边上文本编辑功能。

## 内置工具

### vertices

路径点工具，在路径点位置渲染一个小圆点，拖动小圆点修改路径点位置，双击小圆点删除路径点，在边上单击添加路径点。配置如下：

| 参数名             | 类型                      | 默认值   | 说明                                                                                                                   |
|--------------------|---------------------------|----------|----------------------------------------------------------------------------------------------------------------------|
| attrs              | KeyValue                  | `object` | 小圆点的属性。                                                                                                          |
| snapRadius         | number                    | `20`     | 移动路径点过程中的吸附半径。当路径点与邻近的路径点距离在半径范围内时，将当前路径点吸附到临近路径点。                      |
| addable            | boolean                   | `true`   | 在边上按下鼠标时，是否可以添加新的路径点。                                                                               |
| removable          | boolean                   | `true`   | 是否可以通过双击移除路径点。                                                                                            |
| removeRedundancies | boolean                   | `true`   | 是否自动移除冗余的路径点。                                                                                              |
| stopPropagation    | boolean                   | `true`   | 是否阻止工具上的鼠标事件冒泡到边视图上。阻止后鼠标与工具交互时将不会触发边的 `mousedown`、`mousemove` 和 `mouseup` 事件。 |
| modifiers          | `string \| ModifierKey[]` | -        | 按下对应的键盘按键后才能添加路径点，可以解决添加路径点和边点击两种交互重叠现象。                                         |

其中 `attrs` 的默认值(默认样式)为：

```ts
{
  r: 6,
  fill: '#333',
  stroke: '#fff',
  cursor: 'move',
  'stroke-width': 2,
}
```

工具使用方式如下：

```ts
// 创建 edge 时添加小工具
const edge1 = graph.addEdge({
  ...,
  tools: [
    {
      name: 'vertices',
      args: {
        attrs: { fill: '#666' },
      },
    },
  ]
})
```



```ts
import './index.less'
import { createRoot } from 'react-dom/client'
import React from 'react'
import { Graph } from '@antv/x6'

export default class Example extends React.Component {
  private container: HTMLDivElement

  componentDidMount() {
    const graph = new Graph({
      container: this.container,
      background: {
        color: '#F2F7FA',
      },
    })

    graph.addEdge({
      source: { x: 40, y: 40 },
      target: { x: 380, y: 40 },
      vertices: [
        { x: 40, y: 80 },
        { x: 200, y: 80 },
        { x: 200, y: 40 },
      ],
      attrs: {
        line: {
          stroke: '#8f8f8f',
          strokeWidth: 1,
          targetMarker: 'classic',
        },
      },
      tools: [
        {
          name: 'vertices',
          args: {
            attrs: { fill: '#8f8f8f' },
          },
        },
      ],
    })

    const edge2 = graph.addEdge({
      source: { x: 40, y: 160 },
      target: { x: 380, y: 160 },
      vertices: [
        { x: 40, y: 200 },
        { x: 200, y: 200 },
        { x: 200, y: 160 },
      ],
      connector: 'smooth',
      attrs: {
        line: {
          stroke: '#8f8f8f',
          strokeWidth: 1,
          targetMarker: 'classic',
        },
      },
    })

    graph.on('edge:mouseenter', ({ cell }) => {
      if (cell === edge2) {
        cell.addTools({
          name: 'vertices',
          args: {
            attrs: { fill: '#8f8f8f' },
          },
        })
      }
    })

    graph.on('edge:mouseleave', ({ cell }) => {
      if (cell === edge2) {
        if (cell.hasTool('vertices')) {
          cell.removeTool('vertices')
        }
      }
    })

    graph.centerContent()
  }

  refContainer = (container: HTMLDivElement) => {
    this.container = container
  }

  render() {
    return (
      <div className="edge-tool-vertices-app">
        <div className="app-content" ref={this.refContainer} />
      </div>
    )
  }
}

const root = createRoot(document.getElementById('container')!)
root.render(<Example />)
window.addEventListener('pagehide', () => root.unmount(), { once: true })
```



### segments

线段工具。在边的每条线段的中心渲染一个工具条，可以拖动工具条调整线段两端的路径点的位置。配置如下：

| 参数名             | 类型    | 默认值   | 说明                                                                                                                   |
|--------------------|---------|----------|----------------------------------------------------------------------------------------------------------------------|
| attrs              | object  | `object` | 元素的属性。                                                                                                            |
| precision          | number  | `0.5`    | 线段的两个端点的 X 或 Y 轴的坐标差小于 `precision` 时才渲染工具，默认 `0.5` 表示只对垂直和水平线段渲染工具。             |
| threshold          | number  | `40`     | 线段长度超过 `threshold` 时才渲染工具。                                                                                 |
| snapRadius         | number  | `10`     | 调整线段过程中的吸附半径。                                                                                              |
| removeRedundancies | boolean | `true`   | 是否自动移除冗余的路径点。                                                                                              |
| stopPropagation    | boolean | `true`   | 是否阻止工具上的鼠标事件冒泡到边视图上。阻止后鼠标与工具交互时将不会触发边的 `mousedown`、`mousemove` 和 `mouseup` 事件。 |

其中 `attrs` 的默认值(默认样式)为：

```ts
{
  width: 20,
  height: 8,
  x: -10,
  y: -4,
  rx: 4,
  ry: 4,
  fill: '#333',
  stroke: '#fff',
  'stroke-width': 2,
}
```

工具使用方式如下：

```ts
graph.addEdge({
  ...,
  tools: [{
    name: 'segments',
    args: {
      snapRadius: 20,
      attrs: {
        fill: '#444',
      },
    },
  }]
})
```



```ts
import './index.less'
import { createRoot } from 'react-dom/client'
import React from 'react'
import { Graph } from '@antv/x6'

export default class Example extends React.Component {
  private container: HTMLDivElement

  componentDidMount() {
    const graph = new Graph({
      container: this.container,
      background: {
        color: '#F2F7FA',
      },
    })

    graph.addEdge({
      source: { x: 40, y: 40 },
      target: { x: 380, y: 40 },
      vertices: [
        { x: 40, y: 80 },
        { x: 200, y: 80 },
        { x: 200, y: 40 },
      ],
      attrs: {
        line: {
          stroke: '#8f8f8f',
          strokeWidth: 1,
          targetMarker: 'classic',
        },
      },
      tools: [
        {
          name: 'segments',
          args: {
            snapRadius: 20,
            attrs: {
              fill: '#8f8f8f',
            },
          },
        },
      ],
    })

    graph.addEdge({
      source: { x: 40, y: 160 },
      target: { x: 380, y: 160 },
      vertices: [
        { x: 40, y: 200 },
        { x: 200, y: 200 },
        { x: 200, y: 160 },
      ],
      attrs: {
        line: {
          stroke: '#8f8f8f',
          strokeWidth: 1,
          targetMarker: 'classic',
        },
      },
      connector: 'smooth',
      tools: [
        {
          name: 'segments',
          args: {
            snapRadius: 20,
            attrs: {
              fill: '#8f8f8f',
            },
          },
        },
      ],
    })

    graph.centerContent()
  }

  refContainer = (container: HTMLDivElement) => {
    this.container = container
  }

  render() {
    return (
      <div className="edge-tool-segments-app">
        <div className="app-content" ref={this.refContainer} />
      </div>
    )
  }
}

const root = createRoot(document.getElementById('container')!)
root.render(<Example />)
window.addEventListener('pagehide', () => root.unmount(), { once: true })
```



### boundary

根据边的包围盒渲染一个包围边的矩形。注意，该工具仅仅渲染一个矩形，不带任何交互。配置如下：

| 参数名          | 类型     | 默认值   | 说明                                                                                                     |
|-----------------|----------|----------|--------------------------------------------------------------------------------------------------------|
| tagName         | string   | `rect`   | 使用何种图形渲染。                                                                                        |
| padding         | number   | `10`     | 边距。                                                                                                    |
| attrs           | KeyValue | `object` | 图形属性。                                                                                                |
| useCellGeometry | boolean  | `true`   | 是否使用几何计算的方式来计算元素包围盒，开启后会有性能上的提升，如果出现计算准度问题，请将它设置为 `false`。 |

其中 `attrs` 的默认值(默认样式)为：

```js
{
  fill: 'none',
  stroke: '#333',
  'stroke-width': 0.5,
  'stroke-dasharray': '5, 5',
  'pointer-events': 'none',
}
```

工具使用方式如下：

```ts
graph.addEdge({
  ...,
  tools: [
    {
      name: 'boundary',
      args: {
        padding: 5,
        attrs: {
          fill: '#7c68fc',
          stroke: '#333',
          'stroke-width': 0.5,
          'fill-opacity': 0.2,
        },
      },
    },
  ]
})
```



```ts
import './index.less'
import { createRoot } from 'react-dom/client'
import React from 'react'
import { Graph } from '@antv/x6'

export default class Example extends React.Component {
  private container: HTMLDivElement

  componentDidMount() {
    const graph = new Graph({
      container: this.container,
      background: {
        color: '#F2F7FA',
      },
    })

    graph.addEdge({
      source: { x: 40, y: 40 },
      target: { x: 380, y: 40 },
      vertices: [
        { x: 40, y: 80 },
        { x: 200, y: 80 },
        { x: 200, y: 40 },
      ],
      attrs: {
        line: {
          stroke: '#8f8f8f',
          strokeWidth: 1,
          targetMarker: 'classic',
        },
      },
      tools: ['boundary'],
    })

    graph.addEdge({
      source: { x: 40, y: 160 },
      target: { x: 380, y: 160 },
      vertices: [
        { x: 40, y: 200 },
        { x: 200, y: 200 },
        { x: 200, y: 160 },
      ],
      attrs: {
        line: {
          stroke: '#8f8f8f',
          strokeWidth: 1,
          targetMarker: 'classic',
        },
      },
      connector: 'smooth',
      tools: [
        {
          name: 'boundary',
          args: {
            padding: 5,
            useCellGeometry: false,
            attrs: {
              fill: '#7c68fc',
              stroke: '#333',
              strokeWidth: 0.5,
              fillOpacity: 0.2,
            },
          },
        },
      ],
    })

    graph.centerContent()
  }

  refContainer = (container: HTMLDivElement) => {
    this.container = container
  }

  render() {
    return (
      <div className="edge-tool-boundary-app">
        <div className="app-content" ref={this.refContainer} />
      </div>
    )
  }
}

const root = createRoot(document.getElementById('container')!)
root.render(<Example />)
window.addEventListener('pagehide', () => root.unmount(), { once: true })
```



### button

在指定位置处渲染一个按钮，支持自定义按钮的点击交互。配置如下：

| 参数名   | 类型                                                                   | 默认值      | 说明                          |
|----------|------------------------------------------------------------------------|-------------|-----------------------------|
| distance | number \| string                                                       | `undefined` | 偏离起点的距离或比例。         |
| offset   | number \| Point.PointLike                                              | `0`         | 在 `distance` 基础上的偏移量。 |
| rotate   | boolean                                                                | `undefined` | 是否跟随边旋转。               |
| markup   | Markup.JSONMarkup                                                      | `undefined` | 渲染按钮的 Markup 定义。       |
| onClick  | `(args: {e: Dom.MouseDownEvent, cell: Cell, view: CellView }) => void` | `undefined` | 点击按钮的回调函数。           |

使用方式如下：

```ts
graph.addEdge({
  ...,
  tools: [
    {
      name: 'button',
      args: {
        distance: -40,
        onClick({ view }: any) {
          //
        },
      },
    },
  ],
})
```



```ts
import './index.less'
import { createRoot } from 'react-dom/client'
import React from 'react'
import { Graph, EdgeView } from '@antv/x6'

export default class Example extends React.Component {
  private container: HTMLDivElement

  componentDidMount() {
    const graph = new Graph({
      container: this.container,
      background: {
        color: '#F2F7FA',
      },
    })

    graph.addEdge({
      source: { x: 40, y: 40 },
      target: { x: 380, y: 40 },
      vertices: [
        { x: 40, y: 80 },
        { x: 200, y: 80 },
        { x: 200, y: 40 },
      ],
      attrs: {
        line: {
          stroke: '#8f8f8f',
          strokeWidth: 1,
          targetMarker: 'classic',
        },
      },
      tools: [
        {
          name: 'button',
          args: {
            markup: [
              {
                tagName: 'circle',
                selector: 'button',
                attrs: {
                  r: 18,
                  stroke: '#fe854f',
                  strokeWidth: 2,
                  fill: 'white',
                  cursor: 'pointer',
                },
              },
              {
                tagName: 'text',
                textContent: 'Btn B',
                selector: 'icon',
                attrs: {
                  fill: '#fe854f',
                  fontSize: 10,
                  textAnchor: 'middle',
                  pointerEvents: 'none',
                  y: '0.3em',
                },
              },
            ],
            distance: -40,
            onClick({ view }: { view: EdgeView }) {
              const edge = view.cell
              const source = edge.getSource()
              const target = edge.getTarget()
              edge.setSource(target)
              edge.setTarget(source)
            },
          },
        },
      ],
    })

    graph.addEdge({
      source: { x: 40, y: 160 },
      target: { x: 380, y: 160 },
      vertices: [
        { x: 40, y: 200 },
        { x: 200, y: 200 },
        { x: 200, y: 160 },
      ],
      attrs: {
        line: {
          stroke: '#8f8f8f',
          strokeWidth: 1,
          targetMarker: 'classic',
        },
      },
      connector: 'smooth',
      tools: {
        name: 'button',
        args: {
          markup: [
            {
              tagName: 'circle',
              selector: 'button',
              attrs: {
                r: 18,
                stroke: '#fe854f',
                strokeWidth: 2,
                fill: 'white',
                cursor: 'pointer',
              },
            },
            {
              tagName: 'text',
              textContent: 'Btn A',
              selector: 'icon',
              attrs: {
                fill: '#fe854f',
                fontSize: 10,
                textAnchor: 'middle',
                pointerEvents: 'none',
                y: '0.3em',
              },
            },
          ],
          distance: -100,
          offset: { x: 0, y: 0 },
          onClick({ view }: { view: EdgeView }) {
            const edge = view.cell
            const offset = parseInt(
              edge.attr('line/strokeDashoffset') || '0',
              10,
            )
            edge.attr({
              line: {
                strokeDasharray: '5, 10',
                strokeDashoffset: offset + 20,
              },
            })
          },
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
      <div className="edge-tool-button-app ">
        <div className="app-content" ref={this.refContainer} />
      </div>
    )
  }
}

const root = createRoot(document.getElementById('container')!)
root.render(<Example />)
window.addEventListener('pagehide', () => root.unmount(), { once: true })
```



### button-remove

在指定的位置处，渲染一个删除按钮，点击时删除对应的边。它是上面 `button` 工具的一个特例，所以支持 `button` 的所有配置。使用方式如下：

```ts
graph.addEdge({
  ...,
  tools: [
    {
      name: 'button-remove',
      args: { distance: -40 },
    },
  ]
})
```



```ts
import './index.less'
import { createRoot } from 'react-dom/client'
import React from 'react'
import { Graph } from '@antv/x6'

export default class Example extends React.Component {
  private container: HTMLDivElement

  componentDidMount() {
    const graph = new Graph({
      container: this.container,
      background: {
        color: '#F2F7FA',
      },
    })

    graph.addEdge({
      source: { x: 40, y: 40 },
      target: { x: 380, y: 40 },
      vertices: [
        { x: 40, y: 80 },
        { x: 200, y: 80 },
        { x: 200, y: 40 },
      ],
      attrs: {
        line: {
          stroke: '#8f8f8f',
          strokeWidth: 1,
          targetMarker: 'classic',
        },
      },
      tools: [
        {
          name: 'button-remove',
          args: { distance: -40 },
        },
      ],
    })

    graph.addEdge({
      source: { x: 40, y: 160 },
      target: { x: 380, y: 160 },
      vertices: [
        { x: 40, y: 200 },
        { x: 200, y: 200 },
        { x: 200, y: 160 },
      ],
      attrs: {
        line: {
          stroke: '#8f8f8f',
          strokeWidth: 1,
          targetMarker: 'classic',
        },
      },
      connector: 'smooth',
      tools: [
        {
          name: 'button-remove',
          args: { distance: -40 },
        },
      ],
    })

    graph.centerContent()
  }

  refContainer = (container: HTMLDivElement) => {
    this.container = container
  }

  render() {
    return (
      <div className="edge-tool-button-remove-app">
        <div className="app-content" ref={this.refContainer} />
      </div>
    )
  }
}

const root = createRoot(document.getElementById('container')!)
root.render(<Example />)
window.addEventListener('pagehide', () => root.unmount(), { once: true })
```



### source-arrowhead 和 target-arrowhead

在边的起点或终点渲染一个图形(默认是箭头)，拖动该图形来修改边的起点或终点。配置如下：

| 参数名  | 类型             | 默认值   | 说明                |
|---------|------------------|----------|-------------------|
| tagName | string           | `path`   | 使用何种图形来渲染。 |
| attrs   | Attr.SimpleAttrs | `object` | 图形的属性。         |

其中 `source-arrowhead` 的属性默认值为

```ts
{
  d: 'M 10 -8 -10 0 10 8 Z',
  fill: '#333',
  stroke: '#fff',
  'stroke-width': 2,
  cursor: 'move',
}
```

`target-arrowhead` 的属性默认值为

```ts
{
  d: 'M -10 -8 10 0 -10 8 Z',
  fill: '#333',
  stroke: '#fff',
  'stroke-width': 2,
  cursor: 'move',
}
```

工具使用方式如下：

```ts
graph.on('edge:mouseenter', ({ cell }) => {
  cell.addTools([
    'source-arrowhead',
    {
      name: 'target-arrowhead',
      args: {
        attrs: {
          fill: 'red',
        },
      },
    },
  ])
})

graph.on('edge:mouseleave', ({ cell }) => {
  cell.removeTools()
})
```



```ts
import './index.less'
import { createRoot } from 'react-dom/client'
import React from 'react'
import { Graph } from '@antv/x6'

Graph.registerNode(
  'custom-node-with-port',
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
    ports: {
      groups: {
        in: {
          position: 'top',
          attrs: {
            circle: {
              magnet: true,
              stroke: '#8f8f8f',
              r: 5,
            },
          },
        },
        out: {
          position: 'bottom',
          attrs: {
            circle: {
              magnet: true,
              stroke: '#8f8f8f',
              r: 5,
            },
          },
        },
      },
    },
  },
  true,
)

export default class Example extends React.Component {
  private container: HTMLDivElement

  componentDidMount() {
    const magnetAvailabilityHighlighter = {
      name: 'stroke',
      args: {
        padding: 3,
        attrs: {
          strokeWidth: 3,
          stroke: '#52c41a',
        },
      },
    }

    const graph = new Graph({
      container: this.container,
      background: {
        color: '#F2F7FA',
      },
      highlighting: {
        magnetAvailable: magnetAvailabilityHighlighter,
      },
      connecting: {
        snap: true,
        allowBlank: false,
        allowLoop: false,
        allowNode: false,
        highlight: true,

        createEdge() {
          return this.createEdge({
            attrs: {
              line: {
                stroke: '#8f8f8f',
                strokeWidth: 1,
              },
            },
          })
        },

        validateMagnet({ magnet }) {
          return magnet.getAttribute('port-group') !== 'in'
        },

        validateConnection({ sourceMagnet, targetMagnet }) {
          // 只能从输出链接桩创建连接
          if (
            !sourceMagnet ||
            sourceMagnet.getAttribute('port-group') === 'in'
          ) {
            return false
          }

          // 只能连接到输入链接桩
          if (
            !targetMagnet ||
            targetMagnet.getAttribute('port-group') !== 'in'
          ) {
            return false
          }

          return true
        },
      },
    })

    const source = graph.addNode({
      shape: 'custom-node-with-port',
      x: 40,
      y: 40,
      width: 100,
      height: 40,
      label: 'source',
      ports: [
        { id: 'in-1', group: 'in' },
        { id: 'in-2', group: 'in' },
        { id: 'out-1', group: 'out' },
        { id: 'out-2', group: 'out' },
      ],
    })

    const target = graph.addNode({
      shape: 'custom-node-with-port',
      x: 140,
      y: 240,
      width: 100,
      height: 40,
      label: 'target',
      ports: [
        { id: 'in-1', group: 'in' },
        { id: 'in-2', group: 'in' },
        { id: 'out-1', group: 'out' },
        { id: 'out-2', group: 'out' },
      ],
    })

    graph.addNode({
      shape: 'custom-node-with-port',
      x: 320,
      y: 120,
      width: 100,
      height: 40,
      label: 'hello',
      ports: [
        { id: 'in-1', group: 'in' },
        { id: 'in-2', group: 'in' },
        { id: 'out-1', group: 'out' },
        { id: 'out-2', group: 'out' },
      ],
    })

    graph.addEdge({
      source: { cell: source.id, port: 'out-2' },
      target: { cell: target.id, port: 'in-1' },
      attrs: {
        line: {
          stroke: '#8f8f8f',
          strokeWidth: 1,
        },
      },
    })

    graph.on('edge:mouseenter', ({ cell }) => {
      cell.addTools([
        {
          name: 'source-arrowhead',
        },
        {
          name: 'target-arrowhead',
          args: {
            attrs: {
              fill: 'red',
            },
          },
        },
      ])
    })

    graph.on('edge:mouseleave', ({ cell }) => {
      cell.removeTools()
    })

    graph.centerContent()
  }

  refContainer = (container: HTMLDivElement) => {
    this.container = container
  }

  render() {
    return (
      <div className="edge-tool-arrowhead-app">
        <div className="app-content" ref={this.refContainer} />
      </div>
    )
  }
}

const root = createRoot(document.getElementById('container')!)
root.render(<Example />)
window.addEventListener('pagehide', () => root.unmount(), { once: true })
```



### edge-editor

提供边上文本编辑功能。配置如下：

| 参数名                | 类型                                                                    | 默认值                         | 说明                                                           |
|-----------------------|-------------------------------------------------------------------------|--------------------------------|--------------------------------------------------------------|
| labelAddable          | boolean                                                                 | true                           | 点击非文本位置是否新建 label                                   |
| attrs/fontSize        | string                                                                  | `14`                           | 编辑文本字体大小                                               |
| attrs/color           | string                                                                  | `#000`                         | 编辑文本字体颜色                                               |
| attrs/fontFamily      | string                                                                  | `Arial, helvetica, sans-serif` | 编辑文本的字体                                                 |
| attrs/backgroundColor | string                                                                  | `#fff`                         | 编辑区域的背景色                                               |
| getText               | string \| `(this: CellView, args: {cell: Cell}) => string`              | -                              | 获取原文本方法，在自定义 `markup` 场景需要自定义 `getText` 方法 |
| setText               | string \| `(this: CellView, args: {cell: Cell, value: string}) => void` | -                              | 设置新文本，在自定义 `markup` 场景需要自定义 `setText` 方法     |

> **注意**

需要注意的是，2.8.0 版本后不需要在双击事件中去动态添加工具，也就不需要传入事件参数。

```ts
// 2.8.0 版本之前使用方式
graph.on('node:dblclick', ({ node, e }) => {
  edge.addTools({
    name: 'edge-editor',
    args: {
      event: e,
    },
  })
})

// 2.8.0 版本之后使用方式
edge.addTools({
  name: 'edge-editor',
})
```

还需要注意的是，如果在边中自定义了 `markup`，往往需要自定义 `getText` 和 `setText` 方法来正确获取和设置编辑文本，这两个配置都支持函数和字符串两种形式，函数比较好理解，字符串其实就是要获取或者设置的文本的属性路径，一般情况下建议使用字符串形式，这样图数据可以完全序列化(因为函数无法序列化)，否则可能会出现渲染画布后文本编辑功能异常，比如：

```typescript
edge.addTools({
  name: 'edge-editor',
  args: {
    getText: 'a/b',
    setText: 'c/d',
  },
})
```

上面配置表示：

- 获取编辑文本：`edge.attr('a/b')`
- 设置编辑文本：`edge.attr('c/d', value)`



```ts
import './index.less'
import { createRoot } from 'react-dom/client'
import React from 'react'
import { Graph } from '@antv/x6'

export default class Example extends React.Component {
  private container: HTMLDivElement

  componentDidMount() {
    const graph = new Graph({
      container: this.container,
      background: {
        color: '#F2F7FA',
      },
      connecting: {
        connector: 'smooth',
      },
    })

    const source = graph.addNode({
      x: 40,
      y: 40,
      width: 100,
      height: 40,
      label: 'source',
      attrs: {
        body: {
          stroke: '#8f8f8f',
          strokeWidth: 1,
          fill: '#fff',
          rx: 6,
          ry: 6,
        },
      },
      tools: ['node-editor'],
    })

    const target = graph.addNode({
      x: 180,
      y: 200,
      width: 100,
      height: 40,
      label: 'target',
      attrs: {
        body: {
          stroke: '#8f8f8f',
          strokeWidth: 1,
          fill: '#fff',
          rx: 6,
          ry: 6,
        },
      },
      tools: ['node-editor'],
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
      labels: [
        {
          position: 0.3,
          attrs: {
            label: {
              text: 'edge label 1',
            },
          },
        },
        {
          position: 0.6,
          attrs: {
            label: {
              text: 'edge label 2',
            },
          },
        },
      ],
      tools: ['edge-editor'],
    })

    graph.centerContent()
  }

  refContainer = (container: HTMLDivElement) => {
    this.container = container
  }

  render() {
    return (
      <div className="node-editor-tool-app">
        <div className="app-content" ref={this.refContainer} />
      </div>
    )
  }
}

const root = createRoot(document.getElementById('container')!)
root.render(<Example />)
window.addEventListener('pagehide', () => root.unmount(), { once: true })
```



## 自定义工具

### 方式一

继承 `ToolItem` 实现一个工具类，难度较高，要求对 [ToolItem](https://github.com/antvis/X6/blob/master/src/view/tool.ts) 类都有所了解，可以参考上述内置工具的源码，这里不展开叙述。

```ts
Graph.registerEdgeTool('button', Button)
```

### 方式二

继承已经注册的工具，在继承基础上修改配置。我们在 `ToolItem` 基类上提供了一个静态方法 `define` 来快速实现继承并修改配置。

```ts
import { Vertices } from '@antv/x6/es/registry/tool/vertices'

const RedVertices = Vertices.define<Vertices.Options>({
  attrs: {
    fill: 'red',
  },
})

Graph.registerEdgeTool('red-vertices', RedVertices, true)
```



```ts
import './index.less'
import { createRoot } from 'react-dom/client'
import React from 'react'
import { Graph } from '@antv/x6'

Graph.registerEdgeTool(
  'red-vertices',
  {
    inherit: 'vertices',
    attrs: {
      fill: 'red',
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

    graph.addEdge({
      source: { x: 40, y: 40 },
      target: { x: 380, y: 40 },
      vertices: [
        { x: 40, y: 80 },
        { x: 200, y: 80 },
        { x: 200, y: 40 },
      ],
      attrs: {
        line: {
          stroke: '#8f8f8f',
          strokeWidth: 1,
          targetMarker: 'classic',
        },
      },
      tools: ['red-vertices'],
    })

    const edge2 = graph.addEdge({
      source: { x: 60, y: 140 },
      target: { x: 380, y: 140 },
      vertices: [
        { x: 40, y: 180 },
        { x: 200, y: 140 },
        { x: 240, y: 180 },
      ],
      connector: 'smooth',
      attrs: {
        line: {
          stroke: '#8f8f8f',
          strokeWidth: 1,
          targetMarker: 'classic',
        },
      },
    })

    graph.on('edge:mouseenter', ({ cell }) => {
      if (cell === edge2) {
        cell.addTools([{ name: 'red-vertices' }])
      }
    })

    graph.on('edge:mouseleave', ({ cell }) => {
      if (cell === edge2) {
        if (cell.hasTool('red-vertices')) {
          cell.removeTool('red-vertices')
        }
      }
    })

    graph.centerContent()
  }

  refContainer = (container: HTMLDivElement) => {
    this.container = container
  }

  render() {
    return (
      <div className="edge-tool-custom-vertices-app">
        <div className="app-content" ref={this.refContainer} />
      </div>
    )
  }
}

const root = createRoot(document.getElementById('container')!)
root.render(<Example />)
window.addEventListener('pagehide', () => root.unmount(), { once: true })
```



同时，我们为 `Graph.registerEdgeTool` 方法提供了一种快速继承并指定默认选项的实现：

```ts
Graph.registerEdgeTool('red-vertices', {
  inherit: 'vertices', // 基类名称，使用已经注册的工具名称。
  attrs: {
    // 其他选项，作为继承的类的默认选项。
    fill: 'red',
  },
})
```

通过该方法，我们可以快速定义并注册一个圆形的端点 `circle-target-arrowhead`：

```ts
Graph.registerEdgeTool('circle-target-arrowhead', {
  inherit: 'target-arrowhead',
  tagName: 'circle',
  attrs: {
    r: 18,
    fill: '#31d0c6',
    'fill-opacity': 0.3,
    stroke: '#fe854f',
    'stroke-width': 4,
    cursor: 'move',
  },
})
```



```ts
import './index.less'
import { createRoot } from 'react-dom/client'
import React from 'react'
import { Graph } from '@antv/x6'

Graph.registerEdgeTool('circle-target-arrowhead', {
  inherit: 'target-arrowhead',
  tagName: 'circle',
  attrs: {
    r: 18,
    fill: '#31d0c6',
    'fill-opacity': 0.3,
    stroke: '#fe854f',
    'stroke-width': 4,
    cursor: 'move',
  },
})

export default class Example extends React.Component {
  private container: HTMLDivElement

  componentDidMount() {
    const graph = new Graph({
      container: this.container,
      background: {
        color: '#F2F7FA',
      },
    })

    graph.addEdge({
      source: { x: 40, y: 40 },
      target: { x: 320, y: 40 },
      attrs: {
        line: {
          stroke: '#8f8f8f',
          strokeWidth: 1,
          targetMarker: null,
        },
      },
      tools: 'circle-target-arrowhead',
    })

    graph.centerContent()
  }

  refContainer = (container: HTMLDivElement) => {
    this.container = container
  }

  render() {
    return (
      <div className="edge-tool-custom-arrowhead-app">
        <div className="app-content" ref={this.refContainer} />
      </div>
    )
  }
}

const root = createRoot(document.getElementById('container')!)
root.render(<Example />)
window.addEventListener('pagehide', () => root.unmount(), { once: true })
```
### docs/demos/api/edge-tool/vertices/index.less

```less
.edge-tool-vertices-app {
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
### docs/demos/api/edge-tool/segments/index.less

```less
.edge-tool-segments-app {
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
### docs/demos/api/edge-tool/boundary/index.less

```less
.edge-tool-boundary-app {
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
### docs/demos/api/edge-tool/button/index.less

```less
.edge-tool-button-app {
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
### docs/demos/api/edge-tool/button-remove/index.less

```less
.edge-tool-button-remove-app {
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
### docs/demos/api/edge-tool/arrowhead/index.less

```less
.edge-tool-arrowhead-app {
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
### docs/demos/api/node-tool/node-editor/index.less

```less
.node-editor-tool-app {
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
### docs/demos/api/edge-tool/custom-vertices/index.less

```less
.edge-tool-custom-vertices-app {
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
### docs/demos/api/edge-tool/custom-arrowhead/index.less

```less
.edge-tool-custom-arrowhead-app {
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
