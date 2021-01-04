import React from 'react'
import ReactDom from 'react-dom'
import { Tooltip } from 'antd'
import { Graph, ToolsView, EdgeView } from '@antv/x6'

class TooltipTool extends ToolsView.ToolItem<EdgeView, TooltipToolOptions> {
  private delay = 100
  private timer: number
  private knob: HTMLDivElement
  private tooltipVisible: boolean

  render() {
    super.render()
    this.knob = ToolsView.createElement('div', false) as HTMLDivElement
    this.knob.style.position = 'absolute'
    this.container.appendChild(this.knob)
    this.updatePosition()
    document.addEventListener('mousemove', this.onMouseMove)

    return this
  }

  private toggleTooltip(visible: boolean) {
    ReactDom.unmountComponentAtNode(this.knob)

    if (visible) {
      ReactDom.render(
        <Tooltip title={this.options.tooltip} visible={true}>
          <div />
        </Tooltip>,
        this.knob,
      )
    }
    this.tooltipVisible = visible
  }

  private updatePosition(e?: MouseEvent) {
    const style = this.knob.style
    if (e) {
      style.left = `${e.clientX}px`
      style.top = `${e.clientY}px`
    } else {
      style.left = '-1000px'
      style.top = '-1000px'
    }
  }

  private onMouseLeave() {
    this.updatePosition()
    window.clearTimeout(this.timer)
    window.setTimeout(() => this.toggleTooltip(false), this.delay)
    document.removeEventListener('mousemove', this.onMouseMove)
  }

  private onMouseMove = (e: MouseEvent) => {
    window.clearTimeout(this.timer)
    this.updatePosition(e)
    this.timer = window.setTimeout(() => {
      if (this.tooltipVisible) {
        this.toggleTooltip(false)
      }
      this.toggleTooltip(true)
    }, this.delay)
  }

  delegateEvents() {
    this.cellView.on('cell:mouseleave', this.onMouseLeave, this)
    return super.delegateEvents()
  }

  protected onRemove() {
    this.cellView.off('cell:mouseleave', this.onMouseLeave, this)
  }
}

TooltipTool.config({
  tagName: 'div',
  isSVGElement: false,
})

export interface TooltipToolOptions extends ToolsView.ToolItem.Options {
  tooltip?: string
}

Graph.registerNodeTool('tooltip', TooltipTool, true)
Graph.registerEdgeTool('tooltip', TooltipTool, true)

const graph = new Graph({
  container: document.getElementById('container'),
  grid: true,
})

const edge1 = graph.addEdge({
  source: { x: 40, y: 40 },
  target: { x: 380, y: 40 },
  vertices: [
    { x: 40, y: 80 },
    { x: 200, y: 80 },
    { x: 200, y: 40 },
  ],
  attrs: {
    line: {
      stroke: '#3c4260',
      strokeWidth: 2,
      targetMarker: 'classic',
    },
  },
})

graph.addEdge({
  source: { x: 40, y: 160 },
  target: { x: 380, y: 160 },
  vertices: [
    { x: 40, y: 200 },
    { x: 200, y: 200 },
    { x: 200, y: 160 },
  ],
  attrs: {
    line: {
      stroke: '#3c4260',
      strokeWidth: 2,
    },
  },
  connector: 'smooth',
})

graph.on('cell:mouseenter', ({ cell }) => {
  cell.addTools([
    {
      name: 'tooltip',
      args: {
        tooltip: cell === edge1 ? 'edge 1 tooltip' : 'edge 2 tooltip ',
      },
    },
  ])
})

graph.on('cell:mouseleave', ({ cell }) => {
  cell.removeTools()
})
