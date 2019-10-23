import React from 'react'
import { Collapse, Icon } from 'antd'
import { EditorGraph } from './graph'
import { util } from '../../../../../src'
import { DataItem, generals } from './sidebar-data'
import './sidebar.less'

export class Sidebar extends React.PureComponent {
  graph = this.createTemporaryGraph()

  createTemporaryGraph() {
    const container = document.createElement('div')
    container.style.visibility = 'hidden'
    container.style.position = 'absolute'
    container.style.overflow = 'hidden'
    container.style.height = '1px'
    container.style.width = '1px'

    document.body.appendChild(container)

    return new EditorGraph(container, {
      grid: false,
      tooltip: false,
      folding: false,
      connection: false,
      autoScroll: false,
      resetViewOnRootChange: false,
    })
  }

  createNodeTemplateEntry() {

  }

  createNodeTemplate() {

  }

  createNodeTemplateFromCells() {

  }

  renderThumb(item: DataItem) {
    const thumbWidth = 32
    const thumbHeight = 32
    const thumbBorder = 1

    const width = item.width as number
    const height = item.height as number

    this.graph.view.scaleAndTranslate(1, 0, 0)
    this.graph.addNode({
      width,
      height,
      data: item.data,
      style: item.style,
    })
    const bounds = this.graph.getGraphBounds()
    const scale = Math.floor(Math.min(
      (thumbWidth - 2 * thumbBorder) / bounds.width,
      (thumbHeight - 2 * thumbBorder) / bounds.height,
    ) * 100) / 100

    this.graph.view.scaleAndTranslate(
      scale,
      Math.floor((thumbWidth - bounds.width * scale) / 2 / scale - bounds.x),
      Math.floor((thumbHeight - bounds.height * scale) / 2 / scale - bounds.y),
    )

    let node: HTMLDivElement | SVGElement
    if (this.graph.dialect === 'svg') {
      const stage = this.graph.view.getStage() as SVGGElement
      node = stage.ownerSVGElement!.cloneNode(true) as SVGElement
    } else {
      node = this.graph.container.cloneNode(false) as HTMLDivElement
      node.innerHTML = this.graph.container.innerHTML
    }

    node.style.position = 'relative'
    node.style.overflow = 'hidden'
    node.style.left = ''
    node.style.top = ''
    node.style.width = util.toPx(thumbWidth)
    node.style.height = util.toPx(thumbHeight)

    this.graph.getModel().clear()

    return node.outerHTML
  }

  renderGeneralPalette(items: DataItem[]) {
    return (
      <ul className="x6-cell-thumb-list">
        {
          items.map(
            item => <li
              key={item.title}
              dangerouslySetInnerHTML={{ __html: this.renderThumb(item) }}
            />
          )
        }
      </ul>
    )
  }

  render() {
    const { Panel } = Collapse
    const text = `
  A dog is a type of domesticated animal.
  Known for its loyalty and faithfulness,
  it can be found as a welcome guest in many households across the world.
`
    return (
      <div>
        <Collapse
          bordered={false}
          defaultActiveKey={['general']}
          expandIcon={({ isActive }) => (
            <Icon type="caret-right" rotate={isActive ? 90 : 0} />
          )}
        >
          <Panel header="General" key="general" >
            {this.renderGeneralPalette(generals)}
          </Panel>
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
