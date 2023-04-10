---
title: Panning
order: 1
redirect_from:
  - /zh/docs
  - /zh/docs/api
  - /zh/docs/api/graph
---

## 配置

普通画布(未使用 `scroller` 插件)通过开启 panning 选项来支持拖拽平移。。

```ts
const graph = new Graph({
  panning: true,
});

// 等同于
const graph = new Graph({
  panning: {
    enabled: true,
  },
});
```

支持的选项如下：

```ts
interface Options {
  enabled?: boolean;
  modifiers?: string | ModifierKey[] | null;
  eventTypes?: "leftMouseDown" | "rightMouseDown" | "mouseWheel";
}
```

### enabled

是否开启画布平移交互。

### modifiers

拖拽可能和其他操作冲突，此时可以设置 modifiers 参数，设置修饰键后需要按下修饰键并点击鼠标才能触发画布拖拽。

### eventTypes

触发画布平移的交互方式。

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

| 名称    | 类型    | 必选 | 默认值 | 描述                                               |
|---------|---------|:----:|--------|--------------------------------------------------|
| enabled | boolean |      | -      | 是否启用画布平移功能，缺省时切换画布平移的启用状态。 |
