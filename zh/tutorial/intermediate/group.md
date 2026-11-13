---
title: "群组"
description: "群组"
language: "zh"
canonical: "https://x6.antv.antgroup.com/zh/tutorial/intermediate/group/"
version: "3.x"
---

[资料索引](/llms.txt)

> **在本章节中主要介绍组合相关的知识，通过阅读，你可以了解到**

- 如何组合节点
- 如何通过交互方式组合节点
- 如何在群组内限制子节点移动
- 如何自动扩展父节点
- 如何实现父节点的展开/折叠

## 组合节点

我们可以通过父子关系来实现群组，并提供了一系列用于获取与设置组合关系的[方法](/zh/api/model/cell#父子关系-parentchildren)。



```ts
import './index.less'
import { createRoot } from 'react-dom/client'
import React from 'react'
import { Graph } from '@antv/x6'

Graph.registerNode(
  'custom-group-node',
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
      shape: 'custom-group-node',
      x: 60,
      y: 100,
      label: 'Child\n(inner)',
      zIndex: 2,
    })

    const target = graph.addNode({
      shape: 'custom-group-node',
      x: 420,
      y: 80,
      label: 'Child\n(outer)',
      zIndex: 2,
    })

    const parent = graph.addNode({
      shape: 'custom-group-node',
      x: 40,
      y: 40,
      width: 360,
      height: 160,
      zIndex: 1,
      label: 'Parent\n(try to move me)',
    })

    parent.addChild(source)
    parent.addChild(target)

    graph.addEdge({
      source,
      target,
      vertices: [
        { x: 120, y: 60 },
        { x: 200, y: 100 },
      ],
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
      <div className="embed-edge-app">
        <div className="app-content" ref={this.refContainer} />
      </div>
    )
  }
}

const root = createRoot(document.getElementById('container')!)
root.render(<Example />)
window.addEventListener('pagehide', () => root.unmount(), { once: true })
```



从上述示例可以看出：

- 当移动父节点时子节点也会跟着移动，即便子节点位于父节点外部。
- 默认将边的起点和终点的共同父节点视为边的父节点。移动父节点时，边的路径点将跟随移动。

## 通过交互组合节点

有时需要将一个节点拖入另一个节点，使其成为后者的子节点。此时可以开启 `embedding` 选项，并在节点移动时通过 `findParent` 指定的方法返回父节点。详细配置参见 [API](/zh/tutorial/basic/interacting#组合)。



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
      embedding: {
        enabled: true,
        findParent({ node }) {
          const bbox = node.getBBox()
          return this.getNodes().filter((node) => {
            const data = node.getData<{ parent: boolean }>()
            if (data && data.parent) {
              const targetBBox = node.getBBox()
              return bbox.isIntersectWithRect(targetBBox)
            }
            return false
          })
        },
      },
    })

    graph.addNode({
      shape: 'custom-node',
      x: 40,
      y: 140,
      width: 120,
      height: 60,
      label: 'Child\n(unembed)',
      zIndex: 10,
    })

    graph.addNode({
      shape: 'custom-node',
      x: 500,
      y: 100,
      width: 120,
      height: 60,
      label: 'Child\n(unembed)',
      zIndex: 10,
    })

    graph.addNode({
      shape: 'custom-node',
      x: 200,
      y: 80,
      width: 240,
      height: 160,
      zIndex: 1,
      label: 'Parent',
      data: {
        parent: true,
      },
    })

    graph.on('node:change:parent', ({ node }) => {
      node.attr({
        label: {
          text: 'Child\n(embed)',
        },
      })
    })
  }

  refContainer = (container: HTMLDivElement) => {
    this.container = container
  }

  render() {
    return (
      <div className="embedding-app">
        <div className="app-content" ref={this.refContainer} />
      </div>
    )
  }
}

const root = createRoot(document.getElementById('container')!)
root.render(<Example />)
window.addEventListener('pagehide', () => root.unmount(), { once: true })
```



## 限制子节点的移动

需要将子节点的移动范围限制在父节点内时，可在创建 `Graph` 实例时通过 `translating.restrict` 选项实现。



```ts
import './index.less'
import { createRoot } from 'react-dom/client'
import React from 'react'
import { Graph } from '@antv/x6'

Graph.registerNode(
  'custom-group-node',
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
      translating: {
        restrict(view) {
          if (view) {
            const cell = view.cell
            if (cell.isNode()) {
              const parent = cell.getParent()
              if (parent) {
                return parent.getBBox()
              }
            }
          }
          return null
        },
      },
    })

    const child = graph.addNode({
      shape: 'custom-group-node',
      x: 100,
      y: 60,
      label: 'Child',
      zIndex: 2,
    })

    const parent = graph.addNode({
      shape: 'custom-group-node',
      x: 40,
      y: 40,
      width: 240,
      height: 160,
      zIndex: 1,
      label: 'Parent\n(try to move me)',
    })

    parent.addChild(child)
  }

  refContainer = (container: HTMLDivElement) => {
    this.container = container
  }

  render() {
    return (
      <div className="restrict-app">
        <div className="app-content" ref={this.refContainer} />
      </div>
    )
  }
}

const root = createRoot(document.getElementById('container')!)
root.render(<Example />)
window.addEventListener('pagehide', () => root.unmount(), { once: true })
```



## 自动扩展父节点

监听 `node:change:position` 事件，在子节点移动时自动扩展/收缩父节点的尺寸，使父节点完全包围子节点。该示例代码略复杂，可通过下方 Demo 的 `CodeSandbox` 链接查看完整代码。



```ts
import './index.less'
import { createRoot } from 'react-dom/client'
import React from 'react'
import { Graph, Dom } from '@antv/x6'
import { Settings, State } from './settings.tsx'

Graph.registerNode(
  'custom-group-node',
  {
    inherit: 'rect',
    width: 80,
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
  private embedPadding = 20

  componentDidMount() {
    const graph = new Graph({
      container: this.container,
      background: {
        color: '#F2F7FA',
      },
      embedding: {
        enabled: true,
      },
    })

    const source = graph.addNode({
      shape: 'custom-group-node',
      x: 80,
      y: 100,
      width: 80,
      height: 40,
      label: 'Child',
      zIndex: 2,
    })

    const target = graph.addNode({
      shape: 'custom-group-node',
      x: 280,
      y: 80,
      label: 'Child',
      zIndex: 2,
    })

    const parent = graph.addNode({
      shape: 'custom-group-node',
      x: 40,
      y: 40,
      width: 360,
      height: 160,
      zIndex: 1,
      label: 'Parent',
    })

    parent.addChild(source)
    parent.addChild(target)

    let ctrlPressed = false

    graph.on('node:embedding', ({ e }: { e: Dom.MouseMoveEvent }) => {
      ctrlPressed = e.metaKey || e.ctrlKey
    })

    graph.on('node:embedded', () => {
      ctrlPressed = false
    })

    graph.on('node:change:size', ({ node, options }) => {
      if (options.skipParentHandler) {
        return
      }

      const children = node.getChildren()
      if (children && children.length) {
        node.prop('originSize', node.getSize())
      }
    })

    graph.on('node:change:position', ({ node, options }) => {
      if (options.skipParentHandler || ctrlPressed) {
        return
      }

      const children = node.getChildren()
      if (children && children.length) {
        node.prop('originPosition', node.getPosition())
      }

      const parent = node.getParent()
      if (parent && parent.isNode()) {
        let originSize = parent.prop('originSize')
        if (originSize == null) {
          originSize = parent.getSize()
          parent.prop('originSize', originSize)
        }

        let originPosition = parent.prop('originPosition')
        if (originPosition == null) {
          originPosition = parent.getPosition()
          parent.prop('originPosition', originPosition)
        }

        let x = originPosition.x
        let y = originPosition.y
        let cornerX = originPosition.x + originSize.width
        let cornerY = originPosition.y + originSize.height
        let hasChange = false

        const children = parent.getChildren()
        if (children) {
          children.forEach((child) => {
            const bbox = child.getBBox().inflate(this.embedPadding)
            const corner = bbox.getCorner()

            if (bbox.x < x) {
              x = bbox.x
              hasChange = true
            }

            if (bbox.y < y) {
              y = bbox.y
              hasChange = true
            }

            if (corner.x > cornerX) {
              cornerX = corner.x
              hasChange = true
            }

            if (corner.y > cornerY) {
              cornerY = corner.y
              hasChange = true
            }
          })
        }

        if (hasChange) {
          parent.prop(
            {
              position: { x, y },
              size: { width: cornerX - x, height: cornerY - y },
            },
            // Note that we also pass a flag so that we know we shouldn't
            // adjust the `originPosition` and `originSize` in our handlers.
            { skipParentHandler: true },
          )
        }
      }
    })
  }

  refContainer = (container: HTMLDivElement) => {
    this.container = container
  }

  onSettingsChanged = (state: State) => {
    this.embedPadding = state.padding
  }

  render() {
    return (
      <div className="expand-shrink-app">
        <div className="app-side">
          <Settings onChange={this.onSettingsChanged} />
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



## 展开与折叠父节点

首先，我们自定义一个 `Group` 节点，在左上角渲染展开/折叠按钮，并为该按钮设置自定义事件 `node:collapse`：

```ts
import { Node } from '@antv/x6'

export class Group extends Node {
  private collapsed: boolean = false
  private expandSize: { width: number; height: number }

  protected postprocess() {
    this.toggleCollapse(false)
  }

  isCollapsed() {
    return this.collapsed
  }

  toggleCollapse(collapsed?: boolean) {
    const target = collapsed == null ? !this.collapsed : collapsed
    if (target) {
      this.attr('buttonSign', { d: 'M 1 5 9 5 M 5 1 5 9' })
      this.expandSize = this.getSize()
      this.resize(100, 32)
    } else {
      this.attr('buttonSign', { d: 'M 2 5 8 5' })
      if (this.expandSize) {
        this.resize(this.expandSize.width, this.expandSize.height)
      }
    }
    this.collapsed = target
  }
}

Group.config({
  markup: [
    {
      tagName: 'rect',
      selector: 'body',
    },
    {
      tagName: 'text',
      selector: 'label',
    },
    {
      tagName: 'g',
      selector: 'buttonGroup',
      children: [
        {
          tagName: 'rect',
          selector: 'button',
        },
        {
          tagName: 'path',
          selector: 'buttonSign',
        },
      ],
    },
  ],
  attrs: {
    body: { ... },
    label: { ... },
    buttonGroup: { ... },
    button: {
      ...
      // 自定义事件
      event: 'node:collapse',
    },
    buttonSign: { ... },
  },
})
```

随后，在 `graph` 上监听 `node:collapse` 事件，根据父节点的展开/折叠状态显示或隐藏对应的子节点：

```ts
graph.on('node:collapse', ({ node }: { node: Group }) => {
  node.toggleCollapse()
  const collapsed = node.isCollapsed()
  const cells = node.getDescendants()
  cells.forEach((node) => {
    if (collapsed) {
      node.hide()
    } else {
      node.show()
    }
  })
})
```



```ts
import './index.less'
import { createRoot } from 'react-dom/client'
import React from 'react'
import { Graph } from '@antv/x6'
import { Group } from './shape.ts'

Graph.registerNode(
  'custom-group-node',
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

    const createGroup = (
      id: string,
      x: number,
      y: number,
      width: number,
      height: number,
      fill: string,
    ) => {
      const group = new Group({
        id,
        x,
        y,
        width,
        height,
        attrs: {
          body: { fill },
          label: { text: id },
        },
      })
      graph.addNode(group)
      return group
    }

    const createNode = (
      id: string,
      x: number,
      y: number,
      width: number,
      height: number,
    ) => {
      return graph.addNode({
        shape: 'custom-group-node',
        id,
        x,
        y,
        width,
        height,
        label: id,
      })
    }

    const createEdge = (
      id: string,
      source: string,
      target: string,
      vertices?: { x: number; y: number }[],
    ) => {
      return graph.addEdge({
        id,
        source,
        target,
        vertices,
        label: id,
        attrs: {
          line: {
            stroke: '#8f8f8f',
            strokeWidth: 1,
          },
        },
      })
    }

    const a = createGroup('a', 100, 40, 480, 280, '#91d5ff')
    const aa = createGroup('aa', 180, 100, 160, 140, '#47C769')
    const aaa = createGroup('aaa', 200, 160, 120, 40, '#0491e4')
    const b = createNode('b', 450, 200, 50, 50)

    a.addChild(aa)
    aa.addChild(aaa)
    a.addChild(b)

    createNode('c', 680, 80, 50, 50)

    createEdge('edge1', 'aa', 'b')
    createEdge('edge3', 'b', 'c')
    aa.addChild(
      createEdge('edge2', 'aa', 'aaa', [
        { x: 60, y: 140 },
        { x: 60, y: 220 },
      ]),
    )

    graph.on('node:collapse', ({ node }: { node: Group }) => {
      node.toggleCollapse()
      const collapsed = node.isCollapsed()
      const collapse = (parent: Group) => {
        const cells = parent.getChildren()
        if (cells) {
          cells.forEach((cell) => {
            if (collapsed) {
              cell.hide()
            } else {
              cell.show()
            }

            if (cell instanceof Group) {
              if (!cell.isCollapsed()) {
                collapse(cell)
              }
            }
          })
        }
      }

      collapse(node)
    })
  }

  refContainer = (container: HTMLDivElement) => {
    this.container = container
  }

  render() {
    return (
      <div className="collapsable-app">
        <div className="app-content" ref={this.refContainer} />
      </div>
    )
  }
}

const root = createRoot(document.getElementById('container')!)
root.render(<Example />)
window.addEventListener('pagehide', () => root.unmount(), { once: true })
```
### docs/demos/tutorial/intermediate/group/embed-edge/index.less

```less
.embed-edge-app {
  display: flex;
  width: 100%;
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
}
```
### docs/demos/tutorial/basic/interacting/embedding/index.less

```less
.embedding-app {
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
### docs/demos/tutorial/intermediate/group/restrict/index.less

```less
.restrict-app {
  display: flex;
  width: 100%;
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
}
```
### docs/demos/tutorial/intermediate/group/expand-shrink/index.less

```less
.expand-shrink-app {
  display: flex;
  border: 1px solid #f0f0f0;
  padding: 16px 8px;
  font-family: sans-serif;

  .app-side {
    bottom: 0;
    padding: 0 8px;
  }

  .app-content {
    flex: 1;
    height: 240px;
    margin-right: 8px;
    margin-left: 8px;
    box-shadow: 0 0 10px 1px #e9e9e9;
  }

  .slider-value {
    display: inline-block;
    margin-left: 8px;
    padding: 3px 7px;
    color: #333;
    font-size: 12px;
    line-height: 1.25;
    background: #eee;
    border-radius: 10px;
  }

  .ant-card {
    box-shadow: 0 0 10px 1px #e9e9e9;
  }

  .ant-card-head-title {
    text-align: center;
  }

  .ant-row {
    margin: 16px 0;
    text-align: left;
  }
}
```
### docs/demos/tutorial/intermediate/group/expand-shrink/settings.tsx

```tsx
import React from 'react'
import { Card, Row, Col, Slider } from 'antd'

export interface Props {
  onChange: (res: State) => void
}

export interface State {
  padding: number
}

export class Settings extends React.Component<Props, State> {
  state: State = {
    padding: 20,
  }

  notifyChange() {
    this.props.onChange({
      ...this.state,
    })
  }

  onPaddingChanged = (padding: number) => {
    this.setState({ padding }, () => {
      this.notifyChange()
    })
  }

  render() {
    return (
      <Card
        title="Settings"
        size="small"
        bordered={false}
        style={{ width: 320 }}
      >
        <Row align="middle">
          <Col span={6}>Padding</Col>
          <Col span={12}>
            <Slider
              min={0}
              max={40}
              step={1}
              value={this.state.padding}
              onChange={this.onPaddingChanged}
            />
          </Col>
          <Col span={1} offset={1}>
            <div className="slider-value">{this.state.padding}</div>
          </Col>
        </Row>
        <Row align="middle" style={{ borderTop: '1px solid #f0f0f0' }}>
          <Col style={{ padding: '24px 0 8px 0', color: '#666' }}>
            Press and hold on{' '}
            <strong style={{ color: '#faad14' }}>Ctrl or Command</strong> key,
            then move the child node to remove it from parent node.
          </Col>
        </Row>
      </Card>
    )
  }
}
```
### docs/demos/tutorial/intermediate/group/collapsable/index.less

```less
.collapsable-app {
  display: flex;
  width: 100%;
  border: 1px solid #f0f0f0;
  padding: 16px 8px;
  font-family: sans-serif;

  .app-content {
    flex: 1;
    height: 360px;
    margin-right: 8px;
    margin-left: 8px;
    box-shadow: 0 0 10px 1px #e9e9e9;
  }
}
```
### docs/demos/tutorial/intermediate/group/collapsable/shape.ts

```ts
import { Node } from '@antv/x6'

export class Group extends Node {
  private collapsed = false
  private expandSize: { width: number; height: number }

  protected postprocess() {
    this.toggleCollapse(false)
  }

  isCollapsed() {
    return this.collapsed
  }

  toggleCollapse(collapsed?: boolean) {
    const target = collapsed == null ? !this.collapsed : collapsed
    if (target) {
      this.attr('buttonSign', { d: 'M 1 5 9 5 M 5 1 5 9' })
      this.expandSize = this.getSize()
      this.resize(100, 32)
    } else {
      this.attr('buttonSign', { d: 'M 2 5 8 5' })
      if (this.expandSize) {
        this.resize(this.expandSize.width, this.expandSize.height)
      }
    }
    this.collapsed = target
  }
}

Group.config({
  markup: [
    {
      tagName: 'rect',
      selector: 'body',
    },
    {
      tagName: 'text',
      selector: 'label',
    },
    {
      tagName: 'g',
      selector: 'buttonGroup',
      children: [
        {
          tagName: 'rect',
          selector: 'button',
          attrs: {
            'pointer-events': 'visiblePainted',
          },
        },
        {
          tagName: 'path',
          selector: 'buttonSign',
          attrs: {
            fill: 'none',
            'pointer-events': 'none',
          },
        },
      ],
    },
  ],
  attrs: {
    body: {
      refWidth: '100%',
      refHeight: '100%',
      stroke: 'none',
      fill: '#fff',
    },
    buttonGroup: {
      refX: 8,
      refY: 8,
    },
    button: {
      height: 14,
      width: 16,
      rx: 2,
      ry: 2,
      fill: '#f5f5f5',
      stroke: '#ccc',
      cursor: 'pointer',
      event: 'node:collapse',
    },
    buttonSign: {
      refX: 3,
      refY: 2,
      stroke: '#808080',
    },
    label: {
      fontSize: 12,
      fill: '#fff',
      refX: 32,
      refY: 10,
    },
  },
})
```
