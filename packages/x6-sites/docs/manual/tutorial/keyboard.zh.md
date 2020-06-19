---
title: 键盘事件 Keyboard
order: 12
redirect_from:
  - /zh/docs
  - /zh/docs/manual
  - /zh/docs/manual/tutorial
---

键盘事件可用于绑定快捷键，如 `Ctrl+C` 复制节点 `Ctrl+V` 粘贴节点，默认键盘事件处于禁用状态，通过如下方式启用。

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

也可以调用 `graph.enableKeyboard()` 和 `graph.disableKeyboard()` 来启用和禁用键盘事件。

```ts
if (graph.isKeyboardEnabled()) {
  graph.disableKeyboard()
} else {
  graph.enableKeyboard()
}
```

## 选项

### global

是否为全局键盘事件，设置为 `true` 时键盘事件绑定在 Document 上，否则绑定在画布容器上。当绑定在画布容器上时，需要容器获得焦点才能触发键盘事件。默认为 `false`。

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


## Playground

<iframe
     src="https://codesandbox.io/embed/x6-playground-keyboard-dqoeq?fontsize=14&hidenavigation=1&theme=light&view=preview"
     style="width:100%; height:500px; border:1px solid #f0f0f0; border-radius: 4px; overflow:hidden;"
     title="x6-playground-keyboard"
     allow="accelerometer; ambient-light-sensor; camera; encrypted-media; geolocation; gyroscope; hid; microphone; midi; payment; usb; vr; xr-spatial-tracking"
     sandbox="allow-autoplay allow-forms allow-modals allow-popups allow-presentation allow-same-origin allow-scripts"
   ></iframe>

## API

- `graph.bindKey`
  ```ts
    bindKey(
      keys: string | string[], 
      callback: (e: KeyboardEvent) => void, 
      action?: 'keypress' | 'keydown' | 'keyup',
    )
  ```
- `graph.unbindKey`
  ```ts
    unbindKey(
      keys: string | string[], 
      action?: 'keypress' | 'keydown' | 'keyup',
    )
  ```
- `graph.isKeyboardEnabled()` 是否启用键盘事件。
- `graph.enableKeyboard()` 启用键盘事件。
- `graph.disableKeyboard()` 禁用键盘事件。
- `graph.toggleKeyboard(enabled?: boolean)` 切换键盘事件的启用状态。
