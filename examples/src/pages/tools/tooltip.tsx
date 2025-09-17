import React from 'react'
import ReactDom from 'react-dom'
import { Tooltip } from 'antd'
import { Graph, ToolsView, EdgeView } from '@antv/x6'
import '../index.less'

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
    if (this.knob) {
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
Graph.registerNodeTool('tooltip', TooltipTool, true)

export default class Example extends React.Component {
  private container!: HTMLDivElement

  componentDidMount() {
    const graph = new Graph({
      container: this.container,
      width: 800,
      height: 600,
      grid: true,
      panning: true,
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
          name: 'tooltip',
          args: {
            tooltip: 'tooltip content',
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
          name: 'tooltip',
          args: {
            tooltip: 'tooltip content',
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
          name: 'tooltip',
          args: {
            tooltip: 'tooltip content',
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
