import React from 'react'
import ReactDom from 'react-dom'
import { Dropdown, Menu } from 'antd'
import { Graph, ToolsView, EdgeView } from '@antv/x6'
import '../index.less'

class ContextMenuTool extends ToolsView.ToolItem<
  EdgeView,
  ContextMenuToolOptions
> {
  private knob: HTMLDivElement

  render() {
    super.render()
    this.knob = ToolsView.createElement('div', false) as HTMLDivElement
    this.knob.style.position = 'absolute'
    this.container.appendChild(this.knob)
    this.updatePosition(this.options)
    setTimeout(() => {
      this.toggleContextMenu(true)
    })
    return this
  }

  private toggleContextMenu(visible: boolean) {
    ReactDom.unmountComponentAtNode(this.knob)
    document.removeEventListener('mousedown', this.onMouseDown)
    if (visible) {
      ReactDom.render(
        <Dropdown
          visible={true}
          trigger={['click']}
          overlay={this.options.menu}
        >
          <a />
        </Dropdown>,
        this.knob,
        () => {
          document.addEventListener('mousedown', this.onMouseDown)
        },
      )
    }
  }

  private updatePosition(pos?: { x: number; y: number }) {
    const style = this.knob.style
    if (pos) {
      style.left = `${pos.x}px`
      style.top = `${pos.y}px`
    } else {
      style.left = '-1000px'
      style.top = '-1000px'
    }
  }

  private onMouseDown = (e: MouseEvent) => {
    console.log('')

    setTimeout(() => {
      this.updatePosition()
      this.toggleContextMenu(false)
      if (this.options.onHide) {
        this.options.onHide.call(this)
      }
    }, 100)
  }
}

ContextMenuTool.config({
  tagName: 'div',
  isSVGElement: false,
})

export interface ContextMenuToolOptions extends ToolsView.ToolItem.Options {
  x: number
  y: number
  menu?: Menu | (() => Menu)
  onHide?: (this: ContextMenuTool) => void
}

Graph.registerEdgeTool('contextmenu', ContextMenuTool, true)
Graph.registerNodeTool('contextmenu', ContextMenuTool, true)

const onMenuClick = (e: any) => {
  console.log('menu click ', e)
}

const menu = () => (
  <Menu onClick={onMenuClick}>
    <Menu.Item key="1">1st menu item</Menu.Item>
    <Menu.Item key="2">2nd menu item</Menu.Item>
    <Menu.Item key="3">
      <a target="_blank" rel="noopener noreferrer" href="http://www.tmall.com/">
        3rd menu item
      </a>
    </Menu.Item>
    <Menu.Item key="4">a danger item</Menu.Item>
  </Menu>
)

export default class Example extends React.Component {
  private container: HTMLDivElement

  componentDidMount() {
    const graph = new Graph({
      container: this.container,
      width: 800,
      height: 600,
      grid: true,
      panning: true,
    })

    const source = graph.addNode({
      x: 40,
      y: 40,
      width: 100,
      height: 40,
    })

    const target = graph.addNode({
      x: 240,
      y: 200,
      width: 100,
      height: 40,
    })

    graph.addEdge({
      source,
      target,
    })

    graph.on('cell:contextmenu', ({ cell, e }) => {
      const p = graph.clientToGraph(e.clientX, e.clientY)
      cell.addTools([
        {
          name: 'contextmenu',
          args: {
            menu,
            x: p.x,
            y: p.y,
            onHide() {
              this.cell.removeTools()
            },
          },
        },
      ])
    })
  }

  refContainer = (container: HTMLDivElement) => {
    this.container = container
  }

  render() {
    return (
      <div className="x6-graph-wrap">
        <div ref={this.refContainer} className="x6-graph" />
      </div>
    )
  }
}
