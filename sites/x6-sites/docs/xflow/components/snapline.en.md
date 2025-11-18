---
title: Snapline Alignment Lines
order: 6
redirect_from:
  - /en/docs
  - /en/docs/xflow
  - /en/docs/xflow/components
---

Canvas alignment lines, a tool to assist in the layout of moving nodes.

## Basic Usage

:::info{title="Note"}

The `<Minimap />` component can only be used properly within the `<XFlow />` component.

:::

After importing `<Snapline />`, you can enable node alignment guide lines.

```tsx
<XFlow>
  ...
  <Snapline />
</XFlow>
```

<code id="xflow-components-snapline" src="@/src/xflow/components/snapline/index.tsx"></code>

## API

### Snapline

For detailed configuration, please refer to [Snapline Configuration](/en/tutorial/plugins/snapline#configuration).
