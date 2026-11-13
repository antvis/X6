---
title: "Graph"
description: "Graph"
language: "en"
canonical: "https://x6.antv.antgroup.com/en/tutorial/basic/graph/"
version: "3.x"
---

[Resource index](/llms.txt)

> **This chapter mainly introduces knowledge related to the graph. By reading, you can learn about**

- How to make the graph size responsive
- Optimizing graph style by setting background and grid
- How to make the graph draggable and resizable
- Common graph size and position manipulation APIs


## Graph Size

When instantiating a `Graph` object, you can set the `width` and `height` to fix the graph size. If not set, the graph will initialize based on the size of the graph container.

In practical projects, you often encounter the following two scenarios:

- The graph container has not finished rendering (at this point, its size is 0), leading to abnormal display of the graph elements when the graph object is instantiated.
- The page's `resize` causes the graph container size to change, resulting in abnormal display of the graph elements.

We can use the `autoResize` configuration to solve the above problems.

```html
<!-- Note: When using the autoResize configuration, you need to wrap the graph container in an outer container that has a width and height of 100%. Listen for size changes on the outer container, and when the outer container size changes, the graph will automatically recalculate its width, height, and element positions. -->
<div style="width:100%; height:100%">
  <div id="container"></div>
</div>
```

```ts
const graph = new Graph({
  container: document.getElementById('container'),
  autoResize: true,
})
```

In the example below, you can drag the gray area with the mouse to change the container size. You can see through the background color that the sizes of the three graphs are adaptive.



```ts
import './index.less'
import { createRoot } from 'react-dom/client'
/* eslint-disable no-new */
import React from 'react'
import { Graph } from '@antv/x6'
import { SplitBox } from '@antv/x6-react-components/es/split-box'


export default class Example extends React.Component {
  private container1: HTMLDivElement
  private container2: HTMLDivElement
  private container3: HTMLDivElement

  componentDidMount() {
    new Graph({
      container: this.container1,
      background: {
        color: '#F2F7FA',
      },
      autoResize: true,
    })

    new Graph({
      container: this.container2,
      background: {
        color: '#F2F7FA',
      },
      autoResize: true,
    })

    new Graph({
      container: this.container3,
      background: {
        color: '#F2F7FA',
      },
      autoResize: true,
    })
  }

  refContainer1 = (container: HTMLDivElement) => {
    this.container1 = container
  }

  refContainer2 = (container: HTMLDivElement) => {
    this.container2 = container
  }

  refContainer3 = (container: HTMLDivElement) => {
    this.container3 = container
  }

  render() {
    return (
      <div className="auto-resize-app">
        <SplitBox split="horizontal">
          <div className="full">
            <div ref={this.refContainer1} />
          </div>
          <SplitBox split="vertical">
            <div className="full">
              <div ref={this.refContainer2} />
            </div>
            <div className="full">
              <div ref={this.refContainer3} />
            </div>
          </SplitBox>
        </SplitBox>
      </div>
    )
  }
}

const root = createRoot(document.getElementById('container')!)
root.render(<Example />)
window.addEventListener('pagehide', () => root.unmount(), { once: true })
```



## Background and Grid

You can set the graph background and grid using the `background` and `grid` configurations.



```ts
import './index.less'
import { createRoot } from 'react-dom/client'
import React from 'react'
import { Graph } from '@antv/x6'

const data = {
  nodes: [
    {
      id: 'node1',
      shape: 'rect',
      x: 40,
      y: 40,
      width: 100,
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
    },
    {
      id: 'node2',
      shape: 'rect',
      x: 160,
      y: 180,
      width: 100,
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
    },
  ],
  edges: [
    {
      shape: 'edge',
      source: 'node1',
      target: 'node2',
      label: 'x6',
      attrs: {
        line: {
          stroke: '#8f8f8f',
          strokeWidth: 1,
        },
      },
    },
  ],
}

export default class Example extends React.Component {
  private container: HTMLDivElement

  componentDidMount() {
    const graph = new Graph({
      container: this.container,
      background: {
        color: '#F2F7FA',
      },
      grid: {
        visible: true,
        type: 'doubleMesh',
        args: [
          {
            color: '#eee', // 主网格线颜色
            thickness: 1, // 主网格线宽度
          },
          {
            color: '#ddd', // 次网格线颜色
            thickness: 1, // 次网格线宽度
            factor: 4, // 主次网格线间隔
          },
        ],
      },
    })

    graph.fromJSON(data)
    graph.centerContent()
  }

  refContainer = (container: HTMLDivElement) => {
    this.container = container
  }

  render() {
    return (
      <div className="backgournd-grid-app">
        <div className="app-content" ref={this.refContainer} />
      </div>
    )
  }
}

const root = createRoot(document.getElementById('container')!)
root.render(<Example />)
window.addEventListener('pagehide', () => root.unmount(), { once: true })
```



> **Tip**

In X6, the grid is the minimum unit for rendering/moving nodes, with a default size of 10px. This means that a node positioned at `{ x: 24, y: 38 }` will actually render at `{ x: 20, y: 40 }` on the graph.

The background supports not only colors but also background images. For detailed configurations and methods, refer to the [API](/en/api/graph/background). Additionally, the grid supports four different types and allows configuration of grid line colors and widths. For detailed configurations and methods, refer to the [API](/en/api/graph/grid).

## Zooming and Panning

Dragging and zooming the graph are also common operations. In Graph, these two functionalities are implemented through the `panning` and `mousewheel` configurations. When you press down on the graph and move the mouse, it will drag the graph, and scrolling the mouse wheel will zoom the graph.

```ts
const graph = new Graph({
  ...,
  panning: true,
  mousewheel: true
})
```

Let's experience this through an example:



```ts
import './index.less'
import { createRoot } from 'react-dom/client'
import React from 'react'
import { Graph } from '@antv/x6'

const data = {
  nodes: [
    {
      id: 'node1',
      shape: 'rect',
      x: 40,
      y: 40,
      width: 100,
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
    },
    {
      id: 'node2',
      shape: 'rect',
      x: 160,
      y: 180,
      width: 100,
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
    },
  ],
  edges: [
    {
      shape: 'edge',
      source: 'node1',
      target: 'node2',
      label: 'x6',
      attrs: {
        line: {
          stroke: '#8f8f8f',
          strokeWidth: 1,
        },
      },
    },
  ],
}

export default class Example extends React.Component {
  private container: HTMLDivElement

  componentDidMount() {
    const graph = new Graph({
      container: this.container,
      background: {
        color: '#F2F7FA',
      },
      grid: {
        visible: true,
        type: 'doubleMesh',
        args: [
          {
            color: '#eee', // 主网格线颜色
            thickness: 1, // 主网格线宽度
          },
          {
            color: '#ddd', // 次网格线颜色
            thickness: 1, // 次网格线宽度
            factor: 4, // 主次网格线间隔
          },
        ],
      },
      panning: true,
      mousewheel: {
        enabled: true,
        modifiers: 'Ctrl',
        maxScale: 4,
        minScale: 0.2,
      },
    })

    graph.fromJSON(data)
    graph.centerContent()
  }

  refContainer = (container: HTMLDivElement) => {
    this.container = container
  }

  render() {
    return (
      <div className="panning-mousewheel-app">
        <div className="app-content" ref={this.refContainer} />
      </div>
    )
  }
}

const root = createRoot(document.getElementById('container')!)
root.render(<Example />)
window.addEventListener('pagehide', () => root.unmount(), { once: true })
```



Of course, `panning` and `mousewheel` also support many other configurations, such as modifier keys (which must be pressed to trigger the corresponding behavior), zoom factors (rates), etc. Learn more from [Panning API](/en/api/graph/panning) and [Mousewheel API](/en/api/graph/mousewheel).

## Graph Plugins

Beyond built-in background, grid, zoom, and pan, X6 also provides useful canvas plugins such as scrolling and alignment guides that you can enable as needed.

```ts
import { Graph, Scroller, Snapline } from '@antv/x6'

const graph = new Graph({
  container: document.getElementById('container'),
  height: 300,
  width: 800,
})

// Snapline helps show alignment guides when dragging nodes near others
graph.use(
  new Snapline({
    enabled: true,
  }),
)

// Scroller enables scrollable canvas (with optional drag-to-pan)
graph.use(
  new Scroller({
    enabled: true,
    pannable: true,
  }),
)
```

In the demo below, enabling `Scroller` allows scrolling the canvas, and enabling `Snapline` shows alignment lines when dragging nodes close to others.



```ts
import { Graph, Scroller, Snapline } from '@antv/x6'

const data = {
  nodes: [
    {
      id: 'node1',
      shape: 'rect',
      x: 40,
      y: 160,
      width: 100,
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
    },
    {
      id: 'node2',
      shape: 'rect',
      x: 160,
      y: 180,
      width: 100,
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
    },
  ],
}

const graph = new Graph({
  container: document.getElementById('container'),
  height: 300,
  background: {
    color: '#F2F7FA',
  },
})

graph.use(new Snapline({ enabled: true }))
graph.use(new Scroller({ enabled: true, pannable: true }))

graph.fromJSON(data)
graph.centerContent()
```



For more details, see [Snapline](/en/tutorial/plugins/snapline) and [Scroller](/en/tutorial/plugins/scroller).

## Common APIs

In addition to the configurations mentioned above, X6 also provides a rich set of APIs for manipulating graph size and position. Here are some commonly used APIs; for more detailed content, see [Transform API](/en/api/graph/transform).

```ts
graph.resize(800, 600) // Resize the graph size
graph.translate(20, 20) // Translate the graph in the x and y directions
graph.zoom(0.2) // Increase the graph zoom level by 0.2 (default is 1)
graph.zoom(-0.2) // Decrease the graph zoom level by 0.2
graph.zoomTo(1.2) // Set the graph zoom level to 1.2
// Scale the elements in the graph to fit all elements, with maxScale configuration for the maximum zoom level
graph.zoomToFit({ maxScale: 1 })
graph.centerContent() // Center the elements in the graph for display
```



```ts
import './index.less'
import { createRoot } from 'react-dom/client'
import React from 'react'
import { Graph } from '@antv/x6'
import { Button } from 'antd'

const data = {
  nodes: [
    {
      id: 'node1',
      shape: 'rect',
      x: 40,
      y: 40,
      width: 100,
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
    },
    {
      id: 'node2',
      shape: 'rect',
      x: 160,
      y: 180,
      width: 100,
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
    },
  ],
  edges: [
    {
      shape: 'edge',
      source: 'node1',
      target: 'node2',
      label: 'x6',
      attrs: {
        line: {
          stroke: '#8f8f8f',
          strokeWidth: 1,
        },
      },
    },
  ],
}

const commands = [
  {
    key: 'zoomIn',
    label: 'ZoomIn(0.2)',
  },
  {
    key: 'zoomOut',
    label: 'ZoomOut(-0.2)',
  },
  {
    key: 'zoomTo',
    label: 'ZoomTo(1)',
  },
  {
    key: 'zoomToFit',
    label: 'ZoomToFit',
  },
  {
    key: 'centerContent',
    label: 'CenterContent',
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
      grid: {
        visible: true,
        type: 'doubleMesh',
        args: [
          {
            color: '#eee', // 主网格线颜色
            thickness: 1, // 主网格线宽度
          },
          {
            color: '#ddd', // 次网格线颜色
            thickness: 1, // 次网格线宽度
            factor: 4, // 主次网格线间隔
          },
        ],
      },
      panning: true,
      mousewheel: {
        enabled: true,
        modifiers: 'Ctrl',
        maxScale: 4,
        minScale: 0.2,
      },
    })

    graph.fromJSON(data)
    graph.centerContent()
    this.graph = graph
  }

  transform = (command: string) => {
    switch (command) {
      case 'translate':
        this.graph.translate(20, 20)
        break
      case 'zoomIn':
        this.graph.zoom(0.2)
        break
      case 'zoomOut':
        this.graph.zoom(-0.2)
        break
      case 'zoomTo':
        this.graph.zoomTo(1)
        break
      case 'zoomToFit':
        this.graph.zoomToFit()
        break
      case 'centerContent':
        this.graph.centerContent()
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
      <div className="transform-app">
        <div className="app-btns">
          <Button.Group>
            {commands.map((item) => (
              <Button onClick={() => this.transform(item.key)} key={item.key}>
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



More APIs:

- [Graph Options](/en/api/graph/graph)
- [Grid](/en/api/graph/grid)
- [Background](/en/api/graph/background)
- [Panning](/en/api/graph/panning)
- [Mousewheel](/en/api/graph/mousewheel)
- [Transform](/en/api/graph/transform)
- [Coordinate](/en/api/graph/coordinate)
### docs/demos/tutorial/basic/graph/auto-resize/index.less

```less
.auto-resize-app {
  display: flex;
  width: 600px;
  height: 400px;
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

  .full {
    width: 100%;
    height: 100%;
  }
}

.x6-split-box-horizontal > .x6-split-box-resizer,
.x6-split-box-vertical > .x6-split-box-resizer {
  background: #e3e6e9;
}
```
### docs/demos/tutorial/basic/graph/background-grid/index.less

```less
.backgournd-grid-app {
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
### docs/demos/tutorial/basic/graph/panning-mousewheel/index.less

```less
.panning-mousewheel-app {
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
### docs/demos/tutorial/basic/graph/transform/index.less

```less
.transform-app {
  width: 100%;
  border: 1px solid #f0f0f0;
  padding: 16px 8px;
  font-family: sans-serif;

  .app-btns {
    bottom: 0;
    padding: 0 8px;
  }

  .app-content {
    width: 100%;
    height: 240px;
    margin-top: 16px;
    margin-right: 8px;
    margin-left: 8px;
    border-radius: 5px;
    box-shadow: 0 12px 5px -10px rgb(0 0 0 / 10%), 0 0 4px 0 rgb(0 0 0 / 10%);
  }
}
```
