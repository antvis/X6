import React from 'react'
import { Graph, Edge } from '@antv/x6'
import { Settings, State } from './settings'
import './app.css'

export default class Example extends React.Component {
  private container: HTMLDivElement
  private edge: Edge

  componentDidMount() {
    const graph = new Graph({
      container: this.container,
      grid: true,
    })

    const source = graph.addNode({
      x: 24,
      y: 70,
      width: 100,
      height: 40,
      label: 'Hello',
    })

    const target = graph.addNode({
      x: 24,
      y: 160,
      width: 100,
      height: 40,
      label: 'world',
    })

    this.edge = graph.addEdge({
      source,
      target,
      attrs: {
        line: {
          stroke: '#fe8550',
        },
      },
      vertices: [
        { x: 760, y: 150 },
        { x: 760, y: 240 },
      ],
    })

    const rect = graph.addNode({
      x: 160,
      y: 24,
      width: 70,
      height: 30,
      label: 'rect',
    })

    for (let i = 0; i < 6; i += 1) {
      const source = rect.clone().translate(i * 100, i * 10)
      graph.addNode(source)

      const target = source.clone().translate(0, 200)
      graph.addNode(target)

      if (i % 2 === 0) {
        graph.addEdge({
          source,
          target,
          attrs: {
            line: {
              stroke: '#fe8550',
            },
          },
          connector: {
            name: 'jumpover',
            args: {
              type: 'gap',
            },
          },
        })
      } else {
        graph.addEdge({ source, target })
      }
    }

    this.edge.setConnector('jumpover')
  }

  onAttrsChanged = (args: State) => {
    this.edge.setConnector('jumpover', args)
  }

  refContainer = (container: HTMLDivElement) => {
    this.container = container
  }

  render() {
    return (
      <div className="app">
        <div className="app-left">
          <Settings onChange={this.onAttrsChanged} />
        </div>
        <div className="app-content" ref={this.refContainer} />
      </div>
    )
  }
}
