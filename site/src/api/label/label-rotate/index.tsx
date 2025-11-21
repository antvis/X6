import React from 'react'
import { Graph } from '@antv/x6'
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

    const edge = graph.addEdge({
      markup: [
        {
          tagName: 'path',
          selector: 'line',
        },
        {
          tagName: 'path',
          selector: 'offsetLabelPositiveConnector',
        },
        {
          tagName: 'path',
          selector: 'offsetLabelNegativeConnector',
        },
        {
          tagName: 'path',
          selector: 'offsetLabelAbsoluteConnector',
        },
        {
          tagName: 'text',
          selector: 'offsetLabelMarker',
        },
      ],
      source: { x: 30, y: 120 },
      target: { x: 430, y: 120 },
      vertices: [{ x: 230, y: 200 }],
    })

    edge.attr({
      line: {
        connection: true,
        fill: 'none',
        stroke: '#8f8f8f',
        strokeWidth: 1,
      },
      offsetLabelMarker: {
        atConnectionRatio: 0.66,
        textAnchor: 'middle',
        textVerticalAnchor: 'middle',
        text: '＊',
        fill: 'red',
        stroke: 'black',
        strokeWidth: 1,
        fontSize: 32,
        fontWeight: 'bold',
      },
      offsetLabelPositiveConnector: {
        atConnectionRatio: 0.66,
        d: 'M 0 0 0 80',
        stroke: 'black',
        strokeDasharray: '5 5',
      },
      offsetLabelNegativeConnector: {
        atConnectionRatio: 0.66,
        d: 'M 0 0 0 -80',
        stroke: 'black',
        strokeDasharray: '5 5',
      },
    })

    edge.appendLabel({
      attrs: {
        text: {
          text: '70°\nkeepGradient',
        },
      },
      position: {
        distance: 0.05,
        angle: 70,
        options: {
          keepGradient: true,
        },
      },
    })
    edge.appendLabel({
      attrs: {
        text: {
          text: '0°\nkeepGradient',
        },
      },
      position: {
        distance: 0.3,
        options: {
          keepGradient: true,
        },
      },
    })
    edge.appendLabel({
      attrs: {
        text: {
          text: '45°',
        },
      },
      position: {
        distance: 0.8,
        angle: 45,
      },
    })
    edge.appendLabel({
      attrs: {
        text: {
          text: '135°',
        },
      },
      position: {
        distance: 0.9,
        angle: 135,
      },
    })
    edge.appendLabel({
      attrs: {
        text: {
          text: '270°\nkeepGradient',
        },
      },
      position: {
        distance: 0.66,
        offset: 80,
        angle: 270,
        options: {
          keepGradient: true,
        },
      },
    })
    edge.appendLabel({
      attrs: {
        text: {
          text: '270°\nkeepGradient\nensureLegibility',
        },
      },
      position: {
        distance: 0.66,
        offset: -80,
        angle: 270,
        options: {
          keepGradient: true,
          ensureLegibility: true,
        },
      },
    })

    let oscillateToggle = false

    function contract() {
      edge.animate(
        {
          'source/x': 130,
          'source/y': 120,
          'target/x': 330,
          'target/y': 120,
        },
        {
          delay: 1000,
          duration: 2000,
          direction: 'alternate',
          iterations: 2,
          easing: 'linear',
          fill: 'none',
        },
      )

      oscillateToggle = true
    }

    function oscillate() {
      edge.animate(
        {
          'source/x': 30,
          'source/y': 200,
          'vertices/0/x': 230,
          'vertices/0/y': 120,
          'target/x': 430,
          'target/y': 200,
        },
        {
          delay: 1000,
          duration: 2000,
          direction: 'alternate',
          iterations: 2,
          easing: 'linear',
          fill: 'none',
        },
      )

      oscillateToggle = false
    }

    edge.on('animation:finish', () => {
      if (oscillateToggle) {
        oscillate()
      } else {
        contract()
      }
    })

    contract()
  }

  refContainer = (container: HTMLDivElement) => {
    this.container = container
  }

  render() {
    return (
      <div className="label-rotate-app">
        <div className="app-content" ref={this.refContainer} />
      </div>
    )
  }
}
