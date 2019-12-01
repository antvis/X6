import React from 'react'
import { Menu, Dropdown } from '@antv/x6-components'

const menu = (
  <Menu>
    <Menu.Item key="1">1st menu item</Menu.Item>
    <Menu.Item key="2">2nd menu item</Menu.Item>
    <Menu.Item key="3">3rd menu item</Menu.Item>
  </Menu>
)

export default class DropdownExample extends React.PureComponent {
  render() {
    return (
      <div style={{ height: '100%' }}>
        <div>
          <Dropdown overlay={menu}>
            <a href="#">Hover me</a>
          </Dropdown>
        </div>
        <div style={{ marginTop: 24 }}>
          <Dropdown overlay={menu} trigger={['contextMenu']}>
            <span style={{ userSelect: 'none' }}>Right Click on Me</span>
          </Dropdown>
        </div>
      </div>
    )
  }
}
