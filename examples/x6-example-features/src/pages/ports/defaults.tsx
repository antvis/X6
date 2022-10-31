import React from 'react'
import { Button } from 'antd'
import { Graph, Node } from '@antv/x6'
import '../index.less'

export default class Example extends React.Component {
  private container: HTMLDivElement
  private rect: Node

  componentDidMount() {
    const graph = new Graph({
      container: this.container,
      width: 800,
      height: 400,
      grid: true,
    })

    const rect = graph.addNode({
      shape: 'rect',
      x: 280,
      y: 120,
      width: 100,
      height: 150,
      label: 'Target',
      attrs: {
        rect: { stroke: '#31d0c6', strokeWidth: 2 },
      },
      ports: {
        groups: {
          left: {
            position: 'left',
          },
        },
      },
    })

    rect.addPort({
      group: 'left',
      attrs: {
        circle: {
          magnet: true,
          stroke: '#31d0c6',
          strokeWidth: 2,
          fill: '#ffffff',
        },
      },
    })

    rect.addPort({
      group: 'left',
      attrs: {
        circle: {
          magnet: true,
          stroke: '#31d0c6',
          strokeWidth: 2,
          fill: '#ffffff',
        },
      },
    })

    rect.addPort({
      group: 'left',
      attrs: {
        circle: {
          magnet: true,
          stroke: '#31d0c6',
          strokeWidth: 2,
          fill: '#ffffff',
        },
      },
    })

    const circle = graph.addNode({
      shape: 'circle',
      x: 100,
      y: 165,
      width: 60,
      height: 60,
      attrs: {
        circle: { cx: 8, cy: 8, r: 8 },
        text: { text: 'Source' },
      },
    })

    const ports = rect.getPorts()
    graph.addEdge({
      source: circle,
      target: { cell: rect, port: ports[0].id },
    })
    graph.addEdge({
      source: circle,
      target: { cell: rect, port: ports[1].id },
    })
    graph.addEdge({
      source: circle,
      target: { cell: rect, port: ports[2].id },
    })

    this.rect = rect
  }

  onAddPort = () => {
    this.rect.addPort({
      group: 'left',
      attrs: {
        circle: {
          magnet: true,
          stroke: '#31d0c6',
          strokeWidth: 2,
          fill: '#ffffff',
        },
      },
    })
  }

  onRemovePort = () => {
    const ports = this.rect.getPorts()
    if (ports.length) {
      this.rect.removePortAt(ports.length - 1)
    }
  }

  refContainer = (container: HTMLDivElement) => {
    this.container = container
  }

  render() {
    return (
      <div className="x6-graph-wrap">
        <h1>Default Settings</h1>
        <div className="x6-graph-tools">
          <Button.Group>
            <Button onClick={this.onAddPort}>Add Port</Button>
            <Button onClick={this.onRemovePort}>Remove Port</Button>
          </Button.Group>
        </div>
        <div ref={this.refContainer} className="x6-graph" />
      </div>
    )
  }
}
