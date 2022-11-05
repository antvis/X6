---
title: 基类 Cell
order: 0
redirect_from:
  - /zh/docs
  - /zh/docs/tutorial
  - /zh/docs/tutorial/basic
---

在[快速上手](/zh/docs/tutorial/getting-started)案例中，我们通过 JSON 数据添加了两个矩形节点和一条边到画布中，除此之外，我们在 X6 的 `Shape` 命名空间中内置了一些基础图形，如 `Rect`、`Edge`、`Circle` 等，这些图形最终都有共同的基类 `Cell`，定义了节点和边共同属性和方法，如属性样式、可见性、业务数据等，并且在实例化、定制样式、配置默认选项等方面具有相同的行为。看下面的继承关系。

```
                                     ┌──────────────────┐
                                 ┌──▶│ Shape.Rect       │
                                 │   └──────────────────┘
                                 │   ┌──────────────────┐
                                 ├──▶│ Shape.Circle     │
                     ┌────────┐  │   └──────────────────┘
                  ┌─▶│  Node  │──┤   ┌──────────────────┐
                  │  └────────┘  ├──▶│ Shape.Ellipse    │
                  │              │   └──────────────────┘
                  │              │   ┌──────────────────┐
                  │              └──▶│ Shape.Xxx...     │
      ┌────────┐  │                  └──────────────────┘
      │  Cell  │──┤                                      
      └────────┘  │                  ┌──────────────────┐
                  │              ┌──▶│ Shape.Edge       │
                  │              │   └──────────────────┘
                  │  ┌────────┐  │   ┌──────────────────┐
                  └─▶│  Edge  │──┼──▶│ Shape.DoubleEdge │
                     └────────┘  │   └──────────────────┘
                                 │   ┌──────────────────┐
                                 └──▶│ Shape.ShadowEdge │
                                     └──────────────────┘
```

我们可以使用这些图形的构造函数来创建节点/边，然后调用 [graph.addNode]() 或 [graph.addEdge]() 方法将其添加到画布。

```ts
import { Shape } from '@antv/x6'

const rect = new Shape.Rect({
  id: 'node1',
  x: 40,
  y: 40,
  width: 100,
  height: 40,
  label: 'rect', 
  zIndex: 2,
})

const circle = new Shape.Circle({
  id: 'node2',
  x: 280,
  y: 200,
  width: 60,
  height: 60,
  label: 'circle', 
  zIndex: 2,
})

const edge = new Shape.Edge({
  id: 'edge1',
  source: rect,
  target: circle,
  zIndex: 1,
})

graph.addNode(rect)
graph.addNode(circle)
graph.addEdge(edge)
```

这些构造函数都有一些来自 `Cell` 的基础选项，如 `id`，`attrs`，`zIndex` 等，下面我们就逐个看看这些基础选项的含义。

## 基础选项

| 选项名   | 类型     | 默认值    | 描述                                                   |
|----------|----------|-----------|------------------------------------------------------|
| id       | String   | undefined | 节点/边的唯一标识，默认使用自动生成的 UUID。             |
| markup   | Markup   | undefined | 节点/边的 SVG/HTML 片段。                               |
| attrs    | Object   | { }       | 节点/边属性样式。                                       |
| shape    | String   | undefined | 渲染节点/边的图形。                                     |
| view     | String   | undefined | 渲染节点/边的视图。                                     |
| zIndex   | Number   | undefined | 节点/边在画布中的层级，默认根据节点/边添加顺序自动确定。 |
| visible  | Boolean  | true      | 节点/边是否可见。                                       |
| parent   | String   | undefined | 父节点。                                                |
| children | String[] | undefined | 子节点/边。                                             |
| data     | any      | undefined | 节点/边关联的业务数据。                                 |

### id

`id` 是节点/边的唯一标识，推荐使用具备业务意义的 ID，默认使用自动生成的 UUID。

### markup

`markup` 指定了渲染节点/边时使用的 SVG/HTML 片段，使用 `JSON` 格式描述。例如 `Shape.Rect` 节点的 `markup` 定义如下。

```ts
{
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
}
```

表示该节点内部包含 `<rect>` 和 `<text>` 两个 SVG 元素，渲染到页面之后，节点对应的 SVG 元素看起来像下面这样。

```html
<g data-cell-id="c2e1dd06-15c6-43a4-987a-712a664b8f85" class="x6-cell x6-node" transform="translate(40,40)">
  <rect fill="#fff" stroke="#000" stroke-width="2" fill-opacity="0.5" width="100" height="40"></rect>
  <text font-size="14" xml:space="preserve" fill="#333" text-anchor="middle" font-family="Arial, helvetica, sans-serif" transform="matrix(1,0,0,1,50,20)">
    <tspan dy="0.3em" class="v-line">rect</tspan>
  </text>
</g>
```

通过上面的介绍，我们大致了解了 `Markup` 的结构，下面我们将详细介绍 `Markup` 定义。

```ts
interface Markup {
  tagName: string
  ns?: string
  selector?: string
  groupSelector?: string | string[]
  attrs?: { [key: string]: string | number }
  style?: { [key: string]: string | number }
  className?: string | string[]
  textContent?: string
  children?: Markup[]
}
```

#### tagName

SVG/HTML 元素标签名。

#### ns
 
与 `tagName` 对应的元素命名空间，默认使用 SVG 元素命名空间 `"http://www.w3.org/2000/svg"`，当 `tagName` 指定的标签是 HTML 元素时，需要使用 HTML 元素的命名空间 `"http://www.w3.org/1999/xhtml"`。

#### selector

SVG/HTML 元素的唯一标识，通过该唯一标识为该元素指定[属性样式](https://developer.mozilla.org/zh-CN/docs/Web/SVG/Tutorial/Fills_and_Strokes)。例如，为 `Shape.Rect` 节点指定 `<rect>` 和 `<text>` 元素的属性样式。

```ts
const rect = new Shape.Rect({
  x: 40,
  y: 40,
  width: 100,
  height: 40,
  attrs: {
    // 指定 rect 元素的样式
    body: { 
      stroke: '#000', // 边框颜色
      fill: '#fff',   // 填充颜色
    },
    // 指定 text 元素的样式
    label: { 
      text: 'rect', // 文字
      fill: '#333', // 文字颜色
    },
  },
})
```

#### groupSelector

群组选择器，通过群组选择器可以为该群组对应的多个元素指定样式。例如，下面定义中两个 `<rect>` 具备相同的 `groupSelector` 值 `'group1'`。

```ts
{
  markup: [
    {
      tagName: 'rect',
      selector: 'body',
      groupSelector: 'group1',
    }, 
    {
      tagName: 'rect',
      selector: 'wrap',
      groupSelector: 'group1',
    }, 
    {
      tagName: 'text',
      selector: 'label',
    },
  ],
}
```

创建节点时，我们可以像下面这样来指定群组样式

```ts
new SomeNode({
  attrs: { 
    group1: {
      fill: '#2ECC71',
    },
  },
})
```

#### attrs

该 SVG/HTML 元素的默认属性键值对，通常用于定义那些不变的通用属性，这些默认样式也可以在实例化节点时被覆盖。需要注意的是，`markup` 的 `attrs` 属性只支持原生的 SVG 属性，也就是说 X6 的[自定义属性]()在这里不可用。 

例如，我们为 `Shape.Rect` 节点的 `<rect>` 和 `<text>` 元素指定了如下默认样式。

```js
{
  markup: [
    {
      tagName: 'rect',
      selector: 'body',
      attrs: {
        fill: '#fff',
        stroke: '#000',
        strokeWidth: 2,
      }
    }, 
    {
      tagName: 'text',
      selector: 'label',
      attrs: {
        fill: '#333',
        textAnchor: 'middle',
        textVerticalAnchor: 'middle',
      }
    },
  ],
}
```

#### style

该 SVG/HTML 元素的行内样式键值对。

#### className

该 SVG/HTML 元素的 CSS 样式名。

#### textContent

该 SVG/HTML 元素的文本内容。

#### children

嵌套的子元素。

### attrs

在[快速上手](/zh/docs/tutorial/getting-started)中，我们简单介绍了如何使用 `attrs` 选项定制节点样式，`attrs` 选项是一个复杂对象，该对象的 Key 是节点中 SVG 元素的选择器(Selector)，对应的值是应用到该 SVG 元素的 [SVG 属性值](https://developer.mozilla.org/zh-CN/docs/Web/SVG/Attribute)(如 [fill](https://developer.mozilla.org/zh-CN/docs/Web/SVG/Attribute/fill) 和 [stroke](https://developer.mozilla.org/zh-CN/docs/Web/SVG/Attribute/stroke))，如果你对 SVG 属性还不熟悉，可以参考 MDN 提供的[填充和边框](https://developer.mozilla.org/zh-CN/docs/Web/SVG/Tutorial/Fills_and_Strokes)入门教程。

选择器(Selector)通过节点的 `markup` 确定，如 `Shape.Rect` 节点定义了 `'body'`(代表 `<rect>` 元素) 和 `'label'`(代表 `<text>` 元素) 两个选择器。

```ts
const rect = new Shape.Rect({
  x: 40,
  y: 40,
  width: 100,
  height: 40,
  attrs: { 
    body: {
      fill: '#2ECC71',
      stroke: '#000',
    },
    label: {
      text: 'rect',
      fill: '#333',
      fontSize: 13,
    },
  },
})
```

节点渲染到画布后的 DOM 结构看起来像下面这样。

```html
<g data-cell-id="3ee1452c-6d75-478d-af22-88e03c6d513b" class="x6-cell x6-node" transform="translate(40,40)">
  <rect fill="#2ECC71" stroke="#000" stroke-width="2" width="100" height="40"></rect>
  <text font-size="13" xml:space="preserve" fill="#333" text-anchor="middle" font-family="Arial, helvetica, sans-serif" transform="matrix(1,0,0,1,50,20)">
    <tspan dy="0.3em" class="v-line">
      rect
    </tspan>
  </text>
</g>
```

另外，我们还可以使用 CSS 选择器来指定节点样式，这样我们就不用记住预定的选择器名称，只需要根据渲染后的 DOM 结构来定义样式即可。使用 CSS 选择器时需要注意，指定的 CSS 选择器可能选中多个元素，这时对应的属性样式将同时应用到多个元素上。

```ts
const rect = new Shape.Rect({
  x: 40,
  y: 40,
  width: 100,
  height: 40,
  attrs: { 
    rect: { // 使用 rect css 选择器替代预定义的 body 选择器
      fill: '#2ECC71',
      stroke: '#000',
    },
    text: { // 使用 text css 选择器替代预定义的 label 选择器
      text: 'rect',
      fill: '#333',
      fontSize: 13,
    },
  },
})
```

值得一提的是，支持使用小驼峰(camelCase)格式的属性名，如 `'fontSize'`，这就避免了 `'font-size'` 这种属性名作为对象 Key 时需要加引号的书写麻烦。

除了标准的 [SVG 属性](https://developer.mozilla.org/zh-CN/docs/Web/SVG/Attribute)，我们在 X6 中还定义了一系列特殊属性，详情请参考[如何使用特殊属性](/zh/docs/tutorial/intermediate/attrs)和[如何自定义属性](/zh/docs/api/registry/attr#definition)。另外，我们还可以使用 [CSS](https://developer.mozilla.org/en-US/docs/Web/CSS) 来定制样式，节点和边渲染到画布后分别有 `'x6-node'` 和 `'x6-edge'` 两个样式名，默认的样式定义[参考这里](https://github.com/antvis/X6/blob/master/packages/x6/src/index.less#L26-L156)。例如，我们可以像下面这样来指定节点中 `<rect>` 元素的样式：

```css
.x6-node rect {
  fill: #2ECC71;
  stroke: #000;
}
```

创建节点/边后，我们可以调用实例上的 `attr()` 方法来修改节点属性样式。看下面代码，通过 `/` 分割的路径修改样式，`label` 选择器对应到 `<text>` 元素，`text` 则是该元素的属性名，`'hello'` 是新的属性值。

```ts
rect.attr('label/text', 'hello')

// 等同于
rect.attr('label', {
  text: 'hello'
})

// 等同于
rect.attr({
  label: {
    text: 'hello'
  }
})
```

当传入的属性值为 `null` 时可以移除该属性。

```ts
rect.attr('label/text', null)
```

### shape

节点/边的图形，类似 MVC 模式中的 Model，决定了节点/边的数据逻辑，通常配合 `graph.addNode` 和 `graph.addEdge` 两个方法使用。之前的介绍中都是使用节点/边的构造函数来创建节点/边，其实 `graph` 上也提供了 `graph.addNode` 和 `graph.addEdge` 两个便捷的方法来创建节点/边并将其添加到画布。

```ts
const rect = graph.addNode({
  shape: 'rect',
  x: 100,
  y: 200,
  width: 80,
  height: 40,
  label: 'rect', 
})

const circle = graph.addNode({
  shape: 'circle',
  x: 280,
  y: 200,
  width: 60,
  height: 60,
  label: 'circle', 
  zIndex: 2,
})

const edge = graph.addEdge({
  shape: 'edge',
  source: rect,
  target: circle,
})
```

这里的关键是使用 `shape` 来指定了节点/边的图形，`graph.addNode` 方法中 `shape` 的默认值为 `'rect'`，`graph.addEdge` 方法中 `shape` 的默认值为 `'edge'`，其他选项与使用构造函数创建节点/边一致。在 X6 内部实现中，我们通过 `shape` 指定的图形找到对应的构造函数来初始化节点/边，并将其添加到画布。

#### 内置节点

内置节点构造函数与 `shape` 名称对应关系如下表。

| 构造函数             | shape 名称      | 描述                                            |
|----------------------|-----------------|-----------------------------------------------|
| Shape.Rect           | rect            | 矩形。                                           |
| Shape.Circle         | circle          | 圆形。                                           |
| Shape.Ellipse        | ellipse         | 椭圆。                                           |
| Shape.Polygon        | polygon         | 多边形。                                         |
| Shape.Polyline       | polyline        | 折线。                                         |
| Shape.Path           | path            | 路径。                                           |
| Shape.Image          | image           | 图片。                                           |
| Shape.HTML           | html            | HTML 节点，使用 `foreignObject`  渲染 HTML 片段。 |
| Shape.TextBlock      | text-block      | 文本节点，使用 `foreignObject` 渲染文本。         |
| Shape.BorderedImage  | image-bordered  | 带边框的图片。                                   |
| Shape.EmbeddedImage  | image-embedded  | 内嵌入矩形的图片。                               |
| Shape.InscribedImage | image-inscribed | 内嵌入椭圆的图片。                               |
| Shape.Cylinder       | cylinder        | 圆柱。                                           |

#### 内置边

内置边构造函数与 `shape` 名称对应关系如下表。

| 构造函数         | shape 名称  | 描述    |
|------------------|-------------|--------|
| Shape.Edge       | edge        | 边。     |
| Shape.DoubleEdge | double-edge | 双线边。 |
| Shape.ShadowEdge | shadow-edge | 阴影边。 |

除了使用 X6 的内置节点/边，我们还可以注册自定义节点/边并使用他们，想了解更多请参考[自定义节点](/zh/docs/tutorial/intermediate/custom-node)和[自定义边](/zh/docs/tutorial/intermediate/custom-edge)教程。

### view

指定渲染节点/边所使用的视图，视图的概念与 MVC 模式中的 View 一致，我们将在[自定义节点](/zh/docs/tutorial/intermediate/custom-node)和[自定义边](/zh/docs/tutorial/intermediate/custom-edge)教程中做详细介绍。

### zIndex

节点/边在画布中的层级，默认根据节点/边添加顺序自动确定。节点/边渲染到画布后可以通过 `cell.getZIndex()` 和 `cell.setZIndex(z: number)` 来获取或设置 `zIndex` 的值，也可以调用 `cell.toFront()` 和 `cell.toBack()` 来将其移到最顶层或最底层。

### visible

节点/边是否可见。

### parent

父节点 ID。

### children

子节点/边的 ID 数组。

### data

与节点/边关联的业务数据。例如，我们在实际使用时通常会将某些业务数据存在节点/边的 `data` 上。

```ts
const rect = new Shape.Rect({
  x: 40,
  y: 40,
  width: 100,
  height: 40,
  data: { 
    bizID: 125,
    date: '20200630',
    price: 89.00,
  }
})
```

## 选项默认值

Cell 类提供了一个静态方法 `Cell.config(options)` 来配置选项的默认值，选项默认值对自定义节点/边非常友好，可以为我们的自定义节点/边指定预设的默认值。例如，我们在定义矩形节点时，为其指定了默认 Markup、默认大小和默认样式。

```ts
Shape.Rect.config({
  width: 80,
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
      fill: '#fff',
      stroke: '#000',
      strokeWidth: 2,
    },
    label: {
      fontSize: 14,
      fill: '#333',
      fontFamily: 'Arial, helvetica, sans-serif',
      textAnchor: 'middle',
      textVerticalAnchor: 'middle',
    }
  },
})
```

默认选项可以简化我们添加节点的代码，例如，只需要指定矩形节点的位置和文本就可以添加一个矩形到画布。

```ts
const rect = graph.addNode({
  x: 100,
  y: 100,
  attrs: {
    label: {
      text: 'rect',
    },
  },
})
```

每次调用 `config(options)` 都是与当前预设值进行[深度 merge](https://www.lodashjs.com/docs/latest#_mergeobject-sources)，例如下面代码分别将矩形的边框默认颜色修改为红色和将默认文本颜色修改为蓝色，最终效果是两者的叠加。

```ts
// 只修改边框的默认颜色
Shape.Rect.config({
  attrs: {
    body: {
      stroke: 'red',
    },
  },
})

// 只修改默认文本颜色
Shape.Rect.config({
  attrs: {
    label: {
      fill: 'blue',
      // 覆盖上面定义的 red
      stroke: '#000',
    },
  },
})
```

## 自定义选项

也许你已经注意到，在之前创建矩形的代码中，我们使用了 `label` 选项来设置矩形的标签文本。

```ts
const rect = graph.addNode({
  x: 100,
  y: 100,
  label: 'rect',
})
```

这并不是什么新魔法，我们只是在定义矩形时通过定义 `propHooks` 钩子来消费自定义选项，看下面 `label` 选项钩子的实现细节。

```ts
Shape.Rect.config({
  // 通过钩子将 label 应用到 'attrs/text/text' 属性上
  propHooks(metadata) {
    const { label, ...others } = metadata
    if (label) {
      ObjectExt.setByPath(others, 'attrs/text/text', label)
    }
    return others
  },
})
```

通过 `propHooks` 钩子，我们很容易就扩展出一些自定义的选项。例如，我们可以将某些样式定义为节点的选项，这样不仅可以减少嵌套，而且使创建节点的代码语义性更强。

看下面的代码，为矩形定义 `rx` 和 `ry` 自定义选项。

```ts
Shape.Rect.config({
  propHooks: {
    rx(metadata) { 
      const { rx, ...others } = metadata
      if (rx != null) {
        ObjectExt.setByPath(others, 'attrs/body/rx', rx)
      }
      return others
    },
    ry(metadata) { 
      const { ry, ...others } = metadata
      if (ry != null) {
        ObjectExt.setByPath(others, 'attrs/body/ry', ry)
      }
      return others
    },
  },
})
```

这样，我们就可以很方便添加圆角矩形。

```ts
const rect = graph.addNode({
  x: 100,
  y: 100,
  rx: 5,
  ry: 10,
  label: 'rect',
})
```
