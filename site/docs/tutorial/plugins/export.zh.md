---
title: 导出
order: 9
redirect_from:
  - /zh/docs
  - /zh/docs/tutorial
  - /zh/docs/tutorial/plugins
---

:::info{title="本章节主要介绍导出插件相关的知识，通过阅读，你可以了解到"}

- 如何将画布内容通过图片格式导出

:::

## 使用

你可以通过插件 `Export` 将画布内容导出为图片格式，示例：

```ts
import { Graph, Export } from '@antv/x6'

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

`fileName` 为文件名称，缺省为 `chart`，`Export.ToSVGOptions` 描述如下：

| 属性名             | 类型                                       | 默认值 | 必选 | 描述                                                                                                                                                                            |
|--------------------|--------------------------------------------|--------|------|-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| preserveDimensions | `boolean \| Size`                          | -      |      | 控制导出 SVG 的尺寸；未设置时 width/height 为 100%；设置为 true 时自动计算为图形区域的实际大小；也可传入 `{ width, height }` 显式指定导出尺寸。                              |
| viewBox            | RectangleLike                               | -      |      | 设置导出 SVG 的 viewBox                                                                                                                                                         |
| copyStyles         | boolean                                    | `true` |      | 是否复制外部样式表中的样式，默认 true。开启后会将节点的计算样式按差异内联到导出的 SVG，以保持页面与导出视觉一致，但会增加导出耗时；若样式已通过 `attrs` 指定或追求速度，可设为 `false`，并结合 `stylesheet` 注入必要 CSS。 |
| stylesheet         | string                                     | -      |      | 自定义样式表                                                                                                                                                                    |
| serializeImages    | boolean                                    | `true` |      | 是否将 image 元素的 `xlink:href`/`href` 链接转化为 DataURI（导出 PNG/JPEG 时会强制启用）。                                                                                      |
| beforeSerialize    | `(this: Graph, svg: SVGElement) => any` | -      |      | 可以在导出 svg 字符串之前调用 beforeSerialize 来修改它                                                                                                                          |

### graph.exportPNG(...)

```ts
exportPNG(fileName?: string, options?: Export.ToImageOptions): void
```

`fileName` 为文件名称，缺省为 `chart`，`Export.ToImageOptions` 除了继承上面 `Export.ToSVGOptions` 外，还有以下配置：

| 属性名          | 类型                  | 默认值 | 必选 | 描述                                                                               |
|-----------------|-----------------------|--------|------|----------------------------------------------------------------------------------|
| width           | number                | -      |      | 导出图片的宽度                                                                     |
| height          | number                | -      |      | 导出图片的高度                                                                     |
| ratio           | string                | `1`    |      | 输出缩放比例（如设备像素比），用于计算导出分辨率。                                   |
| backgroundColor | string                | -      |      | 导出图片的背景色，缺省为白色。                                                     |
| padding         | NumberExt.SideOptions | -      |      | 图片的 padding                                                                     |
| quality         | number                | -      |      | 图片质量，可以从 0 到 1 的区间内选择图片的质量。如果超出取值范围，将会使用默认值 0.92 |

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
