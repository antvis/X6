---
title: Using Layouts
order: 8
redirect_from:
  - /en/docs
  - /en/docs/tutorial
  - /en/docs/tutorial/advanced
---

:::info{title="In this chapter, we mainly introduce knowledge related to layouts. By reading, you can learn about"}

- How to implement layout of shapes on the canvas
- What layout methods are built into X6 :::

If you want the shapes on the canvas to be arranged according to certain rules, layout algorithms are essential. We provide many layout algorithms in [Layout](https://github.com/antvis/layout). Below, we will introduce how to use `X6` in conjunction with `Layout`.

## Installation

```shell
# npm
$ npm install @antv/layout --save

# yarn
$ yarn add @antv/layout
```

If you are including it directly via a `script` tag, you can use either of the following CDNs:

- https://unpkg.com/@antv/layout/dist/layout.min.js
- https://cdn.jsdelivr.net/npm/@antv/layout/dist/layout.min.js

## Usage

Here is a simple example of using a grid layout:

```ts
import { Graph } from '@antv/x6'
import { GridLayout } from '@antv/layout' // In UMD mode, use const { GridLayout } = window.layout

const graph = new Graph({
  container: document.getElementById('container'),
  width: 600,
  height: 400,
})

const model = {
  nodes: [
    {
      id: 'node1',
    },
    {
      id: 'node2',
    },
  ],
  edges: [
    {
      source: 'node1',
      target: 'node2',
    },
  ],
}

const gridLayout = new GridLayout({
  type: 'grid',
  width: 600,
  height: 400,
  center: [300, 200],
  rows: 4,
  cols: 4,
})

const newModel = gridLayout.layout(model)

graph.fromJSON(newModel)
```

#### Layout Process

- Choose a layout type, such as the `grid` above. If you are unsure which layout to use, you can check the examples [here](https://g6.antv.vision/zh/examples/gallery#category-%E5%8A%9B%E5%AF%BC%E5%90%91%E5%9B%BE%E5%B8%83%E5%B1%80) for visual references. You can refer to the corresponding documentation for layout configurations.
- Construct the layout data, which is quite simple:

```ts
// The following is the data format required for the layout
{
  nodes: [
    {
      id: 'node1',
      size: {
        width: 30,
        height: 40,
      }
    },
    {
      id: 'node2',
      size: {
        width: 30,
        height: 40,
      }
    }
  ],
  edges: [
    {
      source: 'node1',
      target: 'node2',
    }
  ]
}
```

- After executing the layout method, the layout algorithm will add `x` and `y` properties to the nodes based on the data you provided. Once you have the positions of the nodes, you can move them to the specified locations.

```ts
const layoutData = gridLayout.layout(originData)
layoutData.nodes.forEach((node) => {
  node.x -= node.size.width / 2
  node.y -= node.size.height / 2
})
```

:::warning{title=Note:} The `x` and `y` returned by the layout algorithm actually represent the center coordinates of the nodes. In X6, the `x` and `y` of the nodes represent the top-left corner coordinates, so after the layout, we need to perform a coordinate transformation. :::

## Common Layouts

### Grid Layout

The grid layout arranges nodes in a grid based on the specified sorting method.

<iframe src="/demos/tutorial/advanced/layout/grid"></iframe>

```ts
import { GridLayout } from '@antv/layout'

const gridLayout = new GridLayout({
  type: 'grid',
  width: 600,
  height: 400,
  center: [300, 200],
  rows: 4,
  cols: 4,
})
```

Supports the following configurations:

| Name | Type | Required | Default Value | Description |
| --- | --- | :-: | --- | --- |
| type | string | `true` | `grid` | Layout type |
| begin | [number, number] | `false` | [0, 0] | Grid starting position (top-left corner) |
| width | number | `false` | - | Width of the layout area |
| height | number | `false` | - | Height of the layout area |
| center | [number, number] | `false` | - | Center point of the layout |
| preventOverlap | boolean | `false` | `false` | Whether to prevent overlap |
| preventOverlapPadding | number | `false` | 10 | Padding between nodes when preventing overlap. Effective when `preventOverlap` is `true` |
| rows | number | `false` | - | Number of rows in the grid; if not set, the algorithm calculates based on the number of nodes, layout space, and `cols` (if specified) |
| cols | number | `false` | - | Number of columns in the grid; if not set, the algorithm calculates based on the number of nodes, layout space, and `rows` (if specified) |
| condense | boolean | `false` | `false` | When `false`, it utilizes all available canvas space; when `true`, it utilizes the minimum canvas space |
| sortBy | string | `false` | - | Specifies the sorting criterion (node attribute name); the higher the value, the more centered the node will be placed. If not set, the algorithm calculates based on node degree; nodes with higher degrees will be placed more centrally |
| nodeSize | number \| number[] | `false` | 30 | Uniformly set the size of the nodes |

### Circular Layout

The layout arranges all nodes in a circular ring, allowing you to choose the order of nodes on the ring. You can extend the configuration parameters to create grouped layouts, spiral layouts, etc.

<iframe src="/demos/tutorial/advanced/layout/circular"></iframe>

```ts
import { CircularLayout } from '@antv/layout'

const circularLayout = new CircularLayout({
  type: 'circular',
  width: 600,
  height: 400,
  center: [300, 200],
  radius: 50,
})
```

Supports the following configurations:

| Name | Type | Required | Default Value | Description |
| --- | --- | :-: | --- | --- |
| type | string | `true` | `circular` | Layout type |
| width | number | `false` | - | Width of the layout area |
| height | number | `false` | - | Height of the layout area |
| center | [number, number] | `false` | - | Center point of the layout |
| radius | number | `false` | `null` | Radius of the circle. If `radius` is set, `startRadius` and `endRadius` will not take effect |
| startRadius | number | `false` | `null` | Starting radius for spiral layout |
| endRadius | number | `false` | `null` | Ending radius for spiral layout |
| clockwise | boolean | `false` | `true` | Whether to arrange in a clockwise direction |
| divisions | number | `false` | 1 | Number of segments for nodes on the ring (segments will be evenly distributed); effective when `endRadius - startRadius != 0` |
| ordering | string | `false` | `null` | Basis for ordering nodes on the ring. Default `null` means using the order in the data. `topology` sorts by topology. `degree` sorts by degree size |
| angleRatio | number | `false` | 1 | The ratio of the angle between the first and last nodes |

### Dagre

Dagre is a hierarchical layout.

<iframe src="/demos/tutorial/advanced/layout/dagre"></iframe>

```ts
import { DagreLayout } from '@antv/layout'

const dagreLayout = new DagreLayout({
  type: 'dagre',
  rankdir: 'LR',
  align: 'UL',
  ranksep: 30,
  nodesep: 15,
  controlPoints: true,
})
```

Supports the following configurations:

| Name | Type | Required | Default Value | Description |
| --- | --- | :-: | --- | --- |
| type | string | `true` | `dagre` | Layout type |
| begin | [number, number] | `false` | - | Alignment position of the top-left corner of the layout |
| rankdir | 'TB' \| 'BT' \| 'LR' \| 'RL' | `false` | `TB` | Direction of the layout. T: top; B: bottom; L: left; R: right |
| align | 'UL' \| 'UR' \| 'DL' \| 'DR' \| undefined | `false` | - | Node alignment method. U: upper; D: down; L: left; R: right; undefined (centered) |
| nodesep | number | `false` | 50 | Node spacing (px). When `rankdir` is `TB` or `BT`, this is the horizontal spacing between nodes; when `rankdir` is `LR` or `RL`, this represents the vertical spacing between nodes |
| ranksep | number | `false` | 50 | Layer spacing (px). When `rankdir` is `TB` or `BT`, this is the vertical spacing between adjacent layers; when `rankdir` is `LR` or `RL`, this represents the horizontal spacing between adjacent layers |
| nodesepFunc | function | `false` | - | Callback function for node spacing (px), allowing different spacing for different nodes. |
| ranksepFunc | function | `false` | - | Callback function for layer spacing (px), allowing different spacing for different layers. |
| controlPoints | boolean | `false` | `true` | Whether to retain control points for layout connections |
