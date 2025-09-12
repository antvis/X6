import React from 'react'
import ReactDom from 'react-dom'
import { Tooltip } from 'antd'
import { Graph, Markup, ToolsView, EdgeView } from '@antv/x6'
import '../index.less'

class TooltipTool extends ToolsView.ToolItem<EdgeView, TooltipTool.Options> {
  private delay = 100
  private moveTimer: number
  private enterTimer: number
  private leaveTimer: number
  private tooltipVisible: boolean

  protected onRender() {
    this.updatePosition()
  }

  private toggleTooltip(visible: boolean) {
    ReactDom.unmountComponentAtNode(this.childNodes.foContent)

    if (visible) {
      ReactDom.render(
        <Tooltip title={this.options.tooltip} visible={true}>
          <div />
        </Tooltip>,
        this.childNodes.foContent,
      )
    }
    this.tooltipVisible = visible
  }

  private updatePosition(e?: MouseEvent) {
    const fo = this.childNodes.fo as SVGForeignObjectElement
    if (e) {
      const pos = this.graph.clientToLocal(e.clientX, e.clientY)
      fo.setAttribute('x', `${pos.x}`)
      fo.setAttribute('y', `${pos.y}`)
    } else {
      fo.setAttribute('x', `-10000`)
      fo.setAttribute('y', `-10000`)
    }
  }

  private onMouseEnter({ e }: EdgeView.EventArgs['edge:mouseenter']) {
    this.updatePosition(e.originalEvent)
    window.clearTimeout(this.leaveTimer)
    this.enterTimer = window.setTimeout(
      () => this.toggleTooltip(true),
      this.delay,
    )
    if (this.options.follow !== false) {
      document.addEventListener('mousemove', this.onMouseMove)
    }
  }

  private onMouseLeave() {
    this.updatePosition()
    window.clearTimeout(this.enterTimer)
    this.leaveTimer = window.setTimeout(
      () => this.toggleTooltip(false),
      this.delay,
    )
    if (this.options.follow !== false) {
      document.removeEventListener('mousemove', this.onMouseMove)
    }
  }

  private onMouseMove = (e: MouseEvent) => {
    window.clearTimeout(this.moveTimer)
    window.clearTimeout(this.enterTimer)
    this.updatePosition(e)
    this.moveTimer = window.setTimeout(() => {
      if (this.tooltipVisible) {
        this.toggleTooltip(false)
      }
      this.toggleTooltip(true)
    }, this.delay)
  }

  delegateEvents() {
    this.cellView.on('edge:mouseenter', this.onMouseEnter, this)
    this.cellView.on('edge:mouseleave', this.onMouseLeave, this)
    return super.delegateEvents()
  }

  protected onRemove() {
    this.cellView.off('edge:mouseenter', this.onMouseEnter, this)
    this.cellView.off('edge:mouseleave', this.onMouseLeave, this)
  }
}

// eslint-disable-next-line
namespace TooltipTool {
  TooltipTool.config({
    markup: Markup.getForeignObjectMarkup(),
  })

  export interface Options extends ToolsView.ToolItem.Options {
    follow?: boolean
    tooltip?: string
  }
}

Graph.registerEdgeTool('tooltip', TooltipTool, true)

export default class Example extends React.Component {
  private container!: HTMLDivElement

  componentDidMount() {
    const graph = new Graph({
      container: this.container,
      width: 800,
      height: 400,
      grid: true,
    })

    graph.addEdge({
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
      tools: [
        {
          name: 'tooltip',
          args: { follow: false, tooltip: 'tooltip test 1' },
        },
      ],
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
          targetMarker: 'classic',
        },
      },
      connector: 'smooth',
      tools: {
        name: 'tooltip',
        args: { follow: true, tooltip: 'tooltip test 2' },
      },
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
