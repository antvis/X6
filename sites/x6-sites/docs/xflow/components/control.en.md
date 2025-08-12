---
title: Control Controller
order: 8
redirect_from:
  - /en/docs
  - /en/docs/xflow
  - /en/docs/xflow/components
---

Canvas Common Operations Controller

## Basic Usage

:::info{title="Note"}

The `<Control />` component can only be used properly within the `<XFlow />` component.

:::

The Control component provides shortcuts for common operations on the canvas.

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

| Parameter Name | Description | Type | Default Value |
| -------------- | ----------- | ---- | ------------- |
| items          | Items displayed by the controller | ControlAction[] | - |
| direction      | Type of display for the controller | `horizontal` ｜ `vertical` | `horizontal` |
| placement      | Direction of the controller's Tooltip display | `top` ｜ `right` ｜ `bottom` ｜ `left` | `top` |

Type of ControlAction
| Parameter Name | Type | Default Value |
| -------------- | ---- | ------------- |
| ControlAction  | ("zoomTo" ｜ "zoomToFit" ｜ "zoomIn" ｜ "zoomOut" ｜ "zoomToOrigin")[] | - |
