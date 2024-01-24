---
title: Minimap 小地图
order: 7
redirect_from:
  - /zh/docs
  - /zh/docs/xflow
  - /zh/docs/xflow/components
---

画布小地图

## 基础用法

:::info{title="注意"}

 `<Minimap />` 组件只能在 `<XFlow />` 组件之内方可正常使用

:::

引入 `Minimap` 组件, 可快速实现画布的小地图功能

```tsx
<XFlow>
  ...
  <Minimap simple />
</XFlow>
```

<code id="xflow-components-minimap" src="@/src/xflow/components/minimap/index.tsx"></code>

## API

### Minimap

| 参数名 | 描述 | 类型 | 默认值 |
|--------|------|------|-------|
| style | 语义化结构 style | CSSProperties | - |
| classNames | 语义化结构 class | string | - |
| simple|是否展示简单试图|boolean|`false`|
| simpleNodeBackground|简单视图下的节点背景色|string|-|
| minScale|最小缩放比例|number  |`0.01` |
|maxScale|最大缩放比例|number  |`16` |
|width|小地图的宽度|number|`300`|
|height|小地图的高度 |number|`200`|
|padding|小地图容器的 padding 边距|number|`10`|
|scalable|是否可缩放 |boolean|`true`|
|graphOptions|创建小地图 Graph 的选项|Graph.Options|`null`|
