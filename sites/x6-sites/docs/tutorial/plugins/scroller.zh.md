---
title: 滚动画布
order: 6
redirect_from:
  - /zh/docs
  - /zh/docs/tutorial
  - /zh/docs/tutorial/plugins
---

:::info{title=在本章节中，主要介绍滚动画布插件相关的知识，通过阅读，你可以了解到：}

- 如何使画布具备滚动能力
  :::

## 使用

我们提供了一个独立的插件包 `@antv/x6-plugin-scroller` 来使用滚动画布功能。

```shell
# npm
$ npm install @antv/x6-plugin-scroller --save

# yarn
$ yarn add @antv/x6-plugin-scroller
```

然后我们在代码中这样使用：

```ts
import { Scroller } from "@antv/x6-plugin-scroller";

const graph = new Graph({
  background: {
    color: "#F2F7FA",
  },
});
graph.use(
  new Scroller({
    enabled: true,
  })
);
```

## 演示

<code id="plugin-scroller" src="@/src/tutorial/plugins/scroller/index.tsx"></code>

## 选项

| 属性名           | 类型                | 默认值  | 必选 | 描述                                                                                                                                                                                   |
|------------------|---------------------|---------|------|--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| pannable         | boolean             | `false` |      | 是否启用画布平移能力（在空白位置按下鼠标后拖动平移画布）                                                                                                                                 |
| className        | string              | -       |      | 附加样式名，用于定制样式                                                                                                                                                                |
| width            | number              | -       |      | `Scroller` 的宽度，默认为画布容器宽度                                                                                                                                                   |
| height           | number              | -       |      | `Scroller` 的高度，默认为画布容器高度                                                                                                                                                   |
| modifiers        | ModifierKey         | -       |      | 设置修饰键后需要点击鼠标并按下修饰键才能触发画布拖拽                                                                                                                                   |
| pageWidth        | number              | -       |      | 每一页的宽度，默认为画布容器宽度                                                                                                                                                        |
| pageHeight       | number              | -       |      | 每一页的高度，默认为画布容器高度                                                                                                                                                        |
| pageVisible      | boolean             | `false` |      | 是否分页                                                                                                                                                                               |
| pageBreak        | boolean             | `false` |      | 是否显示分页符                                                                                                                                                                         |
| autoResize       | boolean             | `true`  |      | 是否自动扩充/缩小画布。开启后，移动节点/边时将自动计算需要的画布大小，当超出当前画布大小时，按照 `pageWidth` 和 `pageHeight` 自动扩充画布。反之，则自动缩小画布                              |
| minVisibleWidth  | number              | -       |      | 当 `padding` 为空时有效，设置画布滚动时画布的最小可见宽度                                                                                                                               |
| minVisibleHeight | number              | -       |      | 当 `padding` 为空时有效，设置画布滚动时画布的最小可见高度                                                                                                                               |
| padding          | `number \| Padding` | -       |      | 设置画布四周的 padding 边距。默认根据 `minVisibleWidth` 和 `minVisibleHeight` 自动计算得到，保证画布滚动时，在宽度和高度方向至少有 `minVisibleWidth` 和 `minVisibleHeight` 大小的画布可见 |

上面的 `Padding` 类型定义如下：

```ts
type Padding = { top: number; right: number; bottom: number; left: number };
```

`ModifierKey` 的类型定义如下：

```ts
type ModifierKey = string | ("alt" | "ctrl" | "meta" | "shift")[] | null;
```

支持以下几种形式：

- `alt` 表示按下 `alt`。
- `[alt, ctrl]`,  表示按下 `alt` 或 `ctrl`。
- `alt|ctrl` 表示按下 `alt` 或 `ctrl`。
- `alt&ctrl` 表示同时按下 `alt` 和 `ctrl`。
- `alt|ctrl&shift` 表示同时按下 `alt` 和 `shift` 或者同时按下 `ctrl` 和 `shift`。

## API

### graph.lockScroller()

禁止滚动。

### graph.unlockScroller()

启用滚动。

### graph.getScrollbarPosition()

获取滚动条位置。

### graph.setScrollbarPosition(left?: number, top?: number)

设置滚动条位置。

- `left?: number` 水平滚动条的位置，缺省时表示水平方向不滚动。
- `top?: number` 垂直滚动条的位置，缺省时表示垂直方向不滚动。

例如：

```ts
graph.setScrollbarPosition(100);
graph.setScrollbarPosition(100, null);
graph.setScrollbarPosition(null, 200);
graph.setScrollbarPosition(100, 200);
```
