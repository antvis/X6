---
title: Keyboard
order: 3
redirect_from:
  - /en/docs
  - /en/docs/tutorial
  - /en/docs/tutorial/plugins
---

:::info{title="This section mainly introduces knowledge related to keyboard shortcuts. By reading, you can learn about"}

- How to bind keyboard shortcuts to the canvas

:::

## Usage

We provide a standalone plugin `keyboard` to use keyboard shortcut functionality, we use it in the code like this:

```ts
import { Graph, Keyboard } from '@antv/x6'

const graph = new Graph({
  background: {
    color: '#F2F7FA',
  },
})
graph.use(
  new Keyboard({
    enabled: true,
  }),
)
```

## Demo

<code id="plugin-keyboard" src="@/src/tutorial/plugins/keyboard/index.tsx"></code>

## Configuration

| Property Name | Type                                      | Default Value | Required | Description                                                                                                                                       |
|---------------|-------------------------------------------|---------------|----------|---------------------------------------------------------------------------------------------------------------------------------------------------|
| global        | boolean                                   | `false`       |          | Whether to use global keyboard events. When set to `true`, keyboard events are bound to `document`; otherwise, they are bound to the canvas container. When bound to the canvas container, the container must gain focus to trigger keyboard events. |
| format        | `(this:Graph, key: string) => string`    | -             |          | Format the key string when binding or unbinding keyboard events.                                                                                   |
| guard         | `(this:Graph,e:KeyboardEvent) => boolean` | -             |          | Determine whether a keyboard event should be processed. If it returns `false`, the corresponding keyboard event is ignored.                       |

The `format` and `guard` configurations are used as follows:

```ts
graph.use(
  new Keyboard({
    enabled: true,
    format(key) {
      return key.replace(/\s/g, '').replace('cmd', 'command')
    },
  }),
)
// The statement below is equivalent to graph.bindKey('command', (e) => { })
graph.bindKey('cmd', (e) => {})

graph.use(
  new Keyboard({
    enabled: true,
    guard(this: Graph, e: KeyboardEvent) {
      if (e.altKey) {
        // Ignore all keyboard events when the alt key is pressed
        return false
      }
      return true
    },
  }),
)
```

## API

### graph.bindKey(...)

```ts
bindKey(
  keys: string | string[],
  callback: (e: KeyboardEvent) => void,
  action?: 'keypress' | 'keydown' | 'keyup',
): this
```

Bind keyboard shortcuts.

### graph.unbindKey(...)

```ts
unbindKey(
  keys: string | string[],
  action?: 'keypress' | 'keydown' | 'keyup',
): this
```

Unbind keyboard shortcuts.

### graph.clearKeys()

```ts
clearKeys(): this
```

Clear all keyboard shortcuts.

### graph.triggerKey()

```ts
triggerKey(
  keys: string,
  action?: 'keypress' | 'keydown' | 'keyup',
): this
```

Manually trigger keyboard shortcuts.

### graph.isKeyboardEnabled()

```ts
isKeyboardEnabled(): boolean
```

Get whether keyboard events are enabled.

### graph.enableKeyboard()

```ts
enableKeyboard(): this
```

Enable keyboard events.

### graph.disableKeyboard()

```ts
disableKeyboard(): this
```

Disable keyboard events.

### graph.toggleKeyboard(...)

```ts
toggleKeyboard(enabled?: boolean): this
```

Toggle the enabled state of keyboard events. The parameters are as follows:

| Name     | Type    | Required | Default Value | Description                                           |
|----------|---------|:--------:|---------------|------------------------------------------------------|
| enabled  | boolean |          | -             | Whether to enable keyboard events. If omitted, it toggles the enabled state of keyboard events. |
