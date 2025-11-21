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
      source: { x: 30, y: 80 },
      target: { x: 430, y: 80 },
      vertices: [{ x: 230, y: 160 }],
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
      offsetLabelAbsoluteConnector: {
        atConnectionRatioIgnoreGradient: 0.66,
        d: 'M 0 0 -40 80',
        stroke: 'black',
        strokeDasharray: '5 5',
      },
    })

    edge.appendLabel({
      attrs: {
        text: {
          text: 'offset: 40',
        },
      },
      position: {
        distance: 0.66,
        offset: 40,
      },
    })

    edge.appendLabel({
      attrs: {
        text: {
          text: 'offset: -40',
        },
      },
      position: {
        distance: 0.66,
        offset: -40,
      },
    })

    edge.appendLabel({
      attrs: {
        text: {
          text: 'offset: { x: -40, y: 80 }',
        },
      },
      position: {
        distance: 0.66,
        offset: {
          x: -40,
          y: 80,
        },
      },
    })

    let oscillateToggle = false

    function contract() {
      edge.animate(
        {
          'source/x': 130,
          'source/y': 80,
          'target/x': 330,
          'target/y': 80,
          'labels/0/position/offset': 80,
          'labels/1/position/offset': -80,
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
          'source/y': 160,
          'vertices/0/x': 230,
          'vertices/0/y': 80,
          'target/x': 430,
          'target/y': 160,
          'labels/0/position/offset': 80,
          'labels/1/position/offset': -80,
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
      <div className="label-offset-app">
        <div className="app-content" ref={this.refContainer} />
      </div>
    )
  }
}
