---
title: 自定义边
order: 10
redirect_from:
  - /zh/docs
  - /zh/docs/tutorial
  - /zh/docs/tutorial/intermediate
---

我们在 X6 中内置了 `Edge`、`DoubleEdge` 和 `ShadowEdge` 三种基础边，虽然 `Edge` 就能满足常见需求，但也避免不了偶然的定制需求。定制边与[定制节点](/zh/docs/tutorial/intermediate/custom-node)类似，但也有一些不同。

## 原理

自定义边实际上是从基础边派生（继承）出我们自己的边，并覆盖基类的某些选项和方法。

### 三步法

以内置边 `Edge` 为例，自定义边可以分为以下三步。

#### 第一步：继承

```ts
import { Edge as BaseEdge } from '@antv/x6'

class Edge extends BaseEdge { 
  // 省略实现细节
}
```

#### 第二步：配置

调用继承的静态方法 `config(options)` 来配置[边选项](/zh/docs/tutorial/basic/edge/#选项)的默认值、[自定义选项](/zh/docs/tutorial/basic/cell#自定义选项)和[自定义属性]()，例如通过 [markup](/zh/docs/tutorial/basic/cell#markup) 来指定边默认的 SVG/HTML 结构，通过 [attrs](/zh/docs/tutorial/basic/cell#attrs-1) 来指定边的默认属性样式，通过 [defaultLabel](/zh/docs/tutorial/basic/edge#defaultlabel) 来指定边的默认标签样式。

| 名称      | 类型                             | 是否必选 | 默认值    | 说明                                        |
|-----------|----------------------------------|----------|-----------|-------------------------------------------|
| propHooks | Function \| Function[] \| Object | 否       | undefined | [自定义选项](/zh/docs/tutorial/basic/cell#自定义选项)钩子。 |
| attrHooks | Object                           | 否       | undefined | [自定义属性]()钩子。                         |
| ...others | Object                           |          |           | [边选项](/zh/docs/tutorial/basic/edge/#选项)。              |

看下面 `Edge` 的默认配置。

```ts
Edge.config({
  markup: [
    {
      tagName: 'path',
      selector: 'wrap',
      attrs: {
        fill: 'none',
        cursor: 'pointer',
        stroke: 'transparent',
        strokeLinecap: 'round',
      },
    },
    {
      tagName: 'path',
      selector: 'line',
      attrs: {
        fill: 'none',
        pointerEvents: 'none',
      },
    },
  ],
  attrs: {
    wrap: {
      connection: true,
      strokeWidth: 10,
      strokeLinejoin: 'round',
    },
    line: {
      connection: true,
      stroke: '#333333',
      strokeWidth: 2,
      strokeLinejoin: 'round',
      targetMarker: {
        tagName: 'path',
        d: 'M 10 -5 0 0 10 5 z',
      },
    },
  },
})
```

上面代码中，我们通过 `markup` 定义了两个 `<path>` 元素，分别指定了 `wrap` 和 `line` 选择器，并通过 `markup` 内部的 `attrs` 指定了基础样式（交互响应）：`wrap` 指代的 `<path>` 元素默认透明不可见，用于响应用户交互，而 `line` 指代的 `<path>` 元素仅仅做视觉渲染，不响应用户交互。

然后在 `attrs` 上定义了边的默认属性样式：`line` 指代的 `<path>` 元素代表了边的主体，我们为其指定了 `2px` 宽度的黑色边框，并通过 `targetMarker` [特殊属性](/zh/docs/tutorial/intermediate/marker)为其指定了一个终止箭头；`wrap` 指代的 `<path>` 元素用于响应用户交互，为了让鼠标更容易捕获到连线，我们为其指定了 `10px` 的边框。两者的 `connection` 特殊属性都为 `true`，表示两个 `<path>` 元素的 `d` 属性值都将根据边的 [vertices](/zh/docs/tutorial/basic/edge#vertices)、[router](/zh/docs/tutorial/basic/edge#router)、[connector](/zh/docs/tutorial/basic/edge#connector) 选项计算得到。

#### 第三步：注册


调用 Graph 的静态方法 registerEdge 来注册边，注册以后就可以像使用内置边那样来使用边。

```ts
Graph.registerEdge(name: string, cls: typeof Edge, overwrite?: boolean)
```

| 参数名    | 类型        | 是否必选 | 默认值 | 说明                                              |
|-----------|-------------|---------|--------|-------------------------------------------------|
| name      | String      | 是       |        | 注册的边名。                                       |
| cls       | typeof Edge | 是       |        | 边类，直接或间接继承 Edge 的类。                    |
| overwrite | Boolean     | 否       | false  | 重名时是否覆盖，默认为 `false` 不覆盖（重名时报错）。 |

例如，注册名为 `'edge'` 的边。

```ts
Graph.registerEdge('edge', Edge)
```

注册以后，我们可以像下面这样来使用。

```ts
graph.addEdge({
  shape: 'edge',
  source,
  target,
})
```

### 便捷方法一

有时候我们可能在继承边后并不需要任何扩展任何方法，而只是覆盖某些默认样式。例如，定义一个红色连线的边。

```ts
class RedEdge extends Edge { }

RedEdge.config({
  attrs: {
    line: {
      stroke: 'red',
    },
  },
})
```

上面第一行代码就显得有点尴尬：实现了继承但没有扩展任何方法，有点大材小用的感觉。所以我们也提供了一个更加便捷的静态方法 `define` 来定义这类边。

```ts
const RedEdge = Edge.define({
  attrs: {
    line: {
      stroke: 'red',
    },
  },
})

Graph.registerEdge('red-edge', RedEdge)
```

该方法将其调用者（如上面的 `Edge`）作为基类，继承出一个新的边，然后调用新边的静态方法 `config` 来配置默认选项。

需要注意的是，上面代码生成的 `RedEdge` 类的类名并不是 `'RedEdge'`，而是系统自动生成的类名，当指定 `constructorName` 选项后，其大驼峰（CamelCase）形式将作为新边的类名。

```ts
const RedEdge = Edge.define({
  constructorName: 'red-edge',
  attrs: {
    line: {
      stroke: 'red',
    },
  },
})

Graph.registerEdge('red-edge', RedEdge)
```

如果我们提供了 `shape` 选项，那么系统将自动为你注册边。当没有指定 `constructorName` 选项时，`shape` 的大驼峰形式（CamelCase）也将作新边的类名，也就是说下面代码定义的边的类名为 `'RedEdge'`。

```ts
Edge.define({
  shape: 'red-edge', // 自动注册名为 'red-edge' 的边，并且边的类名为 'RedEdge'。
  attrs: {
    line: {
      stroke: 'red',
    },
  },
})
```

除了 `constructorName` 和 `shape` 两个特殊选项外，其他选项都与 [config 方法](#第二步配置)的选项保持一致。下表是 `define` 方法支持的选项。

| 名称            | 是否必选 | 类型   | 说明                                                                             |
|-----------------|---------|--------|--------------------------------------------------------------------------------|
| constructorName | 否       | String | 类名。                                                                            |
| shape           | 否       | String | 自动注册的边名，当 `constructorName` 缺省时其大驼峰（CamelCase）形式也将作为类名。 |
| ...others       |          | Object | [config 方法](#第二步配置)的选项。            


### 便捷方法二

上面提到的 `Graph.registerEdge` 方法还有另外一种签名，使用该方法可以同时实现定义和注册边。

```ts
Graph.registerEdge(name: string, options: Object, overwrite?: boolean)
```

| 参数名    | 类型    | 是否必选 | 默认值 | 说明                                              |
|-----------|---------|---------|--------|-------------------------------------------------|
| name      | String  | 是       |        | 注册的边名。                                       |
| options   | Object  | 是       |        | 选项。                                             |
| overwrite | Boolean | 否       | false  | 重名时是否覆盖，默认为 `false` 不覆盖（重名时报错）。 |

通过 `options.inherit` 来指定继承的基类，默认值为 `Edge` 类，支持字符串或边类，当 `options.inherit` 为字符串时将自动从已注册的边中找到对应的边作为基类，`options` 的其他选项与 [define 方法](#便捷方法一)一致。当 `options.constructorName` 类名缺省时，第一个参数 `name` 的大驼峰形式（CamelCase）也将作为自定义边的类名。

```ts
Graph.registerEdge('red-edge', {
  inherit: Edge, // 或 'rect'
  attrs: {
    line: {
      stroke: 'red',
    },
  },
})
```

## 案例

接下来我们就基于 `Shape.Edge` 来自定义一个矩形 `CustomEdge`，这里不修改边的 `markup` 定义，而仅仅是做样式覆盖。

使用便捷方法一。

```ts
import { Shape } from '@antv/x6'

Shape.Edge.define({
  // 边名称
  shape: 'custom-edge',
  // 属性样式
  attrs: {
    line: {
      stroke: '#5755a1',
    },
  },
  // 默认标签
  defaultLabel: {
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
      label: {
        fill: 'black',
        fontSize: 14,
        textAnchor: 'middle',
        textVerticalAnchor: 'middle',
        pointerEvents: 'none',
      },
      body: {
        ref: 'label',
        fill: 'white',
        stroke: '#5755a1',
        strokeWidth: 2,
        rx: 4,
        ry: 4,
        refWidth: '140%',
        refHeight: '140%',
        refX: '-20%',
        refY: '-20%',
      },
    },
    position: {
      distance: 100, // 绝对定位
      options: {
        absoluteDistance: true,
      },
    },
  },
})
```

使用便捷方法二。

```ts
Graph.registerEdge(
  'custom-edge', // 边名称
  {
    // 基类
    inherit: 'edge',
    // 属性样式
    attrs: {
      line: {
        stroke: '#5755a1',
      },
    },
    // 默认标签
    defaultLabel: {
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
        label: {
          fill: 'black',
          fontSize: 14,
          textAnchor: 'middle',
          textVerticalAnchor: 'middle',
          pointerEvents: 'none',
        },
        body: {
          ref: 'label',
          fill: 'white',
          stroke: '#5755a1',
          strokeWidth: 2,
          rx: 4,
          ry: 4,
          refWidth: '140%',
          refHeight: '140%',
          refX: '-20%',
          refY: '-20%',
        },
      },
      position: {
        distance: 100, // 绝对定位
        options: {
          absoluteDistance: true,
        },
      },
    },
  },
)
```

<iframe src="/demos/tutorial/intermediate/custom-edge/custom-edge"></iframe>

