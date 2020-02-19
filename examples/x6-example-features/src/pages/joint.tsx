import React from 'react'
import { joint } from '@antv/x6'
import './index.less'

export default class Example extends React.Component {
  private container: HTMLDivElement

  componentDidMount() {
    const graph = new joint.Graph({ container: this.container })
    const rect = new joint.Node({
      markup: '<g class="rotatable"><g class="scalable"><rect/></g><text/></g>',
      size: { width: 100, height: 40 },
      position: { x: 32, y: 40 },
      attrs: {
        '.': { fill: '#ffffff', stroke: 'none' },
        rect: {
          fill: '#ffffff',
          stroke: '#000000',
          width: 100,
          height: 60,
        },
        text: {
          fill: '#000000',
          text: 'rect',
          fontSize: 14,
          textAnchor: 'middle',
          fontFamily: 'Arial, helvetica, sans-serif',
          refX: 0.5,
          refY: 0.5,
          yAlignment: 'middle',
        },
      },
    })

    graph.model.addCell(rect)

    console.log(graph)
  }

  refContainer = (container: HTMLDivElement) => {
    this.container = container
  }

  render() {
    return <div ref={this.refContainer} className="graph" />
  }
}
