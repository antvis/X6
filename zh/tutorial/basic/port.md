---
title: "连接桩"
description: "连接桩"
language: "zh"
canonical: "https://x6.antv.antgroup.com/zh/tutorial/basic/port/"
version: "3.x"
---

[资料索引](/llms.txt)

> **在本章节中主要介绍连接桩相关的知识，通过阅读，你可以了解到**

- 如何在节点中配置连接桩
- 连接桩的增、删、改
- 如何配置连接桩的位置
- 如何配置连接桩上标签的位置


## 配置连接桩

首先我们将具有相同行为和外观的连接桩归为同一组，并通过 `groups` 选项来设置分组，该选项是一个对象 `{ [groupName: string]: PortGroupMetadata }`，组名为键，值为每组连接桩的默认选项，支持的选项如下：

```ts
interface PortGroupMetadata {
  markup?: Markup // 连接桩 DOM 结构定义。
  attrs?: Attr.CellAttrs // 属性和样式。
  zIndex?: number | 'auto' // 连接桩的 DOM 层级，值越大层级越高。
  // 分组中连接桩的布局。
  position?: [number, number] | string | { name: string; args?: object }
  label?: {
    // 连接桩标签
    markup?: Markup
    position?: {
      // 连接桩标签布局
      name: string // 布局名称
      args?: object // 布局参数
    }
  }
}
```

然后我们配置 `items`，`items` 是一个数组 `PortMetadata[]`，数组的每一项表示一个连接桩，连接桩支持的选项如下：

```ts
interface PortMetadata {
  id?: string // 连接桩唯一 ID，默认自动生成。
  group?: string // 分组名称，指定分组后将继承分组中的连接桩选项。
  args?: object // 为群组中指定的连接桩布局算法提供参数，我们不能为单个连接桩指定布局算法，但可以为群组中指定的布局算法提供不同的参数。
  markup?: Markup // 连接桩的 DOM 结构定义。指定该选项后将覆盖 `group` 指代的群组提供的默认选项。
  attrs?: Attr.CellAttrs // 元素的属性样式。指定该选项后将覆盖 `group` 指代的群组提供的默认选项。
  zIndex?: number | 'auto' // 连接桩的 DOM 层级，值越大层级越高。指定该选项后将覆盖 `group` 指代的群组提供的默认选项。
  label?: {
    // 连接桩的标签。指定该选项后将覆盖 `group` 指代的群组提供的默认选项。
    markup?: Markup // 标签 DOM 结构
    position?: {
      // 标签位置
      name: string // 标签位置计算方法的名称
      args?: object // 标签位置计算方法的参数
    }
  }
}
```

下方示例展示了连接桩的定义方式。



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
        top: {
          position: 'top',
          attrs: {
            circle: {
              magnet: true,
              stroke: '#8f8f8f',
              r: 5,
            },
          },
        },
        bottom: {
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
    const graph = new Graph({
      container: this.container,
      background: {
        color: '#F2F7FA',
      },
    })

    const source = graph.addNode({
      shape: 'custom-node-with-port',
      x: 40,
      y: 40,
      label: 'hello',
      ports: {
        items: [
          {
            id: 'port_1',
            group: 'bottom',
          },
          {
            id: 'port_2',
            group: 'bottom',
          },
        ],
      },
    })

    const target = graph.addNode({
      shape: 'custom-node-with-port',
      x: 160,
      y: 180,
      label: 'world',
      ports: {
        items: [
          {
            id: 'port_3',
            group: 'top',
          },
          {
            id: 'port_4',
            group: 'top',
          },
        ],
      },
    })

    graph.addEdge({
      source: { cell: source, port: 'port_2' },
      target: { cell: target, port: 'port_3' },
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
      <div className="config-app">
        <div className="app-content" ref={this.refContainer} />
      </div>
    )
  }
}

const root = createRoot(document.getElementById('container')!)
root.render(<Example />)
window.addEventListener('pagehide', () => root.unmount(), { once: true })
```



## 修改连接桩

节点上有丰富的 [API](/zh/api/model/node#连接桩-ports) 对连接桩进行增、删、改操作。

```ts
// 添加连接桩
node.addPort({
  group: 'top',
  attrs: {
    text: {
      text: 'xx',
    },
  },
})

// 删除连接桩
node.removePort(portId)

// 更新连接桩
node.portProp(portId, 'attrs/circle/stroke', color)
```



```ts
import './index.less'
import { createRoot } from 'react-dom/client'
import React from 'react'
import { Graph, Node, Color } from '@antv/x6'
import { Button } from 'antd'

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
        top: {
          position: 'top',
          attrs: {
            circle: {
              magnet: true,
              stroke: '#8f8f8f',
              r: 5,
            },
          },
          label: {
            position: 'top',
          },
        },
        bottom: {
          position: 'bottom',
          attrs: {
            circle: {
              magnet: true,
              stroke: '#8f8f8f',
              r: 5,
            },
          },
          label: {
            position: 'top',
          },
        },
      },
    },
  },
  true,
)

const commands = [
  {
    key: 'addPort',
    label: 'addPort',
  },
  {
    key: 'removePort',
    label: 'removePort',
  },
  {
    key: 'updatePort',
    label: 'updatePort',
  },
]

export default class Example extends React.Component {
  private container: HTMLDivElement
  private graph: Graph

  componentDidMount() {
    const graph = new Graph({
      container: this.container,
      background: {
        color: '#F2F7FA',
      },
    })

    graph.addNode({
      id: '1',
      shape: 'custom-node-with-port',
      x: 150,
      y: 100,
      label: 'hello',
    })

    graph.centerContent()
    this.graph = graph
  }

  change = (command: string) => {
    const node = this.graph.getCellById('1') as Node
    const ports = node.getPorts()
    let color: string
    switch (command) {
      case 'addPort':
        node.addPort({
          group: 'top',
          attrs: {
            text: {
              text: `${ports.length + 1}`,
            },
          },
        })
        break
      case 'removePort':
        if (ports.length) {
          node.removePortAt(ports.length - 1)
        }
        break
      case 'updatePort':
        color = Color.randomHex()
        ports.forEach((port) => {
          node.portProp(port.id!, 'attrs/circle/stroke', color)
        })
        break
      default:
        break
    }
  }

  refContainer = (container: HTMLDivElement) => {
    this.container = container
  }

  render() {
    return (
      <div className="dynamic-app">
        <div className="app-btns">
          <Button.Group>
            {commands.map((item) => (
              <Button onClick={() => this.change(item.key)} key={item.key}>
                {item.label}
              </Button>
            ))}
          </Button.Group>
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



## 连接桩位置

连接桩布局算法只能通过 `groups` 中的 `position` 选项来指定，因为布局算法在计算连接桩位置时需要考虑到群组中的所有连接桩，我们在单个连接桩中可以通过 `args` 选项来影响该连接桩的布局结果。

我们默认提供了下面几种连接桩布局算法，同时支持[自定义连接桩布局算法并注册使用](/zh/api/registry/port-layout)，点击下面的链接可以了解每种布局算法的使用方法。

- [`absolute`](/zh/api/registry/port-layout#absolute) 绝对定位。
- [`left`](/zh/api/registry/port-layout#left-right-top-bottom) 矩形节点左侧均匀分布。
- [`right`](/zh/api/registry/port-layout#left-right-top-bottom) 矩形节点右侧均匀分布。
- [`top`](/zh/api/registry/port-layout#left-right-top-bottom) 矩形节点顶部均匀分布。
- [`bottom`](/zh/api/registry/port-layout#left-right-top-bottom) 矩形节点底部均匀分布。
- [`line`](/zh/api/registry/port-layout#line) 沿指定的线均匀分布。
- [`ellipse`](/zh/api/registry/port-layout#ellipse) 沿椭圆圆弧分布。
- [`ellipseSpread`](/zh/api/registry/port-layout#ellipsespread) 沿椭圆均匀分布。

## 连接桩标签位置

在 `groups.label.position` 选项和节点的 `ports.items.label.position` 选项中都可以指定标签的位置。

我们默认提供了下面几种标签位置，也支持[自定义标签位置并注册使用](/zh/api/registry/port-label-layout)，点击下面的链接了解每种标签位置的使用方法。

- [`left`](/zh/api/registry/port-label-layout#side) 标签位于连接桩左侧。
- [`right`](/zh/api/registry/port-label-layout#side) 标签位于连接桩右侧。
- [`top`](/zh/api/registry/port-label-layout#side) 标签位于连接桩上方。
- [`bottom`](/zh/api/registry/port-label-layout#side) 标签位于连接桩下方。
- [`inside`](/zh/api/registry/port-label-layout#insideoutside) 标签位于节点内围（靠近边线的内侧）。
- [`outside`](/zh/api/registry/port-label-layout#insideoutside) 标签位于节点外围（靠近边线的外侧）。
- [`insideOriented`](/zh/api/registry/port-label-layout#insideoutside) 标签位于节点内围，而且根据所在方位自动调整文本的方向。
- [`outsideOriented`](/zh/api/registry/port-label-layout#insideoutside) 标签位于节点外围，而且根据所在方位自动调整文本的方向。
- [`radial`](/zh/api/registry/port-label-layout#radial) 标签位于圆形或椭圆形节点的外围。
- [`radialOriented`](/zh/api/registry/port-label-layout#radial) 标签位于圆形或椭圆形节点的外围，并使标签文本自动沿圆弧方向旋转。
### docs/demos/tutorial/basic/ports/config/index.less

```less
.config-app {
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
### docs/demos/tutorial/basic/ports/dynamic/index.less

```less
.dynamic-app {
  border: 1px solid #f0f0f0;
  padding: 16px 8px;
  font-family: sans-serif;

  .app-btns {
    bottom: 0;
    margin: 0;
    padding: 0 8px;
  }

  .app-content {
    width: 100%;
    height: 240px;
    margin: 0;
    margin-top: 16px;
    border-radius: 5px;
    box-shadow: 0 12px 5px -10px rgb(0 0 0 / 10%), 0 0 4px 0 rgb(0 0 0 / 10%);
  }
}
```
