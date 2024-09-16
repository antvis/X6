---
title: Grid
order: 2
redirect_from:
  - /en/docs
  - /en/docs/xflow
  - /en/docs/xflow/components
---

Canvas Grid

## Basic Usage

:::info{title="Note"}

The `<Grid />` component can only be used properly within the `<XFlow />` component.

:::

After importing the `<Grid />` component, you can set the canvas grid for `<XFlowGraph />`.

```tsx
<XFlow>
  ...
  <Grid type="mesh" options={{ color: '#ccc', thickness: 1 }} />
</XFlow>
```

## Grid Size

You can control the grid size by setting the `size` property. The default grid size is 10px, which means that when rendering nodes, they will align to the grid with 10 as the minimum unit. For example, a node positioned at { x: 24, y: 38 } will actually render at { x: 20, y: 40 } on the canvas. When moving nodes, the minimum distance moved will be 10px.

## Hide Grid

You can hide the grid by adding the `visible` property.

## Dot Grid

The dot grid, with the `type` property set to `dot`, allows you to set the grid color and width through the `options` property.

<code id="xflow-components-grid-dot" src="@/src/xflow/components/grid/dot/index.tsx"></code>

## Fixed Dot Size Grid

The fixed dot size grid, with the `type` property set to `fixedDot`, allows you to set the grid color and width through the `options` property. Note: When the canvas zoom level is less than 1, the dot size scales with the canvas zoom level. When the canvas zoom level is greater than 1, the dot size is fixed to the given thickness value.

<code id="xflow-components-grid-fixed-dot" src="@/src/xflow/components/grid/fixed-dot/index.tsx"></code>

## Mesh Grid

The mesh grid, with the `type` property set to `mesh`, allows you to set the grid color and width through the `options` property.

<code id="xflow-components-grid-mesh" src="@/src/xflow/components/grid/mesh/index.tsx"></code>

## Double Mesh Grid

The double mesh grid, with the `type` property set to `doubleMesh`, allows you to set the color and width of the primary and secondary grid lines through the `options` property.

<code id="xflow-components-grid-double-mesh" src="@/src/xflow/components/grid/double-mesh/index.tsx"></code>

## API

### Grid

| Parameter Name | Description | Type | Default Value |
|----------------|-------------|------|---------------|
| visible        | Whether the grid is displayed | boolean | `true` |
| size           | Grid size | number | 10 |
| type           | Grid type | `dot` \| `fixedDot` \| `mesh` \| `doubleMesh` | - |
| options        | Grid parameters corresponding to the grid type | [args](#options-args-parameters) \| [args](#options-args-parameters)[] | - |

<p id="options-args-parameters">The options corresponding to the args parameters are as follows:</p>

| Parameter Name | Description | Type | Default Value |
|----------------|-------------|------|---------------|
| color          | Grid line color | string | - |
| thickness      | Grid line width or dot size | string | - |
| factor         | Interval between primary and secondary grid lines, only effective when `type` is `doubleMesh` | number | - |
