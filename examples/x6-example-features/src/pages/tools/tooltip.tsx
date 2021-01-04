import React from 'react'
import ReactDom from 'react-dom'
import { Tooltip } from 'antd'
import { Graph, ToolsView, EdgeView } from '@antv/x6'
import '../index.less'

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

export default class Example extends React.Component {
  private container: HTMLDivElement

  componentDidMount() {
    const graph = new Graph({
      container: this.container,
      width: 800,
      height: 600,
      grid: true,
      panning: true,
      scroller: true,
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
          targetMarker: {
            name: 'classic',
            size: 7,
          },
        },
      },
    })

    graph.on('cell:mouseenter', ({ cell }) => {
      cell.addTools([
        {
          name: 'tooltip',
          args: {
            tooltip: cell.isNode()
              ? cell === source
                ? 'source tooltip'
                : 'target tooltip '
              : 'edge tooltip',
          },
        },
      ])
    })

    graph.on('cell:mouseleave', ({ cell }) => {
      cell.removeTools()
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
