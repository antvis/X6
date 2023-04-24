---
title: 背景
order: 3
redirect_from:
  - /zh/docs
  - /zh/docs/api
  - /zh/docs/api/graph
---

背景用于为画布指定背景颜色或背景图片，支持[水印背景](#repeat)，背景层在 DOM 层级上位于画布的最底层。

## 演示

<code id="api-graph-background" src="@/src/api/background/playground/index.tsx"></code>

## 配置

### color

背景颜色，支持所有 [CSS background-color](https://developer.mozilla.org/en-US/docs/Web/CSS/background-color) 属性的取值，如：

- `red`
- `#f5f5f5`
- `rgba(255, 255, 128, 0.5)`
- `hsla(50, 33%, 25%, 0.75)`
- `radial-gradient(ellipse at center, red, green)`

### image

背景图片的 URL 地址。默认值为 `undefined`，表示没有背景图片。

### position

背景图片位置，支持所有 [CSS background-position](https://developer.mozilla.org/en-US/docs/Web/CSS/background-position) 属性的取值，默认为 `'center'`。

### size

背景图片大小，支持所有 [CSS background-size](https://developer.mozilla.org/en-US/docs/Web/CSS/background-size) 属性的取值，默认为 `'auto auto'`。

### repeat

背景图片重复方式，支持所有 [CSS background-repeat](https://developer.mozilla.org/en-US/docs/Web/CSS/background-repeat) 属性的取值，默认为 `'no-repeat'`。

另外，还支持以下几个预定义值：

- `watermark`: 水印效果。
- `flip-x`: 水平翻转背景图片。
- `flip-y`: 垂直翻转背景图片。
- `flip-xy`: 水平和垂直翻转背景图片。

### opacity

背景透明度，取值范围 `[0, 1]`，默认值为 `1`。

### quality

背景图片质量，取值范围 `[0, 1]`，默认值为 `1`。

### angle

水印旋转角度，仅当 [repeat](#repeat) 为 `'watermark'` 时有效，默认值为 `20`。

## 方法

### drawBackground(...)

```ts
drawBackground(options?: Options): this
```

重绘背景。

| 名称             | 类型   | 必选 | 默认值 | 描述              |
|------------------|--------|:----:|--------|-----------------|
| options.color    | string |      | -      | 背景颜色。         |
| options.image    | string |      | -      | 背景图片地址。     |
| options.position | string |      | -      | 背景图片位置。     |
| options.size     | string |      | -      | 背景图片大小。     |
| options.repeat   | string |      | -      | 背景图片重复方式。 |
| options.opacity  | string |      | -      | 背景图片透明度。   |

### updateBackground()

```ts
updateBackground(): this
```

更新背景。

### clearBackground()

```ts
clearBackground(): this
```

清除背景。

## 自定义图片重复方式

除了上面 [repeat](#repeat) 支持的几个预定义值外，还可以自定义图片重复方式。

```ts
function watermark(img, options) {
  const width = img.width;
  const height = img.height;
  const canvas = document.createElement("canvas");

  canvas.width = width * 3;
  canvas.height = height * 3;

  const ctx = canvas.getContext("2d")!;
  const angle = options.angle != null ? -options.angle : -20;
  const radians = Angle.toRad(angle);
  const stepX = canvas.width / 4;
  const stepY = canvas.height / 4;

  for (let i = 0; i < 4; i += 1) {
    for (let j = 0; j < 4; j += 1) {
      if ((i + j) % 2 > 0) {
        ctx.setTransform(1, 0, 0, 1, (2 * i - 1) * stepX, (2 * j - 1) * stepY);
        ctx.rotate(radians);
        ctx.drawImage(img, -width / 2, -height / 2, width, height);
      }
    }
  }

  return canvas;
}

Graph.registerBackground("watermark", watermark);
```