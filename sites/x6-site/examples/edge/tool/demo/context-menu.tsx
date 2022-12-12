import React from 'react'
import ReactDom from 'react-dom'
import { Menu, Dropdown } from 'antd'
import { Graph, ToolsView, EdgeView } from '@antv/x6'

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
          <a />
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
    <Menu.Item>1st menu item</Menu.Item>
    <Menu.Item>2nd menu item</Menu.Item>
    <Menu.Item>
      <a target="_blank" rel="noopener noreferrer" href="http://www.tmall.com/">
        3rd menu item
      </a>
    </Menu.Item>
    <Menu.Item danger>a danger item</Menu.Item>
  </Menu>
)

const graph = new Graph({
  container: document.getElementById('container'),
  grid: true,
})

const source = graph.addNode({
  x: 180,
  y: 60,
  width: 100,
  height: 40,
  attrs: {
    body: {
      stroke: '#5F95FF',
      fill: '#EFF4FF',
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
      stroke: '#5F95FF',
      fill: '#EFF4FF',
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
      stroke: '#A2B1C3',
      strokeWidth: 2,
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
