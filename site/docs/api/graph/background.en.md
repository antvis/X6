---
title: Background
order: 3
redirect_from:
  - /en/docs
  - /en/docs/api
  - /en/docs/api/graph
---

The background is used to specify the background color or background image of the canvas, supporting [watermark background](#repeat). The background layer is at the bottom of the DOM layer.

## Demo

<code id="api-graph-background" src="@/src/api/background/playground/index.tsx"></code>

## Configuration

### color

The background color, supporting all [CSS background-color](https://developer.mozilla.org/en-US/docs/Web/CSS/background-color) property values, such as:

-  `red`
-  `#f5f5f5`
-  `rgba(255, 255, 128, 0.5)`
-  `hsla(50, 33%, 25%, 0.75)`
-  `radial-gradient(ellipse at center, red, green)`

### image

The URL address of the background image. The default value is `undefined`, indicating no background image.

### position

The position of the background image, supporting all [CSS background-position](https://developer.mozilla.org/en-US/docs/Web/CSS/background-position) property values, with a default value of `'center'`.

### size

The size of the background image, supporting all [CSS background-size](https://developer.mozilla.org/en-US/docs/Web/CSS/background-size) property values, with a default value of `'auto auto'`.

### repeat

The repeat mode of the background image, supporting all [CSS background-repeat](https://developer.mozilla.org/en-US/docs/Web/CSS/background-repeat) property values, with a default value of `'no-repeat'`.

Additionally, the following predefined values are supported:

-  `watermark`: Watermark effect.
-  `flip-x`: Flip the background image horizontally.
-  `flip-y`: Flip the background image vertically.
-  `flip-xy`: Flip the background image both horizontally and vertically.

### opacity

The opacity of the background, with a value range of `[0, 1]`, and a default value of `1`.

### quality

The quality of the background image, with a value range of `[0, 1]`, and a default value of `1`.

### angle

The rotation angle of the watermark, only valid when [repeat](#repeat) is `'watermark'`, with a default value of `20`.

## Methods

### drawBackground(...)

```ts
drawBackground(options?: Options): this
```

Redraw the background.

| Name             | Type   | Required | Default Value | Description               |
| ---------------- | ------ | :------: | ------------- | ------------------ |
| options.color    | string |          | -             | Background color.         |
| options.image    | string |          | -             | Background image address. |
| options.position | string |          | -             | Background image position. |
| options.size     | string |          | -             | Background image size.     |
| options.repeat   | string |          | -             | Background image repeat mode. |
| options.opacity  | string |          | -             | Background image opacity.   |

### updateBackground()

```ts
updateBackground(): this
```

Update the background.

### clearBackground()

```ts
clearBackground(): this
```

Clear the background.

## Custom Image Repeat Mode

In addition to the predefined values supported by [repeat](#repeat), you can also customize the image repeat mode.

```ts
function watermark(img, options) {
  const width = img.width
  const height = img.height
  const canvas = document.createElement('canvas')

  canvas.width = width * 3
  canvas.height = height * 3

  const ctx = canvas.getContext('2d')!
  const angle = options.angle != null ? -options.angle : -20
  const radians = Angle.toRad(angle)
  const stepX = canvas.width / 4
  const stepY = canvas.height / 4

  for (let i = 0; i < 4; i += 1) {
    for (let j = 0; j < 4; j += 1) {
      if ((i + j) % 2 > 0) {
        ctx.setTransform(1, 0, 0, 1, (2 * i - 1) * stepX, (2 * j - 1) * stepY)
        ctx.rotate(radians)
        ctx.drawImage(img, -width / 2, -height / 2, width, height)
      }
    }
  }

  return canvas
}

Graph.registerBackground('watermark', watermark)
```