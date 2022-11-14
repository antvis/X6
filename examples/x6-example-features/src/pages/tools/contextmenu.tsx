import React from 'react'
import ReactDom from 'react-dom'
import { Menu, Dropdown } from 'antd'
import { Graph, ToolsView, EdgeView } from '@antv/x6'
import '../index.less'

class ContextMenuTool extends ToolsView.ToolItem<
  EdgeView,
  ContextMenuToolOptions
> {
  private knob: HTMLDivElement
  private timer: number

  render() {
    if (!this.knob) {
      this.knob = ToolsView.createElement('div', false) as HTMLDivElement
      this.knob.style.position = 'absolute'
      this.container.appendChild(this.knob)
    }
    return this
  }

  private toggleContextMenu(visible: boolean) {
    ReactDom.unmountComponentAtNode(this.knob)
    document.removeEventListener('mousedown', this.onMouseDown)

    if (visible) {
      ReactDom.render(
        <Dropdown
          visible={true}
          trigger={['contextMenu']}
          overlay={this.options.menu}
        >
          <a href="#" />
        </Dropdown>,
        this.knob,
      )
      document.addEventListener('mousedown', this.onMouseDown)
    }
  }

  private updatePosition(e?: MouseEvent) {
    const style = this.knob.style
    if (e) {
      const pos = this.graph.clientToGraph(e.clientX, e.clientY)
      style.left = `${pos.x}px`
      style.top = `${pos.y}px`
    } else {
      style.left = '-1000px'
      style.top = '-1000px'
    }
  }

  private onMouseDown = () => {
    this.timer = window.setTimeout(() => {
      this.updatePosition()
      this.toggleContextMenu(false)
    }, 200)
  }

  private onContextMenu({ e }: { e: MouseEvent }) {
    if (this.timer) {
      clearTimeout(this.timer)
      this.timer = 0
    }
    this.updatePosition(e)
    this.toggleContextMenu(true)
  }

  delegateEvents() {
    this.cellView.on('cell:contextmenu', this.onContextMenu, this)
    return super.delegateEvents()
  }

  protected onRemove() {
    this.cellView.off('cell:contextmenu', this.onContextMenu, this)
  }
}

ContextMenuTool.config({
  tagName: 'div',
  isSVGElement: false,
})

export interface ContextMenuToolOptions extends ToolsView.ToolItem.Options {
  menu: React.ReactElement
}

Graph.registerEdgeTool('contextmenu', ContextMenuTool, true)
Graph.registerNodeTool('contextmenu', ContextMenuTool, true)

const menu = (
  <Menu>
    <Menu.Item key="1">1st menu item</Menu.Item>
    <Menu.Item key="2">2nd menu item</Menu.Item>
    <Menu.Item key="3">
      <a target="_blank" rel="noopener noreferrer" href="http://www.tmall.com/">
        3rd menu item
      </a>
    </Menu.Item>
    <Menu.Item key="4" danger>
      a danger item
    </Menu.Item>
  </Menu>
)

export default class Example extends React.Component {
  private container: HTMLDivElement

  componentDidMount() {
    const graph = new Graph({
      container: this.container,
      width: 800,
      height: 600,
      grid: {
        visible: true,
      },
      panning: true,
      mousewheel: true,
    })

    const source = graph.addNode({
      x: 180,
      y: 60,
      width: 100,
      height: 40,
      attrs: {
        body: {
          fill: '#f5f5f5',
          stroke: '#d9d9d9',
          strokeWidth: 1,
        },
      },
      tools: [
        {
          name: 'contextmenu',
          args: {
            menu,
          },
        },
      ],
    })

    const target = graph.addNode({
      x: 320,
      y: 250,
      width: 100,
      height: 40,
      attrs: {
        body: {
          fill: '#f5f5f5',
          stroke: '#d9d9d9',
          strokeWidth: 1,
        },
      },
      tools: [
        {
          name: 'contextmenu',
          args: {
            menu,
          },
        },
      ],
    })

    graph.addEdge({
      source,
      target,
      attrs: {
        line: {
          stroke: '#a0a0a0',
          strokeWidth: 1,
        },
      },
      tools: [
        {
          name: 'contextmenu',
          args: {
            menu,
          },
        },
      ],
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
