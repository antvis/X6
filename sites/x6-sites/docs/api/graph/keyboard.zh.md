---
title: Keyboard
order: 8
redirect_from:
  - /zh/docs
  - /zh/docs/api
---

## 配置

键盘快捷键，默认禁用。创建画布时通过以下配置启用。

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

创建画布后，也可以调用 [graph.enableKeyboard()](#enablekeyboard) 和 [graph.disableKeyboard()](#disablekeyboard) 来启用和禁用键盘事件。

```ts
if (graph.isKeyboardEnabled()) {
  graph.disableKeyboard()
} else {
  graph.enableKeyboard()
}
```

> 由于示例通过 iframe 嵌入，导致快捷键失效，请点击【在新窗口中打开】按钮去体验。

<iframe src="/demos/tutorial/basic/keyboard/playground"></iframe>

支持的选项如下：

```sign
interface KeyboardOptions {
  enabled?: boolean
  global?: boolean
  format?: (this: Graph, key: string) => string
  guard?: (this: Graph, e: KeyboardEvent) => boolean
}
```

### enabled

是否开启键盘快捷键。

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

## 方法

### bindKey(...)

```sign
bindKey(
  keys: string | string[], 
  callback: (e: KeyboardEvent) => void, 
  action?: 'keypress' | 'keydown' | 'keyup',
): this
```

绑定键盘快捷键，请参考 [Mousetrap](https://github.com/ccampbell/mousetrap) 的使用文档。

<span class="tag-param">参数<span>

| 名称     | 类型                                     | 必选 | 默认值 | 描述      |
|----------|------------------------------------------|:----:|--------|---------|
| keys     | string \| string[]                       |  ✓   |        | 快捷键。   |
| callback | `(e: KeyboardEvent) => void`             |  ✓   |        | 回调函数。 |
| action   | `'keypress'` \| `'keydown'` \| `'keyup'` |      | -      | 触发时机。 |


### unbindKey(...)

```sign
unbindKey(
  keys: string | string[], 
  action?: 'keypress' | 'keydown' | 'keyup',
): this
```

解绑键盘快捷键，请参考 [Mousetrap](https://github.com/ccampbell/mousetrap) 的使用文档。

<span class="tag-param">参数<span>

| 名称   | 类型                                     | 必选 | 默认值 | 描述      |
|--------|------------------------------------------|:----:|--------|---------|
| keys   | string \| string[]                       |  ✓   |        | 快捷键。   |
| action | `'keypress'` \| `'keydown'` \| `'keyup'` |      | -      | 触发时机。 |

### isKeyboardEnabled()

```sign
isKeyboardEnabled(): boolean
```

获取是否启用了键盘事件。

### enableKeyboard()

```sign
enableKeyboard(): this
```

启用键盘事件。

### disableKeyboard()

```sign
disableKeyboard(): this
```

禁用键盘事件。

### toggleKeyboard(...)

```sign
toggleKeyboard(enabled?: boolean): this
```

切换键盘事件的启用状态。

<span class="tag-param">参数<span>

| 名称    | 类型    | 必选 | 默认值 | 描述                                           |
|---------|---------|:----:|--------|----------------------------------------------|
| enabled | boolean |      | -      | 是否启用键盘事件，缺省时切换键盘事件的启用状态。 |