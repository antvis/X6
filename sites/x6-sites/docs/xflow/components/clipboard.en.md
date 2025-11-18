---
title: Clipboard Copy and Paste
order: 3
redirect_from:
  - /en/docs
  - /en/docs/xflow
  - /en/docs/xflow/components
---

Copy and paste nodes and edges

## Basic Usage

:::info{title="Note"}

The `<Clipboard />` component can only be used properly within the `<XFlow />` component.

:::

By importing this component under the XFlow component, you can enable the ability to copy and paste nodes and edges on the canvas.

Combined with [useClipboard](/en/xflow/hooks/useClipboard), you can quickly implement copy and paste functionality.

```tsx
<XFlow>
  ...
  <Clipboard />
</XFlow>
```

<code id="xflow-components-clipboard" src="@/src/xflow/components/clipboard/index.tsx"></code>

## API

### Clipboard

| Parameter Name      | Description                                                                 | Type    | Default Value |
|---------------------|-----------------------------------------------------------------------------|---------|---------------|
| useLocalStorage     | When enabled, the copied nodes/edges are also saved to `localStorage`, allowing copy/paste to work even after the browser is refreshed or reopened. | boolean | `false`       |
