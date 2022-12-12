---
title: 节点
order: 1
redirect_from:
  - /zh/docs
  - /zh/docs/tutorial/basic
  - /zh/docs/tutorial/basic/basic
---

:::info{title=在本章节中，主要介绍节点相关的知识，通过阅读，你可以了解到：}

- X6 支持的节点渲染方式
- 添加节点方法
- X6 内置的节点类型
- 如何自定义节点
- 如何通过 API 修改节点
  :::

## 节点渲染方式

X6 是基于 `SVG` 的渲染引擎，可以使用不同的 SVG 元素渲染节点和边，非常适合节点内容比较简单的场景。面对复杂的节点， `SVG` 中有一个特殊的 `foreignObject` 元素，在该元素中可以内嵌任何 XHTML 元素，可以借助该元素来渲染 HTML、React/Vue/Angular 组件到需要位置，这会给项目开发带来非常大的便利。

在选择渲染方式时我们推荐：

- 如果节点内容比较简单，而且需求比较固定，使用 `SVG` 节点
- 其他场景，都推荐使用当前项目所使用的框架来渲染节点

:::warning{title=注意：}
React/Vue/HTML 渲染方式也存在一些限制，因为浏览器的兼容性问题，有时会出现一些异常的渲染行为。主要表现形式为节点内容展示不全或者节点内容闪烁。可以通过一些方法规避，比如在节点内部元素的 css 样式中不要使用 `position:absolute`、`position:relative`、`tranform`、`opacity`。
:::

下面的介绍都是基于 `SVG` 节点，但是其他渲染形式的使用方式与其非常类似，在进阶教程中我们会再次介绍。

## 添加节点

节点和边都有共同的基类 [Cell](/zh/docs/api/model/cell)，除了从 `Cell` 继承属性外，还支持以下选项。

| 属性名 | 类型   | 默认值 | 描述                         |
| ------ | ------ | ------ | ---------------------------- |
| x      | number | 0      | 节点位置 x 坐标，单位为 px。 |
| y      | number | 0      | 节点位置 y 坐标，单位为 px。 |
| width  | number | 1      | 节点宽度，单位为 px。        |
| height | number | 1      | 节点高度，单位为 px。        |
| angle  | number | 0      | 节点旋转角度。               |

```ts
graph.addNode({
  shape: "rect",
  x: 100,
  y: 40,
  width: 100,
  height: 40,
});
```

## 内置节点

上面使用 `shape` 来指定了节点的图形，`shape` 的默认值为 `rect`。X6 内置节点与 `shape` 名称对应关系如下表。

| 构造函数       | shape 名称 | 描述                                             |
| -------------- | ---------- | ------------------------------------------------ |
| Shape.Rect     | rect       | 矩形。                                           |
| Shape.Circle   | circle     | 圆形。                                           |
| Shape.Ellipse  | ellipse    | 椭圆。                                           |
| Shape.Polygon  | polygon    | 多边形。                                         |
| Shape.Polyline | polyline   | 折线。                                           |
| Shape.Path     | path       | 路径。                                           |
| Shape.Image    | image      | 图片。                                           |
| Shape.HTML     | html       | HTML 节点，使用 `foreignObject` 渲染 HTML 片段。 |

<code id="node-shapes" src="@/src/tutorial/basic/node/shapes/index.tsx"></code>

## 定制节点

我们可以通过 `markup` 和 `attrs` 来定制节点的形状和样式，`markup` 可以类比 `HTML`，`attrs` 类比 `CSS`。强烈建议仔细阅读 [markup](/zh/docs/api/model/cell#markup) 和 [attrs](/zh/docs/api/model/cell#attrs) 文档。

接下来我们会遇到一个问题，定制的内容要被多个节点使用，是不是需要每个节点都重新定义一次呢？答案是否定的，X6 提供了便捷的方式，可以让不同的节点复用配置。

<code id="node-registry" src="@/src/tutorial/basic/node/registry/index.tsx"></code>

## 修改节点

在渲染完成之后，我们还可以通过 API 修改节点的所有属性。我们会常用到下面两个方法：

- node.prop(path, value)，详细使用见 [prop](/zh/docs/api/model/cell#节点和边的属性-properties)。
- node.attr(path, value)，详细使用见 [attr](/zh/docs/api/model/cell#元素属性-attrs)。

首先来看 `prop`，我们直接打印 X6 默认 rect 节点的 `prop` 的值。

```ts
const node = graph.addNode({
  shape: 'rect',
  width: 100,
  height: 40,
  x: 100,
  y: 100,
  label: 'edge',
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
source.prop("size", { width: 120, height: 50 }); // 修改 x 坐标
source.attr("rect/fill", "#ccc"); // 修改填充色，等价于 source.prop('attrs/rect/fill', '#ccc')
```

<code id="node-prop" src="@/src/tutorial/basic/node/prop/index.tsx"></code>
