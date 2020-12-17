---
title: EdgeView
order: 3
redirect_from:
  - /zh/docs
  - /zh/docs/api
  - /zh/docs/api/view
---

边视图，继承自 [CellView](./cellview)。

## constructor

```sign
constructor(edge: Edge, options?: EdgeView.Options): EdgeView
```

## prototype

### isNodeView()

```sign
isNodeView(): boolean
```

返回该视图是否是节点视图。默认返回 `false`。

### isEdgeView()

```sign
isEdgeView(): boolean
```

返回该视图是否是边视图。默认返回 `true`。

### sendToken(...)

```sign
sendToken(
  token: SVGElement | string,
  options?:
    | number
    | {
        duration?: number
        reversed?: boolean
        selector?: string
      },
  callback?: () => void,
): () => void
```

开始一个沿边路径运动的动画，返回一个停止该动画的方法。

<span class="tag-param">参数<span>

| 名称             | 类型                 | 必选 | 默认值      | 描述                                                           |
|------------------|----------------------|:----:|-------------|--------------------------------------------------------------|
| token            | SVGElement \| string |  ✓   |             | 沿边运动的元素或元素选择器。                                    |
| options.duration | number               |      | `1000`      | 动画持续的时间，单位毫秒。                                       |
| options.reversed | boolean              |      | `false`     | 是否沿反方向运动，即从边的终点运动到起点。                       |
| options.selector | string               |      | `undefined` | 动画参照的 SVGPathElement 元素，默认沿边的 SVGPathElement 运动。 |
| options.start    | (e) => void          |      |             | 动画开始时的回调。                                              |
| options.complete | (e) => void          |      |             | 动画结束时的回调。                                              |
| options.repeat   | (e) => void          |      |             | 动画重复执行时的回调。                                          |
| options....      |                      |      |             | 其他键值对，表示动画选项。                                       |
| callback         | () => void           |      |             | 动画执行完成后的回调函数。                                      |

其中，动画选项可以参考 [AnimateMotionElement](https://www.w3.org/TR/SVG11/animate.html#AnimateMotionElement) 元素的属性。

<span class="tag-example">使用<span>

```ts
const view = graph.findViewByCell(edge) as EdgeView
const token = Vector.create('circle', { r: 6, fill: 'green' })
view.sendToken(token.node, 1000)

// 5s 后停止该动画
setTimeout(stop, 5000)
```

<iframe src="/demos/tutorial/advanced/animation/signal"></iframe>
