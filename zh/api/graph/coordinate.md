---
title: "坐标系"
description: "坐标系"
language: "zh"
canonical: "https://x6.antv.antgroup.com/zh/api/graph/coordinate/"
version: "3.x"
---

[资料索引](/llms.txt)

## 演示



```ts
import './index.less'
import { createRoot } from 'react-dom/client'
import * as React from 'react'
import { Graph } from '@antv/x6'
import { Settings, State, defaults } from './settings.tsx'

export default class Example extends React.Component {
  private container: HTMLDivElement
  private graph: Graph
  private v: HTMLDivElement
  private h: HTMLDivElement
  private c: HTMLDivElement

  componentDidMount() {
    this.graph = new Graph({
      container: this.container,
      background: {
        color: '#F2F7FA',
      },
    })

    const source = this.graph.addNode({
      x: 80,
      y: 80,
      width: 80,
      height: 40,
      label: 'hello',
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

    const target = this.graph.addNode({
      x: 240,
      y: 240,
      width: 80,
      height: 40,
      label: 'world',
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

    this.graph.addEdge({
      source,
      target,
      attrs: {
        line: {
          stroke: '#8f8f8f',
          strokeWidth: 1,
        },
      },
    })

    this.onChanged(defaults)
    this.start()
  }

  componentWillUnmount() {
    document.removeEventListener('mousemove', this.onMouseMove)
  }

  onMouseMove = (e: MouseEvent) => {
    const target = e.target as HTMLElement
    if (
      this.container.contains(target) ||
      this.container === target ||
      target === this.v ||
      target === this.h ||
      target === this.c
    ) {
      const pageX = e.pageX
      const pageY = e.pageY
      const clientX = e.clientX
      const clientY = e.clientY
      this.v.style.left = `${pageX + 2}px`
      this.h.style.top = `${pageY + 2}px`

      this.c.style.left = `${pageX + 10}px`
      this.c.style.top = `${pageY + 10}px`

      const p1 = this.graph.pageToLocal(pageX, pageY)
      const p2 = this.graph.localToGraph(p1)

      this.c.innerHTML = `
        <div>Page(pageX, pageY): ${pageX} x ${pageY}</div>
        <div>Client(clientX, clientY): ${clientX} x ${clientY}</div>
        <div>Local Point: ${p1.x} x ${p1.y}</div>
        <div>Graph Point: ${p2.x} x ${p2.y}</div>
        `
    } else {
      this.v.style.left = `${-1000}px`
      this.h.style.top = `${-1000}px`
      this.c.style.left = `${-10000}px`
      this.c.style.top = `${-10000}px`
    }
  }

  start() {
    const root = document.getElementById('container')!
    const v = document.createElement('div')
    const h = document.createElement('div')
    const c = document.createElement('div')

    v.style.position = 'absolute'
    v.style.width = '1px'
    v.style.top = '0'
    v.style.bottom = '0'
    v.style.left = '-100px'
    v.style.zIndex = `99`
    v.style.borderLeft = '1px dashed red'

    h.style.position = 'absolute'
    h.style.height = '1px'
    h.style.left = '0'
    h.style.right = '0'
    h.style.top = '-100px'
    h.style.zIndex = `99`
    h.style.borderTop = '1px dashed red'

    c.style.position = 'absolute'
    c.style.display = 'inline-block'
    c.style.fontSize = '12px'
    c.style.zIndex = `99`
    c.style.padding = '4px 8px'
    c.style.borderRadius = '2px'
    c.style.lineHeight = '20px'
    c.style.background = '#f6ffed'
    c.style.border = '1px solid #b7eb8f'

    root.appendChild(v)
    root.appendChild(h)
    root.appendChild(c)

    this.v = v
    this.h = h
    this.c = c

    document.addEventListener('mousemove', this.onMouseMove)
  }

  onChanged = (settgins: State) => {
    this.graph.scale(settgins.scale)
    this.graph.translate(settgins.tx, settgins.ty)
  }

  refContainer = (container: HTMLDivElement) => {
    this.container = container
  }

  render() {
    return (
      <div className="coord-app">
        <div className="app-left">
          <Settings onChange={this.onChanged} />
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



在位置计算中，我们经常需要做坐标转换，在 X6 中，存在两个坐标系，一个是画布本地坐标系 `local`，一个是画布坐标系 `graph`，有时候还要涉及到浏览器坐标系，这里统一做一个解释：

- `local`：画布本地坐标系，默认情况下和 `graph` 坐标系一致，但是会随着画布的缩放和平移发生改变。画布中所有节点的坐标都是以 `local` 坐标系为准。
- `graph`：画布坐标系，也就是我们看到的画布视口，它不会随着画布缩放和平移而改变。
- `client`：浏览器坐标系，鼠标事件中的 `e.clinetX`、`e.clientY` 就是相对于浏览器坐标系。
- `page`：页面坐标系，与 `client` 相比，`page` 会考虑页面水平和垂直方向滚动。鼠标事件中的 `e.pageX`、`e.pageY` 就是相对于页面坐标系。

## 方法

### pageToLocal(...)

```ts
pageToLocal(rect: Rectangle.RectangleLike): Rectangle
pageToLocal(x: number, y: number, width: number, height: number): Rectangle
pageToLocal(p: Point.PointLike): Point
pageToLocal(x: number, y: number): Point
```

将页面坐标转换为画布本地坐标。

### localToPage(...)

```ts
localToPage(rect: Rectangle.RectangleLike): Rectangle
localToPage(x: number, y: number, width: number, height: number): Rectangle
localToPage(p: Point.PointLike): Point
localToPage(x: number, y: number): Point
```

将画布本地坐标转换为页面坐标。

### clientToLocal(...)

```ts
clientToLocal(rect: Rectangle.RectangleLike): Rectangle
clientToLocal(x: number, y: number, width: number, height: number): Rectangle
clientToLocal(p: Point.PointLike): Point
clientToLocal(x: number, y: number): Point
```

将页面的浏览器坐标转换画布本地坐标。

### localToClient(...)

```ts
localToClient(rect: Rectangle.RectangleLike): Rectangle
localToClient(x: number, y: number, width: number, height: number): Rectangle
localToClient(p: Point.PointLike): Point
localToClient(x: number, y: number): Point
```

将画布本地坐标转换为浏览器坐标。

### localToGraph(...)

```ts
localToGraph(rect: Rectangle.RectangleLike): Rectangle
localToGraph(x: number, y: number, width: number, height: number): Rectangle
localToGraphPoint(p: Point.PointLike): Point
localToGraphPoint(x: number, y: number): Point
```

将画布本地坐标转换为画布坐标。

### graphToLocal(...)

```ts
graphToLocal(rect: Rectangle.RectangleLike): Rectangle
graphToLocal(x: number, y: number, width: number, height: number): Rectangle
graphToLocal(p: Point.PointLike): Point
graphToLocal(x: number, y: number): Point
```

将画布坐标转换为画布本地坐标。

### snapToGrid(...)

```ts
snapToGrid(p: Point.PointLike): Point
snapToGrid(x: number, y: number): Point
```

将浏览器坐标转换为画布[本地坐标](#clienttolocal)并对齐到画布网格。
### docs/demos/api/coord/playground/index.less

```less
.bar {
  position: absolute;
  top: 48px;
  right: 0;
  left: 0;
  height: 2px;
  background: linear-gradient(to right, #9198e5, #e66465);
}

.coord-app {
  display: flex;
  border: 1px solid #f0f0f0;
  padding: 16px 8px;
  font-family: sans-serif;

  .app-left {
    top: 64px;
    z-index: 10;
    width: 336px;
    padding: 0 8px;
  }

  .app-content {
    flex: 1;
    height: 318px;
    margin-right: 8px;
    overflow: auto;
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

  #elapsed {
    padding: 0 7px;
    color: #52c41a;
    font-size: 12px;
    font-variant: tabular-nums;
    line-height: 20px;
    white-space: nowrap;
    background: #f6ffed;
    border-color: #b7eb8f;
    border-radius: 2px;
  }
}
```
### docs/demos/api/coord/playground/settings.tsx

```tsx
import React from 'react'
import { Slider, Card, Row, Col } from 'antd'

export interface Props {
  onChange: (state: State) => void
}

export interface State {
  scale: number
  tx: number
  ty: number
}

export const defaults: State = {
  scale: 1,
  tx: 0,
  ty: 0,
}

export class Settings extends React.Component<Props, State> {
  state: State = defaults

  notifyChange() {
    this.props.onChange(this.state)
  }

  onScaleChanged = (scale: number) => {
    this.setState({ scale }, () => {
      this.notifyChange()
    })
  }

  onTxChanged = (tx: number) => {
    this.setState({ tx }, () => {
      this.notifyChange()
    })
  }

  onTyChanged = (ty: number) => {
    this.setState({ ty }, () => {
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
          <Col span={7}>scale</Col>
          <Col span={12}>
            <Slider
              min={0.1}
              max={2}
              step={0.1}
              value={this.state.scale}
              onChange={this.onScaleChanged}
            />
          </Col>
          <Col span={1} offset={1}>
            <div className="slider-value">{this.state.scale}</div>
          </Col>
        </Row>
        <Row align="middle">
          <Col span={7}>translateX</Col>
          <Col span={12}>
            <Slider
              min={-50}
              max={50}
              step={1}
              value={this.state.tx}
              onChange={this.onTxChanged}
            />
          </Col>
          <Col span={1} offset={1}>
            <div className="slider-value">{this.state.tx}</div>
          </Col>
        </Row>
        <Row align="middle">
          <Col span={7}>translateY</Col>
          <Col span={12}>
            <Slider
              min={-50}
              max={50}
              step={1}
              value={this.state.ty}
              onChange={this.onTyChanged}
            />
          </Col>
          <Col span={1} offset={1}>
            <div className="slider-value">{this.state.ty}</div>
          </Col>
        </Row>
      </Card>
    )
  }
}
```
