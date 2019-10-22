import React from 'react'
import { Menubar, Menu } from '../../components'
import './_layout.less'

const MenuItem = Menu.Item
const Divider = Menu.Divider
// const SubMenu = Menu.SubMenu
const MenubarItem = Menubar.Item

const Layout: React.FC = props => {
  return (
    <div className="x6-editor">
      <div className="x6-editor-menubar">
        <Menubar>
          <MenubarItem text="File">
            <Menu>
              <MenuItem>New...</MenuItem>
              <MenuItem>Open...</MenuItem>
              <Divider />
              <MenuItem>Save</MenuItem>
              <MenuItem>Save as...</MenuItem>
              <Divider />
              <MenuItem>Import...</MenuItem>
              <MenuItem>Export...</MenuItem>
              <Divider />
              <MenuItem>Page Setup...</MenuItem>
              <MenuItem>Print...</MenuItem>
            </Menu>
          </MenubarItem>
          <MenubarItem text="Edit">
            <Menu>
              <MenuItem hotkey="Cmd+Z">Undo</MenuItem>
              <MenuItem hotkey="Cmd+Shift+Z">Redo</MenuItem>
              <Divider />
              <MenuItem hotkey="Cmd+X">Cut</MenuItem>
              <MenuItem hotkey="Cmd+C">Copy</MenuItem>
              <MenuItem hotkey="Cmd+V">Paste</MenuItem>
              <MenuItem hotkey="Delete">Delete</MenuItem>
              <MenuItem hotkey="Cmd+D">Duplicate</MenuItem>
              <Divider />
              <MenuItem hotkey="Cmd+Shift+I">Select Nodes</MenuItem>
              <MenuItem hotkey="Cmd+Shift+E">Select Edges</MenuItem>
              <MenuItem hotkey="Cmd+A">Select All</MenuItem>
            </Menu>
          </MenubarItem>
          <MenubarItem text="View">
            <Menu>
              <MenuItem>Help</MenuItem>
              <MenuItem>About</MenuItem>
            </Menu>
          </MenubarItem>
          <MenubarItem text="Arrange">
            <Menu>
              <MenuItem hotkey='Cmd+Shift+F'>To Front</MenuItem>
              <MenuItem hotkey='Cmd+Shift+B'>To Back</MenuItem>
              <Divider />
              <MenuItem>Direction</MenuItem>
              <MenuItem hotkey='Cmd+R'>Rotate shape only by 90° / Reverse</MenuItem>
              <Divider />
              <MenuItem>Align</MenuItem>
              <MenuItem>Distribute</MenuItem>
            </Menu>
          </MenubarItem>
          <MenubarItem text="Help">
            <Menu>
              <MenuItem>Help</MenuItem>
              <MenuItem>About</MenuItem>
            </Menu>
          </MenubarItem>
        </Menubar>
      </div>
      <div className="x6-editor-toolbar">
        menubar
      </div>
      <div className="x6-editor-wrap">
        <div className="x6-editor-sidebar">
          sidebar
        </div>
        <div className="x6-editor-graph">
          {props.children}
        </div>
        <div className="x6-editor-format">
          format
        </div>
      </div>
      <div className="x6-editor-footer">
        footer
      </div>
    </div>
  )
}

export default Layout
