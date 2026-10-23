---
title: "Port Label Layout"
description: "Port Label Layout"
language: "en"
canonical: "https://x6.antv.antgroup.com/en/api/registry/port-label-layout/"
version: "3.x"
---

[Resource index](/llms.txt)

The port label layout algorithm is a function with the following signature, returning the position and rotation angle of the label relative to the port.

```ts
type Definition<T> = (
  portPosition: Point, // port position
  elemBBox: Rectangle, // node bounding box
  args: T, // label position arguments
) => Result

interface Result {
  position: Point.PointLike // label position relative to port
  angle: number // label rotation angle
  attrs: Attr.CellAttrs // label attributes
}
```

When creating a port, you can specify the label layout in the `groups` or override it in `items`:

```ts
graph.addNode(
  ...,
  ports: {
    // port group
    groups: {
      group1: {
        label: {
          position: {      // label layout algorithm
            name: 'xxx',   // label layout algorithm name
            args: { ... }, // label layout algorithm arguments
          },
        },
      },
    },

    // port definition
    items: [
      {
        groups: 'group1',
        label: {
          position: { // override label layout algorithm specified in group1
            name: 'xxx',
            args: { ... },
          }
        },
      }
    ],
  },
)
```

Let's take a look at how to use built-in label layout algorithms and how to define and register custom layout algorithms.

## Built-in Port Label Layout

### Side

The label is located on one side of the port.

-  `'left'` The label is located on the left side of the port.
-  `'right'` The label is located on the right side of the port.
-  `'top'` The label is located on the top side of the port.
-  `'bottom'` The label is located on the bottom side of the port.

You can specify the label position and rotation angle through `args`.

```ts
interface SideArgs {
  x?: number
  y?: number
  angle?: number
  attrs?: Attr.CellAttrs
}
```

| Name  | Type           | Required | Default Value | Description                                      |
|-------|----------------|:----:|--------|-----------------------------------------|
| x     | number         |      | -      | Replace the calculated X coordinate with the specified value. |
| y     | number         |      | -      | Replace the calculated Y coordinate with the specified value. |
| angle | number         |      | -      | Replace the calculated rotation angle with the specified value. |
| attrs | Attr.CellAttrs |      | -      | Label attributes.                                 |

```ts
label: {
  position: {
    name : 'right',
    args: {
      y: 10, // Force the y-coordinate to be 10, replacing the calculated y-coordinate
      attrs: {
        text: {
          fill: 'red', // Set the label color to red
        },
      },
    },
  },
}
```



```ts
import './index.less'
import { createRoot } from 'react-dom/client'
import React from 'react'
import { Graph, Node } from '@antv/x6'
import { Settings, State } from './settings.tsx'

export default class Example extends React.Component {
  private container: HTMLDivElement
  private node: Node

  componentDidMount() {
    const graph = new Graph({
      container: this.container,
      background: {
        color: '#F2F7FA',
      },
    })

    this.node = graph.addNode({
      shape: 'rect',
      x: 80,
      y: 68,
      width: 240,
      height: 80,
      attrs: {
        label: {
          text: 'left',
          fill: '#6a6c8a',
        },
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
          a: {
            position: {
              name: 'top',
              args: {
                dr: 0,
                dx: 0,
                dy: -10,
              },
            },
            label: {
              position: {
                name: 'left',
              },
            },
            attrs: {
              circle: {
                fill: '#ffffff',
                stroke: '#8f8f8f',
                strokeWidth: 1,
                r: 10,
              },
              text: {
                fill: '#6a6c8a',
              },
            },
          },
        },
      },
    })

    Array.from({ length: 3 }).forEach((_, index) => {
      const label =
        index === 2
          ? {
              position: { args: { x: 20, y: -20 } },
            }
          : {}
      const stroke = index === 2 ? { stroke: 'red' } : {}
      const fill = index === 2 ? { fill: 'red' } : {}
      this.node.addPort({
        label,
        group: 'a',
        attrs: {
          circle: { magnet: true, ...stroke },
          text: { text: `P${index}`, ...fill },
        },
      })
    })
  }

  onAttrsChanged = ({ position }: State) => {
    this.node.prop('ports/groups/a/label/position/name', position)
    this.node.attr('label/text', position)
  }

  refContainer = (container: HTMLDivElement) => {
    this.container = container
  }

  render() {
    return (
      <div className="port-label-side-app">
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



### Inside/Outside

The label is located inside or outside the node, supporting the following four layouts:

-  `'inside'` The label is located inside the node, close to the edge.
-  `'outside'` The label is located outside the node, close to the edge.
-  `'insideOriented'` The label is located inside the node and automatically adjusts the text direction based on the position.
-  `'outsideOriented'` The label is located outside the node and automatically adjusts the text direction based on the position.

You can set the offset from the node center to the label position through `args.offset`.

```ts
interface InOutArgs {
  offset?: number
  x?: number
  y?: number
  angle?: number
  attrs?: Attr.CellAttrs
}
```

| Name   | Type           | Required | Default Value | Description                                      |
|--------|----------------|:----:|--------|-----------------------------------------|
| offset | number         |      | `15`   | Offset from the node center to the label position.     |
| x      | number         |      | -      | Replace the calculated X coordinate with the specified value. |
| y      | number         |      | -      | Replace the calculated Y coordinate with the specified value. |
| angle  | number         |      | -      | Replace the calculated rotation angle with the specified value. |
| attrs  | Attr.CellAttrs |      | -      | Label attributes.                                 |

```ts
label: {
  position: {
    name : 'outside',
  },
}
```



```ts
import './index.less'
import { createRoot } from 'react-dom/client'
import React from 'react'
import { Graph, Node } from '@antv/x6'
import { Settings, State } from './settings.tsx'

export default class Example extends React.Component {
  private container: HTMLDivElement
  private node: Node

  componentDidMount() {
    const graph = new Graph({
      container: this.container,
      background: {
        color: '#F2F7FA',
      },
    })

    this.node = graph.addNode({
      shape: 'ellipse',
      x: 70,
      y: 85,
      width: 260,
      height: 100,
      attrs: {
        label: {
          text: 'outside',
          fill: '#888',
          fontSize: 12,
        },
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
          a: {
            position: {
              name: 'ellipseSpread',
              args: {
                compensateRotate: true,
              },
            },
            label: {
              position: {
                name: 'outside',
              },
            },
            attrs: {
              circle: {
                fill: '#ffffff',
                stroke: '#8f8f8f',
                strokeWidth: 1,
                r: 10,
                magnet: true,
              },
              text: {
                fill: '#6a6c8a',
                fontSize: 12,
              },
            },
          },
        },
      },
    })

    Array.from({ length: 10 }).forEach((_, index) => {
      this.node.addPort({ attrs: { text: { text: `P ${index}` } }, group: 'a' })
    })
  }

  onAttrsChanged = ({ position, offset }: State) => {
    this.node.prop('ports/groups/a/label/position', {
      name: position,
      args: { offset },
    })

    this.node.attr('label/text', position)
  }

  refContainer = (container: HTMLDivElement) => {
    this.container = container
  }

  render() {
    return (
      <div className="port-label-inside-outside-app">
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



### Radial

Place the label on the outer circle or ellipse of the node. Supports the following two layouts:

-  `'radial'` The label is located on the outer circle or ellipse of the node.
-  `'radialOriented'` The label is located on the outer circle or ellipse of the node and automatically adjusts the text direction based on the position.

```ts
interface RadialArgs {
  offset?: number
  x?: number
  y?: number
  angle?: number
  attrs?: Attr.CellAttrs
}
```

| Name   | Type           | Required | Default Value | Description                                      |
|--------|----------------|:----:|--------|-----------------------------------------|
| offset | number         |      | `20`   | Offset from the node center to the label position.     |
| x      | number         |      | -      | Replace the calculated X coordinate with the specified value. |
| y      | number         |      | -      | Replace the calculated Y coordinate with the specified value. |
| angle  | number         |      | -      | Replace the calculated rotation angle with the specified value. |
| attrs  | Attr.CellAttrs |      | -      | Label attributes.                                 |

```ts
label: {
  position: {
    name : 'radial',
  },
}
```



```ts
import './index.less'
import { createRoot } from 'react-dom/client'
import React from 'react'
import { Graph, Node } from '@antv/x6'
import { Settings, State } from './settings.tsx'

export default class Example extends React.Component {
  private container: HTMLDivElement
  private node: Node

  componentDidMount() {
    const graph = new Graph({
      container: this.container,
      background: {
        color: '#F2F7FA',
      },
    })

    this.node = graph.addNode({
      shape: 'ellipse',
      x: 70,
      y: 50,
      width: 260,
      height: 100,
      attrs: {
        label: {
          text: 'outside',
          fill: '#888',
          fontSize: 12,
        },
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
          a: {
            position: {
              name: 'ellipseSpread',
              args: {
                compensateRotate: true,
              },
            },
            label: {
              position: {
                name: 'outside',
              },
            },
            attrs: {
              circle: {
                fill: '#ffffff',
                stroke: '#8f8f8f',
                strokeWidth: 1,
                r: 10,
                magnet: true,
              },
              text: {
                fill: '#6a6c8a',
                fontSize: 12,
              },
            },
          },
        },
      },
    })

    Array.from({ length: 10 }).forEach((_, index) => {
      this.node.addPort({ attrs: { text: { text: `P ${index}` } }, group: 'a' })
    })
  }

  onAttrsChanged = ({ position, offset }: State) => {
    this.node.prop('ports/groups/a/label/position', {
      name: position,
      args: { offset },
    })

    this.node.attr('label/text', position)
  }

  refContainer = (container: HTMLDivElement) => {
    this.container = container
  }

  render() {
    return (
      <div className="port-label-radial-app">
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



## Custom Port Label Layout

The port label layout algorithm is a function with the following signature, returning the position and rotation angle of the label relative to the port.

```ts
type Definition<T> = (
  portPosition: Point, // port position
  elemBBox: Rectangle, // node bounding box
  args: T, // label position arguments
) => Result

interface Result {
  position: Point.PointLike // label position relative to port
  angle: number // label rotation angle
  attrs: Attr.CellAttrs // label attributes
}
```

So we can create a custom layout algorithm according to the above rules, for example, implementing a layout that is located at the bottom right of the port:

```ts
function bottomRight(portPosition, elemBBox, args) {
  const dx = args.dx || 10
  const dy = args.dy || 10

  return {
    position: {
      x: portPosition.x + dx,
      y: portPosition.y + dy,
    }
  }
}
```

After implementing the layout algorithm, we need to register it to the system. After registration, we can use it like built-in layout algorithms.

```ts
Graph.registerPortLabelLayout('bottomRight', bottomRight)
```

After registration, we can use it like built-in layout algorithms:

```ts
const rect = graph.addNode({
  ports: {
    groups: {
      group1: {
        position: {
          name: 'top',
        },
        label: {
          position: {
            name: 'bottomRight',
          },
        },
      },
    },

    items: [
      { id: 'port1', group: 'group1' },
      { id: 'port2', label: { position: 'bottomRight' } },
    ],
  },
})
```
### docs/demos/api/port-label-layout/side/index.less

```less
.port-label-side-app {
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
### docs/demos/api/port-label-layout/side/settings.tsx

```tsx
import React from 'react'
import { Radio, Card, Row, Col } from 'antd'

export interface Props {
  onChange: (state: State) => void
}

export interface State {
  position: string
  dx: number
  dy: number
  angle: number
}

export class Settings extends React.Component<Props, State> {
  state: State = {
    position: 'left',
    dx: 0,
    dy: 0,
    angle: 45,
  }

  notifyChange() {
    this.props.onChange(this.state)
  }

  onDxChanged = (dx: number) => {
    this.setState({ dx }, () => {
      this.notifyChange()
    })
  }

  onDyChanged = (dy: number) => {
    this.setState({ dy }, () => {
      this.notifyChange()
    })
  }

  onAngleChanged = (angle: number) => {
    this.setState({ angle }, () => {
      this.notifyChange()
    })
  }

  onPositionChange = (e: any) => {
    this.setState(
      {
        position: e.target.value,
      },
      () => {
        this.notifyChange()
      },
    )
  }

  render() {
    const radioStyle = {
      display: 'block',
      height: '36px',
      lineHeight: '36px',
    }

    return (
      <Card
        title="Port Label Position"
        size="small"
        bordered={false}
        style={{ width: 240 }}
      >
        <Row align="middle" justify="center">
          <Col>
            <Radio.Group
              value={this.state.position}
              onChange={this.onPositionChange}
            >
              <Radio style={radioStyle} value={'left'}>
                left
              </Radio>
              <Radio style={radioStyle} value={'right'}>
                right
              </Radio>
              <Radio style={radioStyle} value={'top'}>
                top
              </Radio>
              <Radio style={radioStyle} value={'bottom'}>
                bottom
              </Radio>
            </Radio.Group>
          </Col>
        </Row>
      </Card>
    )
  }
}
```
### docs/demos/api/port-label-layout/inside-outside/index.less

```less
.port-label-inside-outside-app {
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
### docs/demos/api/port-label-layout/inside-outside/settings.tsx

```tsx
import React from 'react'
import { Radio, Slider, Card, Row, Col } from 'antd'

export interface Props {
  onChange: (state: State) => void
}

export interface State {
  position: string
  offset: number
}

export class Settings extends React.Component<Props, State> {
  state: State = {
    position: 'outside',
    offset: 15,
  }

  notifyChange() {
    this.props.onChange(this.state)
  }

  onOffsetChanged = (offset: number) => {
    this.setState({ offset }, () => {
      this.notifyChange()
    })
  }

  onPositionChange = (e: any) => {
    this.setState(
      {
        position: e.target.value,
      },
      () => {
        this.notifyChange()
      },
    )
  }

  render() {
    const radioStyle = {
      display: 'block',
      height: '36px',
      lineHeight: '36px',
    }

    return (
      <Card
        title="Port Label Position"
        size="small"
        bordered={false}
        style={{ width: 240 }}
      >
        <Row
          align="middle"
          justify="center"
          style={{
            borderBottom: '1px solid #f0f0f0',
            paddingBottom: 16,
            marginBottom: 16,
          }}
        >
          <Col>
            <Radio.Group
              value={this.state.position}
              onChange={this.onPositionChange}
            >
              <Radio style={radioStyle} value={'inside'}>
                inside
              </Radio>
              <Radio style={radioStyle} value={'outside'}>
                outside
              </Radio>
              <Radio style={radioStyle} value={'insideOriented'}>
                insideOriented
              </Radio>
              <Radio style={radioStyle} value={'outsideOriented'}>
                outsideOriented
              </Radio>
            </Radio.Group>
          </Col>
        </Row>
        <Row align="middle">
          <Col span={5} style={{ textAlign: 'right', paddingRight: 16 }}>
            offset
          </Col>
          <Col span={14}>
            <Slider
              min={-30}
              max={30}
              step={1}
              value={this.state.offset}
              onChange={this.onOffsetChanged}
            />
          </Col>
          <Col span={1} offset={1}>
            <div className="slider-value">{this.state.offset}</div>
          </Col>
        </Row>
      </Card>
    )
  }
}
```
### docs/demos/api/port-label-layout/radial/index.less

```less
.port-label-radial-app {
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
### docs/demos/api/port-label-layout/radial/settings.tsx

```tsx
import React from 'react'
import { Radio, Slider, Card, Row, Col } from 'antd'

export interface Props {
  onChange: (state: State) => void
}

export interface State {
  position: string
  offset: number
}

export class Settings extends React.Component<Props, State> {
  state: State = {
    position: 'radial',
    offset: 20,
  }

  notifyChange() {
    this.props.onChange(this.state)
  }

  onOffsetChanged = (offset: number) => {
    this.setState({ offset }, () => {
      this.notifyChange()
    })
  }

  onPositionChange = (e: any) => {
    this.setState(
      {
        position: e.target.value,
      },
      () => {
        this.notifyChange()
      },
    )
  }

  render() {
    const radioStyle = {
      display: 'block',
      height: '36px',
      lineHeight: '36px',
    }

    return (
      <Card
        title="Port Label Position"
        size="small"
        bordered={false}
        style={{ width: 240 }}
      >
        <Row
          align="middle"
          justify="center"
          style={{
            borderBottom: '1px solid #f0f0f0',
            paddingBottom: 16,
            marginBottom: 16,
          }}
        >
          <Col>
            <Radio.Group
              value={this.state.position}
              onChange={this.onPositionChange}
            >
              <Radio style={radioStyle} value={'radial'}>
                radial
              </Radio>
              <Radio style={radioStyle} value={'radialOriented'}>
                radialOriented
              </Radio>
            </Radio.Group>
          </Col>
        </Row>
        <Row align="middle">
          <Col span={5} style={{ textAlign: 'right', paddingRight: 16 }}>
            offset
          </Col>
          <Col span={14}>
            <Slider
              min={-30}
              max={50}
              step={1}
              value={this.state.offset}
              onChange={this.onOffsetChanged}
            />
          </Col>
          <Col span={1} offset={1}>
            <div className="slider-value">{this.state.offset}</div>
          </Col>
        </Row>
      </Card>
    )
  }
}
```
