import React from 'react'
import { Graph, Node, Edge, EdgeView } from '@antv/x6'
import './index.less'

export default class Example extends React.Component {
  private container: HTMLDivElement

  componentDidMount() {
    const graph = new Graph({
      container: this.container,
      background: {
        color: '#F2F7FA',
      },
    })

    const source = graph.addNode({
      x: 80,
      y: 40,
      width: 120,
      height: 50,
      label: 'Source',
      attrs: {
        body: {
          stroke: '#8f8f8f',
          strokeWidth: 1,
          fill: '#fff',
          rx: 6,
          ry: 6,
        },
      },
    })

    const target = graph.addNode(
      source.clone().translate(460, 230).setAttrByPath('label/text', 'Target'),
    )

    const obstacles: Node[] = []
    const obstacle = graph.addNode({
      x: 200,
      y: 150,
      width: 120,
      height: 50,
      label: 'Obstacle',
      attrs: {
        body: {
          stroke: '#8f8f8f',
          strokeWidth: 1,
        },
      },
    })

    let edge: Edge

    const update = () => {
      const edgeView = graph.findViewByCell(edge) as EdgeView
      edgeView.update()
    }

    obstacles.push(obstacle)
    obstacles.push(graph.addNode(obstacle.clone().translate(280, -110)))
    obstacles.push(graph.addNode(obstacle.clone().translate(180, 10)))
    obstacles.forEach((obstacle) => obstacle.on('change:position', update))

    edge = graph.addEdge({
      source,
      target,
      attrs: {
        line: {
          stroke: '#8f8f8f',
          strokeWidth: 1,
        },
      },
      router: {
        name: 'metro',
        args: {
          startDirections: ['top'],
          endDirections: ['bottom'],
        },
      },
    })

    graph.centerContent()
  }

  refContainer = (container: HTMLDivElement) => {
    this.container = container
  }

  render() {
    return (
      <div className="manhattan-router-app">
        <div className="app-content" ref={this.refContainer} />
      </div>
    )
  }
}
