---
title: History Undo Redo
order: 4
redirect_from:
  - /en/docs
  - /en/docs/xflow
  - /en/docs/xflow/components
---

Element operations' undo and redo

## Basic Usage

:::info{title="Note"}

The `<History />` component can only be used within the `<XFlow />` component to function properly.

:::

Import the `History` component, and in conjunction with [useHistory](/en/xflow/hooks/useHistory), you can quickly implement undo and redo functionality for element operations.

```tsx
<XFlow>
  ...
  <History color="#F2F7FA" />
</XFlow>
```

<code id="xflow-components-history" src="@/src/xflow/components/history/index.tsx"></code>

## API

### History

For detailed configuration, please refer to [X6 Configuration](/en/tutorial/plugins/history#configuration).
