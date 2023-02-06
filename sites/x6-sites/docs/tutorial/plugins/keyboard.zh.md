---
title: 快捷键
order: 3
redirect_from:
  - /zh/docs
  - /zh/docs/tutorial
  - /zh/docs/tutorial/plugins
---

:::info{title=在本章节中，主要介绍快捷键相关的知识，通过阅读，你可以了解到：}

- 如何为画布绑定快捷键
  :::

## 使用

我们提供了一个独立的插件包 `@antv/x6-plugin-keyboard` 来使用快捷键功能。

```shell
# npm
$ npm install @antv/x6-plugin-keyboard --save

# yarn
$ yarn add @antv/x6-plugin-keyboard
```

然后我们在代码中这样使用：

```ts
import { Keyboard } from "@antv/x6-plugin-keyboard";

const graph = new Graph({
  background: {
    color: "#F2F7FA",
  },
});
graph.use(
  new Keyboard({
    enabled: true,
  })
);
```

## 演示

<code id="plugin-keyboard" src="@/src/tutorial/plugins/keyboard/index.tsx"></code>

## 配置

| 属性名  | 类型                                      | 默认值  | 必选 | 描述                                                                                                                                           |
| ------- | ----------------------------------------- | ------- | ---- | ---------------------------------------------------------------------------------------------------------------------------------------------- |
| enabled | boolean                                   | `false` |      | 是否开启快捷键功能                                                                                                                             |
| global  | boolean                                   | `false` |      | 是否为全局键盘事件，设置为 `true` 时键盘事件绑定在 `document` 上，否则绑定在画布容器上。当绑定在画布容器上时，需要容器获得焦点才能触发键盘事件 |
| format  | `(this:Graph, key: string) => string`     | -       |      | 绑定或解绑键盘事件时，格式化按键字符串                                                                                                         |
| guard   | `(this:Graph,e:KeyboardEvent) => boolean` | -       |      | 判断一个键盘事件是否应该被处理，返回 `false` 时对应的键盘事件被忽略                                                                            |

`format` 和 `guard` 配置使用如下：

```ts
graph.use(
  new Keyboard({
    enabled: true,
    format(key) {
      return key.replace(/\s/g, "").replace("cmd", "command");
    },
  })
);
// 下面语句被格式化后等同于 graph.bindKey('command', (e) => { })
graph.bindKey("cmd", (e) => {});

graph.use(
  new Keyboard({
    enabled: true,
    guard(this: Graph, e: KeyboardEvent) {
      if (e.altKey) {
        // 当按下 alt 键时，忽略所有键盘事件
        return false;
      }
      return true;
    },
  })
);
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

### graph.clearKeys()

```sign
clearKeys(): this
```

清除所有快捷键。

### graph.triggerKey()

```sign
triggerKey(
  keys: string,
  action?: 'keypress' | 'keydown' | 'keyup',
): this
```

手动触发快捷键。

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

### graph.toggleKeyboard(...)

```sign
toggleKeyboard(enabled?: boolean): this
```

切换键盘事件的启用状态。参数如下：

| 名称    | 类型    | 必选 | 默认值 | 描述                                             |
| ------- | ------- | :--: | ------ | ------------------------------------------------ |
| enabled | boolean |      | -      | 是否启用键盘事件，缺省时切换键盘事件的启用状态。 |
