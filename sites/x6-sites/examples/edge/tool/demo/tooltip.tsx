import { EdgeView, Graph, ToolsView } from '@antv/x6'
import { Tooltip } from 'antd'
import React from 'react'
import type { Root } from 'react-dom/client'
import { createRoot } from 'react-dom/client'

class TooltipTool extends ToolsView.ToolItem<EdgeView, TooltipToolOptions> {
  private knob: HTMLDivElement
  private root: Root

  render() {
    if (!this.knob) {
      this.knob = ToolsView.createElement('div', false) as HTMLDivElement
      this.knob.style.position = 'absolute'
      this.container.appendChild(this.knob)
    }
    return this
  }

  private toggleTooltip(visible: boolean) {
    if (this.knob) {
      this.root && this.root.unmount()
      if (visible) {
        this.root = createRoot(this.knob)
        this.root.render(
          <Tooltip
            title={this.options.tooltip}
            open={true}
            arrow={false}
            overlayStyle={{ padding: 0 }}
            destroyTooltipOnHide
          >
            <div />
          </Tooltip>,
        )
      }
    }
  }

  private onMosueEnter({ e }: { e: MouseEvent }) {
    this.updatePosition(e)
    this.toggleTooltip(true)
  }

  private onMouseLeave() {
    this.updatePosition()
    this.toggleTooltip(false)
  }

  private onMouseMove() {
    this.updatePosition()
    this.toggleTooltip(false)
  }

  delegateEvents() {
    this.cellView.on('cell:mouseenter', this.onMosueEnter, this)
    this.cellView.on('cell:mouseleave', this.onMouseLeave, this)
    this.cellView.on('cell:mousemove', this.onMouseMove, this)
    return super.delegateEvents()
  }

  private updatePosition(e?: MouseEvent) {
    const style = this.knob.style
    if (e) {
      const p = this.graph.clientToGraph(e.clientX, e.clientY)
      style.display = 'block'
      style.left = `${p.x}px`
      style.top = `${p.y}px`
    } else {
      style.display = 'none'
      style.left = '-1000px'
      style.top = '-1000px'
    }
  }

  protected onRemove() {
    this.toggleTooltip(false)
    this.cellView.off('cell:mouseenter', this.onMosueEnter, this)
    this.cellView.off('cell:mouseleave', this.onMouseLeave, this)
    this.cellView.off('cell:mousemove', this.onMouseMove, this)
  }
}

TooltipTool.config({
  tagName: 'div',
  isSVGElement: false,
})

export interface TooltipToolOptions extends ToolsView.ToolItem.Options {
  tooltip?: string
}

Graph.registerEdgeTool('tooltip', TooltipTool, true)

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
      name: 'tooltip',
      args: {
        tooltip: 'Tooltip Content',
      },
    },
  ],
})
