---
title: Control 控制器
order: 10
redirect_from:
  - /zh/docs
  - /zh/docs/xflow
  - /zh/docs/xflow/components
---

画布常用操作控制器

## 基础用法

:::info{title="注意"}

 `<Control />` 组件只能在 `<XFlow />` 组件之内方可正常使用

:::

Control 组件对画布的常用操作提供了快捷方式

```tsx
<XFlow>
  ...
  <Control
    items={['zoomOut', 'zoomTo', 'zoomIn', 'zoomToFit', 'zoomToOrigin']}
  />
</XFlow>
```

<code id="xflow-components-control" src="@/src/xflow/components/control/index.tsx"></code>

## API

### Control

| 参数名 | 描述 | 类型 | 默认值 |
| ------ | ---- | ---- | ------ |
| items | 控制器展示的items | ControlAction[] | - |
| direction | 控制器展示的类型 | `horizontal` ｜ `vertical` | `horizontal` |
| placement | 控制器Tooltip展示的方向 | `top` ｜ `right` ｜ `bottom` ｜ `left` | `top` |

ControlAction 的类型
| 参数名 | 类型 | 默认值 |
| ------ | ---- | ------ |
| ControlAction | ("zoomTo" ｜ "zoomToFit" ｜ "zoomIn" ｜"zoomOut" ｜ "zoomToOrigin")[] | - |
