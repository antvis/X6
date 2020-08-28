import React from 'react'
import { Graph } from '@antv/x6'
import './app.css'

export default class Example extends React.Component {
  private container: HTMLDivElement

  componentDidMount() {
    const graph = new Graph({
      container: this.container,
      grid: true,
      interacting: false,
    })

    const rect1 = graph.addNode({
      x: 40,
      y: 40,
      width: 100,
      height: 40,
      label: 'Source',
    })

    const rect2 = graph.addNode({
      x: 360,
      y: 40,
      width: 100,
      height: 40,
      label: 'Target',
    })

    graph.addEdge({
      source: rect1,
      target: rect2,
      labels: [
        {
          markup: [
            {
              tagName: 'rect',
              selector: 'body',
            },
            {
              tagName: 'text',
              selector: 'label',
            },
          ],
          attrs: {
            label: {
              cursor: 'pointer',
              text: 'Eege',
              textAnchor: 'middle',
              textVerticalAnchor: 'middle',
              fontSize: 12,
              fill: 'black',
            },
            body: {
              cursor: 'pointer',
              ref: 'label',
              refX: '-20%',
              refY: '-20%',
              refWidth: '140%',
              refHeight: '140%',
              fill: 'white',
              stroke: 'black',
              strokeWidth: 1,
            },
          },
        },
      ],
    })

    function reset() {
      graph.drawBackground({ color: '#fff' })
      const nodes = graph.getNodes()
      const edges = graph.getEdges()

      nodes.forEach((node) => {
        node.attr('body/stroke', '#000')
      })

      edges.forEach((edge) => {
        edge.attr('line/stroke', 'black')
        edge.prop('labels/0', {
          attrs: {
            body: {
              stroke: 'black',
            },
          },
        })
      })
    }

    graph.on('node:click', ({ node }) => {
      reset()
      node.attr('body/stroke', 'orange')
    })

    graph.on('edge:click', ({ edge }) => {
      reset()
      edge.attr('line/stroke', 'orange')
      edge.prop('labels/0', {
        attrs: {
          body: {
            stroke: 'orange',
          },
        },
      })
    })

    graph.on('blank:click', () => {
      reset()
      graph.drawBackground({ color: 'orange' })
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
