---
title: Marker
order: 4
redirect_from:
  - /zh/docs
  - /zh/docs/api
  - /zh/docs/api/model
---

在之前的[教程](/zh/docs/tutorial/basic/edge#使用箭头-marker)中，我们简单介绍了如何使用 [`sourceMarker`](/zh/docs/api/registry/attr#sourcemarker) 和 [`targetMarker`](/zh/docs/api/registry/attr#targetmarker) 两个特殊属性来为边指定起始箭头和终止箭头，并演示了如何使用内置箭头和自定义箭头，接下来我们将详细介绍如何使用各种 SVG 元素来自定义箭头，并详细列举了每个内置箭头的参数项，最后介绍如何将自定义箭头注册为内置箭头。

## 自定义箭头

我们可以通过 `tagName` 来指定使用哪种 SVG 元素来渲染箭头，例如下面我们通过 `tagName` 来指定使用 `<path>` 元素来渲染箭头，除 `tagName` 外的其他选项都将作为属性被添加到创建出来的 `<path>` 元素上。箭头的填充颜色 `fill` 和边框颜色 `stroke` 默认继承自边，可以通过指定 `fill` 和 `stroke` 属性来覆盖。

```ts
edge.attr({
  line: {
    sourceMarker: {
      tagName: "path",
      d: "M 20 -10 0 0 20 10 Z",
    },
    targetMarker: {
      tagName: "path",
      fill: "yellow", // 使用自定义填充色
      stroke: "green", // 使用自定义边框色
      strokeWidth: 2,
      d: "M 20 -10 0 0 20 10 Z",
    },
  },
});
```

看上面代码，值得注意的是，我们的起始箭头和终止箭头使用了相同的 `'d'` 属性值，这是因为我们会自动计算箭头方向，简单来说，我们只需要定义**向左指向坐标原点**的箭头即可。

<!-- <iframe src="/demos/tutorial/intermediate/marker/custom"></iframe> -->

有时候，我们获取到的 path 元素的 `d` 的坐标可能并不标准，如果直接将其作为箭头来使用就可能出现位置偏离，所以我们在 `Util` 命名空间中提供了 `normalizeMarker` 这个工具方法来标准化 `d` 的坐标。

**方法签名**

```ts
Registry.Marker.normalize(d: string, offset: { x?: number; y?: number }): string
Registry.Marker.normalize(d: string, offsetX?: number, offsetY?: number): string
```

<span class="tag-param">参数<span>

| 参数名  | 类型                       | 说明                        |
|---------|----------------------------|-----------------------------|
| d       | string                     |                             |
| offset  | { x?: number; y?: number } | 相对于坐标原点的偏移量      |
| offsetX | number                     | 相对于坐标原点的 x 轴偏移量 |
| offsetY | number                     | 相对于坐标原点的 y 轴偏移量 |

对比下面的起始和终止箭头，很明显起始箭头出现了一定的偏移，使用 `normalizeMarker` 处理后终止箭头的位置就正常了。

```ts
const d =
  "M4.834,4.834L4.833,4.833c-5.889,5.892-5.89,15.443,0.001,21.334s15.44,5.888,21.33-0.002c5.891-5.891,5.893-15.44,0.002-21.33C20.275-1.056,10.725-1.056,4.834,4.834zM25.459,5.542c0.833,0.836,1.523,1.757,2.104,2.726l-4.08,4.08c-0.418-1.062-1.053-2.06-1.912-2.918c-0.859-0.859-1.857-1.494-2.92-1.913l4.08-4.08C23.7,4.018,24.622,4.709,25.459,5.542zM10.139,20.862c-2.958-2.968-2.959-7.758-0.001-10.725c2.966-2.957,7.756-2.957,10.725,0c2.954,2.965,2.955,7.757-0.001,10.724C17.896,23.819,13.104,23.817,10.139,20.862zM5.542,25.459c-0.833-0.837-1.524-1.759-2.105-2.728l4.081-4.081c0.418,1.063,1.055,2.06,1.914,2.919c0.858,0.859,1.855,1.494,2.917,1.913l-4.081,4.081C7.299,26.982,6.379,26.292,5.542,25.459zM8.268,3.435l4.082,4.082C11.288,7.935,10.29,8.571,9.43,9.43c-0.858,0.859-1.494,1.855-1.912,2.918L3.436,8.267c0.58-0.969,1.271-1.89,2.105-2.727C6.377,4.707,7.299,4.016,8.268,3.435zM22.732,27.563l-4.082-4.082c1.062-0.418,2.061-1.053,2.919-1.912c0.859-0.859,1.495-1.857,1.913-2.92l4.082,4.082c-0.58,0.969-1.271,1.891-2.105,2.728C24.623,26.292,23.701,26.983,22.732,27.563z";

graph.addEdge({
  source: { x: 160, y: 40 },
  target: { x: 420, y: 40 },
  attrs: {
    line: {
      stroke: "#31d0c6",
      sourceMarker: {
        d,
        tagName: "path",
      },
      targetMarker: {
        tagName: "path",
        d: Util.normalizeMarker(d),
      },
    },
  },
});
```

<!-- <iframe src="/demos/tutorial/intermediate/marker/normalize-path"></iframe> -->

除了 `<path>` 我们还可以使用 `<circle>`、`<image>`、`<ellipse>`、`<rect>`、`<polyline>`、`<polygon>` 等元素来定义箭头，只需要通过 `tagName` 指定标签名，并设置元素其他必要属性。例如，使用图片来定制箭头也很简单，首先我们把 `tagName` 设置为 `image`，并通过 `xlink:href` 属性指定图片的 URL，并通过 `width` 和 `height` 属性指定图片的大小，然后调节 `y` 属性来使图片居中对齐。

```ts
edge.attr({
  line: {
    sourceMarker: {
      tagName: "image",
      "xlink:href":
        "http://cdn3.iconfinder.com/data/icons/49handdrawing/24x24/left.png",
      width: 24,
      height: 24,
      y: -12,
    },
    targetMarker: {
      tagName: "image",
      "xlink:href":
        "http://cdn3.iconfinder.com/data/icons/49handdrawing/24x24/left.png",
      width: 24,
      height: 24,
      y: -12,
    },
  },
});
```

<!-- <iframe src="/demos/tutorial/intermediate/marker/image"></iframe> -->

需要注意的是，当使用 `<circle>` 和 `<ellipse>` 来定制箭头时，可以通过设置其 `cx` 属性为对应的轴半径，以避免箭头溢出边的边界；其他元素可以通过 `y` 属性来调节箭头的垂直位置，以便使其垂直居中。

```ts
edge.attr({
  line: {
    sourceMarker: {
      tagName: "ellipse",
      rx: 20,
      ry: 10,
      cx: 20,
      fill: "rgba(255,0,0,0.3)",
    },
    targetMarker: {
      tagName: "circle",
      r: 12,
      cx: 12,
      fill: "rgba(0,255,0,0.3)",
    },
  },
});
```

<!-- <iframe src="/demos/tutorial/intermediate/marker/tagname"></iframe> -->

## 内置箭头

内置箭头是将一些常用的箭头参数化，使用内置箭头时只需要指定箭头名 `name` 和对应的参数即可，填充颜色 `fill` 和边框颜色 `stroke` 默认继承自边，可以通过指定 `fill` 和 `stroke` 属性来覆盖。

```ts
edge.attr({
  line: {
    sourceMarker: "block",
    targetMarker: {
      name: "ellipse",
      rx: 10, // 椭圆箭头的 x 半径
      ry: 6, // 椭圆箭头的 y 半径
    },
  },
});
```

<!-- <iframe src="/demos/tutorial/intermediate/marker/native"></iframe> -->

每种内置箭头都有对应的参数，下面将分别介绍。

### block

实心箭头。

<span class="tag-param">参数<span>

| 参数名   | 类型    | 默认值 | 说明                                                                                 |
|----------|---------|--------|------------------------------------------------------------------------------------|
| size     | Number  | 10     | 箭头大小。                                                                            |
| width    | Number  | size   | 箭头宽度，当宽高一样时可以直接使用 `size` 替代。                                       |
| height   | Number  | size   | 箭头高度，当宽高一样时可以直接使用 `size` 替代。                                       |
| offset   | Number  | 0      | 沿边方向的绝对偏移量。                                                                |
| open     | Boolean | false  | 非封闭箭头。                                                                          |
| ...attrs | Object  | { }    | 其他参数都将作为箭头 `<path>` 元素的属性，例如可以指定 `‘fill’` 和 `'stroke'` 等属性。 |

### classic

经典箭头。

<span class="tag-param">参数<span>

| 参数名   | 类型   | 默认值 | 说明                                                                                 |
|----------|--------|--------|------------------------------------------------------------------------------------|
| size     | Number | 10     | 箭头大小。                                                                            |
| width    | Number | size   | 箭头宽度，当宽高一样时可以直接使用 `size` 替代。                                       |
| height   | Number | size   | 箭头高度，当宽高一样时可以直接使用 `size` 替代。                                       |
| offset   | Number | 0      | 沿边方向的绝对偏移量。                                                                |
| ...attrs | Object | { }    | 其他参数都将作为箭头 `<path>` 元素的属性，例如可以指定 `‘fill’` 和 `'stroke'` 等属性。 |

### diamond

菱形箭头。

<span class="tag-param">参数<span>

| 参数名   | 类型   | 默认值 | 说明                                                                                 |
|----------|--------|--------|------------------------------------------------------------------------------------|
| size     | Number | 10     | 箭头大小。                                                                            |
| width    | Number | size   | 箭头宽度，当宽高一样时可以直接使用 `size` 替代。                                       |
| height   | Number | size   | 箭头高度，当宽高一样时可以直接使用 `size` 替代。                                       |
| offset   | Number | 0      | 沿边方向的绝对偏移量。                                                                |
| ...attrs | Object | { }    | 其他参数都将作为箭头 `<path>` 元素的属性，例如可以指定 `‘fill’` 和 `'stroke'` 等属性。 |

### cross

交叉箭头。

<span class="tag-param">参数<span>

| 参数名   | 类型   | 默认值 | 说明                                                                                 |
|----------|--------|--------|------------------------------------------------------------------------------------|
| size     | Number | 10     | 箭头大小。                                                                            |
| width    | Number | size   | 箭头宽度，当宽高一样时可以直接使用 `size` 替代。                                       |
| height   | Number | size   | 箭头高度，当宽高一样时可以直接使用 `size` 替代。                                       |
| offset   | Number | 0      | 沿边方向的绝对偏移量。                                                                |
| ...attrs | Object | { }    | 其他参数都将作为箭头 `<path>` 元素的属性，例如可以指定 `‘fill’` 和 `'stroke'` 等属性。 |

### async

| 参数名   | 类型    | 默认值 | 说明                                                                                 |
|----------|---------|--------|------------------------------------------------------------------------------------|
| width    | Number  | 10     | 箭头宽度。                                                                            |
| height   | Number  | 6      | 箭头高度。                                                                            |
| offset   | Number  | 0      | 沿边方向的绝对偏移量。                                                                |
| open     | Boolean | false  | 非封闭箭头。                                                                          |
| flip     | Boolean | false  | 是否翻转箭头。                                                                        |
| ...attrs | Object  | { }    | 其他参数都将作为箭头 `<path>` 元素的属性，例如可以指定 `‘fill’` 和 `'stroke'` 等属性。 |

### path

自定义 [pathData](https://developer.mozilla.org/en-US/docs/Web/SVG/Attribute/d) 的箭头。

<span class="tag-param">参数<span>

| 参数名   | 类型   | 默认值    | 说明                                                                                                                                               |
|----------|--------|-----------|--------------------------------------------------------------------------------------------------------------------------------------------------|
| d        | string | undefined | `<path>` 元素的 [d 属性值](https://developer.mozilla.org/en-US/docs/Web/SVG/Attribute/d)，被 `Util.normalizeMarker` 标准化后应用到 `<path>` 元素上。 |
| offsetX  | Number | 0         | x 方向偏移量。                                                                                                                                      |
| offsetY  | Number | 0         | y 方向偏移量。                                                                                                                                      |
| ...attrs | Object | { }       | 其他参数都将作为箭头 `<path>` 元素的属性，例如可以指定 `‘fill’` 和 `'stroke'` 等属性。                                                               |

```ts
graph.addEdge({
  source: { x: 100, y: 40 },
  target: { x: 400, y: 40 },
  attrs: {
    line: {
      stroke: "#31d0c6",
      sourceMarker: {
        name: "path",
        d: "M5.5,15.499,15.8,21.447,15.8,15.846,25.5,21.447,25.5,9.552,15.8,15.152,15.8,9.552z",
      },
      targetMarker: {
        name: "path",
        offsetX: 10,
        d: "M4.834,4.834L4.833,4.833c-5.889,5.892-5.89,15.443,0.001,21.334s15.44,5.888,21.33-0.002c5.891-5.891,5.893-15.44,0.002-21.33C20.275-1.056,10.725-1.056,4.834,4.834zM25.459,5.542c0.833,0.836,1.523,1.757,2.104,2.726l-4.08,4.08c-0.418-1.062-1.053-2.06-1.912-2.918c-0.859-0.859-1.857-1.494-2.92-1.913l4.08-4.08C23.7,4.018,24.622,4.709,25.459,5.542zM10.139,20.862c-2.958-2.968-2.959-7.758-0.001-10.725c2.966-2.957,7.756-2.957,10.725,0c2.954,2.965,2.955,7.757-0.001,10.724C17.896,23.819,13.104,23.817,10.139,20.862zM5.542,25.459c-0.833-0.837-1.524-1.759-2.105-2.728l4.081-4.081c0.418,1.063,1.055,2.06,1.914,2.919c0.858,0.859,1.855,1.494,2.917,1.913l-4.081,4.081C7.299,26.982,6.379,26.292,5.542,25.459zM8.268,3.435l4.082,4.082C11.288,7.935,10.29,8.571,9.43,9.43c-0.858,0.859-1.494,1.855-1.912,2.918L3.436,8.267c0.58-0.969,1.271-1.89,2.105-2.727C6.377,4.707,7.299,4.016,8.268,3.435zM22.732,27.563l-4.082-4.082c1.062-0.418,2.061-1.053,2.919-1.912c0.859-0.859,1.495-1.857,1.913-2.92l4.082,4.082c-0.58,0.969-1.271,1.891-2.105,2.728C24.623,26.292,23.701,26.983,22.732,27.563z",
      },
    },
  },
});
```

<!-- <iframe src="/demos/tutorial/intermediate/marker/path"></iframe> -->

### circle

圆形箭头。

<span class="tag-param">参数<span>

| 参数名   | 类型   | 默认值 | 说明                                                                                   |
|----------|--------|--------|--------------------------------------------------------------------------------------|
| r        | Number | 5      | 圆半径。                                                                                |
| ...attrs | Object | { }    | 其他参数都将作为箭头 `<circle>` 元素的属性，例如可以指定 `‘fill’` 和 `'stroke'` 等属性。 |

### circlePlus

圆形和加号箭头。

<span class="tag-param">参数<span>

| 参数名   | 类型   | 默认值 | 说明                                                                                       |
|----------|--------|--------|------------------------------------------------------------------------------------------|
| r        | Number | 5      | 圆半径。                                                                                    |
| ...attrs | Object | { }    | 其他参数都将作为箭头 `<path>` 元素（加号）的属性，例如可以指定 `‘fill’` 和 `'stroke'` 等属性。 |

### ellipse

椭圆箭头。

<span class="tag-param">参数<span>

| 参数名   | 类型   | 默认值 | 说明                                                                                    |
|----------|--------|--------|---------------------------------------------------------------------------------------|
| rx       | Number | 5      | 椭圆 x 轴半径。                                                                          |
| ry       | Number | 5      | 椭圆 y 轴半径。                                                                          |
| ...attrs | Object | { }    | 其他参数都将作为箭头 `<ellipse>` 元素的属性，例如可以指定 `‘fill’` 和 `'stroke'` 等属性。 |

## 注册箭头

注册是指将生成箭头的方法注册到 X6 体系中，该方法我们称为箭头工厂方法，注册后就可以像使用内置箭头那样来使用箭头。

那么什么时候需要注册箭头呢？

- 经典箭头的统一抽象，并提取出关键参数，通过参数来影响箭头的渲染，实现多场景复用。如上面介绍的[内置箭头](#内置箭头)。
- 复杂箭头的统一定义，实现一次定义多处复用，如具有复杂属性和样式配置的箭头。
- 通过语义化的箭头名和参数名，增强代码的可读性。例如我们可以将 `<image>` 箭头的 `xlink:href` 属性使用 `'imageUrl'` 参数名代替，使其更具有语义性。
- 等等...

继续之前，我们先看看箭头工厂方法的定义。

```ts
type Factory<T extends KeyValue = KeyValue> = (args: T) => Result

type Result = Attr.SimpleAttrs & {
  tagName?: string
  children?: Result[]
}
```

箭头工厂方法只有一个参数 `args`，在配置箭头时传入。例如：

```ts
edge.attr({
  line: {
    sourceMarker: "block",
    targetMarker: {
      name: "ellipse",
      rx: 10,
      ry: 6,
    },
  },
});
```

上面的配置被解析后，分别得到起始和终止箭头的箭头名称和箭头参数。

| 箭头类型     | 箭头名称 name | 箭头参数 args     |
|--------------|---------------|-------------------|
| sourceMarker | block         | { }               |
| targetMarker | ellipse       | { rx: 10, ry: 6 } |

在 X6 内部我们通过箭头名称找到对应的工厂方法，并根据提供参数 `args` 调用该方法，然后返回调用结果。结果 `Result` 的结构与上面介绍的自定义箭头的结构一样，通过 `tagName` 来指定使用哪种 SVG 元素渲染箭头，剩余的键值对则作为该元素的属性附加到元素上，并支持通过 `children` 来实现元素嵌套。

了解清楚工厂方法的原理后，我们就可以通过 Graph 提供的静态方法 `registerMarker` 来注册工厂方法。

```
Graph.registerMarker(name: string, factory: Factory, overwrite?: boolean)
```

| 参数名    | 参数类型 | 默认值 | 说明                                                        |
|-----------|----------|--------|-----------------------------------------------------------|
| name      | String   |        | 箭头名。                                                     |
| factory   | Factory  |        | 箭头工厂方法。                                               |
| overwrite | Boolean  | false  | 遇到重名时是否覆盖旧工厂方法，设置为 `true` 时覆盖，否则报错。 |

最后，我们来注册一个 image 箭头。

```ts
/**
 * 参数定义
 */
interface ImageMarkerArgs extends Attr.SimpleAttrs {
  imageUrl: string;
  imageWidth?: number;
  imageHeight?: number;
}

Graph.registerMarker("image", (args: ImageMarkerArgs) => {
  const { imageUrl, imageWidth, imageHeight, ...attrs } = args;
  return {
    ...attrs, // 原样返回非特殊涵义的参数
    tagName: "image", // 使用 <image> 标签渲染箭头，其余键值对都将作为该元素的属性。
    width: imageWidth,
    height: imageHeight,
    "xlink:href": imageUrl,
  };
});
```

注册之后，我们可以这样来使用 image 箭头。

```ts
edge.attr({
  line: {
    sourceMarker: {
      name: "image",
      imageUrl:
        "http://cdn3.iconfinder.com/data/icons/49handdrawing/24x24/left.png",
      imageWidth: 24,
      imageHeight: 24,
      y: -12,
    },
    targetMarker: {
      name: "image",
      imageUrl:
        "http://cdn3.iconfinder.com/data/icons/49handdrawing/24x24/left.png",
      imageWidth: 24,
      imageHeight: 24,
      y: -12,
    },
  },
});
```
