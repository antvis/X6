---
title: Background
order: 7
redirect_from:
  - /zh/docs
  - /zh/docs/api
---

背景用于为画布指定背景颜色或背景图片，支持[水印背景](#repeat)和[自定义背景图片的重复方式](/zh/docs/api/registry/background#registry)，背景层在 DOM 层级上位于画布的最底层。

<!-- <iframe src="/demos/tutorial/basic/background/playground"></iframe> -->

## 配置

创建画布时，通过 `background` 选项来设置画布的背景颜色或背景图片，默认值为 `false` 表示没有（透明）背景。

```ts
const graph = new Graph({
  background: false | BackgroundOptions,
});
```

创建画布后，可以调用 [graph.drawBackground(options?: BackgroundOptions)](#drawbackground) 方法来重绘背景。

```ts
graph.drawBackground({
  color: "#f5f5f5",
});
```

支持的选项如下：

```sign
interface BackgroundOptions {
  color?: string
  image?: string
  position?: CSS.BackgroundPositionProperty<{
    x: number
    y: number
  }>
  size?: CSS.BackgroundSizeProperty<{
    width: number
    height: number
  }>
  repeat?: CSS.BackgroundRepeatProperty
  opacity?: number
  quality?: number
  angle?: number
}
```

### color

背景颜色，支持所有 [CSS background-color](https://developer.mozilla.org/en-US/docs/Web/CSS/background-color) 属性的取值，如：

- `'red'`
- `'#f5f5f5'`
- `'rgba(255, 255, 128, 0.5)'`
- `'hsla(50, 33%, 25%, 0.75)'`
- `'radial-gradient(ellipse at center, red, green)'`

### image

背景图片的 URL 地址。默认值为 `undefined`，表示没有背景图片。

### position

背景图片位置，支持所有 [CSS background-position](https://developer.mozilla.org/en-US/docs/Web/CSS/background-position) 属性的取值，默认为 `'center'`。

### size

背景图片大小，支持所有 [CSS background-size](https://developer.mozilla.org/en-US/docs/Web/CSS/background-size) 属性的取值，默认为 `'auto auto'`。

### repeat

背景图片重复方式，支持所有 [CSS background-repeat](https://developer.mozilla.org/en-US/docs/Web/CSS/background-repeat) 属性的取值，默认为 `'no-repeat'`。

另外，还支持以下几个预定义值：

- [`'watermark'`](../registry/background#watermark) 水印效果。
- [`'flip-x'`](../registry/background#flip-x) 水平翻转背景图片。
- [`'flip-y'`](../registry/background#flip-y) 垂直翻转背景图片。
- [`'flip-xy'`](../registry/background#flip-xy) 水平和垂直翻转背景图片。

### opacity

背景透明度，取值范围 `[0, 1]`，默认值为 `1`。

### quality

背景图片质量，取值范围 `[0, 1]`，默认值为 `1`。

### angle

水印旋转角度，仅当 [repeat](#repeat) 为 `'watermark'` 时有效，默认值为 `20`。

## 方法

### drawBackground(...)

```sign
drawBackground(options?: Options): this
```

重绘背景。

<span class="tag-param">参数<span>

| 名称             | 类型   | 必选 | 默认值 | 描述               |
| ---------------- | ------ | :--: | ------ | ------------------ |
| options.color    | string |      | -      | 背景颜色。         |
| options.image    | string |      | -      | 背景图片地址。     |
| options.position | string |      | -      | 背景图片位置。     |
| options.size     | string |      | -      | 背景图片大小。     |
| options.repeat   | string |      | -      | 背景图片重复方式。 |
| options.opacity  | string |      | -      | 背景图片透明度。   |

### updateBackground()

```sign
updateBackground(): this
```

更新背景。

### clearBackground()

```sign
clearBackground(): this
```

清除背景。
