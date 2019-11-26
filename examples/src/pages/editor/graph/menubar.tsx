import React from 'react'
import { Menubar, Menu } from '../../../components'

const MenuItem = Menu.Item
const SubMenu = Menu.SubMenu
const Divider = Menu.Divider
const MenubarItem = Menubar.Item

export class GraphMenubar extends React.PureComponent {
  render() {
    return (
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
            <MenuItem hotkey="Cmd+Shift+P">Format Pannel</MenuItem>
            <MenuItem hotkey="Cmd+Shift+M">MiniMap</MenuItem>
            <MenuItem hotkey="Cmd+Shift+L">Layers</MenuItem>
            <Divider />
            <MenuItem hotkey="Cmd+Shift+G">Grid</MenuItem>
            <MenuItem>Guides</MenuItem>
            <Divider />
            <MenuItem hotkey="Cmd+H">Reset View</MenuItem>
            <MenuItem hotkey="Cmd + (Numpad)">Zoom In</MenuItem>
            <MenuItem hotkey="Cmd - (Numpad)">Zoom Out</MenuItem>
          </Menu>
        </MenubarItem>
        <MenubarItem text="Arrange">
          <Menu>
            <MenuItem hotkey='Cmd+Shift+F'>To Front</MenuItem>
            <MenuItem hotkey='Cmd+Shift+B'>To Back</MenuItem>
            <Divider />
            <SubMenu text="Direction">
              <MenuItem>Flip Horizontal</MenuItem>
              <MenuItem>Flip Vertical</MenuItem>
              <Divider />
              <MenuItem>Rotation</MenuItem>
            </SubMenu>
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
    )
  }
}
