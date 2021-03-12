import React from 'react'
import ReactDom from 'react-dom'
import { Menu, Dropdown } from 'antd'
import { Graph, ToolsView, EdgeView } from '@antv/x6'

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
      this.toggleTooltip(true)
    })
    return this
  }

  private toggleTooltip(visible: boolean) {
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
    setTimeout(() => {
      this.updatePosition()
      this.toggleTooltip(false)
      if (this.options.onHide) {
        this.options.onHide.call(this)
      }
    }, 200)
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

const menu = (
  <Menu onClick={onMenuClick}>
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
      fill: '#f5f5f5',
      stroke: '#d9d9d9',
      strokeWidth: 1,
    },
  },
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
