---
title: Menu
order: 2
redirect_from:
  - /en/docs
  - /en/docs/api
  - /en/docs/api/ui
---

Menu component. Generally used in [Menubar](/en/docs/api/ui/menubar), [ContextMenu](/en/docs/api/ui/contextmenu), and [Dropdown](/en/docs/api/ui/dropdown) components.

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

| Parameter | Description | Type | Default Value |
| --- | --- | --- | --- |
| className | Custom style name | string | - |
| hasIcon | Whether to include an Icon | boolean | `false` |
| onClick | Function called when MenuItem is clicked | (name: string) => void | - |
| registerHotkey | Register a hotkey | (hotkey: string, handler: () => void) => void | - |
| unregisterHotkey | Unregister a hotkey | (hotkey: string, handler: () => void) => void | - |

## Menu.Item

| Parameter | Description | Type | Default Value |
| --- | --- | --- | --- |
| className | Custom style name | string | - |
| name | Menu name (unique identifier), used in the Menu's `onClick` callback. If the `name` attribute is not set, `onClick` will not be called. | string | - |
| icon | Menu icon | ReactNode | - |
| text | Menu text | string | - |
| hotkey | Menu hotkey | string | - |
| active | Whether it is active (shows background on mouse hover) | boolean | `false` |
| hidden | Whether it is hidden | boolean | `false` |
| disabled | Whether it is disabled | boolean | `false` |
| onClick | Function called when MenuItem is clicked | () => void | - |
| children | Additional child components | ReactNode | - |

## Menu.SubMenu

| Parameter | Description | Type | Default Value |
| --- | --- | --- | --- |
| className | Custom style name | string | - |
| name | Menu name (unique identifier), used in the Menu's `onClick` callback | string | - |
| icon | Menu icon | ReactNode | - |
| text | Menu text | string | - |
| hotkey | Menu hotkey | string | - |
| active | Whether it is active (shows background on mouse hover and sub-menu) | boolean | `false` |
| hidden | Whether it is hidden | boolean | `false` |
| disabled | Whether it is disabled | boolean | `false` |
| onClick | Function called when MenuItem is clicked | () => void | - |

## Menu.Divider

Menu item divider.
