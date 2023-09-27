import React from 'react'
import ReactDom from 'react-dom'
import { Dropdown } from 'antd'
import { Graph, ToolsView, EdgeView } from '@antv/x6'
import type { MenuProps } from 'antd'

// 如果项目中使用的是 antd@4，使用方式参考：https://codesandbox.io/s/contextmenu-z8gpq3

class ContextMenuTool extends ToolsView.ToolItem<
  EdgeView,
  ContextMenuToolOptions
> {
  private timer: number

  private toggleContextMenu(visible: boolean, pos?: { x: number; y: number }) {
    ReactDom.unmountComponentAtNode(this.container)
    document.removeEventListener('mousedown', this.onMouseDown)

    if (visible && pos) {
      ReactDom.render(
        <Dropdown
          open={true}
          trigger={['contextMenu']}
          menu={{ items: this.options.menu }}
          align={{ offset: [pos.x, pos.y] }}
        >
          <span />
        </Dropdown>,
        this.container,
      )
      document.addEventListener('mousedown', this.onMouseDown)
    }
  }

  private onMouseDown = () => {
    this.timer = window.setTimeout(() => {
      this.toggleContextMenu(false)
    }, 200)
  }

  private onContextMenu({ e }: { e: MouseEvent }) {
    if (this.timer) {
      clearTimeout(this.timer)
      this.timer = 0
    }
    this.toggleContextMenu(true, { x: e.clientX, y: e.clientY })
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
  menu: MenuProps['items']
}

Graph.registerEdgeTool('contextmenu', ContextMenuTool, true)
Graph.registerNodeTool('contextmenu', ContextMenuTool, true)

const menu = [
  {
    key: 'copy',
    label: '复制',
  },
  {
    key: 'paste',
    label: '粘贴',
  },
  {
    key: 'delete',
    label: '删除',
    type: 'danger',
  },
]

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
