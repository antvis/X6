---
title: 滚轮缩放 MouseWheel
order: 16
redirect_from:
  - /en/docs
  - /en/docs/tutorial
  - /en/docs/tutorial/basic
---

鼠标滚轮的默认行为是滚动页面，启用 [Scroller](/en/docs/tutorial/basic/scroller) 后用于滚动画布，但在某些场景下我们需要用滚轮来缩放画布，所为了避免交互冲突，通常配合修饰键来实现滚轮缩放画布，参考下面配置。

```ts
const graph = new Graph({
  scroller: {
    enabled: true,
    pannable: true,
    pageVisible: true,
    pageBreak: false,
  },
  mousewheel: {
    enabled: true,
    modifiers: ['ctrl', 'meta'],
  },
})
```

## 演示

> 按住 `Command` 键通过滚轮缩放画布。

<iframe src="/demos/tutorial/basic/mousewheel/playground"></iframe>

## 选项

```ts
interface MouseWheelOptions {
  enabled?: boolean
  global?: boolean
  factor?: number
  minScale?: number
  maxScale?: number
  zoomAtMousePosition?: boolean
  modifiers?: string | ('alt' | 'ctrl' | 'meta' | 'shift')[] | null
  guard?: (this: Graph, e: WheelEvent) => boolean
}
```

### enabled

是否开启滚轮缩放交互。

### global

是否为全局事件，设置为 `true` 时滚轮事件绑定在 `document` 上，否则绑定在画布容器上。默认为 `false`。

### factor

滚动缩放因子。默认为 `1.2`。

### minScale

最小的缩放级别。缺省时默认值为：

```ts
graph.options.scaling.min || 0.01
```

### maxScale

最大的缩放级别。缺省时默认值为：

```ts
graph.options.scaling.max || 16
```

### zoomAtMousePosition

是否将鼠标位置作为中心缩放，默认为 `true`。

### modifiers

修饰键(`'alt'`、`'ctrl'`、`'meta'`、`'shift'`)，设置修饰键后需要按下修饰键并滚动鼠标滚轮时才触发画布缩放。通过设置修饰键可以解决默认滚动行为与画布缩放冲突问题。

支持配置单个（如 `'alt'`）或多个（如 `['alt', 'ctrl']`）修饰键，通过数组形式配置的多个修饰键是*或关系*，比如刚刚配置的修饰键表示按下 `'alt'` 或 `'ctrl'`，如果需要更加灵活的配置，可以使用如下这些形式：

- `'alt|ctrl'` 表示按下 `'alt'` 或 `'ctrl'`。
- `'alt&ctrl'` 表示同时按下 `'alt'` 和 `'ctrl'`。
- `'alt|ctrl&shift'` 表示同时按下 `'alt'` 和 `'shift'` 或者同时按下 `'ctrl'` 和 `'shift'`。

### guard

判断一个滚轮事件是否应该被处理，返回 `false` 时对应的事件被忽略。

```ts
const graph = new Graph({
  mousewheel: {
    enabled: true,
    guard(this: Graph, e: WheelEvent) {
      if (e.altKey) { // 当按下 alt 键时，忽略所有滚动事件
        return false
      }
      return true
    },
  },
})
```

## API

### graph.isMouseWheelEnabled()

```sign
isMouseWheelEnabled(): boolean
```

返回是否启用了鼠标滚轮来缩放画布。

### graph.enableMouseWheel()

```sign
enableMouseWheel(): this
```

启用鼠标滚轮缩放画布。

### graph.disableMouseWheel()

```sign
disableMouseWheel(): this
```

禁用鼠标滚轮缩放画布。

### graph.toggleMouseWheel(...)

```sign
toggleMouseWheel(enabled?: boolean): this
```

切换鼠标滚轮缩放画布的启用状态。

<span class="tag-param">参数<span>

| 名称    | 类型    | 必选 | 默认值 | 描述                                                           |
|---------|---------|:----:|--------|--------------------------------------------------------------|
| enabled | boolean |      | -      | 是否启用鼠标滚轮缩放画布，缺省时切换鼠标滚轮缩放画布的启用状态。 |
