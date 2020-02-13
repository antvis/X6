import React from 'react'
import { Graph } from '@antv/x6'
import './index.less'

export default class Example extends React.Component {
  private container: HTMLDivElement

  componentDidMount() {
    const graph = new Graph(this.container, {
      connection: {
        enabled: true,
      },
      getAnchors(cell) {
        if (cell != null && this.model.isNode(cell)) {
          return [
            [0, 0],
            [0.5, 0],
            [1, 0],

            [0, 0.5],
            [1, 0.5],

            [0, 1],
            [0.5, 1],
            [1, 1],
          ]
        }
        return null
      },
    })

    graph.batchUpdate(() => {
      const triangle = graph.addNode({
        x: 20,
        y: 20,
        width: 80,
        height: 60,
        label: 'Triangle',
        shape: 'triangle',
        perimeter: 'triangle',
      })

      const rect = graph.addNode({
        x: 200,
        y: 20,
        width: 80,
        height: 30,
        label: 'Rectangle',
      })

      const ellipse = graph.addNode({
        x: 200,
        y: 150,
        width: 80,
        height: 60,
        label: 'Ellipse',
        shape: 'ellipse',
        perimeter: 'ellipse',
      })

      graph.addEdge({
        source: triangle,
        target: ellipse,
        edge: 'elbow',
        elbow: 'horizontal',
        sourceAnchorX: 0.5,
        sourceAnchorY: 1,
        targetAnchorX: 0,
        targetAnchorY: 0,
        // sourcePerimeter: true,
        // targetPerimeter: true,
      })

      graph.addEdge({
        source: rect,
        target: ellipse,
        edge: 'elbow',
        elbow: 'horizontal',
        targetAnchorX: 0.5,
        targetAnchorY: 0,
        // orthogonal: false,
        // targetPerimeter: true,
      })
    })
  }

  refContainer = (container: HTMLDivElement) => {
    this.container = container
  }

  render() {
    return <div ref={this.refContainer} className="graph" />
  }
}
