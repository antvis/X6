import React from 'react'
import { Collapse, Icon } from 'antd'
import { getPalettes } from './sidebar-util'
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
        palette.items.forEach(item => item.render(
          container, thumbWidth, thumbHeight, thumbBorder,
        ))
      }
    })
  }

  refContainer(index: number, container: HTMLDivElement) {
    this.containers[index] = container
  }

  render() {
    const palettes = getPalettes()
    const { Panel } = Collapse
    const text = `
      A dog is a type of domesticated animal.
      Known for its loyalty and faithfulness,
      it can be found as a welcome guest in many households across the world.
      `

    const expandKeys = palettes.filter(i => i.expand).map(i => i.title)

    return (
      <div>
        <Collapse
          bordered={false}
          defaultActiveKey={expandKeys}
          expandIcon={({ isActive }) => (
            <Icon type="caret-right" rotate={isActive ? 90 : 0} />
          )}
        >
          {
            palettes.map((palette, index) => (
              <Panel header={palette.title} key={palette.title} >
                <div
                  className="x6-cell-thumb-list"
                  ref={this.refContainer.bind(this, index)}
                />
              </Panel>
            ))
          }
          <Panel header="Flow" key="flow" >
            <p>{text}</p>
          </Panel>
          <Panel header="UML" key="uml" >
            <p>{text}</p>
          </Panel>
        </Collapse>
      </div>
    )
  }
}
