---
title: Menubar
order: 8
redirect_from:
  - /en/docs
  - /en/docs/api
  - /en/docs/api/ui
---

Menu Bar.

<iframe src="/demos/api/ui/menubar/basic"></iframe>

```tsx
import { Menu, Menubar } from '@antv/x6-react-components'
import '@antv/x6-react-components/es/menu/style/index.css'
import '@antv/x6-react-components/es/menubar/style/index.css'
;<Menubar extra={<div>Extra Component</div>}>
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

| Parameter  | Description                     | Type      | Default Value |
|------------|---------------------------------|-----------|---------------|
| className  | Custom style name               | string    | -             |
| extra      | Additional component on the right side of the menu bar | ReactNode | -             |

## Menubar.Item

| Parameter | Description       | Type    | Default Value |
|-----------|-------------------|---------|---------------|
| text      | Menu item text    | string  | -             |
| hidden    | Whether to hide    | boolean | -             |
