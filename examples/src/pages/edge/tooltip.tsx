import React, { useEffect, useRef } from 'react'
import ReactDom from 'react-dom'
import { Tooltip } from 'antd'
import {
  Graph,
  Markup,
  EdgeView,
  ToolItem,
  CellViewOptions,
  EventArgs,
} from '@antv/x6'
import '../index.less'

class TooltipTool extends ToolItem<EdgeView, CellViewOptions> {
  private delay = 100
  private moveTimer: number = 0
  private enterTimer: number = 0
  private leaveTimer: number = 0
  private tooltipVisible: boolean = false

  protected onRender() {
    this.updatePosition()
  }

  private toggleTooltip(visible: boolean) {
    ReactDom.unmountComponentAtNode(this.childNodes.foContent)

    if (visible) {
      ReactDom.render(
        // @ts-expect-error ignore type error
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

  private onMouseEnter({ e }: EventArgs['edge:mouseenter']) {
    this.updatePosition(e.originalEvent)
    window.clearTimeout(this.leaveTimer)
    this.enterTimer = window.setTimeout(
      () => this.toggleTooltip(true),
      this.delay,
    )
    // @ts-expect-error ignore type error
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
    // @ts-expect-error ignore type error
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

  export interface Options extends CellViewOptions {
    follow?: boolean
    tooltip?: string
  }
}

Graph.registerEdgeTool('tooltip', TooltipTool, true)

const Example: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null)
  useEffect(() => {
    if (!containerRef.current) return

    const graph = new Graph({
      container: containerRef.current,
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

    return () => {
      graph.dispose()
    }
  }, [])

  return (
    <div className="x6-graph-wrap">
      <div ref={containerRef} className="x6-graph" />
    </div>
  )
}

export default Example
