import React from 'react'
import { message } from 'antd'
import { Toolbar, Menu } from '@antv/x6-components'

const Item = Toolbar.Item
const Group = Toolbar.Group

export default class ToolbarExample extends React.PureComponent {
  onClick = (name: string) => {
    message.success(`${name} clicked`, 10)
  }

  onItemClick = () => {
    this.onClick('undo')
  }

  renderZoomDropdown() {
    const MenuItem = Menu.Item
    const Divider = Menu.Divider

    return (
      <Menu>
        <MenuItem name="resetView" hotkey="Cmd+H">
          Reset View
        </MenuItem>
        <MenuItem name="fitWindow" hotkey="Cmd+Shift+H">
          Fit Window
        </MenuItem>
        <Divider />
        <MenuItem name="25">25%</MenuItem>
        <MenuItem name="50">50%</MenuItem>
        <MenuItem name="75">75%</MenuItem>
        <MenuItem name="100">100%</MenuItem>
        <MenuItem name="125">125%</MenuItem>
        <MenuItem name="150">150%</MenuItem>
        <MenuItem name="200">200%</MenuItem>
        <MenuItem name="300">300%</MenuItem>
        <MenuItem name="400">400%</MenuItem>
      </Menu>
    )
  }

  render() {
    return (
      <div style={{ height: '100%' }}>
        <div style={{ background: '#f5f5f5', paddingRight: 16 }}>
          <Toolbar
            hoverEffect={true}
            size="big"
            onClick={this.onClick}
            extra={<span>Extra Component</span>}
          >
            <Group>
              <Item
                name="zoom"
                tooltipAsTitle={true}
                tooltip="Zoom (Alt+Mousewheel)"
                dropdown={this.renderZoomDropdown()}
              >
                <span
                  style={{
                    display: 'inline-block',
                    width: 40,
                    textAlign: 'right',
                  }}
                >
                  100%
                </span>
              </Item>
            </Group>
            <Group>
              <Item name="zoomIn" tooltip="Zoom In (Cmd +)" icon="zoom-in" />
              <Item name="zoomOut" tooltip="Zoom Out (Cmd -)" icon="zoom-out" />
            </Group>
            <Group>
              <Item name="undo" tooltip="Undo (Cmd + Z)" icon="undo" />
              <Item name="redo" tooltip="Redo (Cmd + Shift + Z)" icon="redo" />
            </Group>
            <Group>
              <Item
                name="delete"
                icon="delete"
                disabled={true}
                tooltip="Delete (Delete)"
              />
            </Group>
            <Group>
              <Item
                name="bold"
                icon="bold"
                active={true}
                tooltip="Bold (Cmd + B)"
              />
              <Item name="italic" icon="italic" tooltip="Italic (Cmd + I)" />
              <Item
                name="strikethrough"
                icon="strikethrough"
                tooltip="Strikethrough (Cmd + Shift + x)"
              />
              <Item
                name="underline"
                icon="underline"
                tooltip="Underline (Cmd + U)"
              />
            </Group>
          </Toolbar>
        </div>
        <div style={{ background: '#f5f5f5', marginTop: 24, paddingRight: 16 }}>
          <Toolbar
            size="big"
            onClick={this.onClick}
            extra={<span>Extra Component</span>}
          >
            <Group>
              <Item name="zoomIn" tooltip="Zoom In (Cmd +)" icon="zoom-in" />
              <Item name="zoomOut" tooltip="Zoom Out (Cmd -)" icon="zoom-out" />
            </Group>
            <Group>
              <Item name="undo" tooltip="Undo (Cmd + Z)" icon="undo" />
              <Item name="redo" tooltip="Redo (Cmd + Shift + Z)" icon="redo" />
            </Group>
            <Group>
              <Item
                name="delete"
                icon="delete"
                disabled={true}
                tooltip="Delete (Delete)"
              />
            </Group>
            <Group>
              <Item
                name="bold"
                icon="bold"
                active={true}
                tooltip="Bold (Cmd + B)"
              />
              <Item name="italic" icon="italic" tooltip="Italic (Cmd + I)" />
              <Item
                name="strikethrough"
                icon="strikethrough"
                tooltip="Strikethrough (Cmd + Shift + x)"
              />
              <Item
                name="underline"
                icon="underline"
                tooltip="Underline (Cmd + U)"
              />
            </Group>
          </Toolbar>
        </div>
        <div style={{ background: '#f5f5f5', marginTop: 24, paddingRight: 16 }}>
          <Toolbar
            hoverEffect={true}
            onClick={this.onClick}
            extra={<span>Extra Component</span>}
          >
            <Group>
              <Item name="zoomIn" tooltip="Zoom In (Cmd +)" icon="zoom-in" />
              <Item name="zoomOut" tooltip="Zoom Out (Cmd -)" icon="zoom-out" />
            </Group>
            <Group>
              <Item name="undo" tooltip="Undo (Cmd + Z)" icon="undo" />
              <Item name="redo" tooltip="Redo (Cmd + Shift + Z)" icon="redo" />
            </Group>
            <Group>
              <Item
                name="delete"
                icon="delete"
                disabled={true}
                tooltip="Delete (Delete)"
              />
            </Group>
            <Group>
              <Item
                name="bold"
                icon="bold"
                active={true}
                tooltip="Bold (Cmd + B)"
              />
              <Item name="italic" icon="italic" tooltip="Italic (Cmd + I)" />
              <Item
                name="strikethrough"
                icon="strikethrough"
                tooltip="Strikethrough (Cmd + Shift + x)"
              />
              <Item
                name="underline"
                icon="underline"
                tooltip="Underline (Cmd + U)"
              />
            </Group>
          </Toolbar>
        </div>
        <div style={{ background: '#f5f5f5', marginTop: 24, paddingRight: 16 }}>
          <Toolbar extra={<span>Extra Component</span>}>
            <Group>
              <Item name="zoomIn" tooltip="Zoom In (Cmd +)" icon="zoom-in" />
              <Item name="zoomOut" tooltip="Zoom Out (Cmd -)" icon="zoom-out" />
            </Group>
            <Group>
              <Item name="undo" tooltip="Undo (Cmd + Z)" icon="undo" />
              <Item name="redo" tooltip="Redo (Cmd + Shift + Z)" icon="redo" />
            </Group>
            <Group>
              <Item
                name="delete"
                icon="delete"
                disabled={true}
                tooltip="Delete (Delete)"
              />
            </Group>
            <Group>
              <Item
                name="bold"
                icon="bold"
                active={true}
                tooltip="Bold (Cmd + B)"
              />
              <Item name="italic" icon="italic" tooltip="Italic (Cmd + I)" />
              <Item
                name="strikethrough"
                icon="strikethrough"
                tooltip="Strikethrough (Cmd + Shift + x)"
              />
              <Item
                name="underline"
                icon="underline"
                tooltip="Underline (Cmd + U)"
              />
            </Group>
          </Toolbar>
        </div>
        <div style={{ background: '#f5f5f5', marginTop: 24, paddingRight: 16 }}>
          <Toolbar
            hoverEffect={true}
            size="small"
            onClick={this.onClick}
            extra={<span>Extra Component</span>}
          >
            <Group>
              <Item name="zoomIn" tooltip="Zoom In (Cmd +)" icon="zoom-in" />
              <Item name="zoomOut" tooltip="Zoom Out (Cmd -)" icon="zoom-out" />
            </Group>
            <Group>
              <Item name="undo" tooltip="Undo (Cmd + Z)" icon="undo" />
              <Item name="redo" tooltip="Redo (Cmd + Shift + Z)" icon="redo" />
            </Group>
            <Group>
              <Item
                name="delete"
                icon="delete"
                disabled={true}
                tooltip="Delete (Delete)"
              />
            </Group>
            <Group>
              <Item
                name="bold"
                icon="bold"
                active={true}
                tooltip="Bold (Cmd + B)"
              />
              <Item name="italic" icon="italic" tooltip="Italic (Cmd + I)" />
              <Item
                name="strikethrough"
                icon="strikethrough"
                tooltip="Strikethrough (Cmd + Shift + x)"
              />
              <Item
                name="underline"
                icon="underline"
                tooltip="Underline (Cmd + U)"
              />
            </Group>
          </Toolbar>
        </div>
        <div style={{ background: '#f5f5f5', marginTop: 24, paddingRight: 16 }}>
          <Toolbar
            size="small"
            onClick={this.onClick}
            extra={<span>Extra Component</span>}
          >
            <Group>
              <Item name="zoomIn" tooltip="Zoom In (Cmd +)" icon="zoom-in" />
              <Item name="zoomOut" tooltip="Zoom Out (Cmd -)" icon="zoom-out" />
            </Group>
            <Group>
              <Item name="undo" tooltip="Undo (Cmd + Z)" icon="undo" />
              <Item name="redo" tooltip="Redo (Cmd + Shift + Z)" icon="redo" />
            </Group>
            <Group>
              <Item
                name="delete"
                icon="delete"
                disabled={true}
                tooltip="Delete (Delete)"
              />
            </Group>
            <Group>
              <Item
                name="bold"
                icon="bold"
                active={true}
                tooltip="Bold (Cmd + B)"
              />
              <Item name="italic" icon="italic" tooltip="Italic (Cmd + I)" />
              <Item
                name="strikethrough"
                icon="strikethrough"
                tooltip="Strikethrough (Cmd + Shift + x)"
              />
              <Item
                name="underline"
                icon="underline"
                tooltip="Underline (Cmd + U)"
              />
            </Group>
          </Toolbar>
        </div>
        <div style={{ background: '#f5f5f5', marginTop: 24, paddingRight: 16 }}>
          <Toolbar
            hoverEffect={true}
            size="big"
            onClick={this.onClick}
            extra={<span>Extra Component</span>}
          >
            <Group>
              <Item name="alignLeft" icon="align-left" text="Align Left" />
              <Item
                name="alignCenter"
                icon="align-center"
                text="Align Center"
              />
              <Item name="alignRight" icon="align-right" text="Align Right" />
            </Group>
          </Toolbar>
        </div>
        <div style={{ background: '#f5f5f5', marginTop: 24, paddingRight: 16 }}>
          <Toolbar
            size="big"
            onClick={this.onClick}
            extra={<span>Extra Component</span>}
          >
            <Group>
              <Item name="alignLeft" icon="align-left" text="Align Left" />
              <Item
                name="alignCenter"
                icon="align-center"
                text="Align Center"
              />
              <Item name="alignRight" icon="align-right" text="Align Right" />{' '}
            </Group>
          </Toolbar>
        </div>
        <div style={{ background: '#f5f5f5', marginTop: 24, paddingRight: 16 }}>
          <Toolbar
            hoverEffect={true}
            onClick={this.onClick}
            extra={<span>Extra Component</span>}
          >
            <Group>
              <Item name="alignLeft" icon="align-left" text="Align Left" />
              <Item
                name="alignCenter"
                icon="align-center"
                text="Align Center"
              />
              <Item name="alignRight" icon="align-right" text="Align Right" />
            </Group>
          </Toolbar>
        </div>
        <div style={{ background: '#f5f5f5', marginTop: 24, paddingRight: 16 }}>
          <Toolbar onClick={this.onClick} extra={<span>Extra Component</span>}>
            <Group>
              <Item name="alignLeft" icon="align-left" text="Align Left" />
              <Item
                name="alignCenter"
                icon="align-center"
                text="Align Center"
              />
              <Item name="alignRight" icon="align-right" text="Align Right" />{' '}
            </Group>
          </Toolbar>
        </div>
        <div style={{ background: '#f5f5f5', marginTop: 24, paddingRight: 16 }}>
          <Toolbar
            hoverEffect={true}
            size="small"
            onClick={this.onClick}
            extra={<span>Extra Component</span>}
          >
            <Group>
              <Item name="alignLeft" icon="align-left" text="Align Left" />
              <Item
                name="alignCenter"
                icon="align-center"
                text="Align Center"
              />
              <Item name="alignRight" icon="align-right" text="Align Right" />
            </Group>
          </Toolbar>
        </div>
        <div style={{ background: '#f5f5f5', marginTop: 24, paddingRight: 16 }}>
          <Toolbar
            size="small"
            onClick={this.onClick}
            extra={<span>Extra Component</span>}
          >
            <Group>
              <Item name="alignLeft" icon="align-left" text="Align Left" />
              <Item
                name="alignCenter"
                icon="align-center"
                text="Align Center"
              />
              <Item name="alignRight" icon="align-right" text="Align Right" />{' '}
            </Group>
          </Toolbar>
        </div>
      </div>
    )
  }
}
