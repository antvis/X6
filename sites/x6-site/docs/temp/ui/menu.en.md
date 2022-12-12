---
title: Menu
order: 2
redirect_from:
  - /en/docs
  - /en/docs/api
  - /en/docs/api/ui
---

菜单组件。一般在 [Menubar](/en/docs/api/ui/menubar)、[ContextMenu](/en/docs/api/ui/contextmenu)、[Dropdown](/en/docs/api/ui/dropdown) 组件中使用。

<iframe src="/demos/api/ui/menu/basic"></iframe>

```tsx
import { Menu } from '@antv/x6-react-components'
import '@antv/x6-react-components/es/menu/style/index.css'

const MenuItem = Menu.Item
const SubMenu = Menu.SubMenu
const Divider = Menu.Divider

<Menu hasIcon={true} onClick={this.onMenuClick}>
  <MenuItem onClick={this.onMenuItemClick} name="undo" icon={<UndoOutlined />} hotkey="Cmd+Z" text="Undo" />
  <MenuItem name="redo" icon={<RedoOutlined />} hotkey="Cmd+Shift+Z" text="Redo" />
  <Divider />
  <MenuItem name="cut" icon={<ScissorOutlined />} hotkey="Cmd+X" text="Cut" />
  <MenuItem name="copy" icon={<CopyOutlined />} hotkey="Cmd+C" text="Copy" />
  <MenuItem name="paste" icon={<SnippetsOutlined />} hotkey="Cmd+V" disabled={true} text="Paste" />
  <MenuItem name="delete" icon={<DeleteOutlined />} hotkey="Delete" text="Delete" />
  <Divider />
  <SubMenu text="Appearance" icon={<ControlOutlined />}>
    <MenuItem name="zen" icon={<DesktopOutlined />} hotkey="Cmd+K Z" text="Zen Mode" />
    <MenuItem name="fullscreen" icon={<FullscreenOutlined />} hotkey="Cmd+Shift+F" text="Full Screen" />
    <Divider />
    <MenuItem name="side-bar" text="Show Side Bar" />
    <MenuItem name="status-bar" text="Show Status Bar" />
    <MenuItem name="activity-bar" text="Show Activity Bar" />
    <MenuItem name="editor-area" text="Show Editor Area" />
    <MenuItem name="show-panel" text="Show Panel" />
  </SubMenu>
</Menu>
```

## Menu

| 参数             | 说明                     | 类型                                          | 默认值  |
|------------------|------------------------|-----------------------------------------------|---------|
| className        | 自定义的样式名           | string                                        | -       |
| hasIcon          | 是否包含 Icon            | boolean                                       | `false` |
| onClick          | 点击 MenuItem 调用此函数 | (name: string) => void                        | -       |
| registerHotkey   | 注册快捷键               | (hotkey: string, handler: () => void) => void | -       |
| unregisterHotkey | 取消注册快捷键           | (hotkey: string, handler: () => void) => void | -       |

## Menu.Item

| 参数      | 说明                                               | 类型       | 默认值  |
|-----------|--------------------------------------------------|------------|---------|
| className | 自定义的样式名                                     | string     | -       |
| name      | 菜单名称(唯一标识)，在 Menu 的 `onClick` 回调中使用，如果不设置 `name` 属性，`onClick` 将不会被调用。 | string     | -       |
| icon      | 菜单图标                                           | ReactNode  | -       |
| text      | 菜单文本                                           | string     | -       |
| hotkey    | 菜单快捷键                                         | string     | -       |
| active    | 是否被激活(显示鼠标 Hover 的背景)                  | boolean    | `false` |
| hidden    | 是否隐藏                                           | boolean    | `false` |
| disabled  | 是否被禁用                                         | boolean    | `false` |
| onClick   | 点击 MenuItem 调用此函数                           | () => void | -       |
| children  | 额外的子组件                                       | ReactNode  | -       |

## Menu.SubMenu

| 参数      | 说明                                               | 类型       | 默认值  |
|-----------|--------------------------------------------------|------------|---------|
| className | 自定义的样式名                                     | string     | -       |
| name      | 菜单名称(唯一标识)，在 Menu 的 `onClick` 回调用使用 | string     | -       |
| icon      | 菜单图标                                           | ReactNode  | -       |
| text      | 菜单文本                                           | string     | -       |
| hotkey    | 菜单快捷键                                         | string     | -       |
| active    | 是否被激活(显示鼠标 Hover 的背景和子菜单)          | boolean    | `false` |
| hidden    | 是否隐藏                                           | boolean    | `false` |
| disabled  | 是否被禁用                                         | boolean    | `false` |
| onClick   | 点击 MenuItem 调用此函数                           | () => void | -       |

## Menu.Divider

菜单项分割线。
