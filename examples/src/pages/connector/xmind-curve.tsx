import React from 'react'
import { connectors } from './xmind-definitions'
import { Graph } from '../../../../src'
import '../index.less'

export class XmindCurveExample extends React.Component {
  private container: HTMLDivElement

  componentDidMount() {
    const graph = new Graph({
      container: this.container,
      grid: true,
      width: 1000,
      height: 600,
      connecting: {
        connectionPoint: 'anchor',
      },
    })

    const central = graph.addNode({
      x: 370,
      y: 240,
      width: 180,
      height: 60,
      label: 'Central',
      zIndex: 10,
      attrs: {
        body: {
          rx: 10,
          ry: 10,
          fill: '#ffffff',
          stroke: '#9993a5',
          strokeWidth: 2,
        },
        label: {
          fontSize: 18,
          fill: '#000000',
        },
      },
    })

    const topic1 = graph.addNode({
      x: 620,
      y: 160,
      width: 100,
      height: 40,
      label: 'Topic',
      zIndex: 10,
      attrs: {
        body: {
          rx: 6,
          ry: 6,
          fill: '#ffffff',
          stroke: '#fd6d5a',
          strokeWidth: 2,
        },
        label: {
          fontSize: 14,
          fill: '#000000',
        },
      },
    })

    const topic2 = graph.addNode({
      x: 620,
      y: 250,
      width: 100,
      height: 40,
      label: 'Topic',
      zIndex: 10,
      attrs: {
        body: {
          rx: 6,
          ry: 6,
          fill: '#ffffff',
          stroke: '#feb40b',
          strokeWidth: 2,
        },
        label: {
          fontSize: 14,
          fill: '#000000',
        },
      },
    })

    const topic3 = graph.addNode({
      x: 620,
      y: 340,
      width: 100,
      height: 40,
      label: 'Topic',
      zIndex: 10,
      attrs: {
        body: {
          rx: 6,
          ry: 6,
          fill: '#ffffff',
          stroke: '#6dc354',
          strokeWidth: 2,
        },
        label: {
          fontSize: 14,
          fill: '#000000',
        },
      },
    })

    const topic4 = graph.addNode({
      x: 220,
      y: 200,
      width: 100,
      height: 40,
      label: 'Topic',
      zIndex: 10,
      attrs: {
        body: {
          rx: 6,
          ry: 6,
          fill: '#ffffff',
          stroke: '#5d8cd8',
          strokeWidth: 2,
        },
        label: {
          fontSize: 14,
          fill: '#000000',
        },
      },
    })

    const topic5 = graph.addNode({
      x: 220,
      y: 300,
      width: 100,
      height: 40,
      label: 'Topic',
      zIndex: 10,
      attrs: {
        body: {
          rx: 6,
          ry: 6,
          fill: '#ffffff',
          stroke: '#994487',
          strokeWidth: 2,
        },
        label: {
          fontSize: 14,
          fill: '#000000',
        },
      },
    })

    const topic6 = graph.addNode({
      x: 800,
      y: 120,
      width: 60,
      height: 30,
      label: 'Topic',
      zIndex: 10,
      markup: [
        {
          tagName: 'rect',
          selector: 'body',
        },
        {
          tagName: 'text',
          selector: 'label',
        },
        {
          tagName: 'path',
          selector: 'line',
        },
      ],
      attrs: {
        body: {
          fill: '#ffffff',
          strokeWidth: 0,
        },
        label: {
          fontSize: 14,
          fill: '#000000',
        },
        line: {
          stroke: '#fd6d5a',
          strokeWidth: 2,
          d: 'M 0 30 L 60 30',
        },
      },
    })

    const topic7 = graph.addNode({
      x: 800,
      y: 180,
      width: 60,
      height: 30,
      label: 'Topic',
      zIndex: 10,
      markup: [
        {
          tagName: 'rect',
          selector: 'body',
        },
        {
          tagName: 'text',
          selector: 'label',
        },
        {
          tagName: 'path',
          selector: 'line',
        },
      ],
      attrs: {
        body: {
          fill: '#ffffff',
          strokeWidth: 0,
        },
        label: {
          fontSize: 14,
          fill: '#000000',
        },
        line: {
          stroke: '#fd6d5a',
          strokeWidth: 2,
          d: 'M 0 30 L 60 30',
        },
      },
    })

    graph.addEdge({
      source: {
        cell: central.id,
        anchor: {
          name: 'center',
          args: {
            dx: '25%',
          },
        },
      },
      target: { cell: topic1.id, anchor: 'left' },
      zIndex: 1,
      connector: {
        name: connectors.root,
      },
      attrs: {
        line: {
          targetMarker: '',
          fill: '#fd6d5a',
          stroke: 'none',
          strokeWidth: 0,
        },
      },
    })

    graph.addEdge({
      source: {
        cell: central.id,
        anchor: {
          name: 'center',
          args: {
            dx: '25%',
          },
        },
      },
      target: { cell: topic2.id, anchor: 'left' },
      zIndex: 1,
      connector: {
        name: connectors.root,
      },
      attrs: {
        line: {
          targetMarker: '',
          fill: '#feb40b',
          stroke: 'none',
          strokeWidth: 0,
        },
      },
    })

    graph.addEdge({
      source: {
        cell: central.id,
        anchor: {
          name: 'center',
          args: {
            dx: '25%',
          },
        },
      },
      target: { cell: topic3.id, anchor: 'left' },
      zIndex: 1,
      connector: {
        name: connectors.root,
      },
      attrs: {
        line: {
          targetMarker: '',
          fill: '#6dc354',
          stroke: 'none',
          strokeWidth: 0,
        },
      },
    })

    graph.addEdge({
      source: {
        cell: central.id,
        anchor: {
          name: 'center',
          args: {
            dx: '-25%',
          },
        },
      },
      target: { cell: topic4.id, anchor: 'right' },
      zIndex: 1,
      connector: {
        name: connectors.root,
      },
      attrs: {
        line: {
          targetMarker: '',
          fill: '#5d8cd8',
          stroke: 'none',
          strokeWidth: 0,
        },
      },
    })

    graph.addEdge({
      source: {
        cell: central.id,
        anchor: {
          name: 'center',
          args: {
            dx: '-25%',
          },
        },
      },
      target: { cell: topic5.id, anchor: 'right' },
      zIndex: 1,
      connector: {
        name: connectors.root,
      },
      attrs: {
        line: {
          targetMarker: '',
          fill: '#994487',
          stroke: 'none',
          strokeWidth: 0,
        },
      },
    })

    graph.addEdge({
      source: { cell: topic1.id, anchor: 'right' },
      target: {
        cell: topic6.id,
        anchor: { name: 'left', args: { dy: '50%' } },
      },
      zIndex: 1,
      connector: {
        name: connectors.branch,
      },
      attrs: {
        line: {
          targetMarker: '',
          stroke: '#fd6d5a',
          strokeWidth: 2,
        },
      },
    })

    graph.addEdge({
      source: { cell: topic1.id, anchor: 'right' },
      target: {
        cell: topic7.id,
        anchor: { name: 'left', args: { dy: '50%' } },
      },
      zIndex: 1,
      connector: {
        name: connectors.branch,
      },
      attrs: {
        line: {
          targetMarker: '',
          stroke: '#fd6d5a',
          strokeWidth: 2,
        },
      },
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
