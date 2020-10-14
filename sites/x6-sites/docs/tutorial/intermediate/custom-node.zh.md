---
title: 自定义节点
order: 8
redirect_from:
  - /zh/docs
  - /zh/docs/tutorial
  - /zh/docs/tutorial/intermediate
---

我们在 X6 中内置了一些基础图形，如 `Rect`、`Circle` 和 `Ellipse` 等，但这些还远远不能满足我们的实习需求，我们需要能够定义具有业务意义的节点，例如 ER 图的表格节点。自定义节点也不是什么难事，其实就是在组合使用 SVG 中的 `<rect>` 、`<circle>`、`<ellipse>`、`<image>`、`<text>`、`<path>` 等基础元素，如果你对这些基础元素还不熟悉，可以参考 MDN 提供的[教程](https://developer.mozilla.org/en-US/docs/Web/SVG/Element)，使用这些基础元素可以定义出任何我们想要的图形。

## 原理

自定义节点实际上是从基础节点派生（继承）出我们自己的节点，并覆盖基类的某些选项和方法。

### 三步法

以内置节点 `Rect` 为例，自定义节点可以分以下三步走。

#### 第一步：继承

```ts
import { Node } from '@antv/x6'

class Rect extends Node { 
  // 省略实现细节
}
```

#### 第二步：配置

调用继承的静态方法 `config(options)` 来配置[节点选项](../basic/node/#选项)的默认值、[自定义选项](../basic/cell#自定义选项)和[自定义属性]()，最常用选项的是通过 [markup](../basic/cell#markup) 来指定节点默认的 SVG/HTML 结构，通过 [attrs](../basic/cell#attrs-1) 来指定节点的默认属性样式。

| 名称      | 类型                             | 是否必选 | 默认值    | 说明                                        |
|-----------|----------------------------------|----------|-----------|-------------------------------------------|
| propHooks | Function \| Function[] \| Object | 否       | undefined | [自定义选项](../basic/cell#自定义选项)钩子。 |
| attrHooks | Object                           | 否       | undefined | [自定义属性]()钩子。                         |
| ...others | Object                           |          |           | [节点选项](../basic/node/#选项)。            |

看下面 `Rect` 节点的默认配置。

```ts
Rect.config({
  width: 100,
  height: 40,
  markup: [
    {
      tagName: 'rect',
      selector: 'body',
    },
    {
      tagName: 'text',
      selector: 'label',
    },
  ],
  attrs: {
    body: {
      fill: '#ffffff',
      stroke: '#333333',
      strokeWidth: 2,
    },
    label: {
      fontSize: 14,
      fill: '#333333',
      refX: '50%',
      refY: '50%',
      textAnchor: 'middle',
      textVerticalAnchor: 'middle',
    },
  },
  // 通过钩子将自定义选项 label 应用到 'attrs/text/text' 属性上
  propHooks(metadata) {
    const { label, ...others } = metadata
    if (label) {
      ObjectExt.setByPath(others, 'attrs/text/text', label)
    }
    return others
  },
})
```

上面代码中，我们通过 `width` 和 `height` 指定了节点的默认大小，然后通过 `markup` 定义了节点由 `<rect>` 和 `<text>` 两个 SVG 元素构成，并分别指定了 `body` 和 `label` 两个选择器，接着就可以在 `attrs` 中通过这两个选择器来指定节点的默认样式。最后通过 `propHooks` 定义了一个[自定义选项](../../basic/cell#自定义选项) `label`，这样我们就可以通过 label 设置标签文本。

#### 第三步：注册

调用 Graph 的静态方法 registerNode 来注册节点，注册以后就可以像使用内置节点那样来使用节点。

```ts
Graph.registerNode(name: string, cls: typeof Node, overwrite?: boolean)
```

| 参数名    | 类型        | 是否必选 | 默认值 | 说明                                              |
|-----------|-------------|---------|--------|-------------------------------------------------|
| name      | String      | 是       |        | 注册的节点名。                                     |
| cls       | typeof Node | 是       |        | 节点类，直接或间接继承 Node 的类。                  |
| overwrite | Boolean     | 否       | false  | 重名时是否覆盖，默认为 `false` 不覆盖（重名时报错）。 |


例如，注册名为 `'rect'` 的节点。

```ts
Graph.registerNode('rect', Rect)
```

注册以后，我们可以像下面这样来使用。

```ts
graph.addNode({
  shape: 'rect',
  x: 30,
  y: 40,
})
```

### 便捷方法一

有时候我们可能在继承节点后并不需要任何扩展任何方法，而只是覆盖某些默认样式。例如，定义一个红色边框的矩形。

```ts
class RedRect extends Rect { }

// 覆盖默认边框颜色
RedRect.config({
  attrs: {
    body: {
      stroke: 'red',
    },
  },
})
```

上面第一行代码就显得有点尴尬：实现了继承但没有扩展任何方法，有点大材小用的感觉。所以我们也提供了一个更加便捷的静态方法 `define` 来定义这类节点。

```ts
const RedRect = Rect.define({
  attrs: {
    body: {
      stroke: 'red',
    },
  },
})

Graph.registerNode('red-rect', RedRect)
```

该方法将其调用者（如上面的 `Rect`）作为基类，继承出一个新的节点，然后调用新节点的静态方法 `config` 来配置默认选项。

需要注意的是，上面代码生成的 `RedRect` 类的类名并不是 `'RedRect'`，而是系统自动生成的类名，当指定 `constructorName` 选项后，其大驼峰（CamelCase）形式将作为新节点的类名。

```ts
const RedRect = Rect.define({
  constructorName: 'red-rect',
  attrs: {
    body: {
      stroke: 'red',
    },
  },
})

Graph.registerNode('red-rect', RedRect)
```

如果我们提供了 `shape` 选项，那么系统将自动为你注册节点。当没有指定 `constructorName` 选项时，`shape` 的大驼峰形式（CamelCase）也将作新节点的类名，也就是说下面代码定义的节点类名为 `'RedRect'`。

```ts
Rect.define({
  shape: 'red-rect', // 自动注册名为 'red-rect' 的节点，并且节点类名为 'RedRect'。
  attrs: {
    body: {
      stroke: 'red',
    },
  },
})
```

除了 `constructorName` 和 `shape` 两个特殊选项外，其他选项都与 [config 方法](#第二步配置)的选项保持一致。下表是 `define` 方法支持的选项。

| 名称            | 是否必选 | 类型   | 说明                                                                             |
|-----------------|----------|--------|--------------------------------------------------------------------------------|
| constructorName | 否       | String | 类名。                                                                            |
| shape           | 否       | String | 自动注册的节点名，当 `constructorName` 缺省时其大驼峰（CamelCase）形式也将作为类名。 |
| ...others       |          | Object | [config 方法](#第二步配置)的选项。                                                |

### 便捷方法二

上面提到的 `Graph.registerNode` 方法还有另外一种签名，使用该方法可以同时实现定义和注册节点。

```ts
Graph.registerNode(name: string, options: Object, overwrite?: boolean)
```

| 参数名    | 类型    | 是否必选 | 默认值 | 说明                                              |
|-----------|---------|---------|--------|-------------------------------------------------|
| name      | String  | 是       |        | 注册的节点名。                                     |
| options   | Object  | 是       |        | 选项。                                             |
| overwrite | Boolean | 否       | false  | 重名时是否覆盖，默认为 `false` 不覆盖（重名时报错）。 |

通过 `options.inherit` 来指定继承的基类，默认值为 `Node` 类，支持字符串或节点类，当 `options.inherit` 为字符串时将自动从已注册的节点中找到对应的节点作为基类，`options` 的其他选项与 [define 方法](#便捷方法一)一致。当 `options.constructorName` 类名缺省时，第一个参数 `name` 的大驼峰形式（CamelCase）也将作为自定义节点的类名。

```ts
Graph.registerNode('red-rect', {
  inherit: Rect, // 或 'rect'
  attrs: {
    body: {
      stroke: 'red',
    },
  },
})
```

## 案例

接下来我们就基于 `Shape.Rect` 来自定义一个矩形 `CustomRect`，这里不修改矩形的 `markup` 定义，而仅仅是做样式覆盖。

使用便捷方法一。

```ts
import { Shape } from '@antv/x6'

Shape.Rect.define({
  shape: 'custom-rect',
  width: 300, // 默认宽度
  height: 40, // 默认高度
  attrs: {
    body: {
      rx: 10, // 圆角矩形
      ry: 10,
      strokeWidth: 1,
      fill: '#5755a1',
      stroke: '#5755a1',
    },
    label: {
      fill: '#fff',
      fontSize: 18,
      refX: 10, // x 轴偏移，类似 css 中的 margin-left
      textAnchor: 'left', // 左对齐
    }
  },
})
```

使用便捷方法二。

```ts
Graph.registerNode('custom-rect', {
  inherit: 'rect', // 继承自 Shape.Rect
  width: 300, // 默认宽度
  height: 40, // 默认高度
  attrs: {
    body: {
      rx: 10, // 圆角矩形
      ry: 10,
      strokeWidth: 1,
      fill: '#5755a1',
      stroke: '#5755a1',
    },
    label: {
      fill: '#fff',
      fontSize: 18,
      refX: 10, // x 轴偏移，类似 css 中的 margin-left
      textAnchor: 'left', // 左对齐
    }
  },
})
```

然后我们可以这样来使用。

```ts
graph.addNode({
  x: 100,
  y: 60,
  shape: 'custom-rect',
  label: 'My Custom Rect', // label 继承于基类的自定义选项
});
```

<iframe src="/demos/tutorial/intermediate/custom-node/custom-node"></iframe>
