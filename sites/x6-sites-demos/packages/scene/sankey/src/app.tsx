import React from 'react'
import { Graph } from '@antv/x6'
import { getNodes } from './data'
import './curve'
import './app.css'

export default class Example extends React.Component {
  private container: HTMLDivElement
  private graph: Graph

  componentDidMount() {
    this.graph = new Graph({
      container: this.container,
      grid: true,
      scroller: {
        enabled: true,
      },
      connecting: {
        connectionPoint: 'anchor',
        connector: 'curve',
      },
    })

    const { nodes } = getNodes()
    const nodeMap: { [id: string]: any } = {}
    const colors = [
      'rgba(16, 142, 233, 0.6)',
      'rgba(255, 85, 0, 0.5)',
      'rgba(135, 208, 104, 0.5)',
    ]

    nodes.forEach((node: any) => {
      nodeMap[node.id] = node
      const { x0, x1, y0, y1 } = node
      this.graph.addNode({
        x: x0,
        y: y0,
        width: x1! - x0!,
        height: y1! - y0!,
        id: node.id,
        zIndex: 10,
        attrs: {
          label: {
            text: node.name,
            textAnchor: 'start',
            textVerticalAnchor: 'middle',
            refX: '100%',
            refX2: 8,
            fontSize: 12,
          },
        },
      })
    })

    nodes.forEach((node: any) => {
      if (node.dep) {
        const sourceNode = nodeMap[node.dep]
        const sourceHeight = sourceNode.y1 - sourceNode.y0
        const targetHeight = node.y1 - node.y0
        let acc: number = 0
        for (let i = 0, l = sourceNode.sourceLinks.length; i < l; i += 1) {
          const link = sourceNode.sourceLinks[i]
          const target = link.target
          if (target.id === node.id) {
            acc += targetHeight / 2
            break
          } else {
            acc += target.y1 - target.y0
          }
        }

        this.graph.addEdge({
          source: {
            cell: node.dep,
            anchor: { name: 'right', args: { dy: acc - sourceHeight / 2 } },
            magnet: 'rect',
          },
          target: { cell: node.id, anchor: { name: 'left' } },
          zIndex: 1,
          attrs: {
            line: {
              strokeWidth: targetHeight,
              stroke: colors[nodeMap[node.dep].depth],
              targetMarker: '',
            },
          },
        })
      }
    })

    this.graph.centerContent()
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
