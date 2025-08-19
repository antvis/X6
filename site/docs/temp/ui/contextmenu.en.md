---
title: ContextMenu
order: 6
redirect_from:
  - /en/docs
  - /en/docs/api
  - /en/docs/api/ui
---

Context Menu.

<iframe src="/demos/api/ui/contextmenu/basic"></iframe>

```tsx
import { Menu, ContextMenu } from '@antv/x6-react-components'
import '@antv/x6-react-components/es/menu/style/index.css'
import '@antv/x6-react-components/es/dropdown/style/index.css'
import '@antv/x6-react-components/es/context-menu/style/index.css'

const menu = (
  <Menu>
    <Menu.Item key="1">1st menu item</Menu.Item>
    <Menu.Item key="2">2nd menu item</Menu.Item>
    <Menu.Item key="3">3rd menu item</Menu.Item>
  </Menu>
)

<ContextMenu menu={menu}>
  <div
    style={{
      width: 560,
      height: 240,
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      background: '#f5f5f5',
      userSelect: 'none',
    }}
  >
    Right Click On Me
  </div>
</ContextMenu>
```

## ContextMenu

| Parameter | Description | Type | Default Value |
| --- | --- | --- | --- |
| className | Custom style name | string | - |
| menu | Menu [Menu](/en/docs/api/ui/menu) component | Menu | - |
| overlayClassName | Class name for the dropdown root element | string | - |
| overlayStyle | Style for the dropdown root element | CSSProperties | - |
| disabled | Whether the menu is disabled | boolean | `false` |
| visible | Whether the menu is displayed | boolean | `false` |
| getPopupContainer | The parent node for rendering the menu. By default, it renders to the body. If you encounter positioning issues with scrolling, try changing it to the scrolling area and positioning it relative to that. | (triggerNode: Element) => HTMLElement | - |
| onVisibleChange | Called when the visibility state of the menu changes | (visible?: boolean) => void | - |
