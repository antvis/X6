import React from 'react'
import ReactDom from 'react-dom'
import { Tooltip } from 'antd'
import { Graph, ToolsView, EdgeView } from '@antv/x6'
class TooltipTool extends ToolsView.ToolItem<EdgeView, TooltipToolOptions> {
  private knob: HTMLDivElement

  render() {
    if (!this.knob) {
      this.knob = ToolsView.createElement('div', false) as HTMLDivElement
      this.knob.style.position = 'absolute'
      this.container.appendChild(this.knob)
    }
    return this
  }

  private toggleTooltip(visible: boolean) {
    ReactDom.unmountComponentAtNode(this.knob)
    if (visible) {
      ReactDom.render(
        <Tooltip
          title={this.options.tooltip}
          visible={true}
          destroyTooltipOnHide
        >
          <div />
        </Tooltip>,
        this.knob,
      )
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

graph.addEdge({
  source: { x: 320, y: 200 },
  target: { x: 580, y: 300 },
  attrs: {
    line: {
      stroke: '#bfbfbf',
      strokeWidth: 2,
      targetMarker: 'classic',
    },
  },
  router: 'manhattan',
  tools: [
    {
      name: 'tooltip',
      args: {
        tooltip: 'tooltip content',
      },
    },
  ],
})
