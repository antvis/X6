---
title: 导出
order: 9
redirect_from:
  - /zh/docs
  - /zh/docs/tutorial
  - /zh/docs/tutorial/plugins
---

:::info{title=通过阅读本章节,你可以了解到}

- 如何将画布内容通过图片格式导出 :::

## 使用

我们经常需要将画布内容通过图片的形式导出来，我们提供了一个独立的插件包 `@antv/x6-plugin-export` 来使用这个功能。

```shell
# npm
$ npm install @antv/x6-plugin-export --save

# yarn
$ yarn add @antv/x6-plugin-export
```

然后我们在代码中这样使用：

```ts
import { Export } from '@antv/x6-plugin-export'

const graph = new Graph({
  background: {
    color: '#F2F7FA',
  },
})

graph.use(new Export())
```

## API

### graph.exportSVG(...)

```ts
exportSVG(fileName?: string, options?: Export.ToSVGOptions): void
```

`fileNmae` 为文件名称，缺省为 `chart`，`Export.ToSVGOptions` 描述如下：

| 属性名 | 类型 | 默认值 | 必选 | 描述 |
| --- | --- | --- | --- | --- |
| preserveDimensions | `boolean \| Size` | - |  | preserveDimensions 用来控制导出 svg 的尺寸, 如果不设置，width 和 height 默认为 100%；如果设置为 true, width 和 height 会自动计算为图形区域的实际大小 |
| viewBox | Rectangle.RectangleLike | - |  | 设置导出 svg 的 viewBox |
| copyStyles | boolean | `true` |  | 是否复制外部样式表中的样式，默认是 true。开启 copyStyles 后，在导出过程中因为需要禁用所有样式表，所以页面可能会出现短暂的样式丢失现象。如果效果特别差，可以将 copyStyles 设置为 false |
| stylesheet | string | - |  | 自定义样式表 |
| serializeImages | boolean | `true` |  | 是否将 image 元素的 xlink:href 链接转化为 dataUri 格式 |
| beforeSerialize | `(this: Graph, svg: SVGSVGElement) => any` | - |  | 可以在导出 svg 字符串之前调用 beforeSerialize 来修改它 |

### graph.exportPNG(...)

```ts
exportPNG(fileName?: string, options?: Export.ToImageOptions): void
```

`fileNmae` 为文件名称，缺省为 `chart`，`Export.ToImageOptions` 除了继承上面 `Export.ToSVGOptions` 外，还有以下配置：

| 属性名 | 类型 | 默认值 | 必选 | 描述 |
| --- | --- | --- | --- | --- |
| width | number | - |  | 导出图片的宽度 |
| height | number | - |  | 导出图片的高度 |
| backgroundColor | string | - |  | 导出图片的背景色 |
| padding | NumberExt.SideOptions | - |  | 图片的 padding |
| quality | number | - |  | 图片质量，可以从 0 到 1 的区间内选择图片的质量。如果超出取值范围，将会使用默认值 0.92 |

### graph.exportJPEG(...)

```ts
exportJPEG(fileName?: string, options?: Export.ToImageOptions): void
```

### graph.toSVG(...)

```ts
toSVG(callback: (dataUri: string) => any, options?: Export.ToSVGOptions): void
```

### graph.toPNG(...)

```ts
toPNG(callback: (dataUri: string) => any, options?: Export.ToImageOptions): void
```

### graph.toJPEG(...)

```ts
toJPEG(callback: (dataUri: string) => any, options?: Export.ToImageOptions): void
```
