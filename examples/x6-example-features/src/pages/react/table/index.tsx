import React from 'react'
import { Graph } from '@antv/x6'
import ReactDOM from 'react-dom'
import '@antv/x6-react-shape'
import '../../index.less'
import { Component } from './component'
import { getPortsDefinition } from './registry'

export default class Example extends React.Component {
  private container: HTMLDivElement

  componentDidMount() {
    const graph = new Graph({
      container: this.container,
      width: 800,
      height: 600,
      onPortRendered(args) {
        // console.log(args)
        // const port = args.port
        const contentSelectors = args.contentSelectors
        const container = contentSelectors && contentSelectors.content
        if (container) {
          ReactDOM.render(<div className="react-table-port" />, container)
        }
      },
    })

    const source = graph.addNode({
      x: 40,
      y: 40,
      width: 320,
      height: 480,
      data: {},
      xxx: {},
      shape: 'react-shape',
      component: <Component text="Source" />,
      ports: {
        ...getPortsDefinition(),
        items: [
          {
            id: 'port1',
            group: 'in',
          },
          {
            id: 'port2',
            group: 'in',
          },
          {
            id: 'port3',
            group: 'in',
          },
          {
            id: 'port4',
            group: 'out',
          },
          {
            id: 'port5',
            group: 'out',
          },
        ],
      },
    })

    const target = graph.addNode({
      x: 480,
      y: 100,
      width: 240,
      height: 320,
      shape: 'react-shape',
      component: <Component text="Target" />,
    })

    graph.addEdge({
      source,
      target,
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
