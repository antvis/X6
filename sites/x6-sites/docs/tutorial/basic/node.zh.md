---
title: 节点 Node
order: 1
redirect_from:
  - /zh/docs
  - /zh/docs/tutorial
  - /zh/docs/tutorial/basic
---

在[快速上手](/zh/docs/tutorial/getting-started)案例中，我们通过 JSON 数据来快速添加两个矩形节点和一条边到画布中，并简单介绍了如何定制节点样式。接下来我们将学习更多创建节点的方式，并了解创建节点的基础选项。

## 创建节点

### 选项

节点都有共同的基类 [Cell](/zh/docs/tutorial/basic/cell)，除了[从 Cell 继承的选项](/zh/docs/tutorial/basic/cell#基础选项)外，还支持以下选项。

| 属性名 | 类型   | 默认值 | 描述                         |
|--------|--------|--------|----------------------------|
| x      | Number | 0      | 节点位置 x 坐标，单位为 'px'。 |
| y      | Number | 0      | 节点位置 y 坐标，单位为 'px'。 |
| width  | Number | 1      | 节点宽度，单位为 'px'。        |
| height | Number | 1      | 节点高度，单位为 'px'。        |
| angle  | Number | 0      | 节点旋转角度。                |

接下来我们就一起来看看，如何使用这些选项来创建节点。

### 方式一：构造函数


我们在 X6 的 `Shape` 命名空间中内置了一些基础节点，如 `Rect`、`Circle`、`Ellipse` 等，可以使用这些节点的构造函数来创建节点。

```ts
import { Shape } from '@antv/x6'

// 创建节点
const rect = new Shape.Rect({
  x: 100,
  y: 200,
  width: 80,
  height: 40,
  angle: 30,
  attrs: {
    body: {
      fill: 'blue',
    },
    label: {
      text: 'Hello',
      fill: 'white',
    },
  },
})

// 添加到画布
graph.addNode(rect)
```

这里我们创建了一个矩形节点，分别通过 `x` 和 `y` 选项指定了节点的位置，通过 `width` 和 `height` 选项指定了节点的大小，通过 `angle` 指定了节点的旋转角度，通过 `attrs` 选项指定了[节点样式](#节点样式)，然后通过 `graph.addNode` 方法将节点添加到画布，节点添加到画布后将触发画布重新渲染，最后节点被渲染到画布中。

我们也可以先创建节点，然后调用节点提供的方法来设置节点的大小、位置、旋转角度、样式等。

```ts
const rect = new Shape.Rect()

rect
  // 设置节点位置
  .position(100, 200)
  // 设置节点大小
  .resize(80, 40)
  // 旋转节点
  .rotate(30)
  // 设置节点样式
  .attr({
    body: {
      fill: 'blue',
    },
    label: {
      text: 'Hello',
      fill: 'white',
    },
  })

// 添加到画布
graph.addNode(rect)
```

### 方式二：graph.addNode

另外，我们还可以使用 `graph.addNode` 方法来创建节点并添加节点到画布，**推荐大家使用这个便利的方法**。

```ts
const rect = graph.addNode({
  shape: 'rect', // 指定使用何种图形，默认值为 'rect'
  x: 100,
  y: 200,
  width: 80,
  height: 40,
  angle: 30,
  attrs: {
    body: {
      fill: 'blue',
    },
    label: {
      text: 'Hello',
      fill: 'white',
    },
  },
})
```

这里的关键是使用 `shape` 来指定节点图形，默认值为 `'rect'`，其他选项与使用节点构造函数创建节点的选项一致。在 X6 内部，我们通过 `shape` 指定的图形找到对应的构造函数来初始化节点，并将其添加到画布。内置节点构造函数与 `shape` 名称对应关系[参考此表](/zh/docs/tutorial/basic/cell#内置节点)。除了使用[内置节点](/zh/docs/tutorial/basic/cell#内置节点)，我们还可以使用注册的自定义节点，详情请参考[自定义节点](/zh/docs/tutorial/intermediate/custom-node)教程。

## 定制样式 Attrs

我们在之前的教程中介绍了[如何通过 attrs 选项来定制样式](/zh/docs/tutorial/basic/cell#attrs-1)，并且简单学习了如何通过[选项默认值](/zh/docs/tutorial/basic/cell#选项默认值)和[自定义选项](/zh/docs/tutorial/basic/cell#自定义选项)来定制节点，请结合这几个教程学习如何定制节点样式。

例如 `Shape.Rect` 节点定义了 `'body'`（代表 `<rect>` 元素）和 `'label'`（代表 `<text>` 元素）两个选择器。我们在创建矩形节点时可以像下面这样定义节点样式。

```ts
const rect = new Shape.Rect({
  x: 100,
  y: 40,
  width: 100,
  height: 40,
  attrs: { 
    body: {
      fill: '#2ECC71', // 背景颜色
      stroke: '#000',  // 边框颜色
    },
    label: {
      text: 'rect',    // 文本
      fill: '#333',    // 文字颜色
      fontSize: 13,    // 文字大小
    },
  },
})
```

<iframe src="/demos/tutorial/basic/node/style"></iframe>
