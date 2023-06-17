---
title: Toolbar
order: 10
redirect_from:
  - /en/docs
  - /en/docs/api
  - /en/docs/api/ui
---

工具栏。

<iframe src="/demos/api/ui/toolbar/basic"></iframe>

```tsx
import { Menu, Toolbar } from '@antv/x6-react-components'
import '@antv/x6-react-components/es/menu/style/index.css'
import '@antv/x6-react-components/es/toolbar/style/index.css'

const Item = Toolbar.Item
const Group = Toolbar.Group

<Toolbar onClick={this.onClick} extra={<span>Extra Component</span>}>
  <Group>
    <Item name="zoomIn" tooltip="Zoom In (Cmd +)" icon={<ZoomInOutlined />} />
    <Item name="zoomOut" tooltip="Zoom Out (Cmd -)" icon={<ZoomOutOutlined />} />
  </Group>
  <Group>
    <Item name="undo" tooltip="Undo (Cmd + Z)" icon={<UndoOutlined />} />
    <Item name="redo" tooltip="Redo (Cmd + Shift + Z)" icon={<RedoOutlined />} />
  </Group>
  <Group>
    <Item name="delete" icon={<DeleteOutlined />} disabled={true} tooltip="Delete (Delete)" />
  </Group>
  <Group>
    <Item name="bold" icon={<BoldOutlined />} active={true} tooltip="Bold (Cmd + B)" />
    <Item name="italic" icon={<ItalicOutlined />} tooltip="Italic (Cmd + I)" />
    <Item name="strikethrough" icon={<StrikethroughOutlined />} tooltip="Strikethrough (Cmd + Shift + x)" />
    <Item name="underline" icon={<UnderlineOutlined />} tooltip="Underline (Cmd + U)" />
  </Group>
</Toolbar>
```

## Toolbar

| 参数 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| className | 自定义样式名 | string | - |
| extra | 工具栏右侧的额外组件 | ReactNode | - |
| size | 工具栏大小 | `'small'` \| `'big'` | - |
| align | 工具对齐方式 | `'left'` \| `'right'` | - |
| hoverEffect | 鼠标 Hover 时是否显示一个圆角背景 | boolean | `false` |
| onClick | 点击工具栏的回调函数 | (name: string, value?: any) => void | - |

## Toolbar.Group

| 参数      | 说明         | 类型   | 默认值 |
| --------- | ------------ | ------ | ------ |
| className | 自定义样式名 | string | -      |

## Toolbar.Item

| 参数 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| className | 自定义样式名 | string | - |
| name | 工具项名称 | string | - |
| icon | 工具项图标 | ReactNode | - |
| text | 显示的文本 | string \| ReactNode | - |
| hidden | 是否隐藏 | boolean | - |
| disabled | 是否禁用 | boolean | - |
| active | 是否被激活 | boolean | - |
| tooltip | 工具提示文本 | string | - |
| tooltipProps | [Tooltip](https://ant.design/components/tooltip-cn/) 组件的选项 | TooltipProps | - |
| tooltipAsTitle | 是否将提示文本作为工具项的 `title` 属性 | boolean | - |
| dropdown | 下拉菜单 | ReactNode | - |
| dropdownArrow | 是否显示下拉菜单箭头 | boolean | - |
| dropdown | [下拉菜单](/en/docs/api/ui/dropdown)的选项 | Dropdown.Props | - |
| onClick | 点击工具项的回调函数 | (name?: string) => void | - |
