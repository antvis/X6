---
title: 画布平移
order: 4
redirect_from:
  - /zh/docs
  - /zh/docs/api
  - /zh/docs/api/graph
---

## 演示

<code id="api-graph-panning" src="@/src/api/panning/playground/index.tsx"></code>

## 配置

普通画布(未使用 `scroller` 插件)通过开启 `panning` 选项来支持拖拽平移。

:::warning{title=注意} 不要同时使用 `scroller` 和 `panning`，因为两种形式在交互上有冲突。 :::

```ts
const graph = new Graph({
  panning: true,
})

// 等同于
const graph = new Graph({
  panning: {
    enabled: true,
  },
})
```

支持的选项如下：

```ts
interface Options {
  enabled?: boolean
  modifiers?: ModifierKey
  eventTypes?: ('leftMouseDown' | 'rightMouseDown' | 'mouseWheel')[]
}
```

### enabled

是否开启画布平移交互。

### modifiers

拖拽可能和其他操作冲突，此时可以设置 `modifiers` 参数，设置修饰键后需要按下修饰键并点击鼠标才能触发画布拖拽。

`ModifierKey` 的类型定义如下：

```ts
type ModifierKey = string | ('alt' | 'ctrl' | 'meta' | 'shift')[] | null
```

支持以下几种形式：

- `alt` 表示按下 `alt`。
- `[alt, ctrl]` 表示按下 `alt` 或 `ctrl`。
- `alt|ctrl` 表示按下 `alt` 或 `ctrl`。
- `alt&ctrl` 表示同时按下 `alt` 和 `ctrl`。
- `alt|ctrl&shift` 表示同时按下 `alt` 和 `shift` 或者同时按下 `ctrl` 和 `shift`。

### eventTypes

触发画布平移的交互方式。支持三种形式或者他们之间的组合：

- `leftMouseDown`: 按下鼠标左键移动进行拖拽
- `rightMouseDown`: 按下鼠标右键移动进行拖拽
- `mouseWheel`: 使用鼠标滚轮拖拽

## 方法

### isPannable()

```ts
isPannable(): boolean
```

返回是否启用了画布平移交互功能。

### enablePanning()

```ts
enablePanning(): this
```

启用画布平移功能。

### disablePanning()

```ts
disablePanning(): this
```

禁用画布平移功能。

### togglePanning(...)

```ts
togglePanning(enabled?: boolean): this
```

切换画布平移启用状态。参数如下：

| 名称 | 类型 | 必选 | 默认值 | 描述 |
| --- | --- | :-: | --- | --- |
| enabled | boolean |  | - | 是否启用画布平移功能，缺省时切换画布平移的启用状态。 |
