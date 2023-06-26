---
title: 高亮器
order: 14
redirect_from:
  - /zh/docs
  - /zh/docs/api
  - /zh/docs/api/registry
---

节点/边的高亮器，用于高亮指定的元素。X6 内置了以下几种高亮器。

| 名称      | 说明                                                       |
|-----------|----------------------------------------------------------|
| stroke    | [边框高亮器](#stroke)，沿元素的包围盒渲染一个高亮的边框。    |
| className | [样式名高亮器](#classname)，通过添加额外的样式名来高亮元素。 |

创建 Graph 时，可以通过 `highlighting` 选项来指定触发某种交互时的高亮样式，如：

```ts
new Graph({
  highlighting: {
    // 当连接桩可以被链接时，在连接桩外围渲染一个 2px 宽的红色矩形框
    magnetAvailable: {
      name: 'stroke',
      args: {
        padding: 4,
        attrs: {
          'stroke-width': 2,
          stroke: 'red',
        },
      },
    },
  },
})
```

支持的 `highlighting` 配置项有：

- `'default'` 默认高亮选项，当以下几种高亮配置缺省时被使用。
- `'embedding'` 拖动节点进行嵌入操作过程中，节点可以被嵌入时被使用。
- `'nodeAvailable'` 连线过程中，节点可以被链接时被使用。
- `'magnetAvailable'` 连线过程中，连接桩可以被链接时被使用。
- `'magnetAdsorbed'` 连线过程中，自动吸附到连接桩时被使用。

## 内置高亮器

### stroke

边框高亮器，沿元素的包围盒渲染一个高亮的边框。

| 参数名  | 类型   | 默认值                                     | 说明          |
|---------|--------|--------------------------------------------|-------------|
| rx      | number | `0`                                        | 边框倒角。     |
| ry      | number | `0`                                        | 边框倒角。     |
| padding | number | `3`                                        | 边距。         |
| attrs   | object | `{ 'stroke-width': 3, stroke: '#FEB663' }` | 边框元素属性。 |

### className

样式名高亮器，通过添加额外的样式名来高亮元素。

| 参数名    | 类型   | 默认值           | 说明    |
|-----------|--------|------------------|-------|
| className | string | `x6-highlighted` | 样式名。 |

## 自定义高亮器

高亮器是一个具有如下签名的对象，该对象中包含 `highlight` 和 `unhighlight` 两个方法，分别用于高亮和取消高亮元素。

```ts
export interface Definition<T> {
  highlight: (cellView: CellView, magnet: Element, options: T) => void
  unhighlight: (cellView: CellView, magnet: Element, options: T) => void
}
```

| 参数名   | 类型     | 默认值 | 说明          |
|----------|----------|--------|-------------|
| cellView | CellView |        | 视图。         |
| magnet   | Element  |        | 被高亮的元素。 |
| options  | T        |        | 高亮选项。     |


下面我们来定义一个名为 `opacity` 的高亮器，该高亮器为元素添加一个 `'highlight-opacity'` 样式名。

```ts
export interface OpacityHighlighterOptions {}

const className = 'highlight-opacity'

export const opacity: Highlighter.Definition<OpacityHighlighterOptions> = {
  highlight(cellView, magnet) {
    Dom.addClass(magnet, className)
  },

  unhighlight(cellView, magnetEl) {
    Dom.removeClass(magnetEl, className)
  },
}
```

完成定义后就可以注册我们的高亮器：

```ts
Graph.registerHighlighter('opacity', opacity, true)
```

然后我们就可以通过 `opacity` 字符串来使用该高亮器了：

```ts
new Graph({
  highlighting: {
    magnetAvailable: {
      name: 'opacity',
    },
  },
})
```