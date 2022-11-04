import React from 'react'
import { Graph, Color } from '@antv/x6'
import ReactDOM from 'react-dom'
import { generateData, parsePorts } from './data'
import { getPortsDefinition } from './port'
import './view'
import '../index.less'

export default class Example extends React.Component {
  private container: HTMLDivElement

  componentDidMount() {
    const graph = new Graph({
      container: this.container,
      width: 800,
      height: 600,
      connecting: {
        router: {
          name: 'er',
          args: {
            direction: 'H',
          },
        },
        connector: 'rounded',
        connectionPoint: 'anchor',
      },
      onPortRendered(args) {
        const contentSelectors = args.contentSelectors
        const container = contentSelectors && contentSelectors.content
        if (container) {
          ReactDOM.render(<div className="react-table-port" />, container)
        }
      },
    })

    const data = generateData(50)
    const ports = parsePorts(data)

    const node = graph.addNode({
      x: 240,
      y: 60,
      width: 320,
      height: 480,
      shape: 'react-table-shape',
      data: data,
      ports: {
        ...getPortsDefinition(),
      },
    })

    ports.forEach((port) => {
      if (port.group === 'in') {
        graph.addEdge({
          source: [40, 300],
          target: {
            cell: node,
            port: port.id,
            anchor: 'left',
          },
          attrs: {
            line: {
              strokeWidth: 1,
              targetMarker: null,
              stroke: Color.randomHex(),
            },
          },
        })
      } else {
        graph.addEdge({
          source: {
            cell: node,
            port: port.id,
            anchor: 'right',
          },
          target: [760, 300],
          attrs: {
            line: {
              strokeWidth: 1,
              targetMarker: null,
              stroke: Color.randomHex(),
            },
          },
        })
      }
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
