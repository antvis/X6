import React from 'react'
import { Graph, Edge, Timing } from '../../../../src'
import '../index.less'

export default class Example extends React.Component {
  private container: HTMLDivElement

  componentDidMount() {
    const graph = new Graph({
      container: this.container,
      width: 800,
      height: 600,
      grid: 10,
    })

    graph.on('edge:customevent', ({ name, e, edge }) => {
      if (name === 'click:circle') {
        e.stopPropagation()
        var t = edge.attr<number>('c1/atConnectionRatio') > 0.2 ? 0.2 : 0.9
        var options = {
          delay: 100,
          duration: 1000,
          timing: Timing.easeInOutBack,
        }
        edge.transition('attrs/c1/atConnectionRatio', t, options)
        edge.transition('attrs/c2/atConnectionRatio', t, options)
      }
    })

    graph.addEdge({
      markup: [
        {
          tagName: 'path',
          selector: 'p1',
        },
        {
          tagName: 'rect',
          selector: 'sign',
        },
        {
          tagName: 'circle',
          selector: 'c1',
        },
        {
          tagName: 'path',
          selector: 'p2',
        },
        {
          tagName: 'circle',
          selector: 'c2',
        },
        {
          tagName: 'text',
          selector: 'signText',
        },
        {
          tagName: 'path',
          selector: 'p3',
        },
      ],
      source: { x: 100, y: 100 },
      target: { x: 500, y: 100 },
      vertices: [{ x: 300, y: 50 }],
      attrs: {
        p1: {
          connection: true,
          fill: 'none',
          stroke: 'black',
          strokeWidth: 6,
          strokeLinejoin: 'round',
        },
        p2: {
          connection: true,
          fill: 'none',
          stroke: '#fe854f',
          strokeWidth: 4,
          pointerEvents: 'none',
          strokeLinejoin: 'round',
          targetMarker: {
            type: 'path',
            fill: '#fe854f',
            stroke: 'black',
            'stroke-width': 1,
            d: 'M 10 -3 10 -10 -2 0 10 10 10 3',
          },
        },
        p3: {
          atConnectionRatio: 0.4,
          d: 'M 0 3 30 33',
          fill: 'none',
          stroke: 'black',
          targetMarker: {
            type: 'path',
            fill: 'black',
            stroke: 'black',
            d: 'M 10 10 -2 0 10 -10',
          },
        },
        sign: {
          x: -20,
          y: -10,
          width: 40,
          height: 20,
          stroke: 'black',
          fill: '#fe854f',
          atConnectionLength: 30,
          strokeWidth: 1,
          event: 'click:rect',
        },
        signText: {
          atConnectionLength: 30,
          textAnchor: 'middle',
          textVerticalAnchor: 'middle',
          text: 'Link',
        },
        c1: {
          r: 10,
          stroke: 'black',
          fill: '#fe854f',
          atConnectionRatio: 0.5,
          strokeWidth: 1,
          event: 'click:circle',
          cursor: 'pointer',
        },
        c2: {
          r: 5,
          stroke: 'black',
          fill: 'white',
          atConnectionRatio: 0.5,
          strokeWidth: 1,
          pointerEvents: 'none',
        },
      },
    })

    graph.addEdge({
      markup: [
        {
          tagName: 'path',
          selector: 'stroke',
          attrs: {
            stroke: 'black',
            fill: 'none',
          },
        },
        {
          tagName: 'path',
          selector: 'fill',
        },
      ],
      source: { x: 200, y: 200 },
      target: { x: 500, y: 150 },
      connector: { name: 'rounded' },
      attrs: {
        fill: {
          connection: true,
          strokeWidth: 8,
          strokeLinecap: 'round',
          fill: 'none',
          stroke: {
            type: 'linearGradient',
            stops: [
              { offset: '0%', color: '#ccc' },
              { offset: '50%', color: '#30d0c6' },
              { offset: '100%', color: '#ccc' },
            ],
          },
        },
        stroke: {
          connection: true,
          strokeWidth: 10,
          strokeLinecap: 'round',
        },
      },
    })

    Edge.registry.register('arrow', {
      markup: [
        {
          tagName: 'path',
          selector: 'wrapper',
          attrs: {
            fill: 'none',
            cursor: 'pointer',
            stroke: 'transparent',
          },
        },
        {
          tagName: 'path',
          selector: 'line',
          attrs: {
            fill: 'none',
            'pointer-events': 'none',
          },
        },
        {
          tagName: 'path',
          selector: 'arrow',
          attrs: {
            'pointer-events': 'none',
          },
        },
      ],
      attrs: {
        line: {
          connection: true,
          stroke: '#333333',
          strokeWidth: 2,
          strokeLinejoin: 'round',
          targetMarker: {
            tagName: 'path',
            d: 'M 10 -5 0 0 10 5 z',
          },
        },
        wrapper: {
          connection: true,
          strokeWidth: 10,
          strokeLinejoin: 'round',
        },
        arrow: {
          atConnectionRatio: 0.5,
          d: 'M 0 -10 10 0 0 10 z',
          fill: '#ffffff',
          stroke: '#333333',
        },
      },
    })

    graph.addEdge({
      shape: 'arrow',
      source: { x: 100, y: 300 },
      target: { x: 300, y: 350 },
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
