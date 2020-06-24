---
title: 背景 Background
order: 5
redirect_from:
  - /zh/docs
  - /zh/docs/manual
  - /zh/docs/manual/tutorial
---

背景在 DOM 层级上位于画布的最底层，创建画布时通过 `background` 选项来设置画布的背景颜色或背景图片，默认值为 `false` 表示没有（透明）背景。

```ts
const graph = new Graph({
  background: false | BackgroundOptions
})
```

创建画布后，可以调用 [graph.drawBackground(options?: BackgroundOptions)](#graphdrawbackgroundoptions-backgroundoptions) 方法来重绘背景。

## 选项 BackgroundOptions

```ts
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

背景图片的 URL 地址。

### position 

背景图片位置，支持所有 [CSS background-position](https://developer.mozilla.org/en-US/docs/Web/CSS/background-position) 属性的取值，默认为 `'center'`。

### size 

背景图片大小，支持所有 [CSS background-size](https://developer.mozilla.org/en-US/docs/Web/CSS/background-size) 属性的取值，默认为 `'auto auto'`。

### repeat 

背景重复方式，支持所有 [CSS background-repeat](https://developer.mozilla.org/en-US/docs/Web/CSS/background-repeat) 属性的取值，默认为 `'no-repeat'`。另外还可以使用以下几个预定义值：
  - `'flip-x'` 水平翻转背景图片。
  - `'flip-y'` 垂直翻转背景图片。
  - `'flip-xy'` 水平和垂直翻转背景图片。
  - `'watermark'` 水印效果。

### opacity 

背景透明度，取值范围 `[0, 1]`，默认为 `1`。

### quality 

背景图片质量，取值范围 `[0, 1]`，默认为 `1`。

### angle

水印旋转角度，仅当 `repeat` 为 `watermark` 时有效，默认为 `20`。

## Playground

- 设置不同的背景颜色。
- 设置背景图片。
- 设置背景图片的重复方式，重点体验 `'watermark'`。
- 设置背景图片的位置。
- 设置背景图片的大小。
- 设置背景透明度。

<iframe
     src="https://codesandbox.io/embed/x6-playground-background-xtneg?fontsize=14&hidenavigation=1&theme=light&view=preview"
     style="width:100%; height:500px; border:1px solid #f0f0f0; border-radius: 4px; overflow:hidden; margin-top:16px;"
     title="x6-playground-background"
     allow="accelerometer; ambient-light-sensor; camera; encrypted-media; geolocation; gyroscope; hid; microphone; midi; payment; usb; vr; xr-spatial-tracking"
     sandbox="allow-autoplay allow-forms allow-modals allow-popups allow-presentation allow-same-origin allow-scripts"
   ></iframe>

## API

### graph.drawBackground(options?: BackgroundOptions)

根据提供的[选项](#选项-backgroundoptions)重绘背景。

```ts
graph.drawBackground({
  color: '#f5f5f5',
})
```

### graph.clearBackground()

销毁背景。

### graph.updateBackground()

更新背景。

