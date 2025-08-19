---
title: Transform
order: 7
redirect_from:
  - /en/docs
  - /en/docs/xflow
  - /en/docs/xflow/components
---

Adjusting Node Size and Node Rotation Angle

## Basic Usage

:::info{title="Note"}

The `<Transform />` component can only be used properly within the `<XFlow />` component.

:::

Use the `<Transform />` component to enable node adjustment capabilities.

```tsx
<XFlow>
   ...
   <Transform resizing rotating />
</XFlow>
```

By setting the `resizing` and `rotating` properties of the Transform component to `true`, you can enable the ability to adjust the size and rotation angle of nodes. You can also configure the `resizing` and `rotating` properties.

<code id="xflow-components-transform" src="@/src/xflow/components/transform/index.tsx"></code>

## API

### Transform

| Parameter Name | Description | Type | Default Value |
|----------------|-------------|------|---------------|
| resizing       | Configuration for adjusting node size | [Transform.Resizing](/tutorial/plugins/transform#adjust-size) \| `boolean` | - |
| rotating       | Configuration for adjusting node angle | [Transform.Rotating](/tutorial/plugins/transform#adjust-angle) \| `boolean` | - |
