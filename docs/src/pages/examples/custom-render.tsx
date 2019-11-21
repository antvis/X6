import React from 'react'
import { Graph, DomEvent } from '../../../../src'

export default class CustomRender extends React.Component {
  private container: HTMLDivElement

  componentDidMount() {
    DomEvent.disableContextMenu(this.container)
    const graph = new Graph(this.container)

    graph.batchUpdate(() => {
      const node1 = graph.addNode({
        data: 'Custom',
        x: 60,
        y: 60,
        width: 80,
        height: 30,
        render(elem, cell) {
          console.log(cell)
          const rect = elem.querySelector('rect') as SVGRectElement
          rect.style.stroke = '#ff0000'
          rect.style.strokeWidth = '2'
        }
      })
      const node2 = graph.addNode({ data: 'Render', x: 240, y: 240, width: 80, height: 30 })
      graph.addEdge({
        data: 'Custom Render',
        source: node1,
        target: node2,
        render(elem) {
        }
      })
    })
  }

  refContainer = (container: HTMLDivElement) => {
    this.container = container
  }

  render() {
    return (
      <div
        ref={this.refContainer}
        className="graph-container"
      />
    )
  }
}
