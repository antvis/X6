---
title: Filter
order: 12
redirect_from:
  - /zh/docs
  - /zh/docs/api
  - /zh/docs/api/registry
---

我们可以使用 [filter](/zh/docs/api/registry/attr#filter) 这个特殊属性来为元素指定 [SVG 滤镜](https://developer.mozilla.org/en-US/docs/Web/SVG/Tutorial/Filter_effects)，像下面这样，为该元素的 `filter` 属性指定一个预定义的对象，其中 `name` 和 `args` 分别指定了滤镜名称和滤镜参数。

```ts
// 创建节点是通过 attrs 选项指定滤镜
const rect = graph.addNode({
  x: 40,
  y: 40,
  width: 80,
  height: 30,
  attrs: {
    body: {
      filter: {
        name: "dropShadow",
        args: {
          dx: 2,
          dy: 2,
          blur: 3,
        },
      },
    },
  },
});

// 创建节点后可以通过 `attr()` 方法修改或指定元素滤镜
rect.attr("body/filter", {
  name: "dropShadow",
  args: {
    dx: 2,
    dy: 2,
    blur: 3,
  },
});
```

另外，我们也可以调用 `graph.defineFilter(...)` 方法来得到一个滤镜的 ID，然后将 `filter` 属性指定为这个滤镜的 ID。

```ts
const filterId = graph.defineFilter({
  name: "dropShadow",
  args: {
    dx: 2,
    dy: 2,
    blur: 3,
  },
});

rect.attr("body/filter", `#${filterId}`);
```

通过上面的简单介绍，我们了解了如何使用滤镜，下面我们就分别来看看在 `Registry.Filter.presets` 命名空间中预定义了哪些滤镜。

## presets

### dropShadow

阴影滤镜。参考 [CSS drop-shadow()](https://developer.mozilla.org/en-US/docs/Web/CSS/filter-function/drop-shadow) 滤镜。

<span class="tag-param">参数<span>

| 参数名  | 类型   | 默认值 | 说明                 |
|---------|--------|--------|--------------------|
| dx      | number | `0`    | 阴影在 X 轴的偏移量。 |
| dy      | number | `0`    | 阴影在 Y 轴的偏移量。 |
| blur    | number | `0`    | 阴影的模糊半径。      |
| opacity | number | `1`    | 阴影的透明度。        |

<!-- <iframe src="/demos/api/registry/filter/drop-shadow"></iframe> -->

### blur

高斯模糊滤镜。参考 [CSS blur()](https://developer.mozilla.org/en-US/docs/Web/CSS/filter-function/blur) 滤镜。

<span class="tag-param">参数<span>

| 参数名 | 类型   | 默认值 | 说明                                      |
|--------|--------|--------|-----------------------------------------|
| x      | number | `2`    | X 轴方向的模糊程度。                       |
| y      | number | -      | Y 轴方向的模糊程度，缺省时与 X 轴保持一致。 |

<!-- <iframe src="/demos/api/registry/filter/blur"></iframe> -->

### grayScale

灰阶滤镜。参考 [CSS grayscale()](https://developer.mozilla.org/en-US/docs/Web/CSS/filter-function/grayscale) 滤镜。

<span class="tag-param">参数<span>

| 参数名 | 类型   | 默认值 | 说明                                                   |
|--------|--------|--------|------------------------------------------------------|
| amount | number | `1`    | 灰阶程度。取值从 `[0-1]`，`0` 表示没有灰度，`1` 表示全灰。 |

<!-- <iframe src="/demos/api/registry/filter/gray-scale"></iframe> -->

### sepia

褐色滤镜。参考 [CSS sepia()](https://developer.mozilla.org/en-US/docs/Web/CSS/filter-function/sepia) 滤镜。

<span class="tag-param">参数<span>

| 参数名 | 类型   | 默认值 | 说明                                                           |
|--------|--------|--------|--------------------------------------------------------------|
| amount | number | `1`    | 褐色程度。取值从 `[0-1]`，`0` 表示褐色程度为 `0`，`1` 表示全褐色。 |

<!-- <iframe src="/demos/api/registry/filter/sepia"></iframe> -->

### saturate

饱和度滤镜。参考 [CSS saturate()](https://developer.mozilla.org/en-US/docs/Web/CSS/filter-function/saturate) 滤镜。

<span class="tag-param">参数<span>

| 参数名 | 类型   | 默认值 | 说明                   |
|--------|--------|--------|----------------------|
| amount | number | `1`    | 饱和度。取值从 `[0-1]`。 |

<!-- <iframe src="/demos/api/registry/filter/saturate"></iframe> -->

### hueRotate

色相旋转滤镜。参考 [CSS hue-rotate()](https://developer.mozilla.org/en-US/docs/Web/CSS/filter-function/hue-rotate) 滤镜。

<span class="tag-param">参数<span>

| 参数名 | 类型   | 默认值 | 说明          |
|--------|--------|--------|-------------|
| angle  | number | `0`    | 色相旋转角度。 |

### invert

反色滤镜。参考 [CSS invert()](https://developer.mozilla.org/en-US/docs/Web/CSS/filter-function/invert) 滤镜。

<span class="tag-param">参数<span>

| 参数名 | 类型   | 默认值 | 说明                                                     |
|--------|--------|--------|--------------------------------------------------------|
| amount | number | `1`    | 反色度。取值从 `[0-1]`，`0` 表示没有反色，`1` 表示完全反色。 |

<!-- <iframe src="/demos/api/registry/filter/invert"></iframe> -->

### brightness

明亮度滤镜。参考 [CSS brightness()](https://developer.mozilla.org/en-US/docs/Web/CSS/filter-function/brightness) 滤镜。

<span class="tag-param">参数<span>

| 参数名 | 类型   | 默认值 | 说明                                             |
|--------|--------|--------|------------------------------------------------|
| amount | number | `1`    | 明亮度。取值从 `[0-1]`，`0` 表示全暗，`1` 表示全亮。 |

<!-- <iframe src="/demos/api/registry/filter/brightness"></iframe> -->

### contrast

对比度滤镜。参考 [CSS contrast()](https://developer.mozilla.org/en-US/docs/Web/CSS/filter-function/contrast) 滤镜。

<span class="tag-param">参数<span>

| 参数名 | 类型   | 默认值 | 说明                                             |
|--------|--------|--------|------------------------------------------------|
| amount | number | `1`    | 对比度。取值从 `[0-1]`，`0` 表示全暗，`1` 表示全亮。 |

<!-- <iframe src="/demos/api/registry/filter/contrast"></iframe> -->

### highlight

高亮滤镜。

<span class="tag-param">参数<span>

| 参数名  | 类型   | 默认值 | 说明            |
|---------|--------|--------|---------------|
| color   | string | `red`  | 高亮颜色。       |
| width   | number | `1`    | 高亮外框的宽度。 |
| blur    | number | `0`    | 模糊半径。       |
| opacity | number | `1`    | 透明度。         |

<!-- <iframe src="/demos/api/registry/filter/highlight"></iframe> -->

### outline

边框滤镜。

<span class="tag-param">参数<span>

| 参数名  | 类型   | 默认值 | 说明      |
|---------|--------|--------|---------|
| color   | string | `blue` | 边框颜色。 |
| width   | number | `1`    | 边框宽度。 |
| margin  | number | `2`    | 边距。     |
| opacity | number | `1`    | 透明度。   |

<!-- <iframe src="/demos/api/registry/filter/outline"></iframe> -->

## registry

滤镜定义是一个具有如下签名的函数，返回 `<filter>` 标签字符串。

```ts
export type Definition<T> = (args: T) => string;
```

例如，高斯模糊滤镜的定义为：

```ts
export interface BlurArgs {
  x?: number;
  y?: number;
}

export function blur(args: BlurArgs = {}) {
  const x = getNumber(args.x, 2);
  const stdDeviation = args.y != null && isFinite(args.y) ? [x, args.y] : x;

  return `
    <filter>
      <feGaussianBlur stdDeviation="${stdDeviation}"/>
    </filter>
  `.trim();
}
```

同时，我们在 `Registry.Filter.registry` 对象上提供了 [`register`](#register) 和 [`unregister`](#unregister) 两个方法来注册和取消注册网格定义，同时也将这两个方法分别挂载为 Graph 上的两个静态方法 `Graph.registerFilter` 和 `Graph.unregisterFilter`。

### register

```ts
register(entities: { [name: string]: Definition }, force?: boolean): void
register(name: string, entity: Definition, force?: boolean): Definition
```

注册滤镜。

我们可以调用 `Graph.registerFilter(...)` 方法来注册滤镜。

```ts
Graph.registerFilter("blur", blur);
```

### unregister

```ts
unregister(name: string): Definition | null
```

取消注册滤镜。
