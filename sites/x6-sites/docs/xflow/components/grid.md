---
title: Grid 网格
order: 4
redirect_from:
  - /zh/docs
  - /zh/docs/xflow
  - /zh/docs/xflow/components
---

画布的网格

## 基础用法

:::info{title="注意"}

 `<Grid />` 组件只能在 `<XFlow />` 组件之内方可正常使用

:::

引入  `<Grid />` 组件后, 即可设置 `<XFlowGraph />` 的画布网格

```tsx
<XFlow>
  ...
  <Grid type="mesh" options={{ color: '#ccc', thickness: 1 }} />
</XFlow>
```

## 网格大小

通过设置 `size` 属性可以控制网格大小,网格默认大小为 10px，渲染节点时表示以 10 为最小单位对齐到网格，如位置为 { x: 24, y: 38 }的节点渲染到画布后的实际位置为 { x: 20, y: 40 }， 移动节点时表示每次移动最小距离为 10px。

## 网格隐藏

添加 `visible` 属性即可让网格处于隐藏状态

## 点状网格

`type` 属性为 `dot` 的点状网格, 通过 `options` 属性来设置网格颜色和宽度

<code id="xflow-components-grid-dot" src="@/src/xflow/components/grid/dot/index.tsx"></code>

## 固定网点大小的点状网格

`type` 属性为 `fixedDot` 的固定网点大小的点状网格类型, 通过 `options` 属性来设置网格颜色和宽度。
注意： 当画布的缩放比例小于 1 时，网点大小随着画布缩放比例缩放，当画布缩放比例大于 1 时，网点大小为给定的 thickness 的值。

<code id="xflow-components-grid-fixed-dot" src="@/src/xflow/components/grid/fixed-dot/index.tsx"></code>

## 网状网格

`type` 属性为 `mesh` 的网状网格, 通过 `options` 属性来设置网格颜色和宽度

<code id="xflow-components-grid-mesh" src="@/src/xflow/components/grid/mesh/index.tsx"></code>

## 双线网状网格

`type` 属性为 `doubleMesh` 的双网线网格, 通过 `options` 属性来设置主次网格线的颜色和宽度
<code id="xflow-components-grid-double-mesh" src="@/src/xflow/components/grid/double-mesh/index.tsx"></code>

## API

### Grid

| 参数名 | 描述 | 类型 | 默认值 |
|--------|------|------|-------|
| visible | 网格是否显示 | boolean | `true` |
| size    | 网格大小 | number | 10 |
| type | 网格类型 | `dot` \| `fixedDot` \| `mesh` \| `doubleMesh`  | - |
| options | 网格类型对应的网格参数 | [args](#options-对应的-args-参数如下) \| [args](#options-对应的-args-参数如下)[] | - |

<p id="options-对应的-args-参数如下">options 对应的 args 参数如下:<p>

| 参数名 | 描述 | 类型 | 默认值 |
|--------|------|------|-------|
|color | 网格线颜色 | string | - |
|thickness | 网格线宽度或网点大小 | string | -|
|factor |主次网格线间隔, 仅在 `type` 类型为 `doubleMesh` 时生效  |number | - |
