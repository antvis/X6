---
title: Toolbar
order: 10
redirect_from:
  - /en/docs
  - /en/docs/api
  - /en/docs/api/ui
---

Toolbar.

<iframe src="/demos/api/ui/toolbar/basic"></iframe>

```tsx
import { Menu, Toolbar } from '@antv/x6-react-components'
import '@antv/x6-react-components/es/menu/style/index.css'
import '@antv/x6-react-components/es/toolbar/style/index.css'

const Item = Toolbar.Item
const Group = Toolbar.Group

<Toolbar onClick={this.onClick} extra={<span>>Extra Component</span>}>
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

| Parameter   | Description                          | Type                          | Default Value |
|-------------|--------------------------------------|-------------------------------|---------------|
| className   | Custom style name                    | string                        | -             |
| extra       | Additional components on the right side of the toolbar | ReactNode                    | -             |
| size        | Size of the toolbar                  | `'small'` \| `'big'`         | -             |
| align       | Tool alignment method                | `'left'` \| `'right'`       | -             |
| hoverEffect | Whether to show a rounded background on mouse hover | boolean                       | `false`       |
| onClick     | Callback function when the toolbar is clicked | (name: string, value?: any) => void | -             |

## Toolbar.Group

| Parameter   | Description                          | Type                          | Default Value |
|-------------|--------------------------------------|-------------------------------|---------------|
| className   | Custom style name                    | string                        | -             |

## Toolbar.Item

| Parameter   | Description                          | Type                          | Default Value |
|-------------|--------------------------------------|-------------------------------|---------------|
| className   | Custom style name                    | string                        | -             |
| name        | Name of the tool item                | string                        | -             |
| icon        | Icon for the tool item               | ReactNode                    | -             |
| text        | Displayed text                       | string \| ReactNode          | -             |
| hidden      | Whether to hide                      | boolean                       | -             |
| disabled    | Whether to disable                   | boolean                       | -             |
| active      | Whether it is activated              | boolean                       | -             |
| tooltip     | Tooltip text                         | string                        | -             |
| tooltipProps| Options for the [Tooltip](https://ant.design/components/tooltip-cn/) component | TooltipProps                 | -             |
| tooltipAsTitle | Whether to use the tooltip text as the `title` attribute of the tool item | boolean                       | -             |
| dropdown     | Dropdown menu                       | ReactNode                    | -             |
| dropdownArrow| Whether to show the dropdown menu arrow | boolean                       | -             |
| dropdown     | Options for the [Dropdown](/en/docs/api/ui/dropdown) | Dropdown.Props               | -             |
| onClick     | Callback function when the tool item is clicked | (name?: string) => void      | -             |
