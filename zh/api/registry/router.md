---
title: "路由"
description: "路由"
language: "zh"
canonical: "https://x6.antv.antgroup.com/zh/api/registry/router/"
version: "3.x"
---

[资料索引](/llms.txt)

路由将边的路径点 [vertices](/zh/tutorial/basic/edge#vertices) 做进一步转换处理，并在必要时添加额外的点，然后返回处理后的点（不包含边的起点和终点）。例如，经过 [`orth`](#orth) 路由处理后，边的每一条线段都是水平或垂直的正交线段。

X6 中内置了以下几种路由。

| 路由名称  | 说明                                                                                                           |
|-----------|--------------------------------------------------------------------------------------------------------------|
| normal    | [默认路由](#normal)，原样返回路径点。                                                                            |
| orth      | [正交路由](#orth)，由水平或垂直的正交线段组成。                                                                  |
| oneSide   | [受限正交路由](#oneside)，由受限的三段水平或垂直的正交线段组成。                                                 |
| manhattan | [智能正交路由](#manhattan)，由水平或垂直的正交线段组成，并自动避开路径上的其他节点（障碍）。                        |
| metro     | [智能地铁线路由](#metro)，由水平或垂直的正交线段和斜角线段组成，类似地铁轨道图，并自动避开路径上的其他节点（障碍）。 |
| er        | [实体关系路由](#er)，由 `Z` 字形的斜角线段组成。                                                                 |

在使用时，可以为边设置路由：

```ts
const edge = graph.addEdge({
  source,
  target,
  router: {
    name: 'oneSide',
    args: {
      side: 'right',
    },
  },
})
```

当路由没有参数时，也可以简化为：

```ts
const edge = graph.addEdge({
  source,
  target,
  router: 'oneSide',
})
```

也可以调用 [`edge.setRouter`]() 方法来设置路由：

```ts
edge.setRouter('oneSide', { side: 'right' })
```

在创建画布时，可以通过 `connecting` 选项来设置全局默认路由（画布的默认路由是 `'normal'`）:

```ts
new Graph({
  connecting: {
    router: {
      name: 'oneSide',
      args: {
        side: 'right',
      },
    },
  },
})
```

当路由没有参数时，也可以简化为：

```ts
new Graph({
  connecting: {
    router: 'orth',
  },
})
```

下面我们一起来看看如何使用内置路由，以及如何自定并注册自定义路由。

## 内置路由

### normal

系统的默认路由，该路由原样返回传入的 `vertices` 路径点。

### orth

正交路由，该路由在路径上添加额外的一些点，使边的每一条线段都水平或垂直正交。

支持的参数如下表：

| 参数名  | 参数类型    | 是否必选 | 默认值 | 参数说明                    |
|---------|-------------|:-------:|--------|-------------------------|
| padding | SideOptions |    否    | 20     | 设置锚点距离转角的最小距离。 |

`SideOptions` 定义如下：

```ts
export type SideOptions =
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

例如：

```ts
graph.addEdge({
  source,
  target,
  vertices: [
    { x: 100, y: 200 },
    { x: 300, y: 120 },
  ],
  router: {
    name: 'orth',
    args: {
      padding: {
        left: 50,
      },
    },
  },
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

    const rect1 = graph.addNode({
      x: 30,
      y: 30,
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
    })

    const rect2 = graph.addNode({
      x: 300,
      y: 240,
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
    })

    graph.addNode({
      shape: 'circle',
      x: 80 - 5,
      y: 200 - 5,
      width: 10,
      height: 10,
      attrs: {
        body: {
          stroke: '#8f8f8f',
          strokeWidth: 1,
          fill: '#fff',
        },
      },
    })

    graph.addNode({
      shape: 'circle',
      x: 300 - 5,
      y: 120 - 5,
      width: 10,
      height: 10,
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
      source: rect1,
      target: rect2,
      attrs: {
        line: {
          stroke: '#8f8f8f',
          strokeWidth: 1,
        },
      },
      vertices: [
        { x: 80, y: 200 },
        { x: 300, y: 120 },
      ],
      router: {
        name: 'orth',
      },
    })

    graph.centerContent()
  }

  refContainer = (container: HTMLDivElement) => {
    this.container = container
  }

  render() {
    return (
      <div className="orth-router-app">
        <div className="app-content" ref={this.refContainer} />
      </div>
    )
  }
}

const root = createRoot(document.getElementById('container')!)
root.render(<Example />)
window.addEventListener('pagehide', () => root.unmount(), { once: true })
```



### oneSide

`oneSide` 路由是正交路由 `orth` 的受限版本，该路生成一个严格的三段路由：从起始节点的 `side` 侧开始，经过中间段，再从终止节点的 `side` 侧结束路由。需要特别注意的是，使用该路由时请不要同时指定 `vertices`，否则路由效果会非常差。

支持的参数如下表：

| 参数名  | 参数类型                                       | 是否必选 | 默认值     | 参数说明                                 |
|---------|------------------------------------------------|:-------:|------------|--------------------------------------|
| side    | `'left'` \| `'right'` \| `'top'` \| `'bottom'` |    否    | `'bottom'` | 路由的起始/结束方向，默认值为 `'bottom'`。 |
| padding | SideOptions                                    |    否    | 20         | 设置锚点距离转角的最小距离。              |

例如：

```ts
graph.addEdge({
  source,
  target,
  router: {
    name: 'oneSide',
    args: { side: 'right' },
  },
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

    const rect1 = graph.addNode({
      x: 30,
      y: 30,
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
    })

    const rect2 = graph.addNode({
      x: 200,
      y: 200,
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
    })

    graph.addEdge({
      source: rect1,
      target: rect2,
      attrs: {
        line: {
          stroke: '#8f8f8f',
          strokeWidth: 1,
        },
      },
      router: {
        name: 'oneSide',
        args: { side: 'right', padding: 50 },
      },
    })

    graph.centerContent()
  }

  refContainer = (container: HTMLDivElement) => {
    this.container = container
  }

  render() {
    return (
      <div className="oneside-router-app">
        <div className="app-content" ref={this.refContainer} />
      </div>
    )
  }
}

const root = createRoot(document.getElementById('container')!)
root.render(<Example />)
window.addEventListener('pagehide', () => root.unmount(), { once: true })
```



### manhattan

曼哈顿路由 `manhattan` 路由是正交路由 `orth` 的智能版本，该路由由水平或垂直的正交线段组成，并自动避开路径上的其他节点（障碍）。

我们为该路由算法提供了丰富的选项：

| 参数名           | 参数类型                 | 是否必选 | 默认值                               | 参数说明                                                    |
|------------------|--------------------------|:-------:|--------------------------------------|---------------------------------------------------------|
| step             | number                   |    否    | `10`                                 | 路由算法步进步长，其值越小计算量越大，推荐使用画布的网格大小。 |
| excludeTerminals | ('source' \| 'target')[] |    否    | `[]`                                 | 忽略起始或终止节点，忽略后不参与障碍物计算。                  |
| excludeShapes    | string[]                 |    否    | `[]`                                 | 忽略指定形状的节点，忽略后不参与障碍物计算。                  |
| excludeNodes     | (Node \| string)[]       |    否    | `[]`                                 | 忽略的节点，忽略后不参与障碍物计算。                          |
| startDirections  | string[]                 |    否    | `['top', 'right', 'bottom', 'left']` | 支持从哪些方向开始路由。                                     |
| endDirections    | string[]                 |    否    | `['top', 'right', 'bottom', 'left']` | 支持从哪些方向结束路由。                                     |
| padding          | SideOptions              |    否    | -                                    | 设置锚点距离转角的最小距离。                                 |
| fallbackRouter   | Router                   |    否    | `routerPresets.orth`                | 无法避开障碍物的场景，降级到指定路由。                         |

例如，从 `@antv/x6` 导入 `routerPresets`，显式设置降级路由：

```ts
import { routerPresets } from '@antv/x6'

graph.addEdge({
  source,
  target,
  router: {
    name: 'manhattan',
    args: {
      fallbackRouter: routerPresets.orth,
      startDirections: ['top'],
      endDirections: ['bottom'],
    },
  },
})
```

在使用 `manhattan` 路由和 `Selection` 插件时，如果出现批量拖拽节点卡顿的情况，推荐在 `Selection` 配置中加上 `movingRouterFallback: 'orth'`，将与选中节点相连的边在拖拽过程中临时切换为轻量的 `orth` 路由，避免频繁的路径计算，能有效提升拖拽流畅性：

```ts
graph.use(
  new Selection({
    ...
     // 拖拽期路由降级为 orth 路由
    movingRouterFallback: 'orth',
  }),
)
```

> **注意**

manhattan 路由的特性是自动避开路径中的障碍物，如果出现无法避开的情况，就会自动降级到 orth 路由，此时为了让开发者能够发现问题，我们在控制台增加了 warn：Unable to execute manhattan algorithm, use orth instead。



```ts
import './index.less'
import { createRoot } from 'react-dom/client'
import React from 'react'
import { Graph, Node, Edge, EdgeView } from '@antv/x6'

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
      x: 80,
      y: 40,
      width: 120,
      height: 50,
      label: 'Source',
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

    const target = graph.addNode(
      source.clone().translate(460, 230).setAttrByPath('label/text', 'Target'),
    )

    const obstacles: Node[] = []
    const obstacle = graph.addNode({
      x: 200,
      y: 150,
      width: 120,
      height: 50,
      label: 'Obstacle',
      attrs: {
        body: {
          stroke: '#8f8f8f',
          strokeWidth: 1,
        },
      },
    })

    let edge: Edge

    const update = () => {
      const edgeView = graph.findViewByCell(edge) as EdgeView
      edgeView.update()
    }

    obstacles.push(obstacle)
    obstacles.push(graph.addNode(obstacle.clone().translate(280, -110)))
    obstacles.push(graph.addNode(obstacle.clone().translate(180, 10)))
    obstacles.forEach((obstacle) => obstacle.on('change:position', update))

    edge = graph.addEdge({
      source,
      target,
      attrs: {
        line: {
          stroke: '#8f8f8f',
          strokeWidth: 1,
        },
      },
      router: {
        name: 'manhattan',
        args: {
          startDirections: ['top'],
          endDirections: ['bottom'],
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
      <div className="manhattan-router-app">
        <div className="app-content" ref={this.refContainer} />
      </div>
    )
  }
}

const root = createRoot(document.getElementById('container')!)
root.render(<Example />)
window.addEventListener('pagehide', () => root.unmount(), { once: true })
```



### metro

地铁路由 `metro` 是曼哈顿路由 `manhattan` 的一个变种，它由水平或垂直的正交线段和斜角线段组成，类似地铁轨道图，并自动避开路径上的其他节点（障碍）。其选项与 [manhattan](#manhattan)一样，但 `maxDirectionChange` 的默认值为 `45`，表示路由线段的最大倾斜角度为 `45` 度。

例如：

```ts
graph.addEdge({
  source,
  target,
  router: {
    name: 'metro',
    args: {
      startDirections: ['top'],
      endDirections: ['bottom'],
    },
  },
})
```



```ts
import './index.less'
import { createRoot } from 'react-dom/client'
import React from 'react'
import { Graph, Node, Edge, EdgeView } from '@antv/x6'

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
      x: 80,
      y: 40,
      width: 120,
      height: 50,
      label: 'Source',
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

    const target = graph.addNode(
      source.clone().translate(460, 230).setAttrByPath('label/text', 'Target'),
    )

    const obstacles: Node[] = []
    const obstacle = graph.addNode({
      x: 200,
      y: 150,
      width: 120,
      height: 50,
      label: 'Obstacle',
      attrs: {
        body: {
          stroke: '#8f8f8f',
          strokeWidth: 1,
        },
      },
    })

    let edge: Edge

    const update = () => {
      const edgeView = graph.findViewByCell(edge) as EdgeView
      edgeView.update()
    }

    obstacles.push(obstacle)
    obstacles.push(graph.addNode(obstacle.clone().translate(280, -110)))
    obstacles.push(graph.addNode(obstacle.clone().translate(180, 10)))
    obstacles.forEach((obstacle) => obstacle.on('change:position', update))

    edge = graph.addEdge({
      source,
      target,
      attrs: {
        line: {
          stroke: '#8f8f8f',
          strokeWidth: 1,
        },
      },
      router: {
        name: 'metro',
        args: {
          startDirections: ['top'],
          endDirections: ['bottom'],
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
      <div className="metro-router-app">
        <div className="app-content" ref={this.refContainer} />
      </div>
    )
  }
}

const root = createRoot(document.getElementById('container')!)
root.render(<Example />)
window.addEventListener('pagehide', () => root.unmount(), { once: true })
```



### er

实体关系路由 `er` 由 Z 字形的斜角线段组成，常用于表示 ER 图中的实体之间的连线。

支持的参数如下表：

| 参数名    | 参数类型                                 | 是否必选 | 默认值 | 参数说明                                                                                        |
|-----------|------------------------------------------|---------|--------|---------------------------------------------------------------------------------------------|
| offset    | number \|'center'                        | 否       | `32`   | 路由的第一个点和最后一个点与节点之间的距离。当取值为 `'center'` 时，节点距离的中心作为路由点坐标。 |
| min       | number                                   | 否       | `16`   | 路由的第一个点和最后一个点与节点之间的最小距离。                                                 |
| direction | `'T'`\|`'B'`\|`'L'`\|`'R'`\|`'H'`\|`'V'` | 否       | -      | 路由方向，缺省时将自动选择最优方向。                                                              |

例如：

```ts
graph.addEdge({
  source,
  target,
  router: {
    name: 'er',
    args: {
      offset: 24,
    },
  },
})
```



```ts
import './index.less'
import { createRoot } from 'react-dom/client'
import React from 'react'
import { Edge, Graph } from '@antv/x6'
import { Settings, State, defaults } from './settings.tsx'

export default class Example extends React.Component {
  private container: HTMLDivElement
  private edge: Edge

  componentDidMount() {
    const graph = new Graph({
      container: this.container,
      background: {
        color: '#F2F7FA',
      },
    })

    const rect1 = graph.addNode({
      x: 40,
      y: 30,
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
    })

    const rect2 = graph.addNode({
      x: 240,
      y: 150,
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
    })

    this.edge = graph.addEdge({
      source: rect1,
      target: rect2,
      attrs: {
        line: {
          stroke: '#8f8f8f',
          strokeWidth: 1,
        },
      },
      router: {
        name: 'er',
        args: this.getERArgs(defaults),
      },
    })

    graph.centerContent()
  }

  getERArgs(state: State) {
    const { center, offset, min, direction } = state
    return {
      min,
      direction: direction || undefined,
      offset: center ? 'center' : offset,
    }
  }

  updateConnection = (state: State) => {
    this.edge.prop('router/args', this.getERArgs(state))
  }

  refContainer = (container: HTMLDivElement) => {
    this.container = container
  }

  render() {
    return (
      <div className="er-router-app">
        <div className="app-left">
          <Settings onChange={this.updateConnection} />
        </div>
        <div ref={this.refContainer} className="app-content" />
      </div>
    )
  }
}

const root = createRoot(document.getElementById('container')!)
root.render(<Example />)
window.addEventListener('pagehide', () => root.unmount(), { once: true })
```



## 自定义路由

除了内置路由，我们还可以按照一定规则来创建自定义路由，例如，实现随机的路由：

```ts
// 路由参数
interface RandomRouterArgs {
  bounces?: number
}

function randomRouter(
  vertices: Point.PointLike[],
  args: RandomRouterArgs,
  view: EdgeView,
) {
  const bounces = args.bounces || 20
  const points = vertices.map((p) => Point.create(p))

  for (var i = 0; i < bounces; i++) {
    const sourceCorner = view.sourceBBox.getCenter()
    const targetCorner = view.targetBBox.getCenter()
    const randomPoint = Point.random(
      sourceCorner.x,
      targetCorner.x,
      sourceCorner.y,
      targetCorner.y,
    )
    points.push(randomPoint)
  }

  return points
}

Graph.registerRouter('random', randomRouter)
edge.setRouter('random', { bounces: 3 })
```



```ts
import './index.less'
import { createRoot } from 'react-dom/client'
import React from 'react'
import { Graph, Point } from '@antv/x6'

Graph.registerRouter(
  'random',
  (vertices, args, view) => {
    const BOUNCES = args.bounces || 20
    const points = vertices.map((p) => Point.create(p))

    for (let i = 0; i < BOUNCES; i += 1) {
      const sourceCorner = view.sourceBBox.getCenter()
      const targetCorner = view.targetBBox.getCenter()
      const randomPoint = Point.random(
        sourceCorner.x,
        targetCorner.x,
        sourceCorner.y,
        targetCorner.y,
      )
      points.push(randomPoint)
    }

    return points
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
      x: 30,
      y: 30,
      width: 100,
      height: 40,
      label: 'Source',
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

    const target = graph.addNode(
      source.clone().translate(300, 200).attr('label/text', 'Target'),
    )

    graph.addEdge({
      source,
      target,
      attrs: {
        line: {
          stroke: '#8f8f8f',
          strokeWidth: 1,
        },
      },
      router: {
        name: 'random',
        args: {
          bounces: 3,
        },
      },
    })
  }

  refContainer = (container: HTMLDivElement) => {
    this.container = container
  }

  render() {
    return (
      <div className="random-router-app">
        <div className="app-content" ref={this.refContainer} />
      </div>
    )
  }
}

const root = createRoot(document.getElementById('container')!)
root.render(<Example />)
window.addEventListener('pagehide', () => root.unmount(), { once: true })
```
### docs/demos/api/router/orth/index.less

```less
.orth-router-app {
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
### docs/demos/api/router/oneside/index.less

```less
.oneside-router-app {
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
### docs/demos/api/router/manhattan/index.less

```less
.manhattan-router-app {
  display: flex;
  width: 100%;
  border: 1px solid #f0f0f0;
  padding: 16px 8px;
  font-family: sans-serif;

  .app-content {
    flex: 1;
    height: 380px;
    margin-right: 8px;
    margin-left: 8px;
    box-shadow: 0 0 10px 1px #e9e9e9;
  }
}
```
### docs/demos/api/router/metro/index.less

```less
.metro-router-app {
  display: flex;
  width: 100%;
  border: 1px solid #f0f0f0;
  padding: 16px 8px;
  font-family: sans-serif;

  .app-content {
    flex: 1;
    height: 380px;
    margin-right: 8px;
    margin-left: 8px;
    box-shadow: 0 0 10px 1px #e9e9e9;
  }
}
```
### docs/demos/api/router/er/index.less

```less
.er-router-app {
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
### docs/demos/api/router/er/settings.tsx

```tsx
import React from 'react'
import { Switch, Radio, Slider, Card, Row, Col } from 'antd'

export interface Props {
  onChange: (state: State) => void
}

export interface State {
  offset: number
  min: number
  center: boolean
  direction: '' | 'T' | 'B' | 'L' | 'R' | 'H' | 'V'
}

export const defaults: State = {
  offset: 32,
  min: 16,
  center: false,
  direction: '',
}

export class Settings extends React.Component<Props, State> {
  state: State = defaults

  notifyChange() {
    this.props.onChange(this.state)
  }

  onCenterChanged = (center: boolean) => {
    this.setState({ center }, () => {
      this.notifyChange()
    })
  }

  onOffsetChanged = (offset: number) => {
    this.setState({ offset }, () => {
      this.notifyChange()
    })
  }

  onMinChanged = (min: number) => {
    this.setState({ min }, () => {
      this.notifyChange()
    })
  }

  onDirectionChanged = (e: any) => {
    const direction = e.target.value
    this.setState({ direction }, () => {
      this.notifyChange()
    })
  }

  render() {
    return (
      <Card
        title="Options"
        size="small"
        bordered={false}
        style={{ width: 320 }}
      >
        <Row align="middle">
          <Col span={6}>offset</Col>
          <Col span={14}>
            <Switch
              checkedChildren="center"
              unCheckedChildren="number"
              checked={this.state.center}
              onChange={this.onCenterChanged}
            />
          </Col>
        </Row>
        <Row align="middle">
          <Col span={6}></Col>
          <Col span={14}>
            <Slider
              min={8}
              max={64}
              step={1}
              disabled={this.state.center}
              value={this.state.offset}
              onChange={this.onOffsetChanged}
            />
          </Col>
          <Col span={1} offset={1}>
            <div className="slider-value">{this.state.offset}</div>
          </Col>
        </Row>
        <Row align="middle">
          <Col span={6}>min</Col>
          <Col span={14}>
            <Slider
              min={8}
              max={64}
              step={1}
              value={this.state.min}
              onChange={this.onMinChanged}
            />
          </Col>
          <Col span={1} offset={1}>
            <div className="slider-value">{this.state.min}</div>
          </Col>
        </Row>
        <Row align="top">
          <Col span={6}>direction</Col>
          <Col span={14}>
            <Radio.Group
              name="direction"
              value={this.state.direction}
              onChange={this.onDirectionChanged}
            >
              <Radio value="" style={{ display: 'block', marginBottom: 8 }}>
                NONE
              </Radio>
              <Radio value="L" style={{ marginBottom: 8 }}>
                L
              </Radio>
              <Radio value="R">R</Radio>
              <Radio value="H">H</Radio>
              <Radio value="T">T</Radio>
              <Radio value="B">B</Radio>
              <Radio value="V">V</Radio>
            </Radio.Group>
          </Col>
        </Row>
      </Card>
    )
  }
}
```
### docs/demos/api/router/random/index.less

```less
.random-router-app {
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
