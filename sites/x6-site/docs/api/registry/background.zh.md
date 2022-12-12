---
title: Background
order: 28
redirect_from:
  - /zh/docs
  - /zh/docs/api
  - /zh/docs/api/registry
---

创建画布时，我们可以通过下面方式为画布指定背景图片

```ts
const graph = new Graph({
  background: {
    image: "http://placehold.it/120x48",
    position: "center", // https://developer.mozilla.org/en-US/docs/Web/CSS/background-position
    size: "auto auto", // https://developer.mozilla.org/en-US/docs/Web/CSS/background-size
    repeat: "no-repeat", // https://developer.mozilla.org/en-US/docs/Web/CSS/background-repeat
  },
});
```

上面代码中，通过 `repeat` 选项来指定背景图片的重复方式，支持所有 [CSS background-repeat](https://developer.mozilla.org/en-US/docs/Web/CSS/background-repeat) 属性的取值，另外，我们在 `Registry.Background.presets` 命名空间下提供了以下几种方式：

- [`'watermark'`](#watermark) 水印效果。
- [`'flip-x'`](#flip-x) 水平翻转背景图片。
- [`'flip-y'`](#flip-y) 垂直翻转背景图片。
- [`'flip-xy'`](#flip-xy) 水平和垂直翻转背景图片。

下面分别介绍这几种方式的用法。

## presets

### watermark

水印效果。

```ts
const graph = new Graph({
  container: this.container,
  grid: true,
  background: {
    image: "data:image/png;base64,iV...",
    repeat: "watermark",
    opacity: 0.2,
  },
});
```

<!-- <iframe src="/demos/api/registry/background/watermark"></iframe> -->

### flip-x

水平翻转背景图片。

```
 d b
 d b
```

```ts
const graph = new Graph({
  container: this.container,
  grid: true,
  background: {
    image: "data:image/png;base64,iV...",
    repeat: "flip-x",
    opacity: 0.2,
  },
});
```

<!-- <iframe src="/demos/api/registry/background/flip-x"></iframe> -->

### flip-y

垂直翻转背景图片。

```
  d d
  q q
```

```ts
const graph = new Graph({
  container: this.container,
  grid: true,
  background: {
    image: "data:image/png;base64,iV...",
    repeat: "flip-y",
    opacity: 0.2,
  },
});
```

<!-- <iframe src="/demos/api/registry/background/flip-y"></iframe> -->

### flip-xy

水平和垂直翻转背景图片。

```
 d b
 q p
```

```ts
const graph = new Graph({
  container: this.container,
  grid: true,
  background: {
    image: "data:image/png;base64,iV...",
    repeat: "flip-xy",
    opacity: 0.2,
  },
});
```

<!-- <iframe src="/demos/api/registry/background/flip-xy"></iframe> -->

## registry

背景重复方式的定义是一个具有如下签名的函数，返回一个 Canvas 对象。

```sign
export interface Options {
  color?: string
  image?: string
  position?: BackgroundPositionProperty<{
    x: number
    y: number
  }>
  size?: BackgroundSizeProperty<{
    width: number
    height: number
  }>
  repeat?: BackgroundRepeatProperty
  opacity?: number
}

export interface CommonOptions extends Omit<Options, 'repeat'> {
  quality?: number
}

export type Definition<T extends CommonOptions = CommonOptions> = (
  img: HTMLImageElement,
  options: T,
) => HTMLCanvasElement
```

| 参数名  | 参数类型         | 参数说明                               |
| ------- | ---------------- | -------------------------------------- |
| img     | HTMLImageElement | 由 options.image 作为 src 的图片元素。 |
| options | CommonOptions    | 背景选项。                             |

我们在 `Registry.Background.registry` 对象上提供了 [`register`](#register) 和 [`unregister`](#unregister) 两个方法来注册和取消注册背景重复方式的定义，同时也将这两个方法分别挂载为 Graph 上的两个静态方法 `Graph.registerBackground` 和 `Graph.unregisterBackground`。

### register

```sign
register(entities: { [name: string]: Definition }, force?: boolean): void
register(name: string, entity: Definition, force?: boolean): Definition
```

注册背景重复方式定义。

### unregister

```sign
unregister(name: string): Definition | null
```

取消注册背景重复方式定义。

### 自定义背景重复方式

看下面 `'watermark'` 的实现：

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
```

然后调用 `Graph.registerBackground` 来注册：

```ts
Graph.registerBackground("watermark", watermark);
```
