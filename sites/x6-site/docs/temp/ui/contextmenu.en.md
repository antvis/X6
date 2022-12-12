---
title: ContextMenu
order: 6
redirect_from:
  - /en/docs
  - /en/docs/api
  - /en/docs/api/ui
---

上下文菜单。

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


| 参数              | 说明                                                                                            | 类型                                  | 默认值  |
|-------------------|-----------------------------------------------------------------------------------------------|---------------------------------------|---------|
| className         | 自定义的样式名                                                                                  | string                                | -       |
| menu              | 菜单 [Menu](/en/docs/api/ui/menu) 组件                                                                        | Menu                                  | -       |
| overlayClassName  | 下拉根元素的类名称                                                                              | string                                | -       |
| overlayStyle      | 下拉根元素的样式                                                                                | CSSProperties                         | -       |
| disabled          | 菜单是否禁用                                                                                    | boolean                               | `false` |
| visible           | 菜单是否显示                                                                                    | boolean                               | `false` |
| getPopupContainer | 菜单渲染父节点。默认渲染到 body 上，如果你遇到菜单滚动定位问题，试试修改为滚动的区域，并相对其定位。 | (triggerNode: Element) => HTMLElement | -       |
| onVisibleChange   | 菜单显示状态改变时调用                                                                          | (visible?: boolean) => void           | -       |
