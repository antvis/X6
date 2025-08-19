---
title: Minimap
order: 5
redirect_from:
  - /en/docs
  - /en/docs/xflow
  - /en/docs/xflow/components
---

Canvas Minimap

## Basic Usage

:::info{title="Note"}

The `<Minimap />` component can only be used properly within the `<XFlow />` component.

:::

To implement a mini-map feature for the canvas quickly, import the `Minimap` component:

```tsx
<XFlow>
  ...
  <Minimap simple />
</XFlow>
```

<code id="xflow-components-minimap" src="@/src/xflow/components/minimap/index.tsx"></code>

## API

### Minimap

| Parameter Name | Description | Type | Default Value |
|----------------|-------------|------|---------------|
| style          | Semantic structure style | CSSProperties | - |
| classNames     | Semantic structure class | string | - |
| simple         | Whether to display a simple view | boolean | `false` |
| simpleNodeBackground | Background color of nodes in simple view | string | - |
| minScale       | Minimum scale ratio | number | `0.01` |
| maxScale       | Maximum scale ratio | number | `16` |
| width          | Width of the mini-map | number | `300` |
| height         | Height of the mini-map | number | `200` |
| padding        | Padding margin of the mini-map container | number | `10` |
| scalable       | Whether it is scalable | boolean | `true` |
| graphOptions   | Options for creating the mini-map Graph | Graph.Options | `null` |
