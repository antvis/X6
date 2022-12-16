---
title: Menubar
order: 8
redirect_from:
  - /en/docs
  - /en/docs/api
  - /en/docs/api/ui
---

菜单栏。

<iframe src="/demos/api/ui/menubar/basic"></iframe>

```tsx
import { Menu, Menubar } from '@antv/x6-react-components'
import '@antv/x6-react-components/es/menu/style/index.css'
import '@antv/x6-react-components/es/menubar/style/index.css'

 <Menubar extra={<div>Extra Component</div>}>
  <Menubar.Item text="File">
    <Menu>...</Menu>
  </Menubar.Item>
  <Menubar.Item text="Edit">
    <Menu>...</Menu>
  </Menubar.Item>
  <Menubar.Item text="View">
    <Menu>...</Menu>
  </Menubar.Item>
  <Menubar.Item text="Help">
    <Menu>...</Menu>
  </Menubar.Item>
</Menubar>
```

## Menubar

| 参数      | 说明                 | 类型      | 默认值 |
|-----------|--------------------|-----------|--------|
| className | 自定义样式名         | string    | -      |
| extra     | 菜单栏右侧的额外组件 | ReactNode | -      |

## Menubar.Item

| 参数   | 说明       | 类型    | 默认值 |
|--------|----------|---------|--------|
| text   | 菜单项文本 | string  | -      |
| hidden | 是否隐藏   | boolean | -      |
