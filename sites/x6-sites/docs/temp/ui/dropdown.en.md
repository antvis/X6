---
title: Dropdown
order: 4
redirect_from:
  - /en/docs
  - /en/docs/api
  - /en/docs/api/ui
---

下拉菜单。

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

| 参数 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| className | 自定义的样式名 | string | - |
| overlay | 菜单，通常使用 [Menu](/en/docs/api/ui/menu) 组件 | ReactNode | - |
| overlayClassName | 下拉根元素的类名称 | string | - |
| overlayStyle | 下拉根元素的样式 | CSSProperties | - |
| disabled | 菜单是否禁用 | boolean | `false` |
| visible | 菜单是否显示 | boolean | `false` |
| trigger | 触发行为，可选 `hover` \| `click` \| `contextMenu`，可使用数组设置多个触发行为 | string \| string[] | `'hover'` |
| placement | 下拉菜单的位置，可选 `top` `left` `right` `bottom` `topLeft` `topRight` `bottomLeft` `bottomRight` `leftTop` `leftBottom` `rightTop` `rightBottom` | string | `'bottomLeft'` |
| mouseEnterDelay | 当 `trigger` 为 `'hover'`时，鼠标移入后延时多少才显示下拉菜单，单位：秒 | number | `0.15` |
| mouseLeaveDelay | 当 `trigger` 为 `'hover'`时，鼠标移出后延时多少才隐藏下拉菜单，单位：秒 | number | `0.1` |
| getPopupContainer | 菜单渲染父节点。默认渲染到 body 上，如果你遇到菜单滚动定位问题，试试修改为滚动的区域，并相对其定位。 | (triggerNode: Element) => HTMLElement | - |
| onVisibleChange | 菜单显示状态改变时调用 | (visible?: boolean) => void | - |
