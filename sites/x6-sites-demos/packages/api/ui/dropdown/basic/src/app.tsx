import React from 'react'
import { Menu, Dropdown } from '@antv/x6-components'
import '@antv/x6-components/es/menu/style/index.css'
import '@antv/x6-components/es/dropdown/style/index.css'

const menu = (
  <Menu>
    <Menu.Item key="1">1st menu item</Menu.Item>
    <Menu.Item key="2">2nd menu item</Menu.Item>
    <Menu.Item key="3">3rd menu item</Menu.Item>
  </Menu>
)

export default class Example extends React.Component {
  render() {
    return (
      <div style={{ padding: '24px 0 120px 24px' }}>
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
