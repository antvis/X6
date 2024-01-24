---
title: Wrapper 包裹组件
order: 1
redirect_from:
  - /zh/docs
  - /zh/docs/xflow
  - /zh/docs/xflow/components
---

画布包裹组件, 只有当画布实例存在的时候，才去渲染 `children`

## 基础用法

```tsx
<Wrapper>
   {children}
</Wrapper>
```

## API

### Wrapper

| 参数名 | 描述 | 类型 | 默认值 |
|--------|------|------|-------|
| children| 渲染元素 | ReactNode | - |
