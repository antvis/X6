import React from 'react'
import { Collapse, Icon, Input } from 'antd'
import { getPalettes, PaletteItem } from './sidebar-util'
import { initDnd } from './sidebar-dnd'
import './sidebar.less'

export class Sidebar extends React.PureComponent {
  containers: HTMLDivElement[] = []

  componentDidMount() {
    const thumbWidth = 32
    const thumbHeight = 32
    const thumbBorder = 1
    const palettes = getPalettes()

    palettes.forEach((palette, index) => {
      const container = this.containers[index]
      if (container != null) {
        const render = (items: PaletteItem[]) => {
          items.forEach((item) => item.render(container, thumbWidth, thumbHeight, thumbBorder))
          initDnd(container)
        }

        if (palette.items) {
          render(palette.items)
        } else if (palette.load) {
          palette.load.then((items) => {
            render(items)
          })
        }
      }
    })
  }

  onSearch: (keyword: string) => {}

  refContainer(index: number, container: HTMLDivElement) {
    this.containers[index] = container
  }

  render() {
    const palettes = getPalettes()
    const expandKeys = palettes.filter((i) => i.expand).map((i) => i.title)

    return (
      <div className="x6-editor-sidebar-inner">
        <div className="x6-cell-thumb-search">
          <Input.Search placeholder="Search Shapes" onSearch={this.onSearch} />
        </div>
        <div className="x6-cell-thumb-wrap">
          <Collapse
            bordered={false}
            defaultActiveKey={expandKeys}
            expandIcon={({ isActive }) => <Icon type="caret-right" rotate={isActive ? 90 : 0} />}
          >
            {palettes.map((palette, index) => (
              <Collapse.Panel header={palette.title} key={palette.title}>
                <div className="x6-cell-thumb-list" ref={this.refContainer.bind(this, index)} />
              </Collapse.Panel>
            ))}
          </Collapse>
        </div>
      </div>
    )
  }
}
