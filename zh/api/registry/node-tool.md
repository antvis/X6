---
title: "节点工具"
description: "节点工具"
language: "zh"
canonical: "https://x6.antv.antgroup.com/zh/api/registry/node-tool/"
version: "3.x"
---

[资料索引](/llms.txt)

节点小工具是一些渲染在节点上的一些小组件，这些小工具通常都附带一些交互功能，如删除按钮，点击按钮时删除对应的节点。我们可以根据下面的一些场景来添加或删除小工具。

```ts
// 创建节点时添加小工具
graph.addNode({
  ...,
  tools: [
    {
      name: 'button-remove',
      args: { x: 10, y: 10 },
    },
  ],
})

// 创建节点后添加小工具
node.addTools([
  {
    name: 'button-remove',
    args: { x: 10, y: 10 },
  },
])

// 删除工具
graph.on("node:mouseleave", ({ node }) => {
  if (node.hasTool("button-remove")) {
    node.removeTool("button-remove");
  }
});
```

在 X6 中默认提供了以下几个用于节点的小工具：

- [button](#button) 在指定位置处渲染一个按钮，支持自定义按钮的点击交互。
- [button-remove](#button-remove) 在指定的位置处，渲染一个删除按钮，点击时删除对应的节点。
- [boundary](#boundary) 根据节点的包围盒渲染一个包围节点的矩形。注意，该工具仅仅渲染一个矩形，不带任何交互。
- [node-editor](#node-editor) 提供节点文本编辑功能。

## 内置工具

### button

在指定位置处渲染一个按钮，支持自定义按钮的点击交互。配置如下：

| 参数名          | 类型                                                                   | 默认值 | 说明                                                                                                     |
|-----------------|------------------------------------------------------------------------|--------|--------------------------------------------------------------------------------------------------------|
| x               | number \| string                                                       | `0`    | 相对于节点的左上角 X 轴的坐标，小数和百分比表示相对位置。                                                  |
| y               | number \| string                                                       | `0`    | 相对于节点的左上角 Y 轴的坐标，小数和百分比表示相对位置。                                                  |
| offset          | number \| `{ x: number, y: number }`                                   | `0`    | 在 `x` 和 `y` 基础上的偏移量。                                                                            |
| rotate          | boolean                                                                | -      | 是否跟随节点旋转。                                                                                        |
| useCellGeometry | boolean                                                                | `true` | 是否使用几何计算的方式来计算元素包围盒，开启后会有性能上的提升，如果出现计算准度问题，请将它设置为 `false`。 |
| markup          | Markup.JSONMarkup                                                      | -      | 渲染按钮的 Markup 定义。                                                                                  |
| onClick         | `(args: {e: Dom.MouseDownEvent, cell: Cell, view: CellView }) => void` | -      | 点击按钮的回调函数。                                                                                      |

```ts
// 鼠标 Hover 时添加按钮
graph.on('node:mouseenter', ({ node }) => {
  node.addTools({
    name: 'button',
    args: {
      markup: ...,
      x: 0,
      y: 0,
      offset: { x: 18, y: 18 },
      onClick({ view }) { ... },
    },
  })
})

// 鼠标移开时删除按钮
graph.on('node:mouseleave', ({ node }) => {
   node.removeTools() // 删除所有的工具
})
```



```ts
import './index.less'
import { createRoot } from 'react-dom/client'
import React from 'react'
import { Graph, Color, NodeView } from '@antv/x6'

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
      x: 40,
      y: 40,
      width: 120,
      height: 48,
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
      tools: [
        {
          name: 'button',
          args: {
            markup: [
              {
                tagName: 'circle',
                selector: 'button',
                attrs: {
                  r: 14,
                  stroke: '#fe854f',
                  'stroke-width': 3,
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
                  'font-size': 8,
                  'text-anchor': 'middle',
                  'pointer-events': 'none',
                  y: '0.3em',
                },
              },
            ],
            x: '100%',
            y: '100%',
            offset: { x: -18, y: -18 },
            onClick({ view }: { view: NodeView }) {
              const node = view.cell
              const fill = Color.randomHex()
              node.attr({
                body: {
                  fill,
                },
                label: {
                  fill: Color.invert(fill, true),
                },
              })
            },
          },
        },
      ],
    })

    const target = graph.addNode({
      x: 160,
      y: 180,
      width: 120,
      height: 48,
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

    graph.on('node:mouseenter', ({ node }) => {
      if (node === target) {
        node.addTools({
          name: 'button',
          args: {
            markup: [
              {
                tagName: 'circle',
                selector: 'button',
                attrs: {
                  r: 14,
                  stroke: '#fe854f',
                  'stroke-width': 3,
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
                  'font-size': 8,
                  'text-anchor': 'middle',
                  'pointer-events': 'none',
                  y: '0.3em',
                },
              },
            ],
            x: 0,
            y: 0,
            offset: { x: 18, y: 18 },
            onClick({ view }: { view: NodeView }) {
              const node = view.cell
              const offset = parseInt(
                node.attr('body/strokeDashoffset') || '0',
                10,
              )
              node.attr({
                body: {
                  stroke: Color.randomHex(),
                  strokeDasharray: '5, 1',
                  strokeDashoffset: offset + 20,
                },
              })
            },
          },
        })
      }
    })

    graph.on('node:mouseleave', ({ cell }) => {
      if (cell === target) {
        cell.removeTools()
      }
    })

    graph.centerContent()
  }

  refContainer = (container: HTMLDivElement) => {
    this.container = container
  }

  render() {
    return (
      <div className="button-tool-app">
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

在指定的位置处，渲染一个删除按钮，点击时删除对应的节点。它是上面 `button` 工具的一个特例，所以支持 `button` 的所有配置。

```ts
const source = graph.addNode({
  ...,
  // 添加一个始终显示的删除按钮
  tools: [
    {
      name: 'button-remove',
      args: {
        x: '100%',
        y: 0,
        offset: { x: -10, y: 10 },
      },
    },
  ],
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
      tools: [
        {
          name: 'button-remove',
          args: {
            x: '100%',
            y: 0,
            offset: { x: -10, y: 10 },
          },
        },
      ],
    })

    const target = graph.addNode({
      x: 120,
      y: 160,
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

    graph.on('node:mouseenter', ({ node }) => {
      if (node === target) {
        node.addTools({
          name: 'button-remove',
          args: {
            x: 0,
            y: 0,
            offset: { x: 10, y: 10 },
          },
        })
      }
    })

    graph.on('node:mouseleave', ({ node }) => {
      if (node === target) {
        node.removeTools()
      }
    })

    graph.centerContent()
  }

  refContainer = (container: HTMLDivElement) => {
    this.container = container
  }

  render() {
    return (
      <div className="button-remove-tool-app">
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

根据节点的包围盒渲染一个包围节点的矩形。注意，该工具仅仅渲染一个矩形，不带任何交互。配置如下：

| 参数名          | 类型        | 默认值   | 说明                                                                                                     |
|-----------------|-------------|----------|--------------------------------------------------------------------------------------------------------|
| tagName         | string      | `rect`   | 使用何种图形渲染。                                                                                        |
| rotate          | boolean     | -        | 图形是否跟随节点旋转。                                                                                    |
| padding         | SideOptions | `10`     | 边距。                                                                                                    |
| attrs           | KeyValue    | `object` | 图形属性。                                                                                                |
| useCellGeometry | boolean     | `true`   | 是否使用几何计算的方式来计算元素包围盒，开启后会有性能上的提升，如果出现计算准度问题，请将它设置为 `false`。 |

其中 `attrs` 的默认值(默认样式)为：

```ts
{
  fill: 'none',
  stroke: '#333',
  'stroke-width': 0.5,
  'stroke-dasharray': '5, 5',
  'pointer-events': 'none',
}
```

`SideOptions` 的类型定义如下：

```typescript
type SideOptions =
  | number
  | {
      vertical?: number
      horizontal?: number
      left?: number
      top?: number
      right?: number
      bottom?: number
    }
```

工具使用方式如下：

```ts
const source = graph.addNode({
  ...,
  tools: [
    {
      name: 'boundary',
      args: {
        padding: 5,
        attrs: {
          fill: '#7c68fc',
          stroke: '#333',
          'stroke-width': 1,
          'fill-opacity': 0.2,
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

    const source = graph.addNode({
      x: 40,
      y: 40,
      width: 100,
      height: 40,
      label: 'source',
      tools: [
        {
          name: 'boundary',
          args: {
            padding: 5,
            attrs: {
              fill: '#7c68fc',
              stroke: '#333',
              'stroke-width': 1,
              'fill-opacity': 0.2,
            },
          },
        },
      ],
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
      x: 120,
      y: 160,
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

    graph.on('node:mouseenter', ({ node }) => {
      if (node === target) {
        node.addTools({
          name: 'boundary',
          args: {
            attrs: {
              fill: '#7c68fc',
              stroke: '#333',
              'stroke-width': 1,
              'fill-opacity': 0.2,
            },
          },
        })
      }
    })

    graph.on('node:mouseleave', ({ node }) => {
      if (node === target) {
        node.removeTools()
      }
    })

    graph.centerContent()
  }

  refContainer = (container: HTMLDivElement) => {
    this.container = container
  }

  render() {
    return (
      <div className="boundary-tool-app">
        <div className="app-content" ref={this.refContainer} />
      </div>
    )
  }
}

const root = createRoot(document.getElementById('container')!)
root.render(<Example />)
window.addEventListener('pagehide', () => root.unmount(), { once: true })
```



### node-editor

提供节点上文本编辑功能。配置如下：

| 参数名                | 类型                                                                    | 默认值                         | 说明                                                           |
|-----------------------|-------------------------------------------------------------------------|--------------------------------|--------------------------------------------------------------|
| x                     | number \| string                                                        | -                              | 相对于节点的左上角 X 轴的坐标，小数和百分比表示相对位置         |
| y                     | number \| string                                                        | -                              | 相对于节点的左上角 Y 轴的坐标，小数和百分比表示相对位置         |
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
  node.addTools({
    name: 'node-editor',
    args: {
      event: e,
    },
  })
})

// 2.8.0 版本之后使用方式
node.addTools({
  name: 'node-editor',
})
```

还需要注意的是，如果在节点中自定义了 `markup`，往往需要自定义 `getText` 和 `setText` 方法来正确获取和设置编辑文本，这两个配置都支持函数和字符串两种形式，函数比较好理解，字符串其实就是要获取或者设置的文本的属性路径，一般情况下建议使用字符串形式，这样图数据可以完全序列化(因为函数无法序列化)，否则可能会出现渲染画布后文本编辑功能异常，比如：

```typescript
node.addTools({
  name: 'node-editor',
  args: {
    getText: 'a/b',
    setText: 'c/d',
  },
})
```

上面配置表示：

- 获取编辑文本：`node.attr('a/b')`
- 设置编辑文本：`node.attr('c/d', value)`



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
Graph.registerNodeTool('button', Button)
```

### 方式二

继承已经注册的工具，在继承基础上修改配置。我们在 `ToolItem` 基类上提供了一个静态方法 `define` 来快速实现继承并修改配置。

```ts
const MyButton = Button.define<Button.Options>({
  name: 'my-btn',
  markup: ...,
  onClick({ view }) { ... },
})

Graph.registerNodeTool('my-btn', MyButton, true)
```

同时，我们为 `Graph.registerNodeTool` 方法提供了一种快速继承并指定默认选项的实现：

```ts
Graph.registerNodeTool('my-btn', {
  inherit:'button', // 基类名称，使用已经注册的工具名称。
  markup: ...,
  onClick: ...,
})
```



```ts
import './index.less'
import { createRoot } from 'react-dom/client'
import React from 'react'
import { Graph, Color, CellView } from '@antv/x6'

Graph.registerNodeTool(
  'my-btn',
  {
    inherit: 'button',
    markup: [
      {
        tagName: 'rect',
        selector: 'button',
        attrs: {
          width: 40,
          height: 20,
          rx: 4,
          ry: 4,
          fill: 'white',
          stroke: '#fe854f',
          'stroke-width': 2,
          cursor: 'pointer',
        },
      },
      {
        tagName: 'text',
        selector: 'text',
        textContent: 'btn',
        attrs: {
          fill: '#fe854f',
          'font-size': 10,
          'text-anchor': 'middle',
          'pointer-events': 'none',
          x: 20,
          y: 13,
        },
      },
    ],
    onClick({ view }: { view: CellView }) {
      const node = view.cell
      const fill = Color.randomHex()
      node.attr({
        body: {
          fill,
        },
        label: {
          fill: Color.invert(fill, true),
        },
      })
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
      x: 40,
      y: 40,
      width: 140,
      height: 48,
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
      tools: [
        {
          name: 'my-btn',
          args: {
            x: '100%',
            y: '100%',
            offset: { x: -44, y: -24 },
          },
        },
      ],
    })

    const target = graph.addNode({
      x: 160,
      y: 160,
      width: 140,
      height: 48,
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
  }

  refContainer = (container: HTMLDivElement) => {
    this.container = container
  }

  render() {
    return (
      <div className="custom-button-tool-app">
        <div className="app-content" ref={this.refContainer} />
      </div>
    )
  }
}

const root = createRoot(document.getElementById('container')!)
root.render(<Example />)
window.addEventListener('pagehide', () => root.unmount(), { once: true })
```
### docs/demos/api/node-tool/button/index.less

```less
.button-tool-app {
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
### docs/demos/api/node-tool/button-remove/index.less

```less
.button-remove-tool-app {
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
### docs/demos/api/node-tool/boundary/index.less

```less
.boundary-tool-app {
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
### docs/demos/api/node-tool/custom-button/index.less

```less
.custom-button-tool-app {
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
