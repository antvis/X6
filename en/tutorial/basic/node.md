---
title: "Nodes"
description: "Nodes"
language: "en"
canonical: "https://x6.antv.antgroup.com/en/tutorial/basic/node/"
version: "3.x"
---

[Resource index](/llms.txt)

> **This chapter mainly introduces knowledge related to nodes. By reading, you can learn about**

- Node rendering methods supported by X6
- Methods for adding nodes
- Built-in node types in X6
- How to customize nodes
- How to modify nodes through the API


## Node Rendering Methods

X6 is based on an `SVG` rendering engine, which allows for rendering nodes and edges using different SVG elements, making it particularly suitable for scenarios where node content is relatively simple. For more complex nodes, there is a special `foreignObject` element in `SVG` that can embed any XHTML elements. This element can be used to render HTML, React/Vue/Angular components at the desired location, greatly facilitating project development.

When choosing a rendering method, we recommend:

- If the node content is relatively simple and the requirements are fixed, use `SVG` nodes.
- For other scenarios, it is recommended to use the framework currently employed in the project to render nodes.

> **Note**

The React/Vue/HTML rendering methods also have some limitations. Due to browser compatibility issues, there may occasionally be some abnormal rendering behaviors, primarily manifested as incomplete node content display or flickering of node content. This can be mitigated by avoiding the use of `position:absolute`, `position:relative`, `transform`, and `opacity` in the CSS styles of internal elements of the node.

The following introduction is based on `SVG` nodes, but the usage of other rendering forms is very similar, and we will revisit this in the advanced tutorial.

## Adding Nodes

Both nodes and edges share a common base class [Cell](/en/api/model/cell). In addition to inheriting properties from `Cell`, they also support the following options.

| Property Name | Type   | Default Value | Description                       |
|---------------|--------|---------------|-----------------------------------|
| x             | number | 0             | Node position x coordinate, in px. |
| y             | number | 0             | Node position y coordinate, in px. |
| width         | number | 1             | Node width, in px.                |
| height        | number | 1             | Node height, in px.               |
| angle         | number | 0             | Node rotation angle.               |

```ts
graph.addNode({
  shape: 'rect',
  x: 100,
  y: 40,
  width: 100,
  height: 40,
})
```

## Built-in Nodes

The above example uses `shape` to specify the node's graphic, with the default value of `shape` being `rect`. The correspondence between X6 built-in nodes and `shape` names is as follows:

| Constructor       | Shape Name | Description                                           |
|-------------------|------------|-----------------------------------------------------|
| Shape.Rect        | rect       | Rectangle.                                          |
| Shape.Circle      | circle     | Circle.                                            |
| Shape.Ellipse     | ellipse    | Ellipse.                                          |
| Shape.Polygon     | polygon    | Polygon.                                          |
| Shape.Polyline    | polyline   | Polyline.                                         |
| Shape.Path        | path       | Path.                                            |
| Shape.Image       | image      | Image.                                           |
| Shape.HTML        | html       | HTML node, uses `foreignObject` to render HTML fragments. |



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



## Customizing Nodes

We can customize the shape and style of nodes using `markup` and `attrs`, where `markup` is analogous to `HTML` and `attrs` is analogous to `CSS`. It is strongly recommended to read the documentation on [markup](/en/api/model/cell#markup) and [attrs](/en/api/model/cell#attrs) carefully.

Next, we may encounter a problem: if the customized content needs to be used by multiple nodes, do we need to redefine it for each node? The answer is no. X6 provides a convenient way to allow different nodes to reuse configurations.



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



## Modifying Nodes

After rendering is complete, we can also modify all properties of a node through the API. The two methods we commonly use are:

- node.prop(path, value), for detailed usage see [prop](/en/api/model/cell#node-and-edge-properties).
- node.attr(path, value), for detailed usage see [attr](/en/api/model/cell#element-attributes-attrs).

First, let's look at `prop`. We will directly print the `prop` values of the default rect node in X6.

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

// Result
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

From the above result, we can see that `prop` is a new configuration after processing, and its values can be updated through methods. After updating, the node will immediately refresh to the latest state. To modify the node's `attrs` more conveniently, X6 provides the `attr` method.

```ts
source.prop('size', { width: 120, height: 50 }) // Modify size
source.attr('rect/fill', '#ccc') // Modify fill color, equivalent to source.prop('attrs/rect/fill', '#ccc')
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



In the above JSON output, we can see that some properties like `refWidth` and `refHeight` are not native SVG properties. They are actually special properties built into X6, such as `refWidth`, which represents relative width. For more detailed special properties, refer to [attrs](/en/api/model/attrs).
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
