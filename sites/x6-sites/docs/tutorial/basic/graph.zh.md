---
title: 画布 Graph
order: -1
redirect_from:
  - /zh/docs
  - /zh/docs/tutorial
  - /zh/docs/tutorial/basic
---

在 X6 中，Graph 是图的载体，它包含了图上的所有元素（节点、边等），同时挂载了图的相关操作（如交互监听、元素操作、渲染等）。

## 平移、缩放、居中

### 画布平移

普通画布(未开启 [scroller](/zh/docs/tutorial/basic/scroller) 模式)通过开启 `panning` 选项来支持拖拽平移。

```ts
const graph = new Graph({
  panning: true,
})

// 等同于
const graph = new Graph({
  panning: {
    enabled: true,
  },
})
```

拖拽可能和其他操作冲突，此时可以设置 `modifiers` 参数，设置修饰键后需要按下修饰键并点击鼠标才能触发画布拖拽。

```ts
const graph = new Graph({
  panning: {
    enabled: true,
    modifiers: 'shift',
  },
})
```

还可以配置 `eventTypes` 来设置触发画布拖拽的行为，支持 `leftMouseDown`、 `rightMouseDown`、`mouseWheel`，默认为 `['leftMouseDown']` 。

```ts
const graph = new Graph({
  panning: {
    enabled: true,
    eventTypes: ['leftMouseDown', 'rightMouseDown', 'mouseWheel']
  },
})
```

### 画布缩放

普通画布(未开启 [scroller](/zh/docs/tutorial/basic/scroller) 模式)通过开启 [mousewheel](/zh/docs/tutorial/basic/mousewheel) 选项来支持画布缩放。这里说明怎么通过代码来进行画布缩放：

```ts
graph.zoom() // 获取缩放级别
graph.zoom(0.2) // 在原来缩放级别上增加 0.2
graph.zoom(-0.2) // 在原来缩放级别上减少 0.2
```

### 内容居中

常用的就是将画布内容中心与视口中心对齐，使用方式：

```ts
graph.centerContent()
```

更多的居中方法可以查看 [Transform](/zh/docs/api/graph/transform)

## 导出

### 导出 PNG/JPEG

```ts
import { DataUri } from '@antv/x6'

this.graph.toPNG((dataUri: string) => {
  // 下载
  DataUri.downloadDataUri(dataUri, 'chart.png')
})
```
`toPNG/toJPEG` 方法支持第二个参数：

```ts
interface ToImageOptions {
  width?: number
  height?: number
  backgroundColor?: string
  padding?: NumberExt.SideOptions
  quality?: number
}
```

#### width

导出图片的宽度

#### height

导出图片的高度

#### backgroundColor

导出图片的背景色

#### padding

图片的 `padding`

```ts
this.graph.toPNG((dataUri: string) => {
  // 下载
  DataUri.downloadDataUri(dataUri, 'chart.png')
}, {
  padding: {
    top: 20,
    right: 30,
    bottom: 40,
    left: 50,
  },
})
```

#### quality

图片质量，可以从 0 到 1 的区间内选择图片的质量。如果超出取值范围，将会使用默认值 `0.92`

### 导出 SVG

```ts
this.graph.toSVG((dataUri: string) => {
  // 下载
  DataUri.downloadDataUri(DataUri.svgToDataUrl(dataUri), 'chart.svg')
})
```

`toSVG` 方法还支持第二个参数：

```ts
interface ToSVGOptions {
  preserveDimensions?: boolean | Size
  viewBox?: Rectangle.RectangleLike
  copyStyles?: boolean
  stylesheet?: string
  serializeImages?: boolean
  beforeSerialize?: (this: Graph, svg: SVGSVGElement) => any
}
```

#### preserveDimensions

`preserveDimensions` 用来控制导出 `svg` 的尺寸, 如果不设置，`width` 和 `height` 默认为 `100%`；如果设置为 `true`, `width` 和 `height` 会自动计算为图形区域的实际大小。还可以通过以下方式自定义尺寸：

```ts
this.graph.toSVG((dataUri: string) => {
  // todo
}, {
  preserveDimensions: {
    width: 100,
    height: 100,
  }
})
```

#### viewBox

设置导出 `svg` 的 `viewBox`

#### copyStyles

是否复制外部样式表中的样式，默认是 `true`。

#### stylesheet

自定义样式表

#### serializeImages

是否将 `image` 元素的 `xlink:href` 链接转化为 `dataUri` 格式

#### beforeSerialize

可以在导出 `svg` 字符串之前调用 `beforeSerialize` 来修改它。

## 销毁画布

我们可以调用 `graph.dispose()` 方法进行画布的销毁以及资源的回收。
