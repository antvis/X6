---
title: "Node Anchor"
description: "Node Anchor"
language: "en"
canonical: "https://x6.antv.antgroup.com/en/api/registry/node-anchor/"
version: "3.x"
---

[Resource index](/llms.txt)

When connecting to a node, you can specify the anchor point of the connected node using `NodeAnchor`, which, together with the connection point [ConnectionPoint](/en/api/registry/connection-point), determines the starting and ending points of the edge.

-  Starting point: Draw a reference line from the first path point or the center of the target node (when there is no path point) to the anchor point of the source node, and then calculate the intersection point of the reference line and the graph according to the intersection calculation method specified by [connectionPoint](/en/api/registry/connection-point), which is the starting point of the edge.
-  Ending point: Draw a reference line from the last path point or the center of the source node (when there is no path point) to the anchor point of the target node, and then calculate the intersection point of the reference line and the graph according to the intersection calculation method specified by [connectionPoint](/en/api/registry/connection-point), which is the ending point of the edge.

X6 has built-in the following anchor point definitions.

-  [center](#center) The center point of the element connected to the edge (default value).
-  [top](#top) The top center point of the element connected to the edge.
-  [bottom](#bottom) The bottom center point of the element connected to the edge.
-  [left](#left) The left center point of the element connected to the edge.
-  [right](#right) The right center point of the element connected to the edge.
-  [midSide](#midside) The center point of the nearest side of the element connected to the edge.
-  [topLeft](#topleft) The top-left corner of the element connected to the edge.
-  [topRight](#topright) The top-right corner of the element connected to the edge.
-  [bottomLeft](#bottomleft) The bottom-left corner of the element connected to the edge.
-  [bottomRight](#bottomright) The bottom-right corner of the element connected to the edge.
-  [orth](#orth) The orthogonal point.
-  [nodeCenter](#nodecenter) The center point of the node.



```ts
import './index.less'
import { createRoot } from 'react-dom/client'
import React from 'react'
import { Graph, Edge } from '@antv/x6'
import { Settings, State } from './settings.tsx'

export default class Example extends React.Component {
  private container: HTMLDivElement
  private edge1: Edge
  private edge2: Edge

  componentDidMount() {
    const graph = new Graph({
      container: this.container,
      background: {
        color: '#F2F7FA',
      },
      interacting: false,
    })

    const rect1 = graph.addNode({
      x: 160,
      y: 80,
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
    })

    const rect2 = graph.addNode({
      x: 460,
      y: 80,
      width: 100,
      height: 40,
      markup: [
        { tagName: 'rect', selector: 'body' },
        { tagName: 'rect', selector: 'port' },
      ],
      attrs: {
        body: {
          stroke: '#8f8f8f',
          strokeWidth: 1,
          fill: '#fff',
          rx: 6,
          ry: 6,
        },
        port: {
          x: 10,
          y: 10,
          width: 30,
          height: 10,
          strokeWidth: 1,
          stroke: '#fe8550',
        },
      },
    })

    const edge1 = graph.addEdge({
      source: { x: 100, y: 100 },
      target: { cell: rect1.id },
      attrs: {
        line: {
          stroke: '#8f8f8f',
          strokeWidth: 1,
          targetMarker: 'classic',
        },
      },
    })

    const edge2 = graph.addEdge({
      source: { x: 320, y: 100 },
      target: { cell: rect2, selector: 'port' },
      attrs: {
        line: {
          stroke: '#8f8f8f',
          strokeWidth: 1,
          targetMarker: 'classic',
        },
      },
    })

    function animate() {
      const animateEdge = (
        edge: Edge,
        origin: { x: number; y: number },
        radius: number,
        steps: number,
      ) => {
        const p = edge.getSourcePoint()
        const start = Math.atan2(p.y - origin.y, p.x - origin.x)
        const xs: number[] = []
        const ys: number[] = []
        for (let i = 0; i < steps; i += 1) {
          const theta = start + (2 * Math.PI * i) / steps
          xs.push(origin.x + radius * Math.cos(theta))
          ys.push(origin.y + radius * Math.sin(theta))
        }
        edge.animate(
          {
            'source/x': xs,
            'source/y': ys,
          },
          {
            duration: 5000,
            easing: 'linear',
            fill: 'forwards',
            iterations: Infinity,
          },
        )
      }

      const steps = 60
      animateEdge(edge1, { x: 210, y: 100 }, 140, steps)
      animateEdge(edge2, { x: 485, y: 95 }, 120, steps)
    }

    animate()

    edge1.on('animation:finish', animate)

    this.edge1 = edge1
    this.edge2 = edge2
  }

  onAttrsChanged = ({ type }: State) => {
    this.edge1.prop('target/anchor', { name: type })
    this.edge2.prop('target/anchor', { name: type })
  }

  refContainer = (container: HTMLDivElement) => {
    this.container = container
  }

  render() {
    return (
      <div className="node-anchor-app">
        <div className="app-side">
          <Settings onChange={this.onAttrsChanged} />
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



You can specify the anchor point when creating an edge:

```ts
const edge = graph.addEdge({
  source: {
    cell: 'source-id',
    anchor: {
      name: 'midSide',
      args: {
        dx: 10,
      },
    },
  },
  target: {
    cell: 'target-id',
    anchor: 'orth', // Simplified writing when there are no parameters
  },
})
```

After creation, you can modify the anchor point by calling the `edge.setSource` and `edge.setTarget` methods:

```ts
edge.setSource({
  cell: 'source-id',
  anchor: {
    name: 'midSide',
    args: {
      dx: 10,
    },
  },
})
```

When creating a canvas, you can set the global default anchor point through the `connecting` option:

```ts
new Graph({
  connecting: {
    anchor: {
      name: 'midSide',
      args: {
        dx: 10,
      },
    },
  },
})
```

Simplified writing when there are no parameters:

```ts
new Graph({
  connecting: {
    anchor: 'midSide',
  },
})
```

## Built-in Anchors

### center

The center point of the element, supporting the following parameters:

| Parameter Name | Parameter Type         | Required | Default Value | Parameter Description                                               |
|---------------|------------------------|:-------:|---------|----------------------------------------------------|
| dx            | number \| string       |    No    | `0`     | X-axis offset, supporting absolute offset and percentage relative offset. |
| dy            | number \| string       |    No    | `0`     | Y-axis offset, supporting absolute offset and percentage relative offset. |
| rotate        | boolean                |    No    | `false` | Whether to use the element's bounding box rotated with the node, defaulting to not considering the rotation angle. |

### top

The top center point of the element, supporting the following parameters:

| Parameter Name | Parameter Type         | Required | Default Value | Parameter Description                                               |
|---------------|------------------------|:-------:|---------|----------------------------------------------------|
| dx            | number \| string       |    No    | `0`     | X-axis offset, supporting absolute offset and percentage relative offset. |
| dy            | number \| string       |    No    | `0`     | Y-axis offset, supporting absolute offset and percentage relative offset. |
| rotate        | boolean                |    No    | `false` | Whether to use the element's bounding box rotated with the node, defaulting to not considering the rotation angle. |

### bottom

The bottom center point of the element, supporting the following parameters:

| Parameter Name | Parameter Type         | Required | Default Value | Parameter Description                                               |
|---------------|------------------------|:-------:|---------|----------------------------------------------------|
| dx            | number \| string       |    No    | `0`     | X-axis offset, supporting absolute offset and percentage relative offset. |
| dy            | number \| string       |    No    | `0`     | Y-axis offset, supporting absolute offset and percentage relative offset. |
| rotate        | boolean                |    No    | `false` | Whether to use the element's bounding box rotated with the node, defaulting to not considering the rotation angle. |

### left

The left center point of the element, supporting the following parameters:

| Parameter Name | Parameter Type         | Required | Default Value | Parameter Description                                               |
|---------------|------------------------|:-------:|---------|----------------------------------------------------|
| dx            | number \| string       |    No    | `0`     | X-axis offset, supporting absolute offset and percentage relative offset. |
| dy            | number \| string       |    No    | `0`     | Y-axis offset, supporting absolute offset and percentage relative offset. |
| rotate        | boolean                |    No    | `false` | Whether to use the element's bounding box rotated with the node, defaulting to not considering the rotation angle. |

### right

The right center point of the element, supporting the following parameters:

| Parameter Name | Parameter Type         | Required | Default Value | Parameter Description                                               |
|---------------|------------------------|:-------:|---------|----------------------------------------------------|
| dx            | number \| string       |    No    | `0`     | X-axis offset, supporting absolute offset and percentage relative offset. |
| dy            | number \| string       |    No    | `0`     | Y-axis offset, supporting absolute offset and percentage relative offset. |
| rotate        | boolean                |    No    | `false` | Whether to use the element's bounding box rotated with the node, defaulting to not considering the rotation angle. |

### midSide

The center point of the nearest side of the element, supporting the following parameters:

| Parameter Name | Parameter Type   | Required | Default Value | Parameter Description                                                                                 |
|---------------|------------------|:-------:|---------|--------------------------------------------------------------------------------------|
| padding       | number           |    No    | `0`     | Offset the center point by `padding` pixels, supporting absolute offset and percentage relative offset. |
| rotate        | boolean          |    No    | `false` | Whether to use the element's bounding box rotated with the node, defaulting to not considering the rotation angle. |
| direction     | 'H' \| 'V'       |    No    | -       | The direction of the connection point, such as setting to `H` to only connect to the left or right center point of the node, automatically judging based on the position. |

### topLeft

The top-left corner of the element, supporting the following parameters:

| Parameter Name | Parameter Type         | Required | Default Value | Parameter Description                                               |
|---------------|------------------------|:-------:|---------|----------------------------------------------------|
| dx            | number \| string       |    No    | `0`     | X-axis offset, supporting absolute offset and percentage relative offset. |
| dy            | number \| string       |    No    | `0`     | Y-axis offset, supporting absolute offset and percentage relative offset. |
| rotate        | boolean                |    No    | `false` | Whether to use the element's bounding box rotated with the node, defaulting to not considering the rotation angle. |

### topRight

The top-right corner of the element, supporting the following parameters:

| Parameter Name | Parameter Type         | Required | Default Value | Parameter Description                                               |
|---------------|------------------------|:-------:|---------|----------------------------------------------------|
| dx            | number \| string       |    No    | `0`     | X-axis offset, supporting absolute offset and percentage relative offset. |
| dy            | number \| string       |    No    | `0`     | Y-axis offset, supporting absolute offset and percentage relative offset. |
| rotate        | boolean                |    No    | `false` | Whether to use the element's bounding box rotated with the node, defaulting to not considering the rotation angle. |

### bottomLeft

The bottom-left corner of the element, supporting the following parameters:

| Parameter Name | Parameter Type         | Required | Default Value | Parameter Description                                               |
|---------------|------------------------|:-------:|---------|----------------------------------------------------|
| dx            | number \| string       |    No    | `0`     | X-axis offset, supporting absolute offset and percentage relative offset. |
| dy            | number \| string       |    No    | `0`     | Y-axis offset, supporting absolute offset and percentage relative offset. |
| rotate        | boolean                |    No    | `false` | Whether to use the element's bounding box rotated with the node, defaulting to not considering the rotation angle. |

### bottomRight

The bottom-right corner of the element, supporting the following parameters:

| Parameter Name | Parameter Type         | Required | Default Value | Parameter Description                                               |
|---------------|------------------------|:-------:|---------|----------------------------------------------------|
| dx            | number \| string       |    No    | `0`     | X-axis offset, supporting absolute offset and percentage relative offset. |
| dy            | number \| string       |    No    | `0`     | Y-axis offset, supporting absolute offset and percentage relative offset. |
| rotate        | boolean                |    No    | `false` | Whether to use the element's bounding box rotated with the node, defaulting to not considering the rotation angle. |

### orth

The orthogonal point, supporting the following parameters:

| Parameter Name | Parameter Type | Required | Default Value | Parameter Description    |
|---------------|----------------|:-------:|--------|---------|
| padding       | number          |    No    | `0`    | X-axis offset. |

### nodeCenter

The center point of the node, supporting the following parameters:

| Parameter Name | Parameter Type | Required | Default Value | Parameter Description    |
|---------------|----------------|:-------:|--------|---------|
| dx            | number          |    No    | `0`    | X-axis offset. |
| dy            | number          |    No    | `0`    | Y-axis offset. |

## Custom Anchors

An anchor point definition is a function with the following signature, returning an anchor point.

```ts
export type Definition<T> = (
  this: EdgeView,
  nodeView: NodeView,
  magnet: SVGElement,
  ref: Point.PointLike | SVGElement,
  args: T,
  type: Edge.TerminalType,
) => Point
```

| Parameter Name   | Parameter Type                      | Parameter Description            |
|---------------|-------------------------------|-------------------|
| this         | EdgeView                      | The edge view.           |
| nodeView     | NodeView                      | The node view.           |
| magnet       | SVGElement                    | The magnet element.       |
| ref          | Point.PointLike \| SVGElement | The reference point/element. |
| args         | T                             | The arguments.             |
| type         | Edge.TerminalType             | The edge terminal type.    |

After completing the anchor point definition, we register the anchor point:

```ts
Graph.registerAnchor('custom-anchor', ...)
```

After registration, we can use the anchor point by name:

```ts
new Graph({
  connecting: {
    anchor: {
      name: 'custom-anchor',
    },
  },
})
```
### docs/demos/api/node-anchor/playground/index.less

```less
.node-anchor-app {
  display: flex;
  border: 1px solid #f0f0f0;
  padding: 16px 8px;
  font-family: sans-serif;

  .app-left {
    bottom: 0;
    width: 336px;
    padding: 0 8px;
  }

  .app-content {
    flex: 1;
    margin-right: 8px;
    margin-left: 8px;
    box-shadow: 0 0 10px 1px #e9e9e9;
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
}
```
### docs/demos/api/node-anchor/playground/settings.tsx

```tsx
import React from 'react'
import { Radio, Card, Row, Col } from 'antd'

export interface Props {
  onChange: (state: State) => void
}

export interface State {
  type: string
}

export class Settings extends React.Component<Props, State> {
  state: State = {
    type: 'center',
  }

  notifyChange() {
    this.props.onChange(this.state)
  }

  onChange = (e: any) => {
    this.setState({ type: e.target.value }, () => {
      this.notifyChange()
    })
  }

  render() {
    return (
      <Card title="Anchor" size="small" bordered={false} style={{ width: 320 }}>
        <Row align="middle">
          <Col span={22} offset={2}>
            <Radio.Group onChange={this.onChange} value={this.state.type}>
              <Radio value="center">center</Radio>
              <Radio value="nodeCenter">nodeCenter</Radio>
              <Radio value="orth">orth</Radio>
              <Radio value="midSide">midSide</Radio>
              <Radio value="top">top</Radio>
              <Radio value="bottom">bottom</Radio>
              <Radio value="left">left</Radio>
              <Radio value="right">right</Radio>
              <Radio value="topLeft">topLeft</Radio>
              <Radio value="topRight">topRight</Radio>
              <Radio value="bottomLeft">bottomLeft</Radio>
              <Radio value="bottomRight">bottomRight</Radio>
            </Radio.Group>
          </Col>
        </Row>
      </Card>
    )
  }
}
```
