import React from 'react'
import { Graph } from '@antv/x6'
import { DagreLayout } from '@antv/layout'
import './app.css'

const data: any = {
  nodes: [],
  edges: [],
}

for (let i = 1; i <= 12; i++) {
  data.nodes.push({
    id: i + '',
    shape: 'rect',
    width: 60,
    height: 30,
    label: i,
    attrs: {
      body: {
        fill: '#855af2',
        stroke: 'transparent',
      },
      label: {
        fill: '#ffffff',
      },
    },
  })
}

data.edges.push(
  ...[
    {
      source: '1',
      target: '2',
      attrs: {
        line: {
          stroke: '#fd6d6f',
          strokeWidth: 1,
        },
      },
    },
    {
      source: '2',
      target: '3',
      attrs: {
        line: {
          stroke: '#fd6d6f',
          strokeWidth: 1,
        },
      },
    },
    {
      source: '2',
      target: '4',
      attrs: {
        line: {
          stroke: '#fd6d6f',
          strokeWidth: 1,
        },
      },
    },
    {
      source: '4',
      target: '5',
      attrs: {
        line: {
          stroke: '#fd6d6f',
          strokeWidth: 1,
        },
      },
    },
    {
      source: '4',
      target: '6',
      attrs: {
        line: {
          stroke: '#fd6d6f',
          strokeWidth: 1,
        },
      },
    },
    {
      source: '4',
      target: '7',
      attrs: {
        line: {
          stroke: '#fd6d6f',
          strokeWidth: 1,
        },
      },
    },
    {
      source: '4',
      target: '8',
      attrs: {
        line: {
          stroke: '#fd6d6f',
          strokeWidth: 1,
        },
      },
    },
    {
      source: '5',
      target: '9',
      attrs: {
        line: {
          stroke: '#fd6d6f',
          strokeWidth: 1,
        },
      },
    },
    {
      source: '6',
      target: '10',
      attrs: {
        line: {
          stroke: '#fd6d6f',
          strokeWidth: 1,
        },
      },
    },
    {
      source: '7',
      target: '11',
      attrs: {
        line: {
          stroke: '#fd6d6f',
          strokeWidth: 1,
        },
      },
    },
    {
      source: '8',
      target: '12',
      attrs: {
        line: {
          stroke: '#fd6d6f',
          strokeWidth: 1,
        },
      },
    },
  ],
)

export default class Example extends React.Component {
  private container: HTMLDivElement

  componentDidMount() {
    const graph = new Graph({
      container: this.container,
      grid: true,
    })

    const dagreLayout = new DagreLayout({
      type: 'dagre',
      rankdir: 'LR',
      align: 'UR',
      ranksep: 30,
      nodesep: 15,
      controlPoints: true,
    })
    const model = dagreLayout.layout(data)

    graph.fromJSON(model)
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
