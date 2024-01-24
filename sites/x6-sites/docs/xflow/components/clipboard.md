---
title: Clipboard 复制粘贴
order: 5
redirect_from:
  - /zh/docs
  - /zh/docs/xflow
  - /zh/docs/xflow/components
---

复制粘贴节点和边

## 基础用法

:::info{title="注意"}

 `<Clipboard />` 组件只能在 `<XFlow />` 组件之内方可正常使用

:::

在 XFlow 组件下引入该组件，即可使画布开启复制粘贴节点和边的能力

配合 [useClipboard](/xflow/hooks/use-clipboard) 可快速实现复制粘贴功能

```tsx
<XFlow>
  ...
  <Clipboard />
</XFlow>
```

<code id="xflow-components-clipboard" src="@/src/xflow/components/clipboard/index.tsx"></code>

## API

### Clipboard

| 参数名 | 描述 | 类型 | 默认值 |
|--------|------|------|-------|
| useLocalStorage| 开启后被复制的节点/边同时被保存到 `localStorage` 中，浏览器刷新或者关闭后重新打开，复制/粘贴也能正常工作 | boolean | `false` |
