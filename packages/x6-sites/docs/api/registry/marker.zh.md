---
title: Marker
order: 20
redirect_from:
  - /zh/docs
  - /zh/docs/api
  - /zh/docs/api/registry
---

我们可以通过 [`sourceMarker`](../../api/registry/attr#sourcemarker) 和 [`targetMarker`](../../api/registry/attr#targetmarker) 两个特殊属性，来指定边的起始箭头和终止箭头。同时我们将一些常用的箭头参数化并注册到 `Registry.Marker.presets` 命名空间中，这些箭头被称为“内置箭头”，使用内置箭头时只需要指定箭头名 `name` 和对应的参数即可，填充颜色 `fill` 和边框颜色 `stroke` 默认继承自边，可以通过指定 `fill` 和 `stroke` 属性来覆盖。

```ts
edge.attr({
  line: {
    sourceMarker: 'block',
    targetMarker: {
      name: 'ellipse',
      rx: 10, // 椭圆箭头的 x 半径
      ry: 6,  // 椭圆箭头的 y 半径
    },
  },
})
```

<iframe src="/demos/tutorial/intermediate/marker/native"></iframe>

每种内置箭头都有对应的参数，下面将分别介绍。

## presets


### block

实心箭头。

**参数**

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

**参数**

| 参数名   | 类型   | 默认值 | 说明                                                                                 |
|----------|--------|--------|------------------------------------------------------------------------------------|
| size     | Number | 10     | 箭头大小。                                                                            |
| width    | Number | size   | 箭头宽度，当宽高一样时可以直接使用 `size` 替代。                                       |
| height   | Number | size   | 箭头高度，当宽高一样时可以直接使用 `size` 替代。                                       |
| offset   | Number | 0      | 沿边方向的绝对偏移量。                                                                |
| ...attrs | Object | { }    | 其他参数都将作为箭头 `<path>` 元素的属性，例如可以指定 `‘fill’` 和 `'stroke'` 等属性。 |

### diamond

菱形箭头。

**参数**

| 参数名   | 类型   | 默认值 | 说明                                                                                 |
|----------|--------|--------|------------------------------------------------------------------------------------|
| size     | Number | 10     | 箭头大小。                                                                            |
| width    | Number | size   | 箭头宽度，当宽高一样时可以直接使用 `size` 替代。                                       |
| height   | Number | size   | 箭头高度，当宽高一样时可以直接使用 `size` 替代。                                       |
| offset   | Number | 0      | 沿边方向的绝对偏移量。                                                                |
| ...attrs | Object | { }    | 其他参数都将作为箭头 `<path>` 元素的属性，例如可以指定 `‘fill’` 和 `'stroke'` 等属性。 |

### cross

交叉箭头。

**参数**

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

**参数**

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
      stroke: '#31d0c6',
      sourceMarker: {
        name: 'path',
        d: 'M5.5,15.499,15.8,21.447,15.8,15.846,25.5,21.447,25.5,9.552,15.8,15.152,15.8,9.552z',
      },
      targetMarker: {
        name: 'path',
        offsetX: 10,
        d: 'M4.834,4.834L4.833,4.833c-5.889,5.892-5.89,15.443,0.001,21.334s15.44,5.888,21.33-0.002c5.891-5.891,5.893-15.44,0.002-21.33C20.275-1.056,10.725-1.056,4.834,4.834zM25.459,5.542c0.833,0.836,1.523,1.757,2.104,2.726l-4.08,4.08c-0.418-1.062-1.053-2.06-1.912-2.918c-0.859-0.859-1.857-1.494-2.92-1.913l4.08-4.08C23.7,4.018,24.622,4.709,25.459,5.542zM10.139,20.862c-2.958-2.968-2.959-7.758-0.001-10.725c2.966-2.957,7.756-2.957,10.725,0c2.954,2.965,2.955,7.757-0.001,10.724C17.896,23.819,13.104,23.817,10.139,20.862zM5.542,25.459c-0.833-0.837-1.524-1.759-2.105-2.728l4.081-4.081c0.418,1.063,1.055,2.06,1.914,2.919c0.858,0.859,1.855,1.494,2.917,1.913l-4.081,4.081C7.299,26.982,6.379,26.292,5.542,25.459zM8.268,3.435l4.082,4.082C11.288,7.935,10.29,8.571,9.43,9.43c-0.858,0.859-1.494,1.855-1.912,2.918L3.436,8.267c0.58-0.969,1.271-1.89,2.105-2.727C6.377,4.707,7.299,4.016,8.268,3.435zM22.732,27.563l-4.082-4.082c1.062-0.418,2.061-1.053,2.919-1.912c0.859-0.859,1.495-1.857,1.913-2.92l4.082,4.082c-0.58,0.969-1.271,1.891-2.105,2.728C24.623,26.292,23.701,26.983,22.732,27.563z',
      },
    },
  },
})
```

<iframe src="/demos/tutorial/intermediate/marker/path"></iframe>

### circle

圆形箭头。

**参数**

| 参数名   | 类型   | 默认值 | 说明                                                                                   |
|----------|--------|--------|--------------------------------------------------------------------------------------|
| r        | Number | 5      | 圆半径。                                                                                |
| ...attrs | Object | { }    | 其他参数都将作为箭头 `<circle>` 元素的属性，例如可以指定 `‘fill’` 和 `'stroke'` 等属性。 |

### circlePlus

圆形和加号箭头。

**参数**

| 参数名   | 类型   | 默认值 | 说明                                                                                       |
|----------|--------|--------|------------------------------------------------------------------------------------------|
| r        | Number | 5      | 圆半径。                                                                                    |
| ...attrs | Object | { }    | 其他参数都将作为箭头 `<path>` 元素（加号）的属性，例如可以指定 `‘fill’` 和 `'stroke'` 等属性。 |

### ellipse

椭圆箭头。

**参数**

| 参数名   | 类型   | 默认值 | 说明                                                                                    |
|----------|--------|--------|---------------------------------------------------------------------------------------|
| rx       | Number | 5      | 椭圆 x 轴半径。                                                                          |
| ry       | Number | 5      | 椭圆 y 轴半径。                                                                          |
| ...attrs | Object | { }    | 其他参数都将作为箭头 `<ellipse>` 元素的属性，例如可以指定 `‘fill’` 和 `'stroke'` 等属性。 |


## registry

同时，我们在 `Registry.Marker.registry` 对象上提供了注册和取消注册箭头的方法，生成箭头的方法定义如下：

```sign
type Definition<T extends KeyValue = KeyValue> = (args: T) => Result

type Result = Attr.SimpleAttrs & {
  tagName?: string
  children?: Result[]
}
```

箭头工厂方法只有一个参数 `args`，在配置箭头时传入。例如：

```ts
edge.attr({
  line: {
    sourceMarker: 'block',
    targetMarker: {
      name: 'ellipse',
      rx: 10,
      ry: 6,
    },
  },
})
```

上面的配置被解析后，分别得到起始和终止箭头的箭头名称和箭头参数。

| 箭头类型     | 箭头名称 name | 箭头参数 args     |
|--------------|---------------|-------------------|
| sourceMarker | block         | { }               |
| targetMarker | ellipse       | { rx: 10, ry: 6 } |

在内部实现中，我们通过箭头名称找到对应的工厂方法，并根据提供参数 `args` 调用该方法，然后返结果 `Result`，在返回结果中通过 `tagName` 来指定使用哪种 SVG 元素渲染箭头，剩余的键值对则作为该元素的属性附加到元素上，并支持通过 `children` 来实现元素嵌套。

### register

```sign
register(entities: { [name: string]: Definition }, force?: boolean): void
register(name: string, entity: Definition, force?: boolean): Definition
```

注册箭头。

### unregister

```sign
unregister(name: string): Definition | null
```

取消注册箭头。

实际上，我们将 `registry` 对象的 `register` 和 `unregister` 方法分别挂载为 `Graph` 的两个静态方法 `Graph.registerMaker` 和 `Graph.unregisterMarker`。

### 自定义箭头

下面我们一起来实现一个 `image` 箭头并注册到系统中。

```ts
/**
 * 参数定义
 */
interface ImageMarkerArgs extends Attr.SimpleAttrs {
  imageUrl: string
  imageWidth?: number
  imageHeight?: number
}

Graph.registerMarker('image', (args: ImageMarkerArgs) => { 
  const {imageUrl, imageWidth, imageHeight, ...attrs} = args
  return {
    ...attrs, // 原样返回非特殊涵义的参数
    tagName: 'image', // 使用 <image> 标签渲染箭头，其余键值对都将作为该元素的属性。
    width: imageWidth,
    height: imageHeight,
    'xlink:href': imageUrl,
  }
})
```

注册之后，我们可以这样来使用 image 箭头。

```ts
edge.attr({
  line: {
    sourceMarker: {
      name: 'image',
      imageUrl: 'http://cdn3.iconfinder.com/data/icons/49handdrawing/24x24/left.png',
      imageWidth: 24,
      imageHeight: 24,
      y: -12,
    },
    targetMarker: {
      name: 'image',
      imageUrl: 'http://cdn3.iconfinder.com/data/icons/49handdrawing/24x24/left.png',
      imageWidth: 24,
      imageHeight: 24,
      y: -12,
    }
  }
})
```
