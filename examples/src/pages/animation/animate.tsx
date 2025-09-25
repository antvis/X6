import React from 'react'
import { Graph } from '../../../../src'
import '../index.less'

export class AnimateExample extends React.Component {
  private container!: HTMLDivElement

  componentDidMount() {
    const graph = new Graph({
      container: this.container,
      grid: true,
    })

    const rect1 = graph.addNode({
      x: 80,
      y: 40,
      width: 100,
      height: 40,
    })

    const rect2 = graph.addNode({
      x: 460,
      y: 40,
      width: 100,
      height: 40,
      attrs: {
        rect: {
          fill: null,
          class: 'rect-bg',
        },
      },
    })
    const view2 = graph.findView(rect2)

    view2?.on('view:render', () => {
      view2.animate('rect', {
        attributeType: 'CSS',
        attributeName: 'fill',
        from: 'red',
        to: 'green',
        dur: '1s',
        repeatCount: 'indefinite',
      })
    })

    const edge = graph.addEdge({
      source: rect1,
      target: rect2,
      attrs: {
        line: {
          strokeDasharray: 5,
        },
      },
    })
    const edgeView = graph.findViewByCell(edge)

    edgeView?.on('view:render', () => {
      edgeView.animate('path:nth-child(2)', {
        attributeName: 'stroke-dashoffset',
        from: 20,
        to: 0,
        dur: '1s',
        repeatCount: 'indefinite',
      })
    })
  }

  refContainer = (container: HTMLDivElement) => {
    this.container = container
  }

  render() {
    return (
      <div className="x6-graph-wrap" style={{ height: 500 }}>
        <div ref={this.refContainer} className="x6-graph" />
      </div>
    )
  }
}
