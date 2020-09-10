---
title: 键盘快捷键 Keyboard
order: 14
redirect_from:
  - /zh/docs
  - /zh/docs/tutorial
  - /zh/docs/tutorial/basic
---

键盘事件可用于绑定快捷键，如 `Ctrl+C` 复制节点 `Ctrl+V` 粘贴节点，创建画布时通过以下配置启用。

```ts
const graph = new Graph({
  keyboard: true,
})

// 等同于
const graph = new Graph({
  keyboard: {
    enabled: true,
  },
})
```

创建画布后，也可以调用 [graph.enableKeyboard()](#graphenablekeyboard) 和 [graph.disableKeyboard()](#graphdisablekeyboard) 来启用和禁用键盘事件。

```ts
if (graph.isKeyboardEnabled()) {
  graph.disableKeyboard()
} else {
  graph.enableKeyboard()
}
```

## 演示

> 由于示例通过 iframe 嵌入，导致快捷键失效，请点击【在新窗口中打开】按钮去体验。

<iframe src="/demos/tutorial/basic/keyboard/playground"></iframe>

## 选项

### global

是否为全局键盘事件，设置为 `true` 时键盘事件绑定在 `Document` 上，否则绑定在画布容器上。当绑定在画布容器上时，需要容器获得焦点才能触发键盘事件。默认为 `false`。

### format

绑定或解绑键盘事件时，格式化按键字符串。

```ts
const graph = new Graph({
  keyboard: {
    enabled: true,
    format(key) { 
      return key
      .replace(/\s/g, '')
      .replace('cmd', 'command')
    },
  },
})

graph.bindKey('cmd', (e) => { })
// 被格式化后等同于 graph.bindKey('command', (e) => { })
```

### guard

判断一个键盘事件是否应该被处理，返回 `false` 时对应的键盘事件被忽略。

```ts
const graph = new Graph({
  keyboard: {
    enabled: true,
    guard(this: Graph, e: KeyboardEvent) {
      if (e.altKey) { // 当按下 alt 键时，忽略所有键盘事件
        return false 
      }
      return true
    },
  },
})
```

## API

### graph.bindKey(...)

```sign
bindKey(
  keys: string | string[], 
  callback: (e: KeyboardEvent) => void, 
  action?: 'keypress' | 'keydown' | 'keyup',
): this
```

绑定快捷键。

### graph.unbindKey(...)

```sign
unbindKey(
  keys: string | string[], 
  action?: 'keypress' | 'keydown' | 'keyup',
): this
```

解绑快捷键。

### graph.isKeyboardEnabled()

```sign
isKeyboardEnabled(): boolean
```

获取是否启用了键盘事件。

### graph.enableKeyboard()

```sign
enableKeyboard(): this
```

启用键盘事件。

### graph.disableKeyboard()

```sign
disableKeyboard(): this
```

禁用键盘事件。

### graph.toggleKeyboard(enabled?: boolean)

切换键盘事件的启用状态。

<span class="tag-param">参数<span>

| 名称    | 类型    | 必选 | 默认值 | 描述                                           |
|---------|---------|:----:|--------|----------------------------------------------|
| enabled | boolean |      | -      | 是否启用键盘事件，缺省时切换键盘事件的启用状态。 |
