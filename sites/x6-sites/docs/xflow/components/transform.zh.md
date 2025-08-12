---
title: Transform 图形变换
order: 7
redirect_from:
  - /zh/docs
  - /zh/docs/xflow
  - /zh/docs/xflow/components
---

调整节点大小和节点旋转角度

## 基础用法

:::info{title="注意"}

 `<Transform />` 组件只能在 `<XFlow />` 组件之内方可正常使用

:::

使用 `<Transform />` 组件 开启调整节点能力

```tsx
<XFlow>
   ...
   <Transform resizing rotating />
</XFlow>
```

Transform 组件的 `resizing` 和 `rotating` 属性设置为 `true` ，即可开启调整节点大小及旋转角度, 也可以对 `resizing` 和 `rotating` 属性进行配置

<code id="xflow-components-transform" src="@/src/xflow/components/transform/index.tsx"></code>

## API

### Transform

| 参数名 | 描述 | 类型 | 默认值 |
|--------|------|------|-------|
|resizing|调整节点尺寸配置| [Transform.Resizing](/tutorial/plugins/transform#调整尺寸) \| `boolean` | - |
|rotating|调整节点角度配置| [Transform.Rotating](/tutorial/plugins/transform#调整角度) \| `boolean` | - |
