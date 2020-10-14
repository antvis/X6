import React from 'react'
import { Graph, Node, Edge, EdgeView } from '@antv/x6'
import './app.css'

export default class Example extends React.Component {
  private container: HTMLDivElement

  componentDidMount() {
    const graph = new Graph({
      container: this.container,
      grid: true,
    })

    const source = graph.addNode({
      x: 80,
      y: 40,
      width: 120,
      height: 50,
      attrs: {
        body: {
          fill: '#fe8550',
          stroke: '#ed8661',
          strokeWidth: 2,
        },
        label: {
          text: 'Source',
          fill: '#f0f0f0',
          fontSize: 18,
          fontWeight: 'lighter',
          fontVariant: 'small-caps',
        },
      },
    })

    const target = graph.addNode(
      source.clone().translate(480, 350).setAttrByPath('label/text', 'Target'),
    )

    const obstacles: Node[] = []
    const obstacle = graph.addNode({
      x: 340,
      y: 140,
      width: 120,
      height: 50,
      label: 'Obstacle',
      attrs: {
        label: {
          text: 'Obstacle',
          fill: '#eee',
        },
        body: {
          fill: '#9687fe',
          stroke: '#8e89e5',
          strokeWidth: 2,
        },
      },
    })

    let edge: Edge

    const update = () => {
      const edgeView = graph.findViewByCell(edge) as EdgeView
      edgeView.update()
    }

    obstacles.push(obstacle)
    obstacles.push(graph.addNode(obstacle.clone().translate(200, 100)))
    obstacles.push(graph.addNode(obstacle.clone().translate(-200, 150)))
    obstacles.forEach((obstacle) => obstacle.on('change:position', update))

    edge = graph.addEdge({
      source,
      target,
      router: {
        name: 'manhattan',
        args: {
          startDirections: ['top'],
          endDirections: ['bottom'],
        },
      },
    })
  }

  refContainer = (container: HTMLDivElement) => {
    this.container = container
  }

  render() {
    return (
      <div className="app">
        <div className="app-content" ref={this.refContainer} />
      </div>
    )
  }
}
