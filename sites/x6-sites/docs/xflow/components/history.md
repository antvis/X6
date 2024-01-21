---
title: History 撤销重做
order: 6
redirect_from:
  - /zh/docs
  - /zh/docs/xflow
  - /zh/docs/xflow/components
---

元素操作的撤销与重做

## 基础用法

:::info{title="注意"}

 `<History />` 组件只能在 `<XFlow />` 组件之内方可正常使用

:::

引入 `History` 组件, 配合 [useHistory](/xflow/hooks/use-history) 可快速实现元素操作的撤销与重做功能

```tsx
<XFlow>
  ...
  <History color="#F2F7FA" />
</XFlow>
```

<code id="xflow-components-history" src="@/src/xflow/components/history/index.tsx"></code>

## API

### History

详细配置请参考 [X6 配置](/tutorial/plugins/history#配置)
