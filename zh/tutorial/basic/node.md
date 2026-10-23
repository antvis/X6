---
title: "节点"
description: "节点"
language: "zh"
canonical: "https://x6.antv.antgroup.com/zh/tutorial/basic/node/"
version: "3.x"
---

[资料索引](/llms.txt)

> **在本章节中主要介绍节点相关的知识，通过阅读，你可以了解到**

- X6 支持的节点渲染方式
- 添加节点方法
- X6 内置的节点类型
- 如何自定义节点
- 如何通过 API 修改节点


## 节点渲染方式

X6 是基于 `SVG` 的渲染引擎，可以使用不同的 SVG 元素渲染节点和边，非常适合节点内容比较简单的场景。面对复杂的节点， `SVG` 中有一个特殊的 `foreignObject` 元素，在该元素中可以内嵌任何 XHTML 元素，可以借助该元素来渲染 HTML、React/Vue/Angular 组件到需要位置，这会给项目开发带来非常大的便利。

在选择渲染方式时我们推荐：

- 如果节点内容比较简单，而且需求比较固定，使用 `SVG` 节点
- 其他场景，都推荐使用当前项目所使用的框架来渲染节点

> **注意**

React/Vue/HTML 渲染方式也存在一些限制，因为浏览器的兼容性问题，有时会出现一些异常的渲染行为。主要表现形式为节点内容展示不全或者节点内容闪烁。可以通过一些方法规避，比如在节点内部元素的 css 样式中不要使用 `position:absolute`、`position:relative`、`transform`、`opacity`。

下面的介绍都是基于 `SVG` 节点，但是其他渲染形式的使用方式与其非常类似，在进阶教程中我们会再次介绍。

## 添加节点

节点和边都有共同的基类 [Cell](/zh/api/model/cell)，除了从 `Cell` 继承属性外，还支持以下选项。

| 属性名 | 类型   | 默认值 | 描述                       |
|--------|--------|--------|--------------------------|
| x      | number | 0      | 节点位置 x 坐标，单位为 px。 |
| y      | number | 0      | 节点位置 y 坐标，单位为 px。 |
| width  | number | 1      | 节点宽度，单位为 px。        |
| height | number | 1      | 节点高度，单位为 px。        |
| angle  | number | 0      | 节点旋转角度。              |

```ts
graph.addNode({
  shape: 'rect',
  x: 100,
  y: 40,
  width: 100,
  height: 40,
})
```

## 内置节点

上面使用 `shape` 来指定了节点的图形，`shape` 的默认值为 `rect`。X6 内置节点与 `shape` 名称对应关系如下表。

| 构造函数       | shape 名称 | 描述                                           |
|----------------|------------|----------------------------------------------|
| Shape.Rect     | rect       | 矩形。                                          |
| Shape.Circle   | circle     | 圆形。                                          |
| Shape.Ellipse  | ellipse    | 椭圆。                                          |
| Shape.Polygon  | polygon    | 多边形。                                        |
| Shape.Polyline | polyline   | 折线。                                          |
| Shape.Path     | path       | 路径。                                          |
| Shape.Image    | image      | 图片。                                          |
| Shape.HTML     | html       | HTML 节点，使用 `foreignObject` 渲染 HTML 片段。 |



```ts
import './index.less'
import { createRoot } from 'react-dom/client'
import React from 'react'
import { Graph } from '@antv/x6'

const commonAttrs = {
  body: {
    fill: '#fff',
    stroke: '#8f8f8f',
    strokeWidth: 1,
  },
  label: {
    refX: 0.5,
    refY: '100%',
    refY2: 4,
    textAnchor: 'middle',
    textVerticalAnchor: 'top',
  },
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

    graph.addNode({
      shape: 'rect',
      x: 40,
      y: 40,
      width: 80,
      height: 40,
      label: 'rect',
      attrs: commonAttrs,
    })

    graph.addNode({
      shape: 'circle',
      x: 180,
      y: 40,
      width: 40,
      height: 40,
      label: 'circle',
      attrs: commonAttrs,
    })

    graph.addNode({
      shape: 'ellipse',
      x: 280,
      y: 40,
      width: 80,
      height: 40,
      label: 'ellipse',
      attrs: commonAttrs,
    })

    graph.addNode({
      shape: 'path',
      x: 420,
      y: 40,
      width: 40,
      height: 40,
      // https://www.svgrepo.com/svg/13653/like
      path: 'M24.85,10.126c2.018-4.783,6.628-8.125,11.99-8.125c7.223,0,12.425,6.179,13.079,13.543c0,0,0.353,1.828-0.424,5.119c-1.058,4.482-3.545,8.464-6.898,11.503L24.85,48L7.402,32.165c-3.353-3.038-5.84-7.021-6.898-11.503c-0.777-3.291-0.424-5.119-0.424-5.119C0.734,8.179,5.936,2,13.159,2C18.522,2,22.832,5.343,24.85,10.126z',
      attrs: commonAttrs,
      label: 'path',
    })

    graph.addNode({
      shape: 'polygon',
      x: 60,
      y: 150,
      width: 40,
      height: 40,
      points: '100,10 40,198 190,78 10,78 160,198',
      attrs: commonAttrs,
      label: 'polygon',
    })

    graph.addNode({
      shape: 'polyline',
      x: 180,
      y: 150,
      width: 40,
      height: 40,
      label: 'polyline',
      attrs: {
        body: {
          ...commonAttrs.body,
          refPoints: '0,0 0,10 10,10 10,0',
        },
        label: commonAttrs.label,
      },
    })

    graph.addNode({
      shape: 'image',
      x: 290,
      y: 150,
      width: 60,
      height: 40,
      imageUrl:
        'https://gw.alipayobjects.com/os/s/prod/antv/assets/image/logo-with-text-73b8a.svg',
      label: 'image',
      attrs: commonAttrs,
    })
  }

  refContainer = (container: HTMLDivElement) => {
    this.container = container
  }

  render() {
    return (
      <div className="shapes-app">
        <div className="app-content" ref={this.refContainer} />
      </div>
    )
  }
}

const root = createRoot(document.getElementById('container')!)
root.render(<Example />)
window.addEventListener('pagehide', () => root.unmount(), { once: true })
```



## 定制节点

我们可以通过 `markup` 和 `attrs` 来定制节点的形状和样式，`markup` 可以类比 `HTML`，`attrs` 类比 `CSS`。强烈建议仔细阅读 [markup](/zh/api/model/cell#markup) 和 [attrs](/zh/api/model/cell#attrs) 文档。

接下来我们会遇到一个问题，定制的内容要被多个节点使用，是不是需要每个节点都重新定义一次呢？答案是否定的，X6 提供了便捷的方式，可以让不同的节点复用配置。



```ts
import './index.less'
import { createRoot } from 'react-dom/client'
import React from 'react'
import { Graph } from '@antv/x6'

Graph.registerNode(
  'custom-node',
  {
    inherit: 'rect', // 继承于 rect 节点
    width: 100,
    height: 40,
    markup: [
      {
        tagName: 'rect', // 标签名称
        selector: 'body', // 选择器
      },
      {
        tagName: 'image',
        selector: 'img',
      },
      {
        tagName: 'text',
        selector: 'label',
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
      img: {
        'xlink:href':
          'https://gw.alipayobjects.com/zos/antfincdn/FLrTNDvlna/antv.png',
        width: 16,
        height: 16,
        x: 12,
        y: 12,
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
      shape: 'custom-node', // 可以直接使用上面注册过的 shape
      x: 40,
      y: 40,
      label: 'hello',
    })

    const target = graph.addNode({
      shape: 'custom-node',
      x: 160,
      y: 180,
      label: 'world',
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
      <div className="registry-app">
        <div className="app-content" ref={this.refContainer} />
      </div>
    )
  }
}

const root = createRoot(document.getElementById('container')!)
root.render(<Example />)
window.addEventListener('pagehide', () => root.unmount(), { once: true })
```



## 修改节点

在渲染完成之后，我们还可以通过 API 修改节点的所有属性。我们会常用到下面两个方法：

- node.prop(path, value)，详细使用见 [prop](/zh/api/model/cell#节点和边的属性-properties)。
- node.attr(path, value)，详细使用见 [attr](/zh/api/model/cell#元素属性-attrs)。

首先来看 `prop`，我们直接打印 X6 默认 rect 节点的 `prop` 的值。

```ts
const node = graph.addNode({
  shape: 'rect',
  width: 100,
  height: 40,
  x: 100,
  y: 100,
  label: 'node',
})
console.log(node.prop())

// 结果
{
  "angle": 0,
  "position": {
    "x": 100,
    "y": 100
  },
  "size": {
    "width": 100,
    "height": 40
  },
  "attrs": {
    "text": {
      "fontSize": 14,
      "fill": "#000000",
      "refX": 0.5,
      "refY": 0.5,
      "textAnchor": "middle",
      "textVerticalAnchor": "middle",
      "fontFamily": "Arial, helvetica, sans-serif",
      "text": "node"
    },
    "rect": {
      "fill": "#ffffff",
      "stroke": "#333333",
      "strokeWidth": 2
    },
    "body": {
      "refWidth": "100%",
      "refHeight": "100%"
    }
  },
  "visible": true,
  "shape": "rect",
  "id": "ab47cadc-4104-457c-971f-50fbb077508a",
  "zIndex": 1
}
```

从上面结果可以看到，`prop` 是配置处理后的一份新的配置，它的值可以通过方法进行更新，更新之后，节点会立即刷新到最新状态。为了更快捷的修改节点的 `attrs`，X6 提供了 `attr` 方法。

```ts
source.prop('size', { width: 120, height: 50 }) // 修改尺寸
source.attr('rect/fill', '#ccc') // 修改填充色，等价于 source.prop('attrs/rect/fill', '#ccc')
```



```ts
import './index.less'
import { createRoot } from 'react-dom/client'
import React from 'react'
import { Graph, Color } from '@antv/x6'
import { Button } from 'antd'

Graph.registerNode(
  'custom-node',
  {
    inherit: 'rect', // 继承于 rect 节点
    width: 100,
    height: 40,
    markup: [
      {
        tagName: 'rect', // 标签名称
        selector: 'body', // 选择器
      },
      {
        tagName: 'image',
        selector: 'img',
      },
      {
        tagName: 'text',
        selector: 'label',
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
      img: {
        'xlink:href':
          'https://gw.alipayobjects.com/zos/antfincdn/FLrTNDvlna/antv.png',
        width: 16,
        height: 16,
        x: 12,
        y: 12,
      },
    },
  },
  true,
)

const commands = [
  {
    key: 'prop',
    label: 'prop',
  },
  {
    key: 'attr',
    label: 'attr',
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

    const source = graph.addNode({
      shape: 'custom-node',
      x: 40,
      y: 40,
      label: 'hello',
    })

    const target = graph.addNode({
      shape: 'custom-node',
      x: 160,
      y: 180,
      label: 'world',
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
    this.graph = graph
  }

  change = (command: string) => {
    const nodes = this.graph.getNodes()
    switch (command) {
      case 'prop':
        nodes.forEach((node) => {
          const width = 100 + Math.floor(Math.random() * 50)
          const height = 40 + Math.floor(Math.random() * 10)
          node.prop('size', { width, height })
        })
        break
      case 'attr':
        nodes.forEach((node) => {
          const color = Color.randomHex()
          node.attr('body/fill', color)
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
      <div className="node-prop-app ">
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



在上面的 JSON 数据中，我们可以看到有一些属性 `refWidth`、`refHeight` 并不是 SVG 的原生属性，它们其实是 X6 内置的特殊属性，比如 `refWidth` 就是相对宽度。更多详细的特殊属性参考 [attrs](/zh/api/model/attrs)。
### docs/demos/tutorial/basic/node/shapes/index.less

```less
.shapes-app {
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
### docs/demos/tutorial/basic/node/registry/index.less

```less
.registry-app {
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
### docs/demos/tutorial/basic/node/prop/index.less

```less
.node-prop-app {
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
