---
title: Snapline 对齐线
order: 6
redirect_from:
  - /zh/docs
  - /zh/docs/xflow
  - /zh/docs/xflow/components
---

画布对齐线, 移动节点排版的辅助工具

## 基础用法

:::info{title="注意"}

 `<Minimap />` 组件只能在 `<XFlow />` 组件之内方可正常使用

:::

引入 `<Snapline />` 后, 即可开启节点对齐辅助线

```tsx
<XFlow>
  ...
  <Snapline />
</XFlow>
```

<code id="xflow-components-snapline" src="@/src/xflow/components/snapline/index.tsx"></code>

## API

### Snapline

详细配置请参考 [Snapline 配置](/tutorial/plugins/snapline#配置)
