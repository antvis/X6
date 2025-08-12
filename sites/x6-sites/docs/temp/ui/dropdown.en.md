---
title: Dropdown
order: 4
redirect_from:
  - /en/docs
  - /en/docs/api
  - /en/docs/api/ui
---

Dropdown menu

<iframe src="/demos/api/ui/dropdown/basic"></iframe>

```tsx
import { Menu, Dropdown } from '@antv/x6-react-components'
import '@antv/x6-react-components/es/menu/style/index.css'
import '@antv/x6-react-components/es/dropdown/style/index.css'

const menu = (
  <Menu>
    <Menu.Item key="1">1st menu item</Menu.Item>
    <Menu.Item key="2">2nd menu item</Menu.Item>
    <Menu.Item key="3">3rd menu item</Menu.Item>
  </Menu>
)

<Dropdown overlay={menu}>
  <a href="#">Hover me</a>
</Dropdown>

<Dropdown overlay={menu} trigger={['contextMenu']}>
  <span style={{ userSelect: 'none' }}>Right Click on Me</span>
</Dropdown>
```

## Dropdown

| Parameter | Description | Type | Default Value |
| --- | --- | --- | --- |
| className | Custom style name | string | - |
| overlay | Menu, typically using the [Menu](/en/docs/api/ui/menu) component | ReactNode | - |
| overlayClassName | Class name for the dropdown root element | string | - |
| overlayStyle | Style for the dropdown root element | CSSProperties | - |
| disabled | Whether the menu is disabled | boolean | `false` |
| visible | Whether the menu is displayed | boolean | `false` |
| trigger | Trigger behavior, options are `hover` \| `click` \| `contextMenu`, can use an array to set multiple trigger behaviors | string \| string[] | `'hover'` |
| placement | Position of the dropdown menu, options are `top` `left` `right` `bottom` `topLeft` `topRight` `bottomLeft` `bottomRight` `leftTop` `leftBottom` `rightTop` `rightBottom` | string | `'bottomLeft'` |
| mouseEnterDelay | When `trigger` is `'hover'`, the delay in seconds before the dropdown menu is displayed after mouse enters | number | `0.15` |
| mouseLeaveDelay | When `trigger` is `'hover'`, the delay in seconds before the dropdown menu is hidden after mouse leaves | number | `0.1` |
| getPopupContainer | Parent node for rendering the menu. By default, it renders to the body. If you encounter positioning issues with scrolling, try changing it to the scrolling area and positioning it relative to that. | (triggerNode: Element) => HTMLElement | - |
| onVisibleChange | Called when the visibility state of the menu changes | (visible?: boolean) => void | - |
