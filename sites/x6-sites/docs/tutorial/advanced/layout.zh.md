---
title: 使用布局
order: 8
redirect_from:
  - /zh/docs
  - /zh/docs/tutorial
  - /zh/docs/tutorial/advanced
---

想让画布中图形按照一定的规则进行排列，少不了布局算法。 我们在 [Layout](https://github.com/antvis/layout) 中提供了很多布局算法，下面介绍一下 `X6` 和 `Layout` 的搭配使用。

## 安装

```shell
# npm
$ npm install @antv/layout--save

# yarn
$ yarn add @antv/layout
```

## 使用

下面是一个网格布局的简单使用：

```ts
import { Graph } from '@antv/x6'
import { Layout } from '@antv/layout'

const graph = new Graph({
  container: document.getElementById('container'),
  width: 600,
  height: 400,
})

const model = {
  nodes: [
    {
      id: 'node1',
    }, {
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

const gridLayout = new Layout({
  type: 'grid',
  width: 600,
  height: 400,
  center: [300, 200],
  rows: 4,
  cols: 4,
})

const newModel = gridLayout.layout(model)

gridLayout.fromJSON(newModel)

```

## 布局

### 网格布局

网格布局根据参数指定的排序方式对节点进行排序后，将节点排列在网格上。

<iframe src="/demos/tutorial/advanced/layout/grid"></iframe>

```ts
const gridLayout = new Layout({
  type: 'grid',
  width: 600,
  height: 400,
  center: [300, 200],
  rows: 4,
  cols: 4,
})
```

支持以下配置：

| 名称              | 类型      | 必选 | 默认值           | 描述                                                                          |
|-------------------|-----------|:----:|------------------|-----------------------------------------------------------------------------|
| type                  | string           |  `true`  |   `grid`   | 布局类型 |
| begin                 | [number, number] |  `false` |   [0, 0]   | 网格开始位置（左上角 |
| width                 | number           |  `false` |    -       | 布局区域宽度 |
| height                | number           |  `false` |    -       | 布局区域高度 |
| center                | [number, number] |  `false` |    -       | 布局中心点 |
| preventOverlap        | boolean          |  `false` |    `false` | 是否防止重叠，必须配合下面属性 `nodeSize`，只有设置了与当前图节点大小相同的 `nodeSize` 值，才能够进行节点重叠的碰撞检测 |
| preventOverlapPadding | number           |  `false` |    10      | 避免重叠时节点的间距 `padding`。`preventOverlap` 为 `true` 时生效 |
| rows                  | number           |  `false` |    -       | 网格的行数，不设置时算法根据节点数量、布局空间、`cols`（若指定）自动计算 |
| cols                  | number           |  `false` |    -       | 网格的列数，不设置时算法根据节点数量、布局空间、`rows`（若指定）自动计算 |
| sortBy                | string           |  `false` |    -       | 指定排序的依据（节点属性名），数值越高则该节点被放置得越中心。若不设置，则会计算节点的度数，度数越高，节点将被放置得越中心 |

### 环形布局

布局将所有节点布局在一个圆环上，可以选择节点在圆环上的排列顺序。可以通过参数的配置扩展出环的分组布局、螺旋形布局等

<iframe src="/demos/tutorial/advanced/layout/circular"></iframe>

```ts
const circularLayout = new Layout({
  type: 'circular',
  width: 600,
  height: 400,
  center: [300, 200],
  radius: 50,
})
```

支持以下配置：

| 名称              | 类型      | 必选 | 默认值           | 描述                                                                          |
|-------------------|-----------|:----:|------------------|-----------------------------------------------------------------------------|
| type              | string           |  `true`  |   `circular`   | 布局类型 |
| width             | number           |  `false` |    -           | 布局区域宽度 |
| height            | number           |  `false` |    -           | 布局区域高度 |
| center            | [number, number] |  `false` |    -           | 布局中心点 |
| radius            | number           |  `false` |   `null`       | 圆的半径。若设置了 `radius`，则 `startRadius` 与 `endRadius` 不生效 |
| startRadius       | number           |  `false` |    `null`      | 螺旋状布局的起始半径 |
| endRadius         | number           |  `false` |    `null`      | 螺旋状布局的结束半径 |
| clockwise         | boolean          |  `false` |    `true`      | 是否顺时针排列 |
| divisions         | number           |  `false` |    1           | 节点在环上的分段数（几个段将均匀分布），在 `endRadius - startRadius != 0` 时生效 |
| divisions         | number           |  `false` |    1           | 节点在环上的分段数（几个段将均匀分布），在 `endRadius - startRadius != 0` 时生效 |
| ordering          | string           |  `false` |    `null`      | 节点在环上排序的依据。默认 `null` 代表直接使用数据中的顺序。`topology` 按照拓扑排序。`degree` 按照度数大小排序 |
| angleRatio        | number           |  `false` |    1           | 从第一个节点到最后节点之间相隔多少个 `2*PI` |