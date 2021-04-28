---
title: Highlighter
order: 22
redirect_from:
  - /zh/docs
  - /zh/docs/api
  - /zh/docs/api/registry
---

节点/边的高亮器，用于高亮指定的元素。我们在 `Registry.Highlighter.presets` 命名空间中提供了以下几种高亮器。

| 名称      | 说明                                                       |
|-----------|----------------------------------------------------------|
| stroke    | [边框高亮器](#stroke)，沿元素的包围盒渲染一个高亮的边框。    |
| className | [样式名高亮器](#classname)，通过添加额外的样式名来高亮元素。 |

创建 Graph 时，可以通过 `highlighting` 选项来指定触发某种交互时的高亮样式，如：

```ts
new Graph({
  highlighting: {
    // 当链接桩可以被链接时，在链接桩外围渲染一个 2px 宽的红色矩形框
    magnetAvailable: {
      name: 'stroke',
      args: {
        padding: 4,
        attrs: {
          'stroke-width': 2,
          stroke: 'red',
        }
      },
    },
  },
})
```

支持的 `highlighting` 配置项有：

- `'default'` 默认高亮选项，当以下几种高亮配置缺省时被使用。
- `'embedding'` 拖动节点进行嵌入操作过程中，节点可以被嵌入时被使用。
- `'nodeAvailable'` 连线过程中，节点可以被链接时被使用。
- `'magnetAvailable'` 连线过程中，链接桩可以被链接时被使用。
- `'magnetAdsorbed'` 连线过程中，自动吸附到链接桩时被使用。


另外，也可以直接使用在 [`cellView.highlight(...)`](/zh/docs/api/view/cellview#highlight) 方法中，用来高亮指定的元素。

```ts
cellView.highlight(elem, { 
  highlighter: {
    name: 'stroke',
    args: {
      padding: 4,
      attrs: {
        'stroke-width': 2,
        stroke: 'red',
      }
    },
  },
})
```

## presets

### stroke

边框高亮器，沿元素的包围盒渲染一个高亮的边框。

<span class="tag-param">参数<span>

| 参数名  | 类型   | 默认值                                     | 说明          |
|---------|--------|--------------------------------------------|-------------|
| rx      | number | `0`                                        | 边框倒角。     |
| ry      | number | `0`                                        | 边框倒角。     |
| padding | number | `3`                                        | 边距。         |
| attrs   | object | `{ 'stroke-width': 3, stroke: '#FEB663' }` | 边框元素属性。 |

### className

样式名高亮器，通过添加额外的样式名来高亮元素。

<span class="tag-param">参数<span>

| 参数名    | 类型   | 默认值           | 说明    |
|-----------|--------|------------------|-------|
| className | string | `x6-highlighted` | 样式名。 |

## registry

高亮器是一个具有如下签名的对象，该对象中包含 `highlight` 和 `unhighlight` 两个方法，分别用于高亮和取消高亮元素。

```sign
export interface Definition<T> {
  highlight: (cellView: CellView, magnet: Element, options: T) => void
  unhighlight: (cellView: CellView, magnet: Element, options: T) => void
}
```

<span class="tag-param">参数<span>

| 参数名   | 类型     | 默认值 | 说明          |
|----------|----------|--------|-------------|
| cellView | CellView |        | 视图。         |
| magnet   | Element  |        | 被高亮的元素。 |
| options  | T        |        | 高亮选项。     |

同时我们在 `Registry.Highlighter.registry` 对象上提供了 [register](#register) 和 [unregister](#unregister) 两个方法来注册和取消注册高亮器。

### register

```sign
register(entities: { [name: string]: Definition }, force?: boolean): void
register(name: string, entity: Definition, force?: boolean): Definition
```

注册高亮器。

### unregister

```sign
unregister(name: string): Definition | null
```

取消注册高亮器。

### 自定义高亮器

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

完成定义后就可以注册我们的高亮器，实际上，我们将 `Registry.Highlighter.registry` 对象的 `register` 和 `unregister` 方法分别挂载为 `Graph` 的两个静态方法 `Graph.registerHighlighter` 和 `Graph.unregisterHighlighter`，所以我们可以像下面这样来注册高亮器：

```ts
Graph.registerHighlighter('opacity', opacity, true)
```
